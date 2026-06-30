# Lingora Frontend

AI Speaking & Conversation Platform — frontend.

## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

App berjalan di `http://localhost:3626`.

API backend di-proxy ke `http://localhost:4626` (atur lewat `API_PROXY_URL` di `.env.local`).

## Struktur Folder

```
src/
├── app/          # Next.js App Router (routing)
├── features/     # Feature modules (domain/data/presentation)
├── global/       # Shared components, axios, hooks
└── theme/        # MUI design system (light/dark mode)
```

## Environment

Lihat `.env.example`. Ringkas:

```env
# Kosongkan untuk same-origin proxy (disarankan dev)
NEXT_PUBLIC_API_URL=

# Target backend untuk Next.js rewrites (server-only)
API_PROXY_URL=http://localhost:4626
```
