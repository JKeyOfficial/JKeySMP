import { executeRconCommand } from "./rcon";
import { rankPriority } from "@/config/store";

export async function getUserGroups(username: string): Promise<string[]> {
  // SECURITY: Prevent RCON Injection
  // Allow alphanumeric, underscores, dots, and SPACES (for Bedrock)
  const safeName = username.replace(/[^a-zA-Z0-9_. ]/g, "");
  
  if (!safeName) return ["default"];

  try {
    const lcName = safeName.toLowerCase();
    
    // Velocity commands often need /lpv
    const response = await executeRconCommand(`lpv user ${lcName} parent info`);
    
    if (typeof response !== "string" || !response || response === "1") {
      // If we still get '1' or nothing, we try permission checks (no slashes)
      const hasPro = await executeRconCommand(`lpv user ${lcName} permission check group.pro`) || "";
      const hasElite = await executeRconCommand(`lpv user ${lcName} permission check group.elite`) || "";
      const hasUltra = await executeRconCommand(`lpv user ${lcName} permission check group.ultra`) || "";

      const groups = ["default"];
      if (String(hasPro).toLowerCase().includes("true")) groups.push("pro");
      if (String(hasElite).toLowerCase().includes("true")) groups.push("elite");
      if (String(hasUltra).toLowerCase().includes("true")) groups.push("ultra");
      
      return groups;
    }

    // Parse the list response
    const groups = ["default"];
    const text = String(response).toLowerCase();
    
    if (text.includes("pro")) groups.push("pro");
    if (text.includes("elite")) groups.push("elite");
    if (text.includes("ultra")) groups.push("ultra");

    return Array.from(new Set(groups));
  } catch (error) {
    console.error("Failed to fetch user groups helper:", error);
    return ["default"];
  }
}
