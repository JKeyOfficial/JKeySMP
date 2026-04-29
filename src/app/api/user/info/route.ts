import { NextResponse } from "next/server";
import { getUserGroups } from "@/lib/minecraft";

// Simple in-memory rate limiter
const RATE_LIMIT_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;
const ipCache = new Map<string, { count: number; lastReset: number }>();

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  
  // Rate Limit Check
  const userData = ipCache.get(ip) || { count: 0, lastReset: now };
  if (now - userData.lastReset > RATE_LIMIT_MS) {
    userData.count = 0;
    userData.lastReset = now;
  }
  
  if (userData.count >= MAX_REQUESTS) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }
  
  userData.count++;
  ipCache.set(ip, userData);

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
