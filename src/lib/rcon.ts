import { Rcon } from "rcon-client";

export async function executeRconCommand(command: string) {
  const host = process.env.RCON_HOST;
  const port = parseInt(process.env.RCON_PORT || "25575", 10);
  const password = process.env.RCON_PASSWORD;

  if (!host || !password) {
    console.error("RCON configuration missing!");
    return null;
  }

  try {
    const rcon = await Rcon.connect({
      host,
      port,
      password,
    });

    console.log(`[RCON] Executing command: ${command}`);
    const response = await rcon.send(command);
    console.log(`[RCON] Response: ${response}`);
    
    await rcon.end();
    return response || "";
  } catch (error) {
    console.error(`[RCON] Failed to execute command:`, error);
    return null;
  }
}
