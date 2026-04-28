export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number; // In cents
  features: string[];
  color: string;
  command: string;
}

export const storeItems: StoreItem[] = [
  {
    id: "rank_vip",
    name: "VIP Rank",
    description: "The perfect starting point for dedicated players.",
    price: 499, // $4.99
    features: [
      "[VIP] Chat Prefix",
      "Set up to 3 homes",
      "Access to /workbench",
      "Priority server access",
      "Exclusive Discord Role"
    ],
    color: "from-zinc-300 to-zinc-500", // Silver
    command: "lp user {player} parent add vip"
  },
  {
    id: "rank_mvp",
    name: "MVP Rank",
    description: "Stand out from the crowd with premium perks.",
    price: 1499, // $14.99
    features: [
      "All VIP Features",
      "[MVP] Chat Prefix",
      "Set up to 10 homes",
      "Access to /enderchest",
      "Keep inventory on death",
      "Color chat access"
    ],
    color: "from-amber-300 to-amber-500", // Gold
    command: "lp user {player} parent add mvp"
  },
  {
    id: "rank_mvp_plus",
    name: "MVP+ Rank",
    description: "The ultimate status for our biggest supporters.",
    price: 2499, // $24.99
    features: [
      "All MVP Features",
      "[MVP+] Chat Prefix",
      "Unlimited homes",
      "Access to /fly in claims",
      "Join full server",
      "Custom nicknames"
    ],
    color: "from-cyan-400 to-blue-500", // Blue Diamond
    command: "lp user {player} parent add mvpplus"
  }
];
