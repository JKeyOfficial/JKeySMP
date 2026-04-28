"use client";

import { useState } from "react";
import { storeItems, StoreItem } from "@/config/store";
import { Check } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";

export default function StorePage() {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

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
          {storeItems.map((item) => (
            <div 
              key={item.id}
              className="flex flex-col bg-card border border-border rounded-xl p-8 relative overflow-hidden group hover:-translate-y-2 hover:border-primary hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}></div>
              
              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-bold font-heading text-foreground mb-2">{item.name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 min-h-[48px]">{item.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-black text-foreground">${(item.price / 100).toFixed(2)}</span>
                <span className="text-zinc-500 dark:text-zinc-400"> / lifetime</span>
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
                onClick={() => setSelectedItem(item)}
                className="w-full py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(228,1,46,0.3)]"
              >
                Purchase {item.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <CheckoutModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </main>
  );
}
