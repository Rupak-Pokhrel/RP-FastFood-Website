import app, { ensureAdminAccount } from './app.js';
import 'dotenv/config';

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    await ensureAdminAccount();
    app.listen(port, () => console.log(`RP FastFood API running on http://localhost:${port}`));
  } catch (error) {
    console.error('Could not start the API. Check DATABASE_URL and your Supabase database.');
    console.error(error.message);
    process.exit(1);
  }
}

start();
