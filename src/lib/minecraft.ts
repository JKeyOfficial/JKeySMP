import lp_db from "./luckperms_db";
import { rankPriority } from "@/config/store";

export async function getUserGroups(username: string): Promise<string[]> {
  const safeName = username.replace(/[^a-zA-Z0-9_. ]/g, "");
  if (!safeName) return ["default"];

  try {
    const lcName = safeName.toLowerCase();
    
    // 1. Get the player's UUID from the luckperms_players table
    const [userRows]: any = await lp_db.query(
      'SELECT uuid FROM luckperms_players WHERE username = ? LIMIT 1',
      [lcName]
    );

    if (!userRows || userRows.length === 0) {
      return ["default"];
    }

    const uuid = userRows[0].uuid;

    // 2. Get the player's groups from the luckperms_user_permissions table
    const [permissionRows]: any = await lp_db.query(
      'SELECT permission FROM luckperms_user_permissions WHERE uuid = ? AND permission LIKE "group.%"',
      [uuid]
    );

    const groups = ["default"];
    if (permissionRows && permissionRows.length > 0) {
      permissionRows.forEach((row: any) => {
        const group = row.permission.replace('group.', '').toLowerCase();
        if (["pro", "elite", "ultra"].includes(group)) {
          groups.push(group);
        }
      });
    }

    return Array.from(new Set(groups));
  } catch (error) {
    console.error("Failed to fetch user groups via SQL:", error);
    return ["default"];
  }
}
