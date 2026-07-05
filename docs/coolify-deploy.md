# Deploy ke Coolify

Panduan deploy **lingora-fe** ke Coolify dengan Dockerfile (build langsung dari repo).

## Prasyarat

- Repo Git terhubung ke Coolify
- Backend API sudah bisa diakses dari server Coolify
- Branch production: `main`

## 1. Buat Application di Coolify

1. **New Resource** → **Application**
2. Connect repository Git (GitHub/GitLab/dll.)
3. Branch: `main`
4. Build Pack: **Dockerfile**
5. Dockerfile location: `./Dockerfile` (root)

## 2. Build Variables

Kedua variabel ini di-bake saat `next build`. Set sebagai **Build Variable** di Coolify, bukan hanya runtime env.

| Variable              | Contoh                        | Keterangan                                           |
| --------------------- | ----------------------------- | ---------------------------------------------------- |
| `API_PROXY_URL`       | `https://api.lingora.example` | Target proxy server-side untuk `/api/*`              |
| `NEXT_PUBLIC_API_URL` | _(kosongkan)_                 | Biarkan kosong agar client pakai path relatif `/api` |

## 3. Port & Health Check

- **Port exposed**: `3626`
- **Health check path**: `/`
- **Health check port**: `3626`

## 4. Auto Deploy

Aktifkan **Auto Deploy** (webhook) agar setiap push ke `main` memicu rebuild dan redeploy otomatis.

## 5. CI vs Deploy

- **GitHub Actions** (`.github/workflows/ci.yml`): lint, format check, typecheck, build — gate kualitas di PR/push.
- **Coolify**: build image dari Dockerfile dan jalankan container — tidak perlu registry terpisah.

## Test lokal sebelum deploy

```bash
cp .env.example .env
# edit .env sesuai backend lokal

docker compose up --build
# buka http://localhost:3626
```

Atau tanpa compose:

```bash
docker build \
  --build-arg API_PROXY_URL=http://host.docker.internal:4626 \
  --build-arg NEXT_PUBLIC_API_URL= \
  -t lingora-fe .

docker run -p 3626:3626 lingora-fe
```

## Troubleshooting

- **API 404 / network error**: pastikan `API_PROXY_URL` benar dan backend reachable dari container Coolify.
- **Env tidak berubah setelah deploy**: ubah Build Variable lalu trigger rebuild (env di-bake saat build).
- **Health check gagal**: pastikan port `3626` dan path `/` sesuai konfigurasi Coolify.
