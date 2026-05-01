"use client";

import { useState } from "react";
import JoinModal from "@/components/JoinModal";
import {
  BookOpen,
  Terminal,
  Shield,
  Users,
  Coins,
  Map,
  Heart,
  Pickaxe,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Home,
  Sword,
  MessageSquare,
  Star,
  Compass,
  Package,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────── */

interface Command {
  command: string;
  description: string;
}

interface CommandCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  commands: Command[];
}

const commandCategories: CommandCategory[] = [
  {
    title: "Essential Commands",
    icon: <Terminal className="w-6 h-6" />,
    color: "from-blue-500/20 to-cyan-500/20",
    commands: [
      { command: "/help", description: "View the full in-game help menu" },
      { command: "/spawn", description: "Teleport back to the server spawn" },
      { command: "/sethome <name>", description: "Set a home at your current location" },
      { command: "/home <name>", description: "Teleport to one of your saved homes" },
      { command: "/delhome <name>", description: "Delete a saved home" },
      { command: "/homes", description: "List all your saved homes" },
      { command: "/msg <player> <message>", description: "Send a private message to another player" },
      { command: "/r <message>", description: "Quickly reply to the last private message" },
      { command: "/ignore <player>", description: "Block messages from a specific player" },
    ],
  },
  {
    title: "Teleportation",
    icon: <Compass className="w-6 h-6" />,
    color: "from-purple-500/20 to-pink-500/20",
    commands: [
      { command: "/hub>", description: "Teleport to the main hub" },
      { command: "/tpa <player>", description: "Request to teleport to another player" },
      { command: "/tpahere <player>", description: "Request a player to teleport to you" },
      { command: "/tpaccept", description: "Accept an incoming teleport request" },
      { command: "/tpdeny", description: "Deny an incoming teleport request" },
      { command: "/rtp", description: "Randomly teleport to a safe location in the wild" },
      { command: "/warp <name>", description: "Teleport to a public server warp point" },
      { command: "/warps", description: "List all available warp points" },
    ],
  },
  {
    title: "Economy & Trading",
    icon: <Coins className="w-6 h-6" />,
    color: "from-amber-500/20 to-yellow-500/20",
    commands: [
      { command: "/balance", description: "Check your current balance" },
      { command: "/bal <player>", description: "Check another player's balance" },
      { command: "/pay <player> <amount>", description: "Send money to another player" },
      { command: "/baltop", description: "View the richest players on the server" },
      { command: "/market", description: "Open the market to buy and sell items to players" },
      { command: "/offer <price>", description: "List the item in your hand on the market" },
      { command: "/shop", description: "Open the server admin shop" },
      { command: "/coinflip <amount>", description: "Wager against another player in a game of coinflip" },
    ],
  },
  {
    title: "Social & Community",
    icon: <Users className="w-6 h-6" />,
    color: "from-rose-500/20 to-red-500/20",
    commands: [
      { command: "/mail send <player> <msg>", description: "Send offline mail to a player" },
      { command: "/mail read", description: "Read your received mail" },
      { command: "/list", description: "See all online players" },
      { command: "/discord", description: "Get the link to our Discord server" },
      { command: "/youtube", description: "Get the link to our Youtube Channel" },
      { command: "/tiktok", description: "Get the link to our TikTok" },

    ],
  },
  {
    title: "Utility",
    icon: <Package className="w-6 h-6" />,
    color: "from-indigo-500/20 to-violet-500/20",
    commands: [
      { command: "/kit starter", description: "Claim the free starter kit (once)" },
      { command: "/kits", description: "View all available kits" },
      { command: "/playtime", description: "View your total playtime on the server" },
    ],
  },
];

interface GuideStep {
  step: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  tips: string[];
}

const gettingStartedSteps: GuideStep[] = [
  {
    step: 1,
    title: "Join the Server",
    icon: <Sparkles className="w-7 h-7" />,
    description:
      "Add our server to your Minecraft multiplayer list. We support both Java and Bedrock editions, so you can play from any platform.",
    tips: [
      "Server IP: jkeysmp.net",
      "Java Edition: Use version 1.21+",
      "Bedrock Edition: Connect via port 40008",
      "Make sure your game is up to date for the best experience",
    ],
  },
  {
    step: 2,
    title: "Explore the Spawn",
    icon: <Map className="w-7 h-7" />,
    description:
      "When you first join, take a moment to explore the spawn area. Check out the information boards, the starter NPC, and get familiar with the server rules.",
    tips: [
      "Read the rules at spawn — knowing them keeps you safe from bans",
      "Claim your /kit starter for free gear",
      "Check out the /warps for useful locations",
      "Talk to NPCs at spawn for helpful tips",
    ],
  },
  {
    step: 3,
    title: "Find Your Land",
    icon: <Compass className="w-7 h-7" />,
    description:
      "Venture out into the wild using /rtp (random teleport) to find the perfect spot for your base. Once you find a location you love, claim it immediately.",
    tips: [
      "Use /rtp to find a random safe location",
      "Once you find your spot, use /sethome <name> so you can return anytime",
    ],
  },
  {
    step: 4,
    title: "Build Your Economy",
    icon: <Coins className="w-7 h-7" />,
    description:
      "Start earning money by selling items, trading with players, or completing server activities. The economy is player-driven so every trade matters.",
    tips: [
      "Build a farm and start harvesting resources",
      "Sell items to the server using /sell",
      "Use /shop to buy pvp items, mob drops and food",
      "Check /market to buy and sell from other players",
      "Check /baltop to see how you compare",
    ],
  },
  {
    step: 5,
    title: "PvP!",
    icon: <Sword className="w-7 h-7" />,
    description:
      "Venture the world and hunt other players. Find their bases and steal their items.",
    tips: [
      "Use /rtp to teleport to random locations in the world",
      "Search the area for player bases",
      "Break into their base, kill them, and steal their items.",
      "Be prepared for other players to raid your base",
    ],
  },
  {
    step: 6,
    title: "Join the Community",
    icon: <Heart className="w-7 h-7" />,
    description:
      "JKey SMP is all about community. Join our Discord, participate in events, team up with other players, and make this server your home.",
    tips: [
      "Join our Discord server with /discord",
      "Participate in server events for exclusive rewards",
      "Share your best clips on TikTok and YouTube using #jkeysmp",
      "Visit the store to support the server and unlock perks",
    ],
  },
];

/* ─── Components ────────────────────────────────────────────────────── */

function CommandCard({ category }: { category: CommandCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-primary group-hover:scale-110 transition-transform duration-300`}
          >
            {category.icon}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold font-heading text-foreground">
              {category.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {category.commands.length} commands
            </p>
          </div>
        </div>
        <div
          className={`p-2 rounded-lg bg-card border border-border transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
        >
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        </div>
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 pb-6 space-y-2">
          {category.commands.map((cmd, i) => (
            <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 group/cmd transition-all duration-200">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <code className="text-sm font-mono font-bold text-primary whitespace-nowrap">
                  {cmd.command}
                </code>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate hidden sm:block">
                  — {cmd.description}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(cmd.command);
                }}
                className="ml-3 p-1.5 rounded-lg sm:opacity-0 sm:group-hover/cmd:opacity-100 hover:bg-primary/10 transition-all duration-200 cursor-pointer shrink-0"
                title="Copy command"
              >
                {copiedCmd === cmd.command ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GuideStepCard({ guide }: { guide: GuideStep }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Step number badge */}
      <div className="absolute -top-4 -left-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
        {guide.step}
      </div>

      <div className="flex items-start gap-5 pt-2">
        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shrink-0">
          {guide.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold font-heading text-foreground">
              {guide.title}
            </h3>
            <ChevronRight
              className={`w-5 h-5 text-zinc-400 transition-transform duration-300 shrink-0 ${isExpanded ? "rotate-90" : ""
                }`}
            />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
            {guide.description}
          </p>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className="space-y-2 pt-2 border-t border-border/50">
              {guide.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-500 dark:text-zinc-300 leading-relaxed">
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<"guide" | "commands">("guide");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div className="flex-1 bg-background py-28 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 blur-[200px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-[0.15em] mb-6">
            <BookOpen className="w-4 h-4" />
            Player Guide
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-foreground mb-6 tracking-tight">
            Server Info
          </h1>
          <div className="section-line mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about playing on JKey SMP. From getting
            started to mastering every command.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10 md:mb-16">
          <div className="inline-flex bg-card border border-border rounded-2xl p-1.5 gap-1">
            <button
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${activeTab === "guide"
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:bg-background/50"
                }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Getting Started</span>
              <span className="sm:hidden">Guide</span>
            </button>
            <button
              onClick={() => setActiveTab("commands")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${activeTab === "commands"
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:bg-background/50"
                }`}
            >
              <Terminal className="w-4 h-4" />
              Commands
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative">
          {/* Getting Started Tab */}
          <div
            className={`transition-all duration-500 ${activeTab === "guide"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
              }`}
          >
            {/* Quick Start Banner */}
            <div className="mb-8 md:mb-12 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary/10 via-card to-primary/5 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full"></div>
              <div className="relative z-10 flex items-start gap-4 md:gap-5">
                <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-primary/20 text-primary shrink-0">
                  <Pickaxe className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black font-heading text-foreground mb-2">
                    Quick Start
                  </h2>
                  <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-300 leading-relaxed max-w-xl">
                    New to JKey SMP? Follow these steps to get set up in
                    minutes. Click on any step to reveal helpful tips and
                    tricks.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-6 md:space-y-8">
              {gettingStartedSteps.map((guide) => (
                <GuideStepCard key={guide.step} guide={guide} />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 md:mt-16 text-center p-8 md:p-12 bg-card/50 border border-border rounded-2xl md:rounded-3xl backdrop-blur-sm">
              <Star className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-heading text-foreground mb-3">
                Ready to Play?
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                Jump in and start your adventure. Our community is friendly
                and always happy to help new players.
              </p>
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="inline-block px-8 py-3.5 bg-primary rounded-md text-white font-medium hover:bg-foreground hover:text-background hover:scale-105 cursor-pointer transition-all duration-300"
              >
                Join Server
              </button>
            </div>
          </div>

          {/* Commands Tab */}
          <div
            className={`transition-all duration-500 ${activeTab === "commands"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
              }`}
          >
            {/* Commands Header */}
            <div className="mb-8 md:mb-12 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary/10 via-card to-primary/5 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full"></div>
              <div className="relative z-10 flex items-start gap-4 md:gap-5">
                <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-primary/20 text-primary shrink-0">
                  <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black font-heading text-foreground mb-2">
                    Command Reference
                  </h2>
                  <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-300 leading-relaxed max-w-xl">
                    A complete list of commands available on JKey SMP. Click
                    any category to expand and view all commands. Hover over a
                    command to copy it.
                  </p>
                </div>
              </div>
            </div>

            {/* Command Categories */}
            <div className="space-y-4">
              {commandCategories.map((category) => (
                <CommandCard key={category.title} category={category} />
              ))}
            </div>

            {/* Note */}
            <div className="mt-8 md:mt-12 text-center p-6 md:p-8 bg-card/50 border border-border rounded-2xl md:rounded-3xl backdrop-blur-sm">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                <span className="text-primary font-bold">Note:</span> Some
                commands may require specific ranks or permissions. Visit our{" "}
                <a
                  href="/store"
                  className="text-primary hover:underline font-medium"
                >
                  store
                </a>{" "}
                to unlock additional features and commands.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
