# AI Workplace Productivity Assistant

Port your attached mockup into a real, working app with the same look and layout, and make the three AI tools actually run through Lovable AI (no API keys for you to manage, nothing exposed in the browser).

## Screens

Faithful to the mockup: dark fixed sidebar (264px) with brand mark, nav sections, and footer; light content area; mobile topbar with hamburger + slide-in sidebar and backdrop.

Each mockup "page" becomes its own route so it's shareable and SEO-friendly:

- `/` — Dashboard: eyebrow "Dashboard", greeting heading, 3 clickable stat cards (Email, Notes, Chat) with the accent/teal/amber icon tiles, plus the overview note card.
- `/email` — Smart Email Generator: context textarea, Tone and Audience selects, optional recipient, Generate button with spinner, editable output textarea, Copy button, error box, responsible-AI disclaimer.
- `/notes` — Meeting Notes Summarizer: notes textarea, Summarize button, structured output blocks (Summary, Key points, Decisions, Action items with owner/deadline meta), all fields inline-editable, disclaimer.
- `/chat` — Chat Assistant: 400px scrolling chat window, user/assistant bubbles, typing indicator, input row, disclaimer.

Design tokens (`#5b52f0` accent, `#0fb5a6` teal, `#14152a` sidebar, `#f5f6fb` background, 12px/8px radii, the mockup shadow) go into the project's theme as semantic tokens. Fonts: Plus Jakarta Sans (headings), Inter (body), JetBrains Mono (labels/eyebrows), loaded via the root route head.

Chat history and generated drafts live in the current session only (nothing is saved to a database yet).

## AI wiring

The mockup called the Anthropic API directly from the browser with a key — that can't ship. Instead:

- Email and Notes: server functions that call Lovable AI, keeping the mockup's exact system prompts. Notes uses structured JSON output so the summary/key points/decisions/action items shape is enforced, with "Not specified" fallbacks preserved.
- Chat: a streaming server route so replies appear token by token.
- Gateway errors (rate limit, credits, blocked) surface in the existing red error box with a real message, not a fake reply.

## Technical notes

- TanStack Start routes: `src/routes/index.tsx`, `email.tsx`, `notes.tsx`, `chat.tsx`; shared sidebar/topbar shell in `__root.tsx` around `<Outlet />`.
- `src/lib/assistant.functions.ts` for `generateEmail` / `summarizeNotes` server functions; `src/routes/api/chat.ts` for streaming chat via `useChat`.
- Provider helper in `src/lib/ai-gateway.server.ts` pointing at the Lovable AI Gateway; model `google/gemini-3.7-flash`. `LOVABLE_API_KEY` read server-side only.
- Reusable UI pieces: `Sidebar`, `PageHeader`, `Card`, `Field`, `Disclaimer`, `ErrorBox`.
- Per-route `head()` metadata with distinct titles/descriptions.
