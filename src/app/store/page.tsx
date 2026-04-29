"use client";

import { useState } from "react";
import { storeItems, StoreItem, rankPriority } from "@/config/store";
import { Check } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";
import { useUser } from "@/context/UserContext";

export default function StorePage() {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const { username, groups } = useUser();


  const currentRankLevel = Math.max(...groups.map(g => rankPriority[g] || 0));

  return (
    <main className="flex-1 flex flex-col pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black font-heading mb-4 text-foreground">Server Store</h1>
          <div className="section-line mb-6"></div>
          <p className="text-xl text-zinc-500 dark:text-zinc-300 max-w-2xl mx-auto">
            Support the server and unlock exclusive perks. All purchases directly fund server hosting and development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {storeItems.map((item) => {
            const itemRankName = item.id.replace("rank_", "");
            const itemLevel = rankPriority[itemRankName] || 0;
            const isOwned = groups.includes(itemRankName);
            const isDowngrade = currentRankLevel > itemLevel;

            // Calculate dynamic upgrade price
            let displayPrice = item.price;
            let isUpgrade = false;
            
            if (currentRankLevel > 0 && !isOwned && !isDowngrade) {
              const currentRankKey = Object.keys(rankPriority).find(k => rankPriority[k] === currentRankLevel);
              const currentRankItem = storeItems.find(i => i.id === `rank_${currentRankKey}`);
              if (currentRankItem) {
                displayPrice = Math.max(0, item.price - currentRankItem.price);
                isUpgrade = true;
              }
            }

            return (
              <div 
                key={item.id}
                className={`flex flex-col bg-card border border-border rounded-xl p-8 relative overflow-hidden group transition-all duration-300 ${
                  isOwned || isDowngrade ? "opacity-75" : "hover:-translate-y-2 hover:border-primary hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                }`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}></div>
                
                {isOwned && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Owned
                  </div>
                )}

                <div className="mb-8 mt-2">
                  <h3 className="text-2xl font-bold font-heading text-foreground mb-2">{item.name}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 min-h-[48px]">{item.description}</p>
                </div>

                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground">${(displayPrice / 100).toFixed(2)}</span>
                  <span className="text-zinc-500 dark:text-zinc-400"> / lifetime</span>
                  {isUpgrade && (
                    <span className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded-full uppercase tracking-tight animate-pulse">
                      Upgrade Discount
                    </span>
                  )}
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 shrink-0" />
                      <span className="text-zinc-500 dark:text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !isOwned && !isDowngrade && setSelectedItem(item)}
                  disabled={isOwned || isDowngrade}
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                    isOwned 
                      ? "bg-green-500/20 text-green-500 border border-green-500/50 cursor-default" 
                      : isDowngrade
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 hover:scale-105 shadow-[0_0_15px_rgba(228,1,46,0.3)]"
                  }`}
                >
                  {isOwned ? "Already Owned" : isDowngrade ? "Higher Rank Owned" : isUpgrade ? `Upgrade for $${(displayPrice / 100).toFixed(2)}` : `Purchase ${item.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedItem && (
        <CheckoutModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          initialPrice={(() => {
            const itemRankName = selectedItem.id.replace("rank_", "");
            const itemLevel = rankPriority[itemRankName] || 0;
            if (currentRankLevel > 0 && currentRankLevel < itemLevel) {
              const currentRankKey = Object.keys(rankPriority).find(k => rankPriority[k] === currentRankLevel);
              const currentRankItem = storeItems.find(i => i.id === `rank_${currentRankKey}`);
              if (currentRankItem) return Math.max(0, selectedItem.price - currentRankItem.price);
            }
            return selectedItem.price;
          })()}
        />
      )}
    </main>
  );
}
