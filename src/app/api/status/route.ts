import { NextResponse } from 'next/server';
import util from 'minecraft-server-util';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const result = await util.status('jkeysmp.net', 25565, { timeout: 5000 });
    return NextResponse.json({
      online: true,
      players: result.players.online,
      maxPlayers: result.players.max,
    });
  } catch (error) {
    // If the server is offline or unreachable
    return NextResponse.json({
      online: false,
      players: 0,
      maxPlayers: 0,
    });
  }
}
