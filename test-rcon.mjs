import { RCON } from 'minecraft-server-util';
import fs from 'fs';

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#]+?)=(.+)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
  }
});

const client = new RCON();
const host = env.RCON_HOST;
const port = parseInt(env.RCON_PORT || "25575", 10);
const password = env.RCON_PASSWORD;

async function test() {
  console.log(`[RCON Test] Connecting to ${host}:${port}...`);
  try {
    await client.connect(host, port, { timeout: 5000 });
    console.log("[RCON Test] Connected! Authenticating...");
    await client.login(password);
    console.log("[RCON Test] Authenticated! Sending 'list' command...");
    const response = await client.run("list");
    console.log(`[RCON Test] Server Response: \n${response}`);
    
    // Optional: send a message to the server
    await client.run("say Hello from the Website RCON Tester!");
    console.log("[RCON Test] Broadcasted a hello message to the server.");
    
    await client.close();
    console.log("[RCON Test] Test completely successful! 🎉");
  } catch (err) {
    console.error("[RCON Test] FAILED:", err.message);
    client.close();
  }
}

test();
