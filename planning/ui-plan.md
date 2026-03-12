# UI Development Plan — Thinkboard

> Last updated: March 2, 2026
> Source: planning/mvp-plan.md

**One-liner:** A visual, canvas-based AI workspace where creators drag-and-drop YouTube videos, PDFs, images, and voice notes as spatial nodes, connect them to AI chat, and go from scattered research to polished content — all on one infinite board.

---

## 1. Landing Page

The public marketing homepage. First thing any visitor sees before they have an account. It must communicate the value proposition in under 5 seconds and funnel visitors toward sign-up.

### Layout (top to bottom)

**Top navigation bar**
- Logo on the left.
- Nav links: "Features," "Pricing," "Login" on the right.
- Primary CTA button "Get Started Free" as the rightmost element, visually prominent.

**Hero section**
- Large headline: "The visual AI workspace for creators."
- Subheadline explaining the core value: research, brainstorm, and write content by dropping YouTube videos, PDFs, images, and voice notes onto an AI-powered canvas.
- Primary "Get Started Free" button and a secondary "See Pricing" text link.
- A high-quality static screenshot or short looping animation of the canvas in use — showing a few nodes (a YouTube thumbnail, a PDF, an AI chat with a response) connected by lines on a clean canvas. This hero image communicates the spatial, non-linear nature of the product instantly.

**How It Works section**
- Three or four steps presented horizontally as cards or an illustrated sequence.
  - Step 1: "Drop in your sources" (icon of YouTube + PDF + image).
  - Step 2: "Connect them to AI" (icon of connection lines).
  - Step 3: "Ask anything across all of them" (icon of AI chat bubble).
  - Step 4: "Write your final draft on the canvas" (icon of text editor).
- Each step has a one-sentence description beneath it.

**Feature highlights section**
- A grid of 6 feature cards, one for each core capability: YouTube ingestion, PDF chat, image understanding, voice notes, rich text editor, contextual AI chat.
- Each card has a small icon, a bold title, and a two-sentence description.

**Pricing section** (anchor-linked from the nav as #pricing)
- Two pricing cards side by side.
  - Left card: "Free — $0/mo" with free tier bullets (3 boards, 30 AI messages/day, YouTube + PDF + text only, GPT-4o mini).
  - Right card: "Pro — $15/mo" with pro tier bullets (unlimited boards, 200 AI messages/day, all input types, GPT-4o, priority support). The Pro card is visually highlighted with a subtle border or background accent.
- CTA beneath each card: "Get Started Free" on the free card, "Start Pro" on the pro card.
- Small note beneath both cards: "No annual lock-in. Cancel anytime with one click."
- Optional toggle to show the annual price ($120/year, save $60).

**Footer**
- Logo, links to Terms of Service, Privacy Policy, contact/support email.
- Social links if applicable. Copyright notice.

### Design Direction
Clean, modern, heavy on whitespace. Dark or light theme (must match the in-app theme). No clutter, no walls of testimonials at launch — the product speaks for itself.

---

## 2. Sign Up Page

A standalone authentication page for new users creating an account.

### Layout
- Centered card on a minimal background (subtle gradient or brand color wash).
- App logo at the top of the card.
- Headline: "Create your free account."
- **"Continue with Google" button** — large, prominent, at the top of the form. This is the primary and fastest path. Google icon on the left of the button text.
- Horizontal divider with "or" in the center.
- Email/password form below: email input field, password input field (with show/hide toggle), and a "Create Account" submit button.
- Below the form: "Already have an account? Log in" as a text link.

### States
- **Validation errors:** Inline error messages beneath each field (e.g., "Email already in use," "Password must be at least 8 characters").
- **Loading:** Submit button shows a spinner and disables to prevent double submission.

---

## 3. Log In Page

Visually identical to the sign-up page in structure, adapted for returning users.

### Layout
- Same centered card, same minimal background.
- Logo at the top.
- Headline: "Welcome back."
- "Continue with Google" button (primary path).
- Divider with "or."
- Email and password fields with a "Log In" submit button.
- Below the password field: "Forgot password?" text link (right-aligned).
- Below the form: "Don't have an account? Sign up" as a text link.

### States
- **Error:** A general error banner at the top of the form for "Invalid email or password." Not field-specific, to avoid revealing which field is wrong.

---

## 4. Forgot Password Page

A single-purpose page for initiating password recovery.

### Layout
- Same centered card style as the auth pages.
- Logo at top.
- Headline: "Reset your password."
- Instruction text: "Enter your email and we'll send you a reset link."
- Email input field.
- "Send Reset Link" button.
- "Back to Log In" text link beneath.

### States
- **After submission:** The form is replaced by a confirmation message: "Check your inbox. We've sent a reset link to [email]. Didn't get it? Resend." No redirect — user stays on this page.

---

## 5. Reset Password Page

Accessed via the email reset link. A form to set a new password.

### Layout
- Centered card.
- Headline: "Set a new password."
- New password field (with show/hide toggle and strength indicator — a colored bar beneath that shifts from red to green).
- Confirm password field.
- "Reset Password" button.

### States
- **After submission:** Redirect to the Log In page with a success toast: "Password updated. Log in with your new password."
- **Invalid/expired link:** The card shows an error: "This reset link has expired or is invalid. Request a new one." with a link back to the Forgot Password page.

---

## 6. Dashboard (Board Listing)

The first screen a logged-in user sees. Home base for accessing and managing all boards.

### Layout

**Top navigation bar**
- Logo on the left (clicking it always returns here).
- Search input to filter boards by name (center-left).
- User's avatar or initial circle on the right — opens an account dropdown on click.

**Account dropdown** (on avatar click)
- Menu items: "Account Settings," "Billing," "Log Out."

**Page header area**
- Heading "Your Boards" on the left.
- Prominent "+ New Board" button on the right.

**Board grid**
- Boards displayed as rectangular cards in a responsive grid (3-4 columns desktop, 2 tablet, 1 mobile).
- Each board card shows:
  - A **thumbnail preview** of the canvas (miniaturized node layout render, or a colored placeholder if empty).
  - The **board name** (editable via double-click or a rename option).
  - A **last edited timestamp** ("Edited 2 hours ago").
  - A **three-dot menu icon** in the top-right corner opening a context menu: "Rename," "Duplicate," "Delete."

**Interaction details**
- Clicking anywhere on a board card (except the three-dot menu) navigates to that board's canvas.
- Board cards have a subtle hover effect (slight elevation/shadow increase).
- Deleting a board shows a confirmation dialog: "Delete [Board Name]? This can't be undone." with "Cancel" and "Delete" (red) buttons.

### States

- **Empty state** (no boards): Centered illustration or icon with the text "No boards yet. Create your first one to get started." and a large "+ Create Your First Board" button. Appears only for brand-new accounts.
- **Free tier board limit:** A subtle indicator below the header: "2 of 3 boards used." When at 3/3, the "+ New Board" button is still visible but clicking it triggers the Upgrade Modal instead of creating a board.

---

## 7. Canvas / Board Workspace

The core product screen. This is where users spend 95% of their time. An infinite, pannable, zoomable canvas where all nodes live. The most complex screen with the most sub-components and states.

### Overall Layout

**Top bar**
- Slim horizontal bar across the top.
- Left side: back arrow or logo icon (returns to Dashboard), followed by the board name (click to rename inline).
- Right side: usage indicator ("12/30 AI messages today" for free, "45/200" for pro), and the user avatar dropdown.

**Canvas area**
- Takes the entire remaining viewport. Subtle dot-grid background for spatial orientation.
- **Pan:** Click-drag on empty space or middle-mouse-button drag.
- **Zoom:** Scroll wheel or pinch. Small zoom indicator in the bottom-right corner ("100%") with +/- buttons and a "Fit to view" button.
- **Select:** Click a node to select it (blue selection border). Click empty space to deselect.
- **Multi-select:** Drag a selection rectangle on empty space.
- **Move:** Drag a selected node to reposition it.

**Canvas toolbar**
- Floating horizontal toolbar anchored to the bottom-center of the viewport (fixed position, ignores pan/zoom). Icon buttons with hover tooltips for each node type:
  - **YouTube** (play icon) — Opens a small popover with a URL input field and "Add" button. Creates a YouTube node at viewport center.
  - **PDF** (document icon) — Opens the system file picker filtered to PDFs. Creates a PDF node on selection.
  - **Image** (image icon) — Opens the system file picker filtered to images. **Disabled with a lock icon overlay for free-tier users;** clicking shows tooltip: "Upgrade to Pro to use images."
  - **Voice Note** (microphone icon) — Opens the voice recording popover. **Gated for free-tier users** with the same lock/upgrade tooltip.
  - **Text** (text icon) — Immediately creates a new empty text editor node at viewport center.
  - **AI Chat** (sparkle icon) — Immediately creates a new AI chat node at viewport center.

**Connection system**
- Hovering near any node edge reveals circular **connection handles** (small dots on top, bottom, left, right borders).
- Click-drag from a handle to start drawing a connection line. Line follows the cursor until dropped on another node's handle, creating a permanent edge.
- Edges render as curved or straight lines between nodes.
- Edges are selectable (click the line) and deletable (Delete key or right-click → "Remove connection").

**Drag-and-drop from desktop**
- Dragging files over the canvas shows a full-canvas overlay with a dashed border: "Drop to add to your board."
- On drop: PDFs → PDF node, images → image node, audio files (mp3/m4a/wav) → voice note node (skips recording, goes straight to transcription).
- Unsupported file types show a toast error: "This file type isn't supported yet."

### Canvas States

**Empty state** (brand-new board, no nodes)
- Centered, semi-transparent prompt on the canvas: "Drop a YouTube link, upload a file, or add a node from the toolbar below to get started." with an arrow pointing toward the toolbar. Disappears as soon as the first node is added.

**Onboarding tooltip tour** (first board only, one-time)
- A 4-step tooltip sequence overlaying the canvas, each highlighting a specific UI element with a pulsing border and tooltip bubble:
  1. Points to the toolbar: "Add YouTube videos, PDFs, voice notes, and more from here."
  2. Points to a pre-placed sample YouTube node: "This is a content node. Drag it around, resize it, or double-click to expand."
  3. Points to the connection handle: "Drag from here to connect nodes. Connected sources automatically become AI context."
  4. Points to the AI chat node: "Ask questions about everything you've connected. The AI reads all your linked sources."
- Each tooltip has "Next" and "Skip tour" buttons. Dismisses after the last step. Shows only once (flag stored on user profile).

---

### 7a. YouTube Node

A canvas node representing an ingested YouTube video.

**Appearance**
- Rectangular card, approximately 280×200px (resizable via corner drag handles).
- Top ~60%: video **thumbnail image** filling the area.
- Bottom ~40%: video **title** (bold, truncated to 2 lines with ellipsis) and **channel name** (smaller, muted text).
- Connection handles on all four edges.

**States**
- **Loading:** Spinner overlay on thumbnail with "Fetching transcript..."
- **Ready:** Subtle green checkmark badge or "Transcript ready" text indicator.

**Interactions**
- **Double-click or expand button:** Node expands into a larger panel or right-side drawer showing the full transcript as scrollable text.
- **Right-click context menu:** "View Transcript," "Open on YouTube" (external link), "Delete Node."

---

### 7b. PDF Node

A canvas node representing an uploaded PDF document.

**Appearance**
- Rectangular card, similar dimensions to YouTube nodes.
- Top portion: a **PDF icon** or a rendered preview of the first page (scaled down).
- Bottom: **file name** (bold, truncated) and **page count** ("12 pages," muted text).
- Connection handles on all four edges.

**States**
- **Loading:** Spinner with "Extracting text..."
- **Ready:** Subtle indicator that content is available.

**Interactions**
- **Double-click or expand:** Opens a larger panel/drawer showing the extracted text content (scrollable plain text, not a full PDF renderer).
- **Right-click context menu:** "View Content," "Delete Node."

---

### 7c. Image Node

A canvas node representing an uploaded image (Pro only).

**Appearance**
- Rectangular card that auto-sizes to the image's aspect ratio (with max width/height constraints and resize handles).
- Displays the **image itself**, scaled to fit within the node.
- Thin title bar at top or bottom with the **file name**.
- Connection handles on all four edges.

**States**
- No loading state needed (images load from local upload near-instantly).

**Interactions**
- **Double-click:** Opens the image in a lightbox overlay (full-screen centered, dimmed background, Esc or click-outside to close).
- **Right-click context menu:** "View Full Size," "Delete Node."

---

### 7d. Voice Note Node

A canvas node representing a recorded or imported audio clip with transcription (Pro only).

**Appearance**
- Rectangular card, smaller than other node types (approximately 260×140px).
- Connection handles on all four edges.

**States**
- **Recording:** Large pulsing red indicator, live timer counting up ("0:12"), a "Stop" button, and an optional waveform visualization.
- **Transcribing:** Spinner with "Transcribing..."
- **Completed:** Playback bar (play/pause button, progress bar, duration), the **transcribed text** beneath (truncated to 3-4 lines with "Show more" expansion), and a label like "Voice Note — 0:45."

**Interactions**
- **Right-click context menu:** "Play," "View Transcript," "Delete Node."

---

### 7e. Text Editor Node

A canvas node containing a Notion-like rich text editor for drafting content.

**Appearance**
- Rectangular card, approximately 320×240px (freely resizable — this is the primary node users will expand to work in).
- Contains a rich text editor. On creation, shows placeholder: "Start writing..." in muted text.

**Formatting toolbar**
- Appears at the top of the node when the editor is focused.
- Buttons: heading levels (H1/H2/H3 dropdown), bold, italic, bulleted list, numbered list, code block, horizontal divider.
- Keyboard shortcuts supported (Cmd+B for bold, etc.).
- Slash commands: type "/" to open an inline command palette with formatting options.
- Connection handles on all four edges.

**Behavior**
- Auto-saves on every change (debounced). No manual save button.

**Interactions**
- **Right-click context menu:** "Delete Node."

---

### 7f. AI Chat Node

A canvas node containing the AI chat interface. This is the central intelligence of the product.

**Appearance**
- Rectangular card, approximately 360×400px (resizable — users will commonly make this large).

**Header area**
- Label "AI Chat" with a sparkle icon.
- Source indicator showing how many nodes are connected: "3 sources connected" with small type icons (YouTube icon, PDF icon, microphone icon, etc.).

**Message area** (scrollable, main body)
- Chat-style message list.
- User messages: right-aligned, colored background (light blue or brand color).
- AI responses: left-aligned, neutral background, rendered as **formatted markdown** (headings, bold, italic, lists, code blocks). Responses stream in token-by-token. Each AI response has a small "Copy" button on hover.

**Input area** (bottom of the node)
- Text input with placeholder "Ask about your connected sources..."
- Send button (arrow icon) on the right.
- Multi-line support: Shift+Enter for new line, Enter to send.
- While AI is generating: send button transforms into a "Stop" button (square icon) to cancel generation.

**States**
- **Empty, no connections:** Centered message: "Connect sources to this chat by drawing lines from other nodes. Then ask anything." with a subtle illustration.
- **Empty, has connections:** "Ask anything about your connected sources" with suggestion chips: "Summarize everything," "What are the key points?," "Compare these sources."
- **Free tier limit reached:** Input is replaced with: "You've used all 30 AI messages today. Upgrade to Pro for 200/day." and an "Upgrade" button.
- **Pro tier limit reached:** "Daily limit reached. Resets at midnight."

**Interactions**
- **Right-click context menu:** "Clear Chat," "Delete Node."

---

## 8. Account Settings Page

Accessed from the avatar dropdown. Manages user profile information.

### Layout

**Top navigation**
- Same as dashboard (logo, avatar dropdown). A "Back to Dashboard" link or breadcrumb.

**Settings content** (centered column, max-width ~640px)

**Profile section**
- User's avatar or initial circle with an "Upload photo" option.
- Display name input field.
- Email display (read-only text — contact support to change).
- "Save Changes" button, disabled until a field is modified.

**Password section** (only visible for email/password users, hidden for Google-only accounts)
- "Change Password" button that expands to show: current password field, new password field, confirm new password field, and "Update Password" button.

**Danger zone section**
- Bordered section at the bottom.
- "Delete Account" button in red.
- On click: confirmation modal — "This will permanently delete your account and all your boards. Type 'DELETE' to confirm." with a text input and "Delete My Account" (red) / "Cancel" buttons.

---

## 9. Billing Page

Accessed from the avatar dropdown. Manages subscription, payment method, and billing history.

### Layout

**Top navigation**
- Same as other authenticated pages.

**Current plan section**
- A card showing the active plan.
  - Free users: "Free Plan — $0/mo" with included bullets and a prominent "Upgrade to Pro" button.
  - Pro users: "Pro Plan — $15/mo" (or "$120/year" if on annual) with included bullets, the next billing date ("Next payment: April 2, 2026"), and payment method on file ("Visa ending in 4242" with an "Update" link that opens a Stripe-hosted payment method form).

**Plan comparison**
- Side-by-side comparison of Free vs. Pro (same format as landing page pricing), so the user can see what they'd gain or lose.

**Billing actions**
- Free users: "Upgrade to Pro" button → initiates Stripe Checkout (redirect to Stripe hosted page, then back on success).
- Pro monthly users: "Switch to Annual ($120/year, save $60)" option.
- Pro annual users: "Switch to Monthly ($15/mo)" option.
- "Cancel Subscription" as a text link (deliberately less prominent). On click: confirmation — "Are you sure? You'll lose access to Pro features at the end of your billing period on [date]." with "Keep Pro" and "Cancel Subscription" buttons.

**Billing history section**
- Table/list of past invoices: date, amount, status (Paid), and a "Download" link for each invoice PDF (served by Stripe).

**Usage section**
- Current usage stats: "AI messages used today: 23 / 200" with a progress bar.
- Board count: "Boards: 7" (no limit indicator for pro).

---

## 10. Upgrade Modal

A modal overlay that appears in multiple contexts when a user encounters a free-tier limitation. Not a standalone page — it renders on top of whatever screen the user is currently on.

### Triggers
- User tries to create a 4th board on the free tier (from Dashboard).
- User exhausts 30 daily AI messages (from Canvas, inside AI Chat node).
- User clicks a Pro-gated toolbar button — Image or Voice Note (from Canvas).

### Layout
- Centered modal with a dimmed background overlay.
- **Headline** (varies by trigger):
  - Board limit: "You've reached the free board limit."
  - AI message limit: "You've used all your AI messages today."
  - Pro feature: "Image upload is a Pro feature." / "Voice notes are a Pro feature."
- **Value statement:** "Upgrade to Pro for unlimited boards, 200 AI messages/day, and access to every feature."
- Two plan cards (Free and Pro) side by side, Pro highlighted.
- Primary button: "Upgrade to Pro — $15/mo" → initiates Stripe Checkout.
- Dismiss link beneath: "Maybe later."

---

## Total Screen Inventory

| # | Screen | Route | Auth Required | Notes |
|---|--------|-------|---------------|-------|
| 1 | Landing Page | `/` | No | Public marketing page with hero, features, pricing, and CTAs |
| 2 | Sign Up | `/signup` | No | Google OAuth + email/password registration |
| 3 | Log In | `/login` | No | Google OAuth + email/password login |
| 4 | Forgot Password | `/forgot-password` | No | Email input to trigger password reset link |
| 5 | Reset Password | `/reset-password?token=xxx` | No | New password form accessed via email link |
| 6 | Dashboard | `/dashboard` | Yes | Board listing grid with create, rename, duplicate, delete |
| 7 | Canvas Workspace | `/board/:id` | Yes | Infinite canvas with all node types and connections |
| 7a | — YouTube Node | (canvas component) | — | Video thumbnail, title, transcript extraction |
| 7b | — PDF Node | (canvas component) | — | PDF preview, text extraction |
| 7c | — Image Node | (canvas component) | — | Image display, Pro only |
| 7d | — Voice Note Node | (canvas component) | — | Record/import, transcription, Pro only |
| 7e | — Text Editor Node | (canvas component) | — | Notion-like rich text editor |
| 7f | — AI Chat Node | (canvas component) | — | Contextual AI chat with streaming responses |
| 8 | Account Settings | `/settings` | Yes | Profile, password, account deletion |
| 9 | Billing | `/billing` | Yes | Subscription management, invoices, usage stats |
| 10 | Upgrade Modal | (overlay, any screen) | Yes | Triggered by free-tier limits, routes to Stripe |

---

## Complete App Flow

```
Landing Page (/)
├── "Get Started Free" → Sign Up (/signup)
│   ├── Google OAuth → Dashboard (/dashboard)
│   └── Email/password submit → Dashboard (/dashboard)
├── "Login" → Log In (/login)
│   ├── Google OAuth → Dashboard (/dashboard)
│   ├── Email/password submit → Dashboard (/dashboard)
│   └── "Forgot password?" → Forgot Password (/forgot-password)
│       └── Email sent → Reset Password (/reset-password?token=xxx)
│           └── Password set → Log In (/login)
└── "See Pricing" → Scrolls to #pricing on Landing Page

Dashboard (/dashboard)
├── Click board card → Canvas Workspace (/board/:id)
├── "+ New Board" → Creates board → Canvas Workspace (/board/:id)
│   └── (Free tier at 3/3) → Upgrade Modal → Stripe Checkout → Dashboard
├── Board three-dot menu → Rename / Duplicate / Delete
├── Avatar dropdown → Account Settings (/settings)
├── Avatar dropdown → Billing (/billing)
└── Avatar dropdown → Log Out → Landing Page (/)

Canvas Workspace (/board/:id)
├── Back arrow / logo → Dashboard (/dashboard)
├── Board name click → Inline rename
├── Toolbar: YouTube → URL popover → YouTube Node on canvas
├── Toolbar: PDF → File picker → PDF Node on canvas
├── Toolbar: Image → File picker → Image Node on canvas
│   └── (Free tier) → "Upgrade to Pro" tooltip
├── Toolbar: Voice Note → Recording popover → Voice Note Node on canvas
│   └── (Free tier) → "Upgrade to Pro" tooltip
├── Toolbar: Text → Text Editor Node on canvas
├── Toolbar: AI Chat → AI Chat Node on canvas
├── Desktop drag-and-drop → Auto-detect file type → Appropriate node
├── Draw connection (node handle → node handle) → Edge created
├── AI Chat send message → Streaming response
│   └── (Daily limit hit) → Upgrade prompt in chat / Upgrade Modal
├── Node right-click → Context menu (view, delete, etc.)
├── Avatar dropdown → Account Settings / Billing / Log Out
└── Zoom controls (bottom-right) → +/- / Fit to view

Account Settings (/settings)
├── Edit profile → Save Changes
├── Change Password → Update Password
├── Delete Account → Confirmation modal → Account deleted → Landing Page
└── Back to Dashboard → Dashboard (/dashboard)

Billing (/billing)
├── "Upgrade to Pro" → Stripe Checkout → Return to Billing (success toast)
├── "Switch to Annual/Monthly" → Confirmation → Plan updated
├── "Cancel Subscription" → Confirmation modal → Cancelled (active until period end)
├── "Update" payment method → Stripe hosted form
├── Download invoice → PDF download
└── Back to Dashboard → Dashboard (/dashboard)

Upgrade Modal (overlay on any authenticated screen)
├── "Upgrade to Pro — $15/mo" → Stripe Checkout → Return to previous screen (success toast)
└── "Maybe later" → Dismiss modal
```

---

*This document is the source of truth for building the front end. Every screen, component, state, and interaction described here maps directly to the MVP plan. Anything not listed here is post-launch.*
