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
    price: 299, // $2.99
    features: [
      "[PRO] Chat Prefix",
      "Set up to 5 homes",
      "Exclusive Discord Role",
      "Leaderboard glow"
    ],
    color: "from-zinc-300 to-zinc-500", // Silver
    commands: ["lpv user \"{player}\" parent add pro"]
  },
  {
    id: "rank_elite",
    name: "Elite Rank",
    description: "Stand out from the crowd with premium perks.",
    price: 499, // $4.99
    features: [
      "[ELITE] Chat Prefix",
      "Set up to 7 homes",
      "Exclusive Discord Role",
      "Leaderboard glow",

    ],
    color: "from-amber-300 to-amber-500", // Gold
    commands: ["lpv user \"{player}\" parent add elite"]
  },
  {
    id: "rank_ultra",
    name: "Ultra Rank",
    description: "The ultimate status for our biggest supporters.",
    price: 799, // $7.99
    features: [
      "[ULTRA] Chat Prefix",
      "Set up to 12 homes",
      "Exclusive Discord Role",
      "Leaderboard glow",
      "Custom nicknames",
      "HabiTick lifetime premium"
    ],
    color: "from-cyan-400 to-blue-500", // Blue Diamond
    commands: ["lpv user \"{player}\" parent add ultra"]
  }
];
