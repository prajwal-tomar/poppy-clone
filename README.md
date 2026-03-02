# Visual AI Workspace

An affordable, visual AI workspace where creators drag-and-drop YouTube videos, PDFs, images, and voice notes onto a canvas and use AI to research, brainstorm, and write content — all in one place.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui + Lucide React
- **Canvas:** React Flow (@xyflow/react)
- **Rich Text:** Tiptap v3
- **State:** Zustand
- **Auth & Database:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** Vercel AI SDK + OpenAI GPT-4o
- **Payments:** Polar.sh
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20.9+

### Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd poppy-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── canvas/             # React Flow canvas and custom nodes
│   │   ├── nodes/          # Custom node components (YouTube, PDF, Image, etc.)
│   │   └── edges/          # Custom edge components
│   ├── dashboard/          # Board listing components
│   ├── landing/            # Landing page sections
│   ├── auth/               # Auth form components
│   └── shared/             # Shared components (user menu, upgrade modal)
├── lib/                    # Utilities and client setup
│   └── supabase/           # Supabase client configuration
├── stores/                 # Zustand state stores
└── types/                  # TypeScript type definitions
```

## Environment Variables

When you're ready to connect services, copy the template and fill in your values:

```bash
cp .env.example .env.local
```

See `.env.example` for the full list of required variables.
