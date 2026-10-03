# RP FastFood — Vercel + Supabase

RP FastFood is a React/Vite customer ordering site with an Express API and restaurant admin dashboard. This converted version uses **Supabase PostgreSQL** instead of XAMPP/MySQL and is prepared for **Vercel** deployment.

## Requirements
- Node.js 24.x recommended
- A Supabase project
- A Vercel account

## Database
1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `sql/schema.sql`.
4. In **Connect**, copy the **Transaction pooler** PostgreSQL connection string (port `6543`) for the API.

`sql/mysql-schema-legacy.sql` is kept only as a reference for the old XAMPP/MySQL version.

## Local setup
Copy `server/.env.example` to `server/.env` and set your Supabase `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

Then run from the project root:

```bash
npm install
npm run server:dev
```

In a second terminal:

```bash
npm run dev
```

Open:
- Customer site: `http://localhost:5173`
- Admin dashboard: `http://localhost:5173/admin`
- API health: `http://localhost:5000/api/health`

The Vite development server proxies `/api` to the local Express server, so the frontend uses the same `/api` path in development and production.

## Admin account
On the first API startup, an admin account is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` if it does not already exist.

## Vercel deployment
Import this repository into Vercel with the project root as the Root Directory.

Build command:
```text
npm run build
```

Output directory:
```text
dist
```

Add these environment variables in Vercel:

```text
DATABASE_URL=<Supabase transaction-pooler URL, port 6543>
DATABASE_SSL=true
DB_POOL_SIZE=1
JWT_SECRET=<long random secret>
ADMIN_EMAIL=<restaurant admin email>
ADMIN_PASSWORD=<strong password>
CLIENT_URL=https://your-project.vercel.app
VITE_API_URL=https://your-project.vercel.app/api
```

`VITE_API_URL` is optional because `/api` is the default, but setting the full production URL is explicit and easy to troubleshoot.

After deployment test:

```text
https://your-project.vercel.app/api/health
https://your-project.vercel.app/
https://your-project.vercel.app/admin
```

Then place a test order and confirm it appears in the admin dashboard.

## Security
- Never commit `.env` or production secrets.
- Change the example admin password.
- Never put `DATABASE_URL`, `JWT_SECRET`, or admin credentials in `VITE_*` variables.
- The database connection runs only on the server/API.
