"use client";

import React, { useState } from "react";
import ServerStatus from "@/components/ServerStatus";
import { ArrowRight, Shield, Zap, Gem } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ExploreButton from "@/components/ExploreButton";
import JoinModal from "@/components/JoinModal";

export default function Home() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col">
      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center px-[14%] overflow-hidden">
        {/* Optional subtle background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background to-transparent z-0"></div>

        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-20">
          <div className="flex flex-col">
            <h1 className="text-6xl md:text-[6.6rem] font-black leading-tight mb-4 font-heading text-foreground tracking-tight">
              JKey SMP
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-300 max-w-[620px] leading-8 mb-10">
              Join our thriving Minecraft community featuring cross-platform play, balanced gameplay, and regular events for all players.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="inline-block px-8 py-3.5 bg-primary rounded-md text-white font-medium hover:bg-foreground hover:text-background hover:scale-105 cursor-pointer transition-all duration-300"
              >
                Join Server
              </button>
              <ExploreButton />
            </div>
          </div>

          <div className="flex justify-center md:justify-end w-full relative">
            {/* Soft glow behind the image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full z-0"></div>

            <img
              src="/towersimage.png"
              alt="Cinematic Minecraft Render"
              className="w-full max-w-[600px] object-contain relative z-10 animate-float drop-shadow-2xl scale-110"
            />
          </div>
        </div>
      </section>

      {/* Server Status Section */}
      <section className="py-12 bg-card border-y border-border relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <ServerStatus />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background relative z-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4 text-foreground">Server Features</h2>
            <div className="section-line"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-xl hover:-translate-y-2 hover:border-primary hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300">
              <Shield className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold font-heading text-foreground mb-3">Grief Protection</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">Your builds are completely safe. Claim your land and play with peace of mind knowing your hard work is protected.</p>
            </div>

            <div className="bg-card border border-border p-8 rounded-xl hover:-translate-y-2 hover:border-primary hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300">
              <Zap className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold font-heading text-foreground mb-3">Lag Free</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">Running on premium dedicated hardware optimized for the best possible TPS, ensuring a smooth survival experience.</p>
            </div>

            <div className="bg-card border border-border p-8 rounded-xl hover:-translate-y-2 hover:border-primary hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300">
              <Gem className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold font-heading text-foreground mb-3">Player Economy</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">A thriving player-driven economy. Build , trade with others, and become the richest player on the server.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border relative overflow-hidden bg-card">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold font-heading mb-4 text-foreground">Support the Server</h2>
          <div className="section-line mb-8"></div>

          <p className="text-lg text-zinc-500 dark:text-zinc-300 mb-10">
            Want to help keep the server running and get some awesome perks in return? Check out our web store!
          </p>
          <Link
            href="/store"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary rounded-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(228,1,46,0.4)]"
          >
            Visit Store
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
