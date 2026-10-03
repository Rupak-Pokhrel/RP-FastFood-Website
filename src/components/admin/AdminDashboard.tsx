import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, Clock3, LogOut, Package, RefreshCw, Truck, XCircle } from 'lucide-react';
import { formatNPR } from '../../utils/currency';
import { getOrders, getStats, loginAdmin, updateOrderStatus, updatePaymentStatus, type Order, type OrderStatus, type PaymentStatus } from '../../lib/api';

const statuses: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusClass = (status: string) => `status-pill status-${status.replaceAll('_', '-')}`;
const prettyStatus = (status: string) => status.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <section className="admin-shell admin-login-page">
      <div className="admin-login-card">
        <div className="admin-brand-mark">RP</div>
        <div className="eyebrow">RESTAURANT ADMIN</div>
        <h1>Order Dashboard</h1>
        <p>Sign in to view and manage customer orders.</p>
        <form onSubmit={async (e) => { e.preventDefault(); setError(''); setBusy(true); try { const result = await loginAdmin(email, password); onLogin(result.token); } catch (err) { setError(err instanceof Error ? err.message : 'Login failed.'); } finally { setBusy(false); } }}>
          <label><span>Email</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@rpfastfood.com" /></label>
          <label><span>Password</span><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="btn primary full" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('rp_admin_token') || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, activeOrders: 0, grossSales: 0 });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSeenPending, setLastSeenPending] = useState(0);

  const load = useCallback(async (showLoading = true) => {
    if (!token) return;
    if (showLoading) setLoading(true);
    try {
      const [orderData, statData] = await Promise.all([getOrders(token, filter), getStats(token)]);
      setOrders(orderData);
      setStats(statData);
      setError('');
      if (lastSeenPending === 0) setLastSeenPending(statData.pendingOrders);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load dashboard.';
      setError(message);
      if (message.toLowerCase().includes('session') || message.toLowerCase().includes('authentication')) logout();
    } finally { setLoading(false); }
  }, [token, filter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!token) return;
    const timer = window.setInterval(() => load(false), 5000);
    return () => window.clearInterval(timer);
  }, [token, load]);

  const logout = () => { localStorage.removeItem('rp_admin_token'); setToken(''); setOrders([]); };
  const handleLogin = (value: string) => { localStorage.setItem('rp_admin_token', value); setToken(value); };
  const changeStatus = async (id: number, status: OrderStatus) => { try { await updateOrderStatus(token, id, status); await load(false); } catch (err) { setError(err instanceof Error ? err.message : 'Update failed.'); } };
  const changePayment = async (id: number, paymentStatus: PaymentStatus) => { try { await updatePaymentStatus(token, id, paymentStatus); await load(false); } catch (err) { setError(err instanceof Error ? err.message : 'Update failed.'); } };

  const hasNewPending = stats.pendingOrders > lastSeenPending;
  const visibleOrders = useMemo(() => orders, [orders]);

  if (!token) return <AdminLogin onLogin={handleLogin} />;

  return (
    <section className="admin-shell">
      <div className="admin-container">
        <header className="admin-header">
          <div><div className="eyebrow">RP FASTFOOD</div><h1>Restaurant Orders</h1><p>Manage incoming orders and update customers as the kitchen progresses.</p></div>
          <div className="admin-actions">
            {hasNewPending && <button className="admin-notification" onClick={() => setLastSeenPending(stats.pendingOrders)}><Bell size={18} /> {stats.pendingOrders} new order{stats.pendingOrders === 1 ? '' : 's'}</button>}
            <button className="icon-action" onClick={() => load()} title="Refresh"><RefreshCw size={18} /></button>
            <button className="icon-action" onClick={logout} title="Log out"><LogOut size={18} /></button>
          </div>
        </header>

        <div className="admin-stats">
          <div className="admin-stat"><Package size={20} /><span>Total Orders</span><strong>{stats.totalOrders}</strong></div>
          <div className="admin-stat"><Clock3 size={20} /><span>Pending</span><strong>{stats.pendingOrders}</strong></div>
          <div className="admin-stat"><Truck size={20} /><span>Active</span><strong>{stats.activeOrders}</strong></div>
          <div className="admin-stat"><CheckCircle2 size={20} /><span>Gross Sales</span><strong>{formatNPR(stats.grossSales)}</strong></div>
        </div>

        <div className="admin-toolbar">
          <div><h2>Orders</h2><p>{loading ? 'Updating...' : `${visibleOrders.length} order${visibleOrders.length === 1 ? '' : 's'} shown`}</p></div>
          <div className="admin-filters">
            <button className={filter === '' ? 'active' : ''} onClick={() => setFilter('')}>All</button>
            <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
            <button className={filter === 'preparing' ? 'active' : ''} onClick={() => setFilter('preparing')}>Preparing</button>
            <button className={filter === 'out_for_delivery' ? 'active' : ''} onClick={() => setFilter('out_for_delivery')}>Delivery</button>
            <button className={filter === 'delivered' ? 'active' : ''} onClick={() => setFilter('delivered')}>Delivered</button>
          </div>
        </div>

        {error && <div className="form-error admin-error">{error}</div>}
        <div className="admin-orders">
          {visibleOrders.length === 0 && !loading && <div className="admin-empty"><Package size={42} /><h3>No orders yet</h3><p>New customer orders will appear here automatically.</p></div>}
          {visibleOrders.map((order) => (
            <article className={`admin-order-card ${order.status === 'pending' ? 'is-new' : ''}`} key={order.id}>
              <div className="admin-order-top">
                <div><span className="order-number">Order #{order.id}</span><span className="order-date">{new Date(order.createdAt).toLocaleString()}</span></div>
                <span className={statusClass(order.status)}>{prettyStatus(order.status)}</span>
              </div>
              <div className="admin-order-grid">
                <div className="customer-panel"><h3>{order.customerName}</h3><p><strong>Phone:</strong> {order.phone}</p><p><strong>Address:</strong> {order.address}</p><p><strong>Distance:</strong> {Number(order.distanceKm).toFixed(1)} km</p>{order.notes && <p><strong>Notes:</strong> {order.notes}</p>}</div>
                <div className="items-panel">
                  <h4>Order Items</h4>

                  {order.items.map((item) => (
                    <div className="admin-item" key={`${order.id}-${item.id}`}>
                      <span>{item.name} × {item.quantity}</span>
                      <strong>{formatNPR(Number(item.lineTotal))}</strong>
                    </div>
                  ))}

                  <div className="admin-summary-line">
                    <span>Subtotal</span>
                    <strong>{formatNPR(Number(order.subtotal))}</strong>
                  </div>

                  <div className="admin-summary-line">
                    <span>Delivery Fee</span>
                    <strong>{Number(order.deliveryFee) > 0
                        ? formatNPR(Number(order.deliveryFee))
                        : 'FREE'}</strong>
                  </div>

                  <div className="admin-total">
                    <span>Total</span>
                    <strong>{formatNPR(Number(order.total))}</strong>
                  </div>
                </div>
                <div className="order-control-panel"><label><span>Order Status</span><select value={order.status} onChange={(e) => changeStatus(order.id, e.target.value as OrderStatus)}>{statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label><label><span>Payment</span><select value={order.paymentStatus} onChange={(e) => changePayment(order.id, e.target.value as PaymentStatus)}><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option></select></label><div className="payment-summary"><span>Method</span><strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'eSewa'}</strong></div></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
