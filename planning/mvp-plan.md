# MVP Plan — Visual AI Workspace

> Last updated: March 2, 2026

---

## 1. Product Overview

**One-liner:** An affordable, visual AI workspace where creators drag-and-drop YouTube videos, PDFs, images, and voice notes onto a canvas and use AI to research, brainstorm, and write content — all in one place.

**Problem:** Today's AI tools (ChatGPT, Claude) are linear chat interfaces that don't match how creative people actually think. The one product that does solve this (Poppy AI) locks users into $399+/year annual contracts with no free trial, no monthly option, and declining quality — pricing out students, freelancers, and solo creators who need it most.

**Our edge:** Same core value, radically more accessible. Monthly pricing starting at $15/mo, a free tier to try before you buy, and a clean interface that works on day one without a mandatory onboarding call.

---

## 2. Target User

- **Solo content creators** (YouTube, TikTok, newsletters) who research across multiple sources and produce scripts/posts weekly
- **Freelance marketers and copywriters** managing multiple clients and juggling research across videos, docs, and notes
- **Students and researchers** who need to synthesize information from lectures, papers, and videos into structured output
- **Small business owners** who create their own content and can't justify $400+/year on a single AI tool

**Common thread:** They all think non-linearly, work with mixed media, and are priced out of or frustrated by existing solutions.

---

## 3. Core MVP Features

### Visual Canvas with Draggable Nodes
An infinite, zoomable canvas where users place, move, and arrange content nodes — YouTube videos, PDFs, images, voice notes, text documents, and AI chat. The workspace is spatial, not linear.

### Connections Between Nodes
Users draw edges between nodes to link related content. When a source node (YouTube, PDF, image, voice note) is connected to an AI chat node, its content is automatically injected as context. This makes the AI aware of exactly what you've linked to it — no copy-pasting.

### YouTube URL Ingestion + AI Q&A
Paste a YouTube URL. The app extracts the transcript, displays the video thumbnail and title as a canvas node, and makes the full content available to AI. Users ask questions, extract key points, or generate scripts from hours of video in seconds.

### PDF Upload + Chat
Upload any PDF. Text is extracted and the document becomes a node on the canvas. Connect it to an AI chat to ask questions, summarize, or pull specific insights from the document.

### Image Upload + AI Understanding
Drag-and-drop images onto the canvas. The AI can see and interpret them (via GPT-4o vision) — useful for analyzing screenshots, charts, competitor ads, or reference material.

### Voice Note Recording + Transcription
Record a voice note directly in the browser or import an audio file. The audio is transcribed automatically and becomes a text node on the canvas. Ideal for users who think out loud and want to provide rich context to the AI without typing.

### Notion-Like Rich Text Editor
Each text node on the canvas is a mini-document with formatting support — headings, bold, italic, lists, code blocks. This is where users draft their scripts, blog posts, emails, and other output alongside their research.

### AI Chat with Contextual Awareness
An AI chat node (powered by GPT-4o) that reads context from every source node connected to it. Ask questions across multiple videos, documents, images, and voice notes simultaneously. Responses stream in real-time.

### Auth + Board Persistence
Email and Google sign-in. Each user has named boards that auto-save. Boards persist across sessions — open the app, and your workspace is exactly where you left it.

### Monthly Billing via Stripe
Transparent monthly pricing with one-click cancellation. No annual lock-in. No hidden onboarding requirements. No forced calls.

---

## 4. What's Cut from V1 (and Why)

| Feature | Reason for cutting |
|---------|--------------------|
| Real-time multiplayer | High engineering cost, low actual usage in competitor data. Solo workflow first. |
| Multiple AI models (Claude + GPT) | GPT-4o covers 90% of use cases. Add model switching in V2. |
| Mind map auto-generation | Poppy has this in beta and it's broken. Not core to the research-to-writing workflow. |
| Website URL scraping | Useful but not core. YouTube and PDFs cover the primary use cases. |
| TikTok / IG Reels support | YouTube is the dominant platform for long-form research. Short-form can come later. |
| Writing style / voice cloning | Can be approximated with good system prompts. Dedicated feature is a V2 investment. |
| API access | Enterprise feature. Not our market at launch. |
| Mobile app | Desktop-first is the norm for this category. Responsive web is sufficient. |
| Social media scheduling | Different product. Out of scope. |
| Export (PDF/Markdown) | Important but not launch-blocking. Early users can copy-paste. |

---

## 5. User Journey

### First Visit (minute 0-2)
Land on a clean pricing page. See: "The visual AI workspace for creators — free to start, $15/mo to unlock." Click "Get Started Free." Sign up with Google in one click.

### First Board (minute 2-10)
Dropped into a fresh canvas with a brief interactive tooltip tour (30 seconds, skippable). User pastes their first YouTube URL — a video they've been meaning to study. The transcript loads, thumbnail appears as a node. They open an AI chat node, draw a connection to the video, and ask: "What are the 5 key points in this video?" The AI responds in seconds. The "aha" moment hits.

### First Week
User creates 2-3 boards for different projects. They upload a PDF for a client brief, record a voice note with their content ideas, and connect everything to an AI chat that synthesizes it into a script draft. They write the final version in a text editor node right on the canvas. They hit the free tier limit and upgrade to Pro because the value is already obvious.

### Daily Usage
Open the app, pick a board, drop in today's research (a competitor video, a reference image, a quick voice note), connect to AI, generate a first draft, polish in the editor. 30 minutes of work that used to take 3 hours.

---

## 6. Monetization Plan

### Free Tier — $0/month
- 3 boards max
- 30 AI messages per day
- YouTube, PDF, and text input only
- Single AI model (GPT-4o mini for cost efficiency)
- Community support

### Pro Tier — $15/month (or $120/year)
- Unlimited boards
- 200 AI messages per day
- All input types (YouTube, PDF, image, voice notes)
- GPT-4o (full model)
- Priority support
- One-click cancel, no questions asked

### Why $15/month
- **60-75% cheaper than Poppy** ($399-449/year = $33-37/month equivalent)
- **Cheaper than ChatGPT Plus** ($20/month) while offering the canvas experience on top
- **Sustainable margin:** Heavy users cost ~$3-5/month in API calls. At $15/month, gross margin is ~65-80%.
- **Monthly by default:** No one is forced into annual. The annual option exists as a discount, not a requirement.

---

*This document is the source of truth for the MVP. Anything not listed here is post-launch.*