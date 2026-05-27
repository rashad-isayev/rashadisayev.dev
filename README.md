# rashadisayev.dev

This is an open-source personal website. It includes a public homepage for brief introduction, a blog page for sharing articles of interest, a contact channel for quick navigation, and an admin dashboard for managing dynamic content. Website can be extended by adding pages for project/work demonstration, FAQ, and many more.


## Installation guide

1. Install requirements: Node.js 20+, npm, Git, PostgreSQL.
2. Clone and install:
```bash
git clone https://github.com/rashad-isayev/rashadisayev.dev.git
cd rashadisayev.dev
npm install
```
3. Create `.env` file:
```bash
cp .env.example .env
```
Set `DATABASE_URL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET`.
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
ADMIN_PASSWORD_HASH="scrypt$..."
ADMIN_SESSION_SECRET="at-least-32-random-characters"
```
You can generate `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` manually with the following commands:
```bash
node -e 'const { scryptSync, randomBytes } = require("node:crypto"); const password = process.argv[1]; const salt = randomBytes(16); const key = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }); const hash = `scrypt$16384$8$1$${salt.toString("base64url")}$${key.toString("base64url")}`; console.log(hash.replaceAll("$", "\\$"));' "your-admin-password"
```
```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```
4. Set up database:
```bash
npm run db:generate
npm run db:migrate
```
5. Run locally:
```bash
npm run dev
```
Open `http://localhost:3000`. Admin dashboard is available at `http://localhost:3000/admin/sign-in`.
6. Before deployment:
```bash
npm run lint
npm run test
npm run build
```
7. For Vercel, add the same environment variables and run production migrations with:
```bash
npm run db:deploy
```
For Vercel, remove backslashes from the hash while entering environment variables:
```text
Local:
scrypt\$16384\$8\$1\$...

Vercel:
scrypt$16384$8$1$...
```

## Contribution

Pull requests for typos, grammar mistakes, and technical improvement are welcome.

## License

All source code is licensed under the MIT License. Blog articles and written content are licensed under the [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.
