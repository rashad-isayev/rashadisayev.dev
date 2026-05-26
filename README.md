# rashadisayev.dev

Personal platform for Rashad Isayev. It includes a public homepage, blog, contact page, admin dashboard, markdown publishing, page construction controls, availability settings, RSS, sitemap, robots metadata, and lightweight anonymous post metrics.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Create `.env` from `.env.example`.

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
ADMIN_PASSWORD_HASH="scrypt$..."
ADMIN_SESSION_SECRET="at-least-32-random-characters"
```

The app checks these database variables in order: `DATABASE_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`.

## Admin Setup

In development, `/admin/sign-in` shows helper commands when admin secrets are missing. For production, generate a password hash locally and set:

```bash
ADMIN_PASSWORD_HASH="generated-scrypt-hash"
ADMIN_SESSION_SECRET="generated-session-secret"
```

## Database

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:studio
```

## Verification

```bash
npm run lint
npm run test
npm run build
```
