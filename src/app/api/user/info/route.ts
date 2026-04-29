import { NextResponse } from "next/server";
import { executeRconCommand } from "@/lib/rcon";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // Try 'parent list' instead of 'info', it's often more reliable for RCON
    const response = await executeRconCommand(`lp user ${username} parent list`);
    
    if (typeof response !== "string" || !response || response === "1") {
      // If we still get '1' or nothing, we try a permission check as a last resort
      const hasPro = await executeRconCommand(`lp user ${username} permission check group.pro`) || "";
      const hasElite = await executeRconCommand(`lp user ${username} permission check group.elite`) || "";
      const hasUltra = await executeRconCommand(`lp user ${username} permission check group.ultra`) || "";
      
      const groups = ["default"];
      if (String(hasPro).toLowerCase().includes("true")) groups.push("pro");
      if (String(hasElite).toLowerCase().includes("true")) groups.push("elite");
      if (String(hasUltra).toLowerCase().includes("true")) groups.push("ultra");
      
      return NextResponse.json({ groups });
    }

    // Parse the list response. LuckPerms list usually looks like: "- pro", "- default", etc.
    const groups = ["default"];
    const text = String(response).toLowerCase();
    
    if (text.includes("pro")) groups.push("pro");
    if (text.includes("elite")) groups.push("elite");
    if (text.includes("ultra")) groups.push("ultra");

    return NextResponse.json({ groups: Array.from(new Set(groups)) });
  } catch (error) {
    console.error("Failed to fetch user groups:", error);
    return NextResponse.json({ error: "Failed to connect to server" }, { status: 500 });
  }
}
