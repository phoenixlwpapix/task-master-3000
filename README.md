# Task Master 3000 💀

A bold, unapologetic, **Neo-brutalist Todo Application** built with **Next.js 16** and **Convex**.

This project isn't just a todo list; it's a statement. It rejects the polished "corporate SaaS" aesthetic in favor of raw structure, high-contrast colors, and mechanical interactions.

![Neo-Brutalism Design](https://placehold.co/1200x600/FFFDF5/000000?text=Task+Master+3000)
*(Replace with actual screenshot)*

## ⚡ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database / Backend**: [Convex](https://www.convex.dev/) (Real-time, reactive)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Font**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)

## 🎨 Design Philosophy: Neo-Brutalism

- **Hard Borders**: Every element has a `4px` solid black border. No exceptions.
- **Vibrant Palette**: Cream (`#FFFDF5`) canvas with Hot Red (`#FF6B6B`), Vivid Yellow (`#FFD93D`), and Soft Violet (`#C4B5FD`) accents.
- **Mechanical Feel**: Buttons "press" down physically (translate + shadow removal) rather than fading.
- **Visual Weight**: Deep, solid black shadows (`8px`, `12px`) offset at 45 degrees.
- **Typography**: Massive, uppercase `Space Grotesk` headings for maximum impact.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd test-todo-convex
pnpm install
```

### 2. Setup Convex

Initialize your Convex database project:

```bash
pnpm convex dev
```

This will prompt you to log in to Convex and select/create a project. It will save your deployment URL to `.env.local` automatically.

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🛠 Features

- **Real-time Sync**: Tasks update instantly across all devices/windows using Convex's reactive subscriptions.
- **Tasks**: Add, toggle (complete/incomplete), and delete tasks.
- **Progress Tracking**: Visual progress bar and stats counter.
- **Responsive Design**: Mobile-friendly layout that maintains the neo-brutalist aesthetic.

## 📂 Project Structure

- `convex/`: Backend functions (database schema, queries, mutations).
- `src/app/`: Next.js App Router pages and layouts.
- `src/app/globals.css`: Global styles, CSS variables, and custom animations.

---

**Get Shit Done.**
