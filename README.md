# Cloudian Meet

Cloudian Meet is a modern video meeting MVP built with Next.js, LiveKit, and PostgreSQL. It provides a Google Meet-inspired interface for creating, joining, sharing, and leaving meetings.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![LiveKit](https://img.shields.io/badge/LiveKit-FF6B6B?style=for-the-badge&logo=livekit&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)

## Overview

- Create a meeting and share its generated meeting code.
- Join with MVP name/password credentials and a LiveKit access token.
- Preview and toggle camera or microphone before joining.
- Use a responsive meeting layout with screen sharing, participant controls, and a leave flow.
- Store meeting and user data in PostgreSQL through Prisma ORM.

## How to Set Up

### 1. Install dependencies

From the project root:

```bash
bun install
```

### 2. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

Set these values in `.env`:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. |
| `LIVEKIT_API_KEY` | LiveKit project API key. |
| `LIVEKIT_API_SECRET` | LiveKit project API secret. |
| `LIVEKIT_PROJECT_URL` | LiveKit WebSocket URL, for example `wss://your-project.livekit.cloud`. |

Keep `.env` private. It contains database and LiveKit credentials.

### 3. Prepare the database contract

Define or update database models in `prisma/contract.prisma`, then generate the runtime contract:

```bash
bun run contract:emit
```

### 4. Start the application

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the development server. |
| `bun run build` | Create a production build. |
| `bun run start` | Start the production server. |
| `bun run lint` | Run ESLint. |
| `bun run contract:emit` | Regenerate the Prisma database contract. |

Build with Cloudian 💙 Cloud