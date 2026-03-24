# MVP Task Breakdown — Thinkboard

> Last updated: March 20, 2026

---

## Progress Overview

| Phase | Area | Tasks | Complete |
|-------|------|-------|----------|
| 1 | Authentication Integration | 7 | 7/7 |
| 2 | Core Feature Flow (Database + Boards + Canvas) | 10 | 0/10 |
| 3 | Secondary Features (Nodes + AI) | 9 | 0/9 |
| 4 | Monetization (Polar.sh) | 5 | 0/5 |
| 5 | Pro/Premium Gating | 4 | 0/4 |
| 6 | Settings & Polish | 5 | 0/5 |
| **Total** | | **40** | **7/40** |

---

## Dependency Graph

```
Phase 1 (Auth)
  ↓
Phase 2 (Core: DB + Boards + Canvas)
  ↓
Phase 3 (Nodes + AI)        Phase 4 (Polar)
  ↓                            ↓
Phase 5 (Pro Gating) ←——— Phase 4
  ↓
Phase 6 (Settings + Polish)
```

Phases 3 and 4 can run in parallel once Phase 2 is complete. Phase 5 requires both Phase 3 (features to gate) and Phase 4 (subscription state to check). Phase 6 can start partially after Phase 1 (settings page) but fully completes last.

---

## Phase 1: Authentication Integration

> **Dependencies:** None — this is the foundation everything else builds on.

### 1.1 — Create Supabase client helpers
- **Status:** Complete
- **Files to create:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`
- **Description:** Set up the Supabase browser client (for client components), server client (for Server Components/Actions using `@supabase/ssr` with cookie handling), and a middleware helper that refreshes auth tokens on every request.
- **Acceptance criteria:**
  - Browser client created with `createBrowserClient()` using env vars
  - Server client created with `createServerClient()` reading/writing cookies via `next/headers`
  - Middleware helper refreshes session and returns updated response

### 1.2 — Add auth middleware for protected routes
- **Status:** Complete
- **Files to create:** `middleware.ts` (project root)
- **Description:** Protect `/dashboard`, `/board/*`, `/settings`, `/billing` routes. Redirect unauthenticated users to `/login`. Redirect authenticated users away from `/login`, `/signup` to `/dashboard`.
- **Acceptance criteria:**
  - Unauthenticated requests to protected routes redirect to `/login`
  - Authenticated requests to `/login` or `/signup` redirect to `/dashboard`
  - Public routes (`/`, `/forgot-password`, `/reset-password`) remain accessible
  - Session is refreshed on every request

### 1.3 — Wire up Sign Up page to Supabase Auth
- **Status:** Complete
- **Files to modify:** `src/app/(auth)/signup/page.tsx`
- **Files to create:** `src/app/(auth)/signup/actions.ts`
- **Description:** Connect the existing sign-up form UI to Supabase Auth. Implement email/password sign-up via a Server Action and Google OAuth via the Supabase client-side redirect flow.
- **Acceptance criteria:**
  - Email/password creates a new Supabase user and redirects to `/dashboard`
  - Google OAuth button initiates OAuth flow and redirects to `/dashboard` on success
  - Validation errors display inline (email in use, weak password)
  - Loading state shows spinner on submit button

### 1.4 — Wire up Log In page to Supabase Auth
- **Status:** Complete
- **Files to modify:** `src/app/(auth)/login/page.tsx`
- **Files to create:** `src/app/(auth)/login/actions.ts`
- **Description:** Connect the existing login form UI to Supabase Auth with email/password sign-in and Google OAuth.
- **Acceptance criteria:**
  - Email/password authenticates and redirects to `/dashboard`
  - Google OAuth button initiates flow and redirects to `/dashboard`
  - Invalid credentials show a general error banner (not field-specific)
  - Loading state on submit

### 1.5 — Create OAuth callback route
- **Status:** Complete
- **Files to create:** `src/app/auth/callback/route.ts`
- **Description:** Handle the Supabase OAuth redirect. Exchange the auth code for a session and redirect to `/dashboard`.
- **Acceptance criteria:**
  - `GET /auth/callback?code=xxx` exchanges code for session
  - Redirects to `/dashboard` on success, `/login?error=...` on failure

### 1.6 — Wire up Forgot Password + Reset Password pages
- **Status:** Complete
- **Files to modify:** `src/app/(auth)/forgot-password/page.tsx`, `src/app/(auth)/reset-password/page.tsx`
- **Files to create:** `src/app/(auth)/forgot-password/actions.ts`
- **Description:** Connect forgot password to `supabase.auth.resetPasswordForEmail()`. Connect reset password page to read the token from the URL and call `supabase.auth.updateUser()`.
- **Acceptance criteria:**
  - Submitting email sends a password reset email via Supabase
  - Form is replaced with "Check your inbox" confirmation message
  - Reset password page sets the new password using the token
  - Redirects to `/login` with a success toast on completion
  - Invalid/expired token shows error with link back to forgot password

### 1.7 — Wire up Log Out
- **Status:** Complete
- **Files to modify:** `src/components/app/app-navbar.tsx`
- **Description:** Connect the "Log Out" button in the avatar dropdown to `supabase.auth.signOut()` and redirect to `/`.
- **Acceptance criteria:**
  - Clicking "Log Out" signs out the user and redirects to the landing page
  - Session cookie is cleared

---

## Phase 2: Core Feature Flow (Database + Boards + Canvas Persistence)

> **Dependencies:** Phase 1 (authentication must work so we know which user owns which board).

### 2.1 — Design and create database schema
- **Status:** Not Started
- **Files to create:** `supabase/migrations/001_initial_schema.sql`
- **Description:** Create all tables needed for the MVP:
  - `profiles` (id, email, display_name, avatar_url, has_seen_onboarding, created_at)
  - `boards` (id, user_id, name, created_at, updated_at)
  - `nodes` (id, board_id, type, position_x, position_y, width, height, data jsonb, created_at, updated_at)
  - `edges` (id, board_id, source_node_id, target_node_id, created_at)
  - `chat_messages` (id, node_id, role, content, created_at)
  - `usage` (id, user_id, date, ai_messages_count)
  - `subscriptions` (id, user_id, polar_customer_id, polar_subscription_id, plan, status, current_period_end, created_at, updated_at)
- **Acceptance criteria:**
  - All tables created with proper foreign keys and indexes
  - Row Level Security enabled on every table
  - RLS policies: users can only CRUD their own data
  - `profiles` auto-created on auth signup via trigger
  - Cascade deletes: deleting a board deletes its nodes/edges/messages

### 2.2 — Create shared TypeScript types
- **Status:** Not Started
- **Files to create:** `src/types/database.ts`, `src/types/board.ts`, `src/types/node.ts`
- **Description:** Define TypeScript types that mirror the database schema. Include types for board cards (dashboard), node data variants (YouTube, PDF, image, voice, text, AI chat), edge data, and chat messages.
- **Acceptance criteria:**
  - Types match the database schema exactly
  - Node `data` field is a discriminated union by node type
  - All components can import from `@/types/*`

### 2.3 — Create Zustand board store
- **Status:** Not Started
- **Files to create:** `src/stores/board-store.ts`
- **Description:** Zustand store for the canvas workspace managing nodes, edges, and React Flow state. Actions: `addNode`, `updateNode`, `removeNode`, `addEdge`, `removeEdge`, `onNodesChange`, `onEdgesChange`, `onConnect`. Handles loading board data from Supabase and persisting changes.
- **Acceptance criteria:**
  - Store provides all state React Flow needs (`nodes`, `edges`, handlers)
  - `loadBoard(boardId)` fetches from Supabase and populates store
  - Changes are debounce-persisted to Supabase
  - Adding/removing nodes and edges syncs to the database

### 2.4 — Create board CRUD Server Actions
- **Status:** Not Started
- **Files to create:** `src/lib/actions/board-actions.ts`
- **Description:** Server Actions for: `createBoard`, `renameBoard`, `duplicateBoard`, `deleteBoard`, `getBoards` (for dashboard), `getBoard` (for canvas). Validate inputs with Zod. Check user auth. Enforce free-tier 3-board limit.
- **Acceptance criteria:**
  - All actions authenticate the user via Supabase server client
  - `createBoard` checks board count against plan limit (3 for free)
  - `duplicateBoard` deep-copies nodes, edges, and messages
  - `deleteBoard` cascade-deletes all related data
  - Inputs validated with Zod schemas

### 2.5 — Wire up Dashboard to real board data
- **Status:** Not Started
- **Files to modify:** `src/app/(app)/dashboard/page.tsx`
- **Description:** Replace mock board data with a real Supabase query. Wire up "+ New Board" to `createBoard` action (redirect to `/board/[id]`). Wire up three-dot menu actions (rename, duplicate, delete) to their respective Server Actions. Show board count indicator ("2 of 3 boards used" for free tier).
- **Acceptance criteria:**
  - Dashboard shows the user's actual boards from the database
  - Empty state shown for new users with no boards
  - Creating a board navigates to the new board's canvas
  - Rename updates board name in real time
  - Delete shows confirmation dialog, then removes the board
  - Duplicate creates a copy and shows it in the grid
  - Free tier board limit enforced (shows upgrade modal at 3/3)
  - "Edited X ago" shows real timestamps via `date-fns`

### 2.6 — Wire up Canvas to load/save board state
- **Status:** Not Started
- **Files to modify:** `src/app/board/[id]/page.tsx`
- **Description:** On load, fetch the board's nodes and edges from Supabase and hydrate the Zustand store. Pipe store state into React Flow. Save node position/size changes, new nodes, and new edges back to the database (debounced). Show the board name in the top bar (editable inline). Show 404 if board doesn't exist or doesn't belong to user.
- **Acceptance criteria:**
  - Opening `/board/[id]` loads nodes and edges from DB
  - Moving/resizing nodes persists positions to DB (debounced ~1s)
  - Adding connections (edges) persists immediately
  - Deleting nodes/edges removes them from DB
  - Board name is editable inline and saves on blur
  - Unauthorized access redirects to `/dashboard`

### 2.7 — Wire up Canvas Toolbar to create real nodes
- **Status:** Not Started
- **Files to modify:** `src/components/app/canvas-toolbar.tsx`
- **Description:** Connect each toolbar button to the Zustand store's `addNode` action with the correct node type. YouTube button opens URL popover, PDF/Image open file picker, Voice Note opens recorder, Text/AI Chat create immediately. New nodes are placed at viewport center.
- **Acceptance criteria:**
  - Each toolbar button creates the correct node type
  - Nodes appear at the center of the current viewport
  - New nodes are persisted to the database
  - YouTube popover accepts a URL and creates a YouTube node

### 2.8 — Implement drag-and-drop file upload on canvas
- **Status:** Not Started
- **Files to modify:** `src/app/board/[id]/page.tsx`
- **Description:** Use `react-dropzone` to wrap the canvas. Detect file types on drop: PDFs become PDF nodes, images become image nodes, audio files become voice note nodes. Show drop overlay with dashed border. Show toast error for unsupported types.
- **Acceptance criteria:**
  - Dragging files over canvas shows "Drop to add to your board" overlay
  - PDFs create PDF nodes, images create image nodes, audio creates voice note nodes
  - Unsupported file types show an error toast
  - Files are uploaded to Supabase Storage and node `data` stores the file URL

### 2.9 — Set up Supabase Storage buckets
- **Status:** Not Started
- **Files to create:** `supabase/migrations/002_storage_buckets.sql`
- **Description:** Create Storage buckets for `pdfs`, `images`, and `audio`. Set up RLS policies so users can only access their own uploads. Configure file size limits and allowed MIME types.
- **Acceptance criteria:**
  - Three buckets created: `pdfs`, `images`, `audio`
  - RLS policies restrict access to the file owner
  - File size limits: PDFs 50MB, images 10MB, audio 25MB
  - MIME type restrictions enforced

### 2.10 — Create file upload Server Actions
- **Status:** Not Started
- **Files to create:** `src/lib/actions/file-actions.ts`
- **Description:** Server Actions for uploading files to Supabase Storage and generating signed URLs. Actions: `uploadPDF`, `uploadImage`, `uploadAudio`. Each validates file type/size, uploads to the correct bucket, and returns a signed URL.
- **Acceptance criteria:**
  - Files upload to the correct Supabase Storage bucket
  - Signed URLs returned for file access
  - File type and size validation with Zod
  - User authentication checked before upload

---

## Phase 3: Secondary Features (Node Functionality + AI)

> **Dependencies:** Phase 2 (nodes must exist in the database and canvas must persist).

### 3.1 — YouTube node: transcript extraction
- **Status:** Not Started
- **Files to modify:** `src/components/nodes/youtube-node.tsx`
- **Files to create:** `src/app/api/youtube/route.ts`
- **Description:** When a YouTube URL is added, fetch the video metadata (title, thumbnail, channel) and extract the transcript. Store transcript in the node's `data` field. Display loading → ready states. Double-click expands to show full transcript in a Sheet/drawer.
- **Acceptance criteria:**
  - Pasting a YouTube URL fetches title, thumbnail, channel name
  - Transcript is extracted and stored in the node's `data.transcript`
  - Loading state shows spinner with "Fetching transcript..."
  - Ready state shows green checkmark
  - Double-click opens transcript in a scrollable panel
  - Right-click context menu works (View Transcript, Open on YouTube, Delete)

### 3.2 — PDF node: text extraction
- **Status:** Not Started
- **Files to modify:** `src/components/nodes/pdf-node.tsx`
- **Files to create:** `src/app/api/pdf/route.ts`
- **Description:** When a PDF is uploaded, extract text content server-side. Store extracted text in the node's `data` field. Display file name, page count, and loading/ready states. Double-click opens extracted text in a panel.
- **Acceptance criteria:**
  - PDF upload extracts text content
  - Node shows file name and page count
  - Loading state shows "Extracting text..."
  - Double-click opens scrollable text content
  - Extracted text stored in node `data.content`

### 3.3 — Image node: upload and display
- **Status:** Not Started
- **Files to modify:** `src/components/nodes/image-node.tsx`
- **Description:** Display uploaded image within the node using the signed URL from Supabase Storage. Double-click opens a lightbox overlay. Node auto-sizes to image aspect ratio (with max constraints).
- **Acceptance criteria:**
  - Image displays within node at correct aspect ratio
  - Double-click opens lightbox (full-screen, dimmed background, Esc to close)
  - File name shown in title bar
  - Image loads from Supabase Storage signed URL

### 3.4 — Voice note node: recording + transcription
- **Status:** Not Started
- **Files to modify:** `src/components/nodes/voice-note-node.tsx`
- **Files to create:** `src/app/api/transcribe/route.ts`
- **Description:** Implement browser audio recording via MediaRecorder API. On stop, upload audio to Supabase Storage, then send to OpenAI Whisper for transcription. Display recording → transcribing → completed states with playback controls.
- **Acceptance criteria:**
  - Record button starts browser audio recording with pulsing red indicator
  - Stop button ends recording and triggers upload + transcription
  - Audio uploaded to Supabase Storage `audio` bucket
  - Transcription via Whisper API stored in node `data.transcript`
  - Completed state shows play/pause, progress bar, duration, and transcribed text
  - Imported audio files (from drag-and-drop) skip recording, go straight to transcription

### 3.5 — Text editor node: wire up Tiptap with persistence
- **Status:** Not Started
- **Files to modify:** `src/components/nodes/text-editor-node.tsx`
- **Description:** Initialize a real Tiptap editor instance inside the text node with StarterKit extensions, placeholder, and the formatting toolbar. Auto-save content (debounced) to the node's `data.content` field in Supabase.
- **Acceptance criteria:**
  - Tiptap editor initializes with StarterKit (headings, bold, italic, lists, code blocks)
  - Placeholder "Start writing..." shows when empty
  - Formatting toolbar buttons work (H1/H2/H3, bold, italic, lists, code)
  - Keyboard shortcuts work (Cmd+B, etc.)
  - Content auto-saves on change (debounced ~1s) to database
  - Content loads from database when board opens

### 3.6 — AI Chat node: streaming with Vercel AI SDK
- **Status:** Not Started
- **Files to modify:** `src/components/nodes/ai-chat-node.tsx`
- **Files to create:** `src/app/api/chat/route.ts`
- **Description:** Wire up `useChat()` from the Vercel AI SDK. The API route collects context from all source nodes connected to this chat node (via edges), builds a system prompt with that context, and streams the response. Messages persist to `chat_messages` table.
- **Acceptance criteria:**
  - `useChat()` handles message state, streaming, and stop/abort
  - API route receives connected node IDs, fetches their content from DB
  - Connected YouTube transcripts, PDF text, image descriptions, voice transcripts injected as context
  - Responses stream token-by-token with markdown rendering
  - Stop button cancels generation mid-stream
  - Messages persist to `chat_messages` table and reload on board open
  - Copy button on AI responses works
  - Empty states show correctly (no connections vs. has connections)
  - Free tier uses `gpt-4o-mini`, Pro tier uses `gpt-4o`

### 3.7 — Context injection system (edges → AI context)
- **Status:** Not Started
- **Files to create:** `src/lib/ai/context-builder.ts`
- **Description:** Build the system that reads edges connected to an AI Chat node, fetches the content from each source node (transcript, extracted text, image URL for vision), and constructs a context prompt. This is the core value proposition of the product.
- **Acceptance criteria:**
  - Given an AI Chat node ID, finds all connected source nodes via edges
  - Extracts content from each source type (YouTube → transcript, PDF → text, image → URL, voice → transcript, text → content)
  - Builds a structured context string with source labels
  - Source indicator in chat header shows connected node count and types
  - Handles the case where nodes have no content yet (still loading)

### 3.8 — AI usage tracking and daily limits
- **Status:** Not Started
- **Files to modify:** `src/app/api/chat/route.ts`
- **Files to create:** `src/lib/actions/usage-actions.ts`
- **Description:** Track AI message usage per user per day in the `usage` table. Check against plan limit (30 free / 200 pro) before processing each message. Return limit error when exceeded. Display usage in the top bar ("12/30 AI messages today").
- **Acceptance criteria:**
  - Each AI message increments the daily counter
  - Messages blocked when daily limit reached with appropriate error
  - Usage count displayed in canvas top bar
  - Free tier: 30/day limit, Pro tier: 200/day limit
  - Counter resets at midnight (based on UTC or user timezone)
  - AI Chat node shows "limit reached" state with upgrade prompt

### 3.9 — Node context menu actions
- **Status:** Not Started
- **Files to modify:** All files in `src/components/nodes/`
- **Description:** Wire up right-click context menus on all node types. Actions: View Transcript/Content (opens panel), Open on YouTube (external link), Delete Node (removes from canvas and DB), Clear Chat (for AI Chat nodes).
- **Acceptance criteria:**
  - Right-click on any node opens a context menu with the correct options per type
  - "Delete Node" removes from canvas and database (with connected edges)
  - "View Transcript/Content" opens a Sheet/drawer with full content
  - "Open on YouTube" opens the URL in a new tab
  - "Clear Chat" clears messages from AI Chat node and database

---

## Phase 4: Monetization (Polar.sh)

> **Dependencies:** Phase 1 (auth), Phase 2 (subscriptions table in DB).

### 4.1 — Set up Polar.sh products and checkout
- **Status:** Not Started
- **Files to create:** `src/lib/polar/client.ts`, `src/app/api/polar/checkout/route.ts`
- **Description:** Configure the Polar.sh SDK. Create a checkout route that generates a Polar Checkout session for the Pro plan ($15/mo or $120/year) and redirects the user. Pass the Supabase user ID as metadata so webhooks can match.
- **Acceptance criteria:**
  - Polar SDK initialized with access token
  - Checkout route creates a Polar session with the correct product
  - User ID passed as customer metadata
  - Redirects to Polar's hosted checkout page
  - Success URL returns to `/billing?success=true`

### 4.2 — Handle Polar webhooks
- **Status:** Not Started
- **Files to create:** `src/app/api/polar/webhook/route.ts`
- **Description:** Handle Polar webhook events: `subscription.created`, `subscription.updated`, `subscription.canceled`. Update the `subscriptions` table in Supabase to reflect current plan status.
- **Acceptance criteria:**
  - Webhook signature verified using `POLAR_WEBHOOK_SECRET`
  - `subscription.created` → insert/update subscription record with `active` status
  - `subscription.updated` → update plan, billing period, status
  - `subscription.canceled` → set status to `canceled`, record period end date
  - All events idempotent (safe to replay)

### 4.3 — Wire up Upgrade Modal to Polar Checkout
- **Status:** Not Started
- **Files to modify:** `src/components/app/upgrade-modal.tsx`
- **Description:** Replace the static upgrade modal with a real checkout flow. "Upgrade to Pro" button calls the checkout route and redirects to Polar. Trigger contexts: board limit, AI message limit, pro-only features.
- **Acceptance criteria:**
  - "Upgrade to Pro — $15/mo" initiates Polar Checkout
  - Monthly/annual toggle works
  - Modal dismisses with "Maybe later"
  - Correct trigger headline shown based on context (board limit, AI limit, feature gate)

### 4.4 — Wire up Billing page to real subscription data
- **Status:** Not Started
- **Files to modify:** `src/app/(app)/billing/page.tsx`
- **Description:** Replace mock data with real subscription state from the `subscriptions` table. Show current plan, next billing date, usage stats. Link to Polar Customer Portal for payment method updates and invoice downloads.
- **Acceptance criteria:**
  - Current plan displayed from DB (Free or Pro with billing details)
  - "Upgrade to Pro" button for free users initiates checkout
  - Pro users see next billing date and payment method
  - "Cancel Subscription" triggers confirmation and calls Polar API
  - Usage stats (AI messages today, board count) are real
  - Invoice history links to Polar Customer Portal

### 4.5 — Replace PlanProvider with real subscription state
- **Status:** Not Started
- **Files to modify:** `src/components/app/plan-provider.tsx`
- **Description:** Replace the `localStorage`-based plan toggle with real subscription data from Supabase. Fetch the user's subscription status on app load and provide it via context. This determines feature gating, AI model selection, and usage limits throughout the app.
- **Acceptance criteria:**
  - Plan state sourced from `subscriptions` table (not localStorage)
  - Falls back to "free" when no active subscription exists
  - Plan context available to all authenticated components
  - Re-fetches after successful checkout return

---

## Phase 5: Pro/Premium Feature Gating

> **Dependencies:** Phase 4 (subscription state must be real).

### 5.1 — Gate Image node to Pro users
- **Status:** Not Started
- **Files to modify:** `src/components/app/canvas-toolbar.tsx`, `src/components/nodes/image-node.tsx`
- **Description:** Image upload button in toolbar shows lock icon for free users. Clicking triggers upgrade modal with "Image upload is a Pro feature" message. Drag-and-drop images also gated.
- **Acceptance criteria:**
  - Free users see lock icon on image toolbar button
  - Clicking shows upgrade modal with correct message
  - Drag-and-dropping an image on free tier shows upgrade modal
  - Pro users can upload images normally

### 5.2 — Gate Voice Note node to Pro users
- **Status:** Not Started
- **Files to modify:** `src/components/app/canvas-toolbar.tsx`, `src/components/nodes/voice-note-node.tsx`
- **Description:** Voice note button in toolbar shows lock icon for free users. Clicking triggers upgrade modal with "Voice notes are a Pro feature" message.
- **Acceptance criteria:**
  - Free users see lock icon on voice note toolbar button
  - Clicking shows upgrade modal with correct message
  - Drag-and-dropping audio on free tier shows upgrade modal
  - Pro users can record/import voice notes normally

### 5.3 — Gate board creation at free tier limit
- **Status:** Not Started
- **Files to modify:** `src/app/(app)/dashboard/page.tsx`
- **Description:** When a free user has 3 boards and clicks "+ New Board", show upgrade modal with "You've reached the free board limit" message instead of creating a board.
- **Acceptance criteria:**
  - Free users with <3 boards can create normally
  - Free users at 3/3 see upgrade modal when clicking "+ New Board"
  - Board count indicator shows "X of 3 boards used"
  - Pro users have no board limit

### 5.4 — Gate AI model by plan tier
- **Status:** Not Started
- **Files to modify:** `src/app/api/chat/route.ts`
- **Description:** Select the AI model based on the user's subscription: free users get `gpt-4o-mini`, pro users get `gpt-4o`. This affects response quality and vision capability.
- **Acceptance criteria:**
  - Free tier AI requests use `gpt-4o-mini`
  - Pro tier AI requests use `gpt-4o`
  - Image node content only sent to vision API for Pro users (gpt-4o supports vision)

---

## Phase 6: Settings & Polish

> **Dependencies:** Phase 1 (auth), Phase 4 (subscription state for billing link).

### 6.1 — Wire up Account Settings page
- **Status:** Not Started
- **Files to modify:** `src/app/(app)/settings/page.tsx`
- **Files to create:** `src/lib/actions/profile-actions.ts`
- **Description:** Connect settings form to real profile data. Display name and avatar update via `profiles` table. Password change via Supabase Auth. Account deletion deletes all user data and signs out.
- **Acceptance criteria:**
  - Display name loads from `profiles` table and saves on "Save Changes"
  - Avatar upload stores to Supabase Storage and updates profile
  - "Change Password" section only visible for email/password users
  - Password change calls `supabase.auth.updateUser()`
  - "Delete Account" shows confirmation (type DELETE), then cascades all data and signs out
  - Password section hidden for Google-only accounts

### 6.2 — Implement onboarding tooltip tour
- **Status:** Not Started
- **Files to modify:** `src/components/app/onboarding-modal.tsx`, `src/app/board/[id]/page.tsx`
- **Description:** Show a 4-step tooltip tour on the user's first board. Highlights: toolbar, sample node, connection handle, AI chat. Uses the `has_seen_onboarding` flag in `profiles` table. Show only once.
- **Acceptance criteria:**
  - Tour shows on first board visit only (`has_seen_onboarding = false`)
  - 4 steps with pulsing highlights and tooltip bubbles
  - "Next" and "Skip tour" buttons work
  - Completing or skipping sets `has_seen_onboarding = true` in DB
  - Never shows again after dismissal

### 6.3 — Board auto-save indicator
- **Status:** Not Started
- **Files to modify:** `src/app/board/[id]/page.tsx`
- **Description:** Show a subtle save status indicator in the canvas top bar: "Saving..." while debounced writes are pending, "Saved" with a checkmark when complete, "Save failed" with retry on error.
- **Acceptance criteria:**
  - "Saving..." appears when changes are being written
  - "Saved" appears after successful persist
  - "Save failed" appears on error with retry option
  - Indicator is unobtrusive and doesn't block interaction

### 6.4 — Canvas empty state
- **Status:** Not Started
- **Files to modify:** `src/app/board/[id]/page.tsx`
- **Description:** When a board has zero nodes, show a centered prompt: "Drop a YouTube link, upload a file, or add a node from the toolbar below to get started." with an arrow pointing to the toolbar. Disappears when the first node is added.
- **Acceptance criteria:**
  - Empty state visible only when board has no nodes
  - Arrow points to the bottom toolbar
  - Disappears immediately when first node is created
  - Does not reappear if all nodes are deleted (debatable — could reappear)

### 6.5 — Error handling and edge cases
- **Status:** Not Started
- **Files to modify:** Multiple (global error boundary, toast notifications)
- **Files to create:** `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/board/[id]/error.tsx`
- **Description:** Add global error boundary, 404 page, board-specific error boundary. Ensure all Server Actions return structured errors. Toast notifications for all user-facing errors (file too large, upload failed, AI error, network issues).
- **Acceptance criteria:**
  - Global error boundary catches unhandled errors with a "Something went wrong" UI
  - Custom 404 page for invalid routes
  - Board error boundary handles board-not-found and load failures
  - All Server Action errors are caught and shown as toasts
  - Network errors during save show "Save failed" with retry
  - File upload errors show specific messages (too large, wrong type)

---

*This document is the source of truth for the MVP implementation plan. Update task statuses as work progresses.*
