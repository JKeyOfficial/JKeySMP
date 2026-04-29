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
    console.log(`[RCON] Attempting to connect to ${host}:${port}...`);
    const rcon = await Rcon.connect({
      host,
      port,
      password,
    });
    
    console.log(`[RCON] Connected! Waiting 100ms...`);
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log(`[RCON] Executing command: ${command}`);
    const response = await rcon.send(command);
    console.log(`[RCON] Raw Response: "${response}"`);
    
    await rcon.end();
    return response || "";
  } catch (error) {
    console.error(`[RCON] Failed to execute command:`, error);
    return null;
  }
}
