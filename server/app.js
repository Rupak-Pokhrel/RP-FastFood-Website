import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const jwtSecret = process.env.JWT_SECRET || 'development-secret-change-me';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  max: Number(process.env.DB_POOL_SIZE || 1),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS origin not allowed'));
  },
}));
app.use(express.json({ limit: '1mb' }));

const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    req.admin = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    res.status(503).json({ ok: false, database: 'unavailable', message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const { rows } = await pool.query('SELECT id, email, password_hash FROM admins WHERE email = $1 LIMIT 1', [email.trim().toLowerCase()]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid email or password.' });
    const admin = rows[0];
    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password.' });
    const token = jwt.sign({ id: admin.id, email: admin.email }, jwtSecret, { expiresIn: '12h' });
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.post('/api/auth/setup', async (req, res) => {
  try {
    const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || '';
    if (!email || !password) return res.status(400).json({ message: 'Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment first.' });
    const { rows: existing } = await pool.query('SELECT id FROM admins WHERE email = $1 LIMIT 1', [email]);
    if (existing.length) return res.json({ message: 'Admin account already exists.' });
    const hash = await bcrypt.hash(password, 12);
    await pool.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [email, hash]);
    res.status(201).json({ message: 'Admin account created. You can now log in.' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.post('/api/orders', async (req, res) => {
  const body = req.body || {};
  const { customerName, phone, address, distanceKm = 0, notes = '', paymentMethod = 'cod', items = [] } = body;
  if (!customerName || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Customer details and at least one order item are required.' });
  }
  if (!['cod', 'esewa'].includes(paymentMethod)) return res.status(400).json({ message: 'Invalid payment method.' });

  const cleanItems = items.map((item) => ({
    id: String(item.id || ''), name: String(item.name || '').trim(), price: Number(item.price), quantity: Number(item.quantity),
  }));
  if (cleanItems.some((item) => !item.id || !item.name || !Number.isFinite(item.price) || item.price < 0 || !Number.isInteger(item.quantity) || item.quantity < 1)) {
    return res.status(400).json({ message: 'Invalid order item.' });
  }

  const subtotal = cleanItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const distance = Math.max(0, Number(distanceKm) || 0);
  const deliveryFee = distance > 1 ? 100 : 0;
  const total = subtotal + deliveryFee;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, phone, address, distance_km, notes, payment_method, subtotal, delivery_fee, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [String(customerName).trim(), String(phone).trim(), String(address).trim(), distance, String(notes).trim(), paymentMethod, subtotal, deliveryFee, total]
    );
    const orderId = orderResult.rows[0].id;
    for (const item of cleanItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, line_total)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.id, item.name, item.price, item.quantity, item.price * item.quantity]
      );
    }
    await client.query('COMMIT');
    res.status(201).json({ message: 'Order placed successfully.', orderId, total });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally { client.release(); }
});

app.get('/api/orders', auth, async (req, res) => {
  try {
    const status = req.query.status;
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
    const params = [];
    let where = '';
    if (status && validStatuses.includes(status)) { where = 'WHERE o.status = $1'; params.push(status); }
    params.push(limit);
    const { rows: orders } = await pool.query(
      `SELECT o.id, o.customer_name AS "customerName", o.phone, o.address, o.distance_km AS "distanceKm",
              o.notes, o.payment_method AS "paymentMethod", o.payment_status AS "paymentStatus",
              o.status, o.subtotal, o.delivery_fee AS "deliveryFee", o.total,
              o.created_at AS "createdAt", o.updated_at AS "updatedAt"
       FROM orders o ${where} ORDER BY o.created_at DESC LIMIT $${params.length}`,
      params
    );
    if (!orders.length) return res.json([]);
    const ids = orders.map((o) => o.id);
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
    const { rows: items } = await pool.query(
      `SELECT order_id AS "orderId", menu_item_id AS id, name, price, quantity, line_total AS "lineTotal"
       FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`, ids
    );
    const byOrder = new Map();
    for (const item of items) {
      if (!byOrder.has(item.orderId)) byOrder.set(item.orderId, []);
      byOrder.get(item.orderId).push(item);
    }
    res.json(orders.map((order) => ({ ...order, items: byOrder.get(order.id) || [] })));
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.get('/api/orders/:id', auth, async (req, res) => {
  try {
    const { rows: orders } = await pool.query('SELECT * FROM orders WHERE id = $1 LIMIT 1', [req.params.id]);
    if (!orders.length) return res.status(404).json({ message: 'Order not found.' });
    const { rows: items } = await pool.query('SELECT menu_item_id AS id, name, price, quantity, line_total AS "lineTotal" FROM order_items WHERE order_id = $1', [req.params.id]);
    res.json({ ...orders[0], items });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.patch('/api/orders/:id/status', auth, async (req, res) => {
  const { status } = req.body || {};
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid order status.' });
  try {
    const result = await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2', [status, req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: 'Order status updated.', status });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.patch('/api/orders/:id/payment', auth, async (req, res) => {
  const { paymentStatus } = req.body || {};
  if (!['pending', 'paid', 'failed'].includes(paymentStatus)) return res.status(400).json({ message: 'Invalid payment status.' });
  try {
    const result = await pool.query('UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2', [paymentStatus, req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: 'Payment status updated.', paymentStatus });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.get('/api/dashboard/stats', auth, async (_req, res) => {
  try {
    const { rows: [stats] } = await pool.query(`
      SELECT COUNT(*)::int AS "totalOrders",
             COUNT(*) FILTER (WHERE status = 'pending')::int AS "pendingOrders",
             COUNT(*) FILTER (WHERE status IN ('accepted','preparing','ready','out_for_delivery'))::int AS "activeOrders",
             COALESCE(SUM(CASE WHEN status <> 'cancelled' THEN total ELSE 0 END), 0)::numeric AS "grossSales"
      FROM orders
    `);
    res.json({ ...stats, grossSales: Number(stats.grossSales) });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

export async function ensureAdminAccount() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email || !password) return;
  const { rows: existing } = await pool.query('SELECT id FROM admins WHERE email = $1 LIMIT 1', [email]);
  if (!existing.length) {
    const hash = await bcrypt.hash(password, 12);
    await pool.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [email, hash]);
  }
}

export default app;
