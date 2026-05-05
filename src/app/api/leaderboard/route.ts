import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Cache this endpoint for 5 minutes (300 seconds)
export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stat = searchParams.get('stat') || 'vault_eco_balance';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 100; // Limit per page to avoid massive payloads
  const offset = (page - 1) * limit;

  // Configure your actual database tables and column names here
  // Depending on which plugins you use (Essentials, CMI, Plan, etc.), 
  // the table and column names will be different.
  const queryConfig: Record<string, { table: string, nameCol: string, valCol: string }> = {
    'vault_eco_balance': { table: 'ajlb_vault_eco_balance', nameCol: 'namecache', valCol: 'value' },
    'statistic_time_played': { table: 'ajlb_statistic_time_played', nameCol: 'namecache', valCol: 'value' },
    'statistic_player_kills': { table: 'ajlb_statistic_player_kills', nameCol: 'namecache', valCol: 'value' },
    'statistic_deaths': { table: 'ajlb_statistic_deaths', nameCol: 'namecache', valCol: 'value' },
  };

  try {
    let rows: any[];
    let total: number;

    if (stat === 'kd') {
      // Calculate KD by joining kills and deaths tables
      // We use NULLIF to avoid division by zero
      const killsTable = 'ajlb_statistic_player_kills';
      const deathsTable = 'ajlb_statistic_deaths';
      
      [rows] = await db.query(
        `SELECT 
          k.namecache AS name, 
          (CAST(k.value AS DECIMAL(10,2)) / NULLIF(CAST(d.value AS DECIMAL(10,2)), 0)) AS value 
        FROM ?? k
        LEFT JOIN ?? d ON k.namecache = d.namecache
        ORDER BY value DESC
        LIMIT ? OFFSET ?`,
        [killsTable, deathsTable, limit, offset]
      );

      const [countResult]: any = await db.query(`SELECT COUNT(*) as total FROM ??`, [killsTable]);
      total = countResult[0].total;
    } else {
      const config = queryConfig[stat];
      if (!config) {
        return NextResponse.json({ error: 'Invalid stat requested' }, { status: 400 });
      }

      [rows] = await db.query(
        `SELECT ?? AS name, ?? AS value FROM ?? ORDER BY CAST(?? AS DECIMAL) DESC LIMIT ? OFFSET ?`,
        [config.nameCol, config.valCol, config.table, config.valCol, limit, offset]
      );

      const [countResult]: any = await db.query(`SELECT COUNT(*) as total FROM ??`, [config.table]);
      total = countResult[0].total;
    }

    // --- RANK SYNC LOGIC ---
    // Now that we have the 100 players, let's fetch all their ranks from LuckPerms in ONE query
    const names = rows.map((r: any) => r.name.toLowerCase());
    
    if (names.length > 0) {
      try {
        const lp_db = (await import('@/lib/luckperms_db')).default;

        // 1. Get UUIDs for these names
        const [userRows]: any = await lp_db.query(
          `SELECT uuid, username FROM luckperms_players WHERE username IN (?)`,
          [names]
        );

        if (userRows.length > 0) {
          const uuids = userRows.map((u: any) => u.uuid);
          const uuidToName: Record<string, string> = {};
          userRows.forEach((u: any) => uuidToName[u.uuid] = u.username.toLowerCase());

          // 2. Get all groups for these UUIDs from the permissions table
          const [permissionRows]: any = await lp_db.query(
            `SELECT uuid, permission FROM luckperms_user_permissions WHERE uuid IN (?) AND permission LIKE 'group.%'`,
            [uuids]
          );

          // 3. Map ranks back to players
          const playerRanks: Record<string, string[]> = {};
          permissionRows.forEach((p: any) => {
            const name = uuidToName[p.uuid];
            if (!playerRanks[name]) playerRanks[name] = ['default'];
            const groupName = p.permission.replace('group.', '').toLowerCase();
            playerRanks[name].push(groupName);
          });

          // Attach ranks to the rows
          rows = rows.map((row: any) => ({
            ...row,
            ranks: playerRanks[row.name.toLowerCase()] || ['default']
          }));
        }
      } catch (lpError) {
        console.error('LuckPerms Rank Fetch Error:', lpError);
        // If rank fetch fails, just default to 'default'
        rows = rows.map((row: any) => ({ ...row, ranks: ['default'] }));
      }
    }

    return NextResponse.json({
      data: rows,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    console.error('Leaderboard DB Error:', error);
    
    // Log all tables to help identify LuckPerms table names
    try {
      const lp_db = (await import('@/lib/luckperms_db')).default;
      const [tables]: any = await lp_db.query(`SHOW TABLES`);
      console.log(`LuckPerms Available tables:`, tables.map((t: any) => Object.values(t)[0]));
    } catch (showError) {
      console.error('Failed to show LP tables:', showError);
    }

    return NextResponse.json({
      data: [],
      meta: { total: 0, page: 1, totalPages: 0 },
      error: `Database error: ${error.message}`
    });
  }
}
