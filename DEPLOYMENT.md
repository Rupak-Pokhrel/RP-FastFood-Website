# RP FastFood — Vercel + Supabase deployment

This version replaces the old XAMPP/MySQL production setup with Supabase PostgreSQL and a Vercel Node/Express API. Local XAMPP is no longer required for the converted version.

## 1. Create the Supabase database
1. Create a free Supabase project.
2. Open **SQL Editor**.
3. Paste and run `sql/supabase-schema.sql`.
4. In **Supabase Dashboard → Connect**, choose the **Shared pooler / Transaction mode** connection string (port `6543`). Supabase recommends transaction-mode pooling for serverless functions such as Vercel.

## 2. Local environment
Copy `server/.env.example` to `server/.env` and set:
- `DATABASE_URL` to the Supabase transaction-pooler connection string
- `DATABASE_SSL=true`
- `JWT_SECRET` to a long random value
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLIENT_URL=http://localhost:5173`

The frontend defaults to `/api`. Vite proxies `/api` to `http://localhost:5000`, so no frontend API URL is required locally.

## 3. Install and run
From the project root:

```bash
npm install
```

Terminal 1:

```bash
npm run server:dev
```

Terminal 2:

```bash
npm run dev
```

Check:
`http://localhost:5000/api/health`

The first API startup creates the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if it does not already exist.

## 4. Deploy to Vercel
Push the project to GitHub and import the repository into Vercel. Use the project root as the Root Directory.

Build command:
`npm run build`

Output directory:
`dist`

The repository includes `api/index.js` and `vercel.json` so `/api/*` requests are routed to the Express API while normal routes are served by the Vite SPA.

### Vercel environment variables
Add:

- `DATABASE_URL` = Supabase **transaction pooler** connection string (port `6543`)
- `DATABASE_SSL` = `true`
- `DB_POOL_SIZE` = `1`
- `JWT_SECRET` = a long random secret
- `ADMIN_EMAIL` = restaurant admin email
- `ADMIN_PASSWORD` = a strong admin password
- `CLIENT_URL` = your exact deployed URL, e.g. `https://your-project.vercel.app`
- `VITE_API_URL` = `https://your-project.vercel.app/api` (optional; `/api` is the default)

Redeploy after adding variables.

## 5. Test production
Open:
- `https://your-project.vercel.app/api/health`
- `https://your-project.vercel.app/`
- `https://your-project.vercel.app/admin`

Then place a test order and verify it appears in the admin dashboard.

## Important security notes
- Never commit `.env` or production secrets to GitHub.
- Change the example admin password before deployment.
- Do not put `DATABASE_URL`, `JWT_SECRET`, or admin credentials in any `VITE_*` variable.
- The database connection is server-side only.
