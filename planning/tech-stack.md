# Tech Stack — Thinkboard

> Last updated: March 2, 2026
> All versions verified against npm registry as of this date.

---

## Stack at a Glance

```
Framework        Next.js 16 (App Router) + TypeScript
Styling          Tailwind CSS 4 + shadcn/ui + Lucide React
Canvas           React Flow (@xyflow/react)
Rich Text        Tiptap v3
State            Zustand
Auth             Supabase Auth (Google OAuth + email/password)
Database         Supabase PostgreSQL + Row Level Security
File Storage     Supabase Storage
Server Logic     Supabase Edge Functions + Next.js Server Actions
AI Chat          Vercel AI SDK + OpenAI GPT-4o / GPT-4o-mini
Transcription    OpenAI Whisper API
Vision           OpenAI GPT-4o Vision
Payments         Polar.sh (Merchant of Record)
Deployment       Vercel
Validation       Zod
```

---

## 1. Framework & Language

| Package | Version | Purpose | Install |
|---------|---------|---------|---------|
| `next` | 16.1.6 | React meta-framework with App Router, Server Components, Server Actions, Turbopack | `npm install next@latest` |
| `react` | 19.2.x | UI library with View Transitions (ships with Next.js 16) | `npm install react@latest` |
| `react-dom` | 19.2.x | React DOM renderer | `npm install react-dom@latest` |
| `typescript` | 5.x | Static typing for the entire codebase | `npm install -D typescript @types/react @types/node` |

**Why Next.js 16:** Stable release with Turbopack as the default bundler (5-10x faster Fast Refresh, 2-5x faster builds), React 19.2 with View Transitions, the `"use cache"` directive for opt-in caching, and improved routing with layout deduplication. All dependencies in this stack are compatible with v16.

**Why Next.js at all:** Vercel's own framework — zero-config deployment. App Router provides Server Components (faster initial loads) and Server Actions (server-side functions callable from React without API routes). 120k+ GitHub stars, the most popular React meta-framework by a wide margin.

**Why TypeScript:** Complex data structures (boards, nodes, edges, messages, subscriptions) need type safety. AI models generate better code with TypeScript because type annotations provide structural context.

---

## 2. Styling & UI Components

| Package | Version | Purpose | Install |
|---------|---------|---------|---------|
| `tailwindcss` | 4.2.1 | Utility-first CSS framework | `npm install -D tailwindcss @tailwindcss/postcss` |
| `shadcn/ui` | CLI | Accessible component library (copies source into project) | `npx shadcn@latest init` |
| `lucide-react` | 0.575.0 | Icon library (ships with shadcn/ui) | `npm install lucide-react` |

**Why Tailwind CSS:** Utility-first — style directly in JSX without separate CSS files. No naming conventions to invent. AI models generate Tailwind classes with high accuracy. 80k+ GitHub stars, dominant in the React ecosystem.

**Why shadcn/ui:** Not an npm dependency — copies accessible, customizable component source code directly into the project. Built on Radix UI primitives (unified `radix-ui` package as of Feb 2026). Covers nearly every component the UI plan specifies: Dialog, DropdownMenu, Toast, Card, Button, Input, Form, Tabs, Tooltip, Sheet. The most popular component approach in the Next.js ecosystem. AI models are deeply familiar with shadcn patterns.

**Why Lucide React:** Ships with shadcn/ui. 31M weekly downloads. Covers every icon in the UI spec (play, document, microphone, sparkle, image, text, arrow, etc.).

---

## 3. Canvas & Node System

| Package | Version | Purpose | Install |
|---------|---------|---------|---------|
| `@xyflow/react` | 12.10.1 | Node-based infinite canvas with pan, zoom, drag, and connections | `npm install @xyflow/react` |

**Why React Flow:** Purpose-built for exactly this product — node-based interfaces with draggable nodes and connection edges. Provides out of the box: infinite pan/zoom canvas, dot-grid background, node dragging, connection handles on node edges, edge drawing, selection rectangles, minimap, zoom controls, fit-to-view. Custom React components are written for each node type (YouTube, PDF, AI Chat, etc.) while React Flow handles all spatial logic. 25k+ GitHub stars, 3.4M weekly downloads, excellent docs with interactive examples. Building a custom canvas from scratch would add months.

---

## 4. Rich Text Editor

| Package | Version | Purpose | Install |
|---------|---------|---------|---------|
| `@tiptap/react` | 3.20.0 | React bindings for Tiptap editor | `npm install @tiptap/react` |
| `@tiptap/pm` | 3.20.0 | ProseMirror core (required peer) | `npm install @tiptap/pm` |
| `@tiptap/starter-kit` | 3.20.0 | Bundle of common extensions (paragraphs, headings, bold, italic, lists, code blocks, undo/redo) | `npm install @tiptap/starter-kit` |
| `@tiptap/extension-placeholder` | 3.20.0 | "Start writing..." placeholder text | `npm install @tiptap/extension-placeholder` |

**Why Tiptap v3:** Built on ProseMirror, the engine behind many Notion-like editors. v3 introduces a React Composable API with declarative components (`Tiptap.Content`, `Tiptap.BubbleMenu`, `Tiptap.FloatingMenu`). Supports everything the Text Editor Node spec requires: headings, bold, italic, lists, code blocks, horizontal dividers, slash commands. Headless — all styling controlled with Tailwind. 27k+ GitHub stars, 4.8M weekly downloads.

**Why not Slate.js:** Lower-level, requires more manual work. **Why not BlockNote:** Newer, less mature, less AI training data. **Why not Lexical:** More complex API surface for no benefit at this scale.

---

## 5. State Management

| Package | Version | Purpose | Install |
|---------|---------|---------|---------|
| `zustand` | 5.0.11 | Global state management for canvas, nodes, edges, chat, UI | `npm install zustand` |

**Why Zustand:** API surface is tiny — `create()`, `get()`, `set()`. No providers, no reducers, no action types. ~3KB gzipped. Works outside React components (useful for React Flow callbacks). 18M weekly downloads — the dominant state management library in 2026. AI models generate Zustand stores with near-perfect accuracy.

**Why not Jotai:** Atomic model is elegant for independent state pieces, but canvas state is deeply interconnected (nodes reference edges, edges reference nodes, chat messages reference connected sources). A centralized store is a better mental model. **Why not Redux Toolkit:** More boilerplate for no benefit. Declining adoption (9M downloads vs Zustand's 18M).

---

## 6. Backend, Auth & Storage

| Package | Version | Purpose | Install |
|---------|---------|---------|---------|
| `@supabase/supabase-js` | 2.98.0 | Supabase client — database queries, auth, storage, realtime | `npm install @supabase/supabase-js` |
| `@supabase/ssr` | 0.8.0 | Server-side auth helpers for Next.js App Router | `npm install @supabase/ssr` |

**Why Supabase (not Convex):**

| Factor | Supabase | Convex |
|--------|----------|--------|
| File storage | Built-in Storage for PDFs, images, audio with signed URLs and type restrictions | No native file storage — requires bolting on S3/R2. Four out of six node types involve file uploads. Dealbreaker. |
| Auth | Built-in Google OAuth, email/password, password reset, session management — covers the entire auth spec | Convex Auth exists but is newer and less battle-tested |
| Query language | PostgreSQL — the most documented query language in existence. Complex queries for usage tracking, billing history, aggregations | Proprietary TypeScript query functions. Less documentation, less AI training data |
| AI familiarity | ~70k GitHub stars, massive community. AI models generate Supabase code accurately | ~30k GitHub stars. Growing but significantly less training data |
| Real-time | Basic subscriptions (adequate for V1 — single-user, no multiplayer) | Exceptional sub-50ms reactive data. Best-in-class — but multiplayer is cut from V1 |
| Free tier | 500MB database, 1GB storage, 50k MAUs, unlimited API requests | 500MB storage, 1M function calls/month (every read/write counts), 1GB bandwidth |

Convex's biggest advantage is real-time collaboration, which is explicitly cut from V1. Supabase covers auth, database, and file storage in one service with zero custom backend code.

**How Supabase maps to the MVP:**

| Supabase Feature | MVP Feature |
|-----------------|-------------|
| Supabase Auth | Google OAuth, email/password, password reset, session management |
| PostgreSQL + RLS | Users, boards, nodes, edges, chat messages, usage counters, subscriptions. Row Level Security = security at the database level |
| Supabase Storage | PDF uploads, image uploads, audio file uploads with signed URLs |
| Edge Functions | YouTube transcript fetching, OpenAI API proxying, Polar webhook handling, Whisper transcription |

---

## 7. AI Integration

| Package | Version | Purpose | Install |
|---------|---------|---------|---------|
| `ai` | 6.0.105 | Vercel AI SDK — `useChat()` hook for streaming, message state, stop/abort | `npm install ai` |
| `@ai-sdk/openai` | 3.0.37 | OpenAI provider for Vercel AI SDK | `npm install @ai-sdk/openai` |
| `openai` | 6.25.0 | Direct OpenAI SDK — used server-side for Whisper transcription and Vision API | `npm install openai` |

**Why Vercel AI SDK (not raw OpenAI SDK alone):**

The AI Chat Node requires token-by-token streaming, a Stop button, and message history management. With the raw OpenAI SDK, this means: parsing Server-Sent Events, managing ReadableStreams, wiring AbortControllers, maintaining message arrays, and building API routes to hide the key. ~150-200 lines of boilerplate.

The Vercel AI SDK's `useChat()` hook does all of this in ~10 lines. It streams tokens, manages messages, provides `isLoading` and `stop()`, and handles the server-side route. It costs nothing — free open-source abstraction that still calls OpenAI underneath with identical per-token pricing. The direct `openai` package is still installed for server-side-only calls (Whisper, Vision) that don't need streaming.

**AI model mapping from pricing plan:**
- Free tier → `gpt-4o-mini` (cost-efficient, fast)
- Pro tier → `gpt-4o` (full model, vision-capable for Image Nodes)

**Voice transcription:** OpenAI Whisper API at $0.006/min. Best accuracy (8.06% WER), same API key as GPT-4o, simple audio-in/text-out. A 2-minute voice note costs $0.012.

---

## 8. Payments

| Package | Version | Purpose | Install |
|---------|---------|---------|---------|
| `@polar-sh/nextjs` | 0.9.3 | Polar.sh Next.js adapter — checkout, customer portal, webhooks | `npm install @polar-sh/nextjs` |
| `@polar-sh/sdk` | 0.42.x | Polar.sh core SDK (peer dependency of the Next.js adapter) | `npm install @polar-sh/sdk` |
| `zod` | 3.25.x | Required peer dependency for Polar webhook validation | (installed separately below) |

**Why Polar.sh (not Stripe):**

| Factor | Polar.sh | Stripe |
|--------|----------|--------|
| Global availability | Available worldwide — no country restrictions for merchants | Not available in many countries, blocking developers in large parts of Asia, Africa, and South America |
| Merchant of Record | Polar handles sales tax, VAT, GST compliance, and global tax reporting automatically | Developer must handle tax compliance themselves or add a service like Lemon Squeezy |
| Pricing | 4% + 40c per transaction (+0.5% for subscriptions) | 2.9% + 30c per transaction (but no MoR — tax compliance is extra) |
| Next.js integration | First-class adapter with checkout, customer portal, and webhook handlers | Works but requires more manual wiring |
| Subscription billing | Monthly, annual, usage-based, free trials, proration, upgrades/downgrades | Full subscription support |

**How Polar maps to the MVP:**

| Polar Feature | MVP Feature |
|--------------|-------------|
| Polar Checkout | Upgrade Modal → hosted checkout page (no custom payment UI) |
| Customer Portal | Billing page — subscription management, plan switching, invoice downloads |
| Webhooks | Sync subscription status to Supabase when payments succeed or subscriptions cancel |
| Annual Subscriptions | $15/mo or $120/year toggle on pricing page |

**Environment variables needed:**
- `POLAR_ACCESS_TOKEN` — organization access token
- `POLAR_WEBHOOK_SECRET` — webhook signature verification

Quick-start: `npx polar-init`

---

## 9. Utilities

| Package | Version | Purpose | Install |
|---------|---------|---------|---------|
| `zod` | 3.25.x | Schema validation and TypeScript type inference for all user inputs | `npm install zod` |
| `react-dropzone` | 15.0.0 | Drag-and-drop file uploads onto canvas with drop overlay UX | `npm install react-dropzone` |
| `date-fns` | 4.1.0 | "Edited 2 hours ago" relative timestamps on board cards | `npm install date-fns` |
| `sonner` | 2.0.7 | Toast notifications (ships with shadcn/ui) | `npm install sonner` |

**Why Zod:** Validates all user inputs (YouTube URLs, form data, API payloads). Pairs with TypeScript for inferred types. AI models generate Zod schemas fluently. Using stable v3 — v4 is in beta and not production-ready.

---

## 10. Deployment

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting and deployment — zero-config for Next.js, automatic preview deployments, edge network, environment variable management |
| **Supabase** (hosted) | Managed PostgreSQL, Auth, Storage, Edge Functions, Realtime |
| **Polar.sh** | Payment processing, subscription management, tax compliance |
| **OpenAI API** | GPT-4o / GPT-4o-mini for AI chat, Whisper for transcription |

---

## Full Install Command

```bash
# Create Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Core dependencies
npm install @xyflow/react @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder zustand

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# AI
npm install ai @ai-sdk/openai openai

# Payments
npm install @polar-sh/nextjs @polar-sh/sdk

# Utilities
npm install zod react-dropzone date-fns sonner lucide-react

# shadcn/ui (interactive setup)
npx shadcn@latest init
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Polar.sh
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
NEXT_PUBLIC_POLAR_ORGANIZATION_ID=
```

---

*This document is the source of truth for the tech stack. Every package listed here is verified against npm as of March 2, 2026.*
