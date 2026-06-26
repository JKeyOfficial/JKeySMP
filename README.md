# JKey SMP — Custom Minecraft Server Website & Store

## Overview

This is the custom website and online store I built for my Minecraft server, [JKey SMP](https://jkeysmp.net). 

I wanted to move away from traditional Minecraft store providers like **Tebex** due to their limited design flexibility, generic templates, and ongoing fees. Instead, I built a fully custom solution using **Google Antigravity** and **Vercel**, giving me complete control over the design, user experience, and feature set.

---

## Features

### 1. Fully Responsive UI
A clean, modern interface that works across all devices. This involved extensive iteration — refining layouts, adjusting element sizing, and ensuring visual consistency across screen sizes.

<img width="382" height="824" alt="image" src="https://github.com/user-attachments/assets/9af83349-3a5b-4fb8-b5bb-1368c2ab006e" />

---

### 2. Username-Based Login System
Players log in by entering their Minecraft username — no password required. On login, their Minecraft skin renders as a profile picture, giving immediate visual confirmation that they're on the correct account.

---

### 3. Smart Store with Duplicate Purchase Prevention
The store displays three rank tiers (Pro, Elite, Ultra), but automatically **greys out and marks as "Already Owned"** any ranks the player already has.

**How it works:** The site queries my **LuckPerms MySQL database**, parses the user's group memberships, and cross-references them against store packages. This prevents accidental duplicate purchases and keeps the UI clean.

&lt;img width="800" alt="Store showing owned ranks" src="https://github.com/user-attachments/assets/850ec735-38c8-4f0f-860e-218643077a00" /&gt;

---

### 4. Real-Time Live Chat Bridge
A web-based chat interface synced directly with the Minecraft server via **RCON**, allowing players to communicate in-game from their browser.

---

### 5. Dynamic Leaderboards
Live leaderboards tracking player stats including:
- Wealth
- Kills
- K/D Ratio
- Playtime

---

### 6. Server Status Monitoring
Real-time server health indicator showing uptime and ping latency.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Google Antigravity |
| Hosting | Vercel |
| Database | MySQL (LuckPerms) |
| Server Integration | RCON |
| Payments | Stripe |

---

## What I Learned

- Architecting multi-service integrations (web ↔ database ↔ game server)
- The importance of responsive design iteration
- Database querying and parsing for dynamic UI states
- Deploying and maintaining a live production site

---
