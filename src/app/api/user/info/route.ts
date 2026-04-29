import { NextResponse } from "next/server";
import { executeRconCommand } from "@/lib/rcon";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // Command to get player groups
    const response = await executeRconCommand(`lp user ${username} parent info`);
    
    if (response === null || typeof response !== "string") {
      return NextResponse.json({ groups: ["default"] });
    }

    // LuckPerms response usually looks like: "JKeyOfficial has the following parents: [default, pro] (direct)"
    // We'll extract the words inside the brackets
    const match = response.match(/\[(.*?)\]/);
    if (match && match[1]) {
      const groups = match[1].split(",").map(g => g.trim().toLowerCase());
      return NextResponse.json({ groups });
    }

    return NextResponse.json({ groups: ["default"] });
  } catch (error) {
    console.error("Failed to fetch user groups:", error);
    return NextResponse.json({ error: "Failed to connect to server" }, { status: 500 });
  }
}
