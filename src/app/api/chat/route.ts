import { NextResponse } from "next/server";

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHAT_CHANNEL_ID;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const before = searchParams.get("before");

  if (!DISCORD_TOKEN || !CHANNEL_ID) {
    // Return mock data if credentials are missing so the UI still looks good during dev
    return NextResponse.json([
      {
        id: "1",
        author: "System",
        content: "Waiting for Discord configuration...",
        timestamp: new Date().toISOString(),
        isSystem: true,
      },
      {
        id: "2",
        author: "JKey",
        content: "Welcome to the live chat feed! This will sync with the server soon.",
        timestamp: new Date().toISOString(),
        isSystem: false,
      }
    ]);
  }

  try {
    const url = new URL(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`);
    url.searchParams.append("limit", "50");
    if (before) {
      url.searchParams.append("before", before);
    }

    const response = await fetch(
      url.toString(),
      {
        headers: {
          Authorization: `Bot ${DISCORD_TOKEN}`,
        },
        next: { revalidate: before ? 3600 : 5 }, // Cache history longer than live feed
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages from Discord");
    }

    const messages = await response.json();

    // Format the messages for our UI
    const formattedMessages = messages.map((msg: any) => {
      let content = msg.content;
      let playerName = msg.author.username;
      let displayContent = content;
      let rank = "";
      let isSystem = false;

      // Handle Embeds (Death messages, Join/Leave, etc.)
      if (msg.embeds && msg.embeds.length > 0) {
        const embed = msg.embeds[0];
        
        // Try every possible location for the text
        displayContent = embed.description || (embed.author ? embed.author.name : "") || embed.title || "";
        isSystem = true;
        
        // If we still have no content, check if it's a field-based embed
        if (!displayContent && embed.fields && embed.fields.length > 0) {
          displayContent = embed.fields[0].value;
        }

        // Try to parse player name from the extracted text for the avatar
        // Example: ".JKey4847 was smashed by JKeyOfficial" or ".JKey4847 joined"
        const nameMatch = displayContent.match(/^(\.?[a-zA-Z0-9_]{3,16})/);
        if (nameMatch) {
          playerName = nameMatch[1];
        }
      } else {
        // 1. Try to match Rank Pattern: "**Rank** Name » Message"
        const rankMatch = content.match(/^\*\*(.*?)\*\*\s+(.*?)\s+»\s+(.*)/);
        
        if (rankMatch) {
          rank = rankMatch[1];
          playerName = rankMatch[2];
          displayContent = rankMatch[3];
        } else {
          // 2. Try to match Non-Rank Pattern: "Name » Message"
          const noRankMatch = content.match(/^(.*?)\s+»\s+(.*)/);
          if (noRankMatch) {
            playerName = noRankMatch[1];
            displayContent = noRankMatch[2];
          }
        }

        // 3. Special handling for Server Status messages
        if (content.includes("Server has started")) {
          playerName = "Server_Up";
          displayContent = "Server has started";
          isSystem = true;
        } else if (content.includes("Server has stopped")) {
          playerName = "Server_Down";
          displayContent = "Server has stopped";
          isSystem = true;
        }
      }

      return {
        id: msg.id,
        author: playerName,
        rank: rank,
        content: displayContent,
        timestamp: msg.timestamp,
        isBot: msg.author.bot,
        isSystem: isSystem,
      };
    });

    return NextResponse.json(formattedMessages.reverse());
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to fetch chat" }, { status: 500 });
  }
}
