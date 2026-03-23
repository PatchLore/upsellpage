# Upsell Builder

Create high-converting upsell pages in seconds. Built with Next.js 16, Tailwind CSS, and Supabase.

## Quick Start

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration from `supabase/migration.sql`:

```bash
# Copy the contents of supabase/migration.sql and run in Supabase SQL Editor
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase values from **Project Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## How it works

| Route | Purpose |
|-------|---------|
| `/` | Builder form — create an upsell page |
| `/success?slug=abc123` | Success screen with copy link button |
| `/u/[slug]` | Public upsell page — share this with your audience |
| `/api/upsell` | POST endpoint to save and generate slug |

---

## Deploy to Vercel

```bash
npx vercel
```

Add the two env vars in Vercel's project settings. Done.

---

## File structure

```
src/
  app/
    page.tsx              # Builder form
    success/page.tsx      # Success + copy link
    u/[slug]/page.tsx     # Public upsell page
    not-found.tsx         # 404 page
    layout.tsx            # Root layout
    globals.css           # Tailwind + animations
    api/
      upsell/route.ts     # POST /api/upsell
  lib/
    supabase.ts           # Supabase client + types
```

---

## What's next (post-MVP)

- [ ] Auth — let creators manage their pages
- [ ] Analytics — track views and CTA clicks  
- [ ] Custom domains
- [ ] A/B test headlines
- [ ] Countdown timer widget
- [ ] Stripe payment integration
- [ ] List on Whop marketplace as an iframe app
