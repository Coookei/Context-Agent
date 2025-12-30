# Context Agent

Context Agent is a full-stack chat app that answers questions using a local Markdown knowledge source. The server builds a prompt from the knowledge base and forwards it to an external large language model, then returns the response to the client UI.

## What it does

- Provides a chat UI for asking questions, with a typing indicator, and sound notifications.
- Uses a local knowledge source (`packages/server/prompts/context.md`) to ground responses.
- Maintains lightweight conversation state per session (in memory).
- Validates inputs on the server and returns clean JSON responses.

## Screenshots

![Context Agent Chat Interface](public/example.png)

_Context Agent responding to a user query_

## Tech stack

Client:

- React 19 + Vite (Vite dev server with API proxy)
- Shadcn/up + Tailwind CSS
- Axios for API calls

Server:

- Express 5
- OpenAI SDK
- Zod for request validation
- Helmet, compression, and CORS middleware

Tooling:

- Bun workspaces
- Prettier formatting
- Husky + lint-staged for pre-commit checks

## Client and server setup

- `packages/client` runs a Vite dev server and proxies `/api` to the server.
- `packages/server` exposes `/api/chat` and handles OpenAI requests.
- The root `index.ts` uses `concurrently` to run both in dev.
- CORS is enforced on the server when requests come from a browser origin. During local dev, the Vite proxy avoids cross-origin requests.

## Why Bun

This project uses Bun for fast installs, workspace support, and simple scripting. It also provides `bunx` for tooling like lint-staged. If you do not have Bun installed, follow the install steps below.

## Setup

### Prerequisites

- Bun (https://bun.sh)
- An OpenAI API key

### Clone the repository

```bash
git clone https://github.com/Coookei/Context-Agent.git
cd Context-Agent
```

### Install dependencies

From the repository root run:

```bash
bun install
```

### Setup server

Create the .env file and set the variables below:

```bash
cp packages/server/.env.example packages/server/.env
```

- `OPENAI_API_KEY` (required)
- `WHITELISTED_ORIGINS` (comma-separated list of allowed client origins, for example `http://localhost:5173/`)

Update the `agent.txt` and `context.md` files:

- Update `packages/server/prompts/agent.txt` to provide a system prompt for the chat agent.
- Update `packages/server/prompts/context.md` to provide the knowledge base used in responses.

### Setup client

Create the .env file and set the variable below:

```bash
cp packages/client/.env.example packages/client/.env
```

- `VITE_API_URL` (defaults to `http://localhost:3000` if omitted)

### Run in development

From the repository root run:

```bash
bun dev
```

This starts:

- Client: `http://localhost:5173`
- Server: `http://localhost:3000`

You can also run them separately:

```bash
cd packages/server && bun run dev
cd packages/client && bun run dev
```

## Husky and lint-staged

This repo installs a pre-commit hook via Husky (`bun run prepare` runs on install). The hook executes `bunx lint-staged`, which formats staged files using Prettier. If formatting fails, the commit is blocked until fixes are applied.

## Notes

- Conversation state is stored in memory on the server and resets on server restart.
- If you call the server directly from the browser (without the Vite proxy), add the client origin to `WHITELISTED_ORIGINS`.
