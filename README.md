# Blog REST API (Express + MongoDB)

UI yoktur; tüm testler Postman üzerinden yapılır.

## Kurulum

```bash
npm install
```

## Ortam değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri düzenleyin:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `PORT` (opsiyonel)
- `UPLOAD_DIR` (varsayılan: `uploads`)

## Çalıştırma

Geliştirme:

```bash
npm run dev
```

Prod:

```bash
npm start
```

Sağlık kontrolü:

- `GET http://localhost:3000/health`

API base URL (varsayılan):

- `http://localhost:3000/api`

## Uploadlar

Yüklenen dosyalar `uploads/` altına kaydedilir ve şu şekilde servis edilir:

- `GET /uploads/<dosya>`

## Endpoint’ler (özet)

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Profil:
- `PATCH /api/users/me`
- `POST /api/users/me/avatar` (multipart form-data: `avatar`)

Post:
- `POST /api/posts`
- `GET /api/posts` (query: `q`, `authorId`, `tag`, `from`, `to`, `sort=latest|popular`, `page`, `limit`)
- `GET /api/posts/:idOrSlug`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/cover` (multipart form-data: `cover`)
- `POST /api/posts/:postId/like`
- `DELETE /api/posts/:postId/like`
- `POST /api/posts/:postId/comments`
- `GET /api/posts/:postId/comments`

Comment:
- `POST /api/comments/:commentId/replies`
- `PATCH /api/comments/:id`
- `DELETE /api/comments/:id`
- `POST /api/comments/:commentId/like`
- `DELETE /api/comments/:commentId/like`

## Postman

`postman/` klasöründe:
- `postman/BlogAPI.postman_collection.json`
- `postman/BlogAPI.postman_environment.json`

İçe aktarın, environment olarak **BlogAPI Local** seçin ve sırasıyla Register/Login çağrılarını çalıştırarak `accessToken` değişkenini otomatik doldurun.

