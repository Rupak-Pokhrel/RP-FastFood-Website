import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatNPR } from '../utils/currency';
import type { CartItem } from '../types/restaurant';

export default function Cart({
  items,
  subtotal,
  deliveryDistance,
  setDistance,
  onChange,
  onRemove,
  onCheckout,
  onClose,
}: {
  items: CartItem[];
  subtotal: number;
  deliveryDistance: number;
  setDistance: (n: number) => void;
  onChange: (id: string, d: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onClose: () => void;
}) {
  const free = deliveryDistance <= 1;
  const deliveryFee = free ? 0 : 100;
  const total = subtotal + deliveryFee;

  return (
    <aside className="cart-drawer" aria-label="Shopping cart">
      <div className="cart-head">
        <div>
          <span className="eyebrow">YOUR ORDER</span>
          <h2>Shopping Cart</h2>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close cart">
          <X />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <ShoppingBag size={42} />
          <h3>Your cart is empty</h3>
          <p>Add a few favorites from the menu to get started.</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((i) => (
              <div className="cart-item" key={i.id}>
                <img src={i.image} alt="" />
                <div className="cart-item-main">
                  <strong>{i.name}</strong>
                  <span>{formatNPR(i.price)} each</span>
                  <div className="qty">
                    <button onClick={() => onChange(i.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <b>{i.quantity}</b>
                    <button onClick={() => onChange(i.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-side">
                  <strong>{formatNPR(i.price * i.quantity)}</strong>
                  <button
                    onClick={() => onRemove(i.id)}
                    aria-label={`Remove ${i.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="delivery-input">
            <label htmlFor="distance">Delivery Distance (KM)</label>
            <input
              id="distance"
              type="number"
              min="0"
              step="0.1"
              value={deliveryDistance}
              onChange={(e) => setDistance(Number(e.target.value) || 0)}
            />
            <small>
              {free
                ? 'Free delivery within 1 KM.'
                : 'Delivery available. Additional delivery charges may apply.'}
            </small>
          </div>

          <div className="summary">
            <div>
              <span>Subtotal</span>
              <strong>{formatNPR(subtotal)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{free ? 'FREE' : formatNPR(deliveryFee)}</strong>
            </div>
            <div className="total">
              <span>Total</span>
              <strong>{formatNPR(total)}</strong>
            </div>
            <button className="btn primary full" onClick={onCheckout}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
