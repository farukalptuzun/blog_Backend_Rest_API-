# Blog Monorepo

- `backend/`: Node.js + Express + MongoDB REST API
- `frontend/`: UI (şimdilik boş)

## Backend çalıştırma

Önce `backend/.env.example` dosyasını `backend/.env` olarak kopyalayıp doldurun.

```bash
npm install
npm run dev:backend
```

Backend doğrudan: `http://localhost:<PORT>/api` (`.env` içindeki `PORT`; ör. 3000 veya 4000).  
Health: `http://localhost:<PORT>/health`

**Frontend:** İstekler tarayıcıda `/api` üzerinden gider; Next.js bunları `next.config.ts` içindeki **rewrite** ile Express’e yönlendirir (varsayılan hedef `http://127.0.0.1:3000`). Backend farklı portta ise `frontend/.env.local` içine `BACKEND_URL=http://127.0.0.1:4000` yazın ve `npm run dev`’i yeniden başlatın.

