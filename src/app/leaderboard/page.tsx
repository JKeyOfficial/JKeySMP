'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Swords, Skull, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import Image from 'next/image';

type StatType = 'vault_eco_balance' | 'statistic_time_played' | 'statistic_player_kills' | 'kd';

interface LeaderboardEntry {
  name: string;
  value: string | number;
  ranks?: string[];
}

export default function LeaderboardPage() {
  const [activeStat, setActiveStat] = useState<StatType>('vault_eco_balance');
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const rankStyles: Record<string, { text: string, glow: string, label: string }> = {
    'ultra': { text: 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]', label: 'ULTRA' },
    'elite': { text: 'bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]', label: 'ELITE' },
    'pro': { text: 'bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(161,161,170,0.5)]', glow: 'shadow-[0_0_15px_rgba(161,161,170,0.3)]', label: 'PRO' },
  };

  const getHighestRank = (ranks: string[] = []) => {
    if (ranks.includes('ultra')) return 'ultra';
    if (ranks.includes('elite')) return 'elite';
    if (ranks.includes('pro')) return 'pro';
    return null;
  };

  const medalRankColors: Record<number, string> = {
    1: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]',
    2: 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]',
    3: 'text-orange-500 drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]',
  };

  const stats = [
    { id: 'vault_eco_balance', label: 'Wealth', icon: Trophy, color: 'text-yellow-400' },
    { id: 'statistic_player_kills', label: 'Kills', icon: Swords, color: 'text-red-400' },
    { id: 'kd', label: 'K/D Ratio', icon: Trophy, color: 'text-purple-400' },
    { id: 'statistic_time_played', label: 'Playtime', icon: Clock, color: 'text-blue-400' },
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/leaderboard?stat=${activeStat}&page=${page}`);
        const json = await res.json();
        
        if (json.error) {
          setError(json.error);
        } else {
          setData(json.data || []);
          setTotalPages(json.meta?.totalPages || 1);
        }
      } catch (err) {
        setError('Failed to load leaderboard data.');
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [activeStat, page]);

  // Helper to format values. e.g. add "$" for economy, format ticks to hours for playtime
  const formatValue = (statId: string, value: string | number) => {
    const num = Number(value);
    if (isNaN(num)) return value;

    if (statId === 'vault_eco_balance') {
      return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (statId === 'statistic_time_played') {
      // ajLeaderboards appears to store statistic_time_played as seconds in the DB
      let seconds = Math.floor(num);
      const weeks = Math.floor(seconds / (7 * 24 * 3600));
      seconds %= (7 * 24 * 3600);
      const days = Math.floor(seconds / (24 * 3600));
      seconds %= (24 * 3600);
      const hours = Math.floor(seconds / 3600);
      seconds %= 3600;
      const minutes = Math.floor(seconds / 60);

      const parts = [];
      if (weeks > 0) parts.push(`${weeks}w`);
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

      return parts.join(' ');
    }
    if (statId === 'kd') {
      return num.toFixed(2);
    }
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight"
        >
          Server <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">Leaderboards</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto"
        >
          See who reigns supreme across all time.
        </motion.p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {stats.map((stat) => (
          <button
            key={stat.id}
            onClick={() => { setActiveStat(stat.id as StatType); setPage(1); }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeStat === stat.id 
                ? 'bg-white/10 text-white ring-2 ring-white/20 shadow-lg' 
                : 'bg-black/20 text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span>{stat.label}</span>
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-400 p-8 text-center">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="font-bold">{error}</p>
            <p className="text-sm text-gray-500 mt-2">Check your .env.local database credentials and table names.</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p>No records found for this category yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold text-center w-24">Rank</th>
                  <th className="p-4 font-semibold">Player</th>
                  <th className="p-4 font-semibold text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((player, index) => {
                  const rank = (page - 1) * 100 + index + 1;
                  const highestRank = getHighestRank(player.ranks);
                  const style = highestRank ? rankStyles[highestRank] : null;
                  const medalRankColor = page === 1 ? medalRankColors[rank] : '';

                  return (
                    <motion.tr 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      key={`${player.name}-${rank}`}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className={`p-4 text-center font-black text-2xl group-hover:scale-110 transition-transform ${medalRankColor || 'text-gray-500 group-hover:text-white'}`}>
                        #{rank}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className={`relative w-10 h-10 rounded-md overflow-hidden ${style?.glow || ''}`}>
                            <img 
                              src={`https://mc-heads.net/avatar/${player.name}/50`} 
                              alt={player.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-bold text-lg ${style?.text || 'text-white'}`}>
                              {player.name}
                            </span>
                            {style && (
                              <span className="text-[10px] font-black tracking-tighter opacity-70">
                                {style.label}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-xl text-emerald-400 font-bold">
                        {formatValue(activeStat, player.value)}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 bg-white/5 border-t border-white/5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center px-4 py-2 bg-black/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Prev
            </button>
            <span className="text-gray-400">
              Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center px-4 py-2 bg-black/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
