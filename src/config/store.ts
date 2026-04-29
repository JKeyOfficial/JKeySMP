export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number; // In cents
  features: string[];
  color: string;
  commands: string[];
}

export const rankPriority: Record<string, number> = {
  "default": 0,
  "pro": 1,
  "elite": 2,
  "ultra": 3
};

export const storeItems: StoreItem[] = [
  {
    id: "rank_pro",
    name: "Pro Rank",
    description: "The perfect starting point for dedicated players.",
    price: 499, // $4.99
    features: [
      "[PRO] Chat Prefix",
      "Set up to 3 homes",
      "Access to /workbench",
      "Priority server access",
      "Exclusive Discord Role"
    ],
    color: "from-zinc-300 to-zinc-500", // Silver
    commands: ["lpv user \"{player}\" parent add pro"]
  },
  {
    id: "rank_elite",
    name: "Elite Rank",
    description: "Stand out from the crowd with premium perks.",
    price: 1499, // $14.99
    features: [
      "All Pro Features",
      "[ELITE] Chat Prefix",
      "Set up to 10 homes",
      "Access to /enderchest",
      "Keep inventory on death",
      "Color chat access"
    ],
    color: "from-amber-300 to-amber-500", // Gold
    commands: ["lpv user \"{player}\" parent add elite"]
  },
  {
    id: "rank_ultra",
    name: "Ultra Rank",
    description: "The ultimate status for our biggest supporters.",
    price: 2499, // $24.99
    features: [
      "All Elite Features",
      "[ULTRA] Chat Prefix",
      "Unlimited homes",
      "Access to /fly in claims",
      "Join full server",
      "Custom nicknames"
    ],
    color: "from-cyan-400 to-blue-500", // Blue Diamond
    commands: ["lpv user \"{player}\" parent add ultra"]
  }
];
