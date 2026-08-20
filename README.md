# Workplace Productivity Assistant

An AI-powered assistant that automates three common workplace tasks: writing emails, summarizing meeting notes, and answering ad-hoc queries through a chat interface.

Built for the **CAPACITI AI Skill Accelerator Programme** — "AI-Powered Workplace Productivity Assistant" project.

## Project Overview

Professionals lose significant time each week on repetitive tasks such as drafting emails, digesting long meeting notes, and looking things up. This project addresses that problem with a single lightweight web app that wraps three focused AI tools in one interface, so a user can move between them without switching platforms.

The app is built as a dashboard: a fixed sidebar for navigation and a main content area for each tool, in a clean, modern style similar to a SaaS product.

## Expected Project Structure — Coverage

| Requirement | How it's met |
|---|---|
| Dashboard layout | Overview page with tool cards, plus a dedicated page per tool |
| Sidebar navigation | Fixed left sidebar (Overview, Email Generator, Notes Summarizer, Chat Assistant) |
| Responsive design (desktop + mobile) | Sidebar collapses into a slide-in drawer with a mobile top bar under 880px width |
| Input and output sections | Each tool has a clearly separated input form and output area |
| AI-generated responses | All three tools call the Claude API live |
| Professional UI/UX | Consistent SaaS-style design system (indigo/teal palette, card layout, clear states) |
| Responsible AI disclaimer | Present on every tool page, plus a note on the Overview page |
| Editable AI outputs | Email draft is an editable textarea; notes summary fields are click-to-edit |

## Features Implemented

This solution implements 3 of the 5 suggested features:

### 1. Smart Email Generator
- Generates a full, context-based professional email (subject line included) from a short description of what it needs to say
- Supports three tone variations: **formal**, **informal**, and **persuasive**
- Adapts vocabulary and structure based on audience: **client**, **manager**, or **team**
- Optional recipient name for personalization
- One-click copy of the generated draft

### 2. Meeting Notes Summarizer
- Converts long, messy meeting notes into a structured summary
- Extracts key discussion points
- Extracts decisions made
- Extracts action items, each with an owner and deadline (marked "Not specified" when the notes don't state one, rather than inventing details)

### 3. AI Chatbot Interface
- Simple chat window for open-ended workplace queries
- Maintains conversation history across multiple turns in a session
- Simulates a general-purpose workplace assistant a user could ask to draft, plan, or explain things

## Technologies and Tools Used

- **HTML, CSS, JavaScript** — single-file front end, no build step or framework
- **Anthropic Claude API** (`claude-sonnet-4-6`, `/v1/messages` endpoint) — powers all three AI features
- **Google Fonts** — Plus Jakarta Sans, Inter, JetBrains Mono
- **Prompt engineering** — each feature uses a dedicated system prompt:
  - Email Generator: instructed to write only the email itself, adapt tone/audience, and never invent facts not provided by the user
  - Notes Summarizer: instructed to return strict JSON (summary, key points, decisions, action items) so the output can be rendered as structured cards instead of a wall of text, and to mark missing owners/deadlines explicitly rather than guessing
  - Chat Assistant: instructed to stay concise and practical, with the full conversation history sent on every turn for context

## Responsible AI Considerations

- A persistent on-screen disclaimer reminds users that AI-generated content may contain errors and should be reviewed before being sent or acted on
- The Email Generator and Notes Summarizer prompts explicitly instruct the model not to invent facts, names, or details that were not supplied by the user
- The Notes Summarizer labels any action item missing an owner or deadline as "Not specified" instead of fabricating one
- All AI output is presented as an editable draft, not a final, ready-to-send artifact

## Setup Instructions

This app is a single self-contained HTML file (`index.html`) with no server, build tools, or dependencies to install.

1. Download `index.html`
2. Open it directly in any modern web browser (Chrome, Edge, Firefox, Safari)
3. Use the three sheet tabs at the top to switch between the Email Generator, Notes Summarizer, and Chat Assistant
4. No API key setup is required in this environment — API calls are pre-authorized

> If hosting this outside the current environment, the `fetch` call in `index.html` targeting `https://api.anthropic.com/v1/messages` would need to be pointed at a backend that attaches a valid Anthropic API key, since keys should never be exposed in client-side code in a real deployment.

## Team Members

- Melokuhle Manelisi Hadebe — sole contributor
