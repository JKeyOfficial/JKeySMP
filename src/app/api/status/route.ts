import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    // Using mcstatus.io API - No external libraries needed, avoids deprecation warnings
    const res = await fetch('https://api.mcstatus.io/v2/status/java/jkeysmp.net', {
      next: { revalidate: 60 }
    });
    const data = await res.json();

    return NextResponse.json({
      online: data.online,
      players: data.players?.online || 0,
      maxPlayers: data.players?.max || 0,
    });
  } catch (error) {
    console.error("Status fetch error:", error);
    return NextResponse.json({
      online: false,
      players: 0,
      maxPlayers: 0,
    });
  }
}
