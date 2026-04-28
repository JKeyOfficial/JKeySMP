import { RCON } from "minecraft-server-util";

export async function executeRconCommand(command: string) {
  const client = new RCON();
  
  const host = process.env.RCON_HOST;
  const port = parseInt(process.env.RCON_PORT || "25575", 10);
  const password = process.env.RCON_PASSWORD;

  if (!host || !password) {
    console.error("RCON configuration missing!");
    return false;
  }

  try {
    await client.connect(host, port);
    await client.login(password);
    
    console.log(`[RCON] Executing command: ${command}`);
    const response = await client.run(command);
    console.log(`[RCON] Response: ${response}`);
    
    await client.close();
    return true;
  } catch (error) {
    console.error(`[RCON] Failed to execute command:`, error);
    client.close();
    return false;
  }
}
