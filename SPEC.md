# Gas Tracker - Base MiniApp

## Problem
Users on Base don't have an easy way to track gas prices and optimize when to transact.

## Solution
A simple web app showing:
- Current Base gas price (in gwei)
- Average gas price (last 1hr, 24hr)
- Recommendation: "Transact now" / "Wait"
- Historical chart (7 days)

## Tech Stack
- Frontend: Plain HTML/CSS/JS (simple, deploy anywhere)
- Data: Base RPC + Covalent API (free tier)

## Features
1. Live gas price display
2. Color-coded recommendation (green/yellow/red)
3. Simple historical chart (using Chart.js)
4. "Notify me when gas < X" - optional (later)

## Revenue Model
- Free tier: basic gas info
- Premium (future): gas alerts, portfolio tracking
- Sponsored by protocols wanting to attract users during low-gas periods

## Files
- index.html - Main app
- styles.css - Styling  
- app.js - Logic + API calls
- README.md - Setup instructions

## Status
- [x] Spec written
- [ ] Code
- [ ] Deploy (could use Vercel, Netlify, or IPFS)
- [ ] Post about it
