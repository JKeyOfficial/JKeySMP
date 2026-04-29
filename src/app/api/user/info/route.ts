import { NextResponse } from "next/server";
import { getUserGroups } from "@/lib/minecraft";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const groups = await getUserGroups(username);
    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Failed to fetch user groups:", error);
    return NextResponse.json({ error: "Failed to connect to server" }, { status: 500 });
  }
}
