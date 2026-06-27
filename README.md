# Lingora Frontend

AI Speaking & Conversation Platform — frontend.

## Quick Start

```bash
cp .env.example .env.local
npm run dev
```

App berjalan di `http://localhost:3000`.

## Struktur Folder

```
src/
├── app/          # Next.js App Router (routing)
├── features/     # Feature modules (domain/data/presentation)
├── global/       # Shared components, axios, hooks
└── theme/        # MUI design system (light/dark mode)
```

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```
