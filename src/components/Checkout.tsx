import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react';
import { formatNPR } from '../utils/currency';
import { restaurantConfig } from '../config/restaurant';
import type { CartItem } from '../types/restaurant';
import { createOrder } from '../lib/api';

type CheckoutProps = {
  items: CartItem[];
  subtotal: number;
  distance: number;
  onBack: () => void;
  onPlaced: () => void;
};

export default function Checkout({
  items,
  subtotal,
  distance,
  onBack,
  onPlaced,
}: CheckoutProps) {
  const [payment, setPayment] = useState<'cod' | 'esewa'>('cod');
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const deliveryFee = distance > 1 ? 100 : 0;
  const total = subtotal + deliveryFee;

  if (placed) {
    return (
      <section className="checkout-page">
        <div className="success-card">
          <CheckCircle2 size={58} />
          <h1>Order placed successfully!</h1>
          <p>Your order <strong>#{orderId}</strong> has been sent to RP FastFood.</p>
          <button className="btn primary" onClick={onPlaced}>
            Back to Menu
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="container">
        <button className="back-link" onClick={onBack}>
          <ArrowLeft size={17} /> Back to Cart
        </button>

        <div className="checkout-grid">
          <div>
            <div className="eyebrow">CHECKOUT</div>
            <h1>Complete your order.</h1>
            <p className="lead">Tell us where to deliver your fresh favorites.</p>

            <form
              className="checkout-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                setSubmitting(true);
                try {
                  const result = await createOrder({ customerName, phone, address, distanceKm: distance, notes, paymentMethod: payment, items });
                  setOrderId(result.orderId);
                  setPlaced(true);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Could not place the order. Please try again.');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <label>
                <span>Full Name</span>
                <div className="input-wrap">
                  <UserRound size={17} />
                  <input required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your full name" />
                </div>
              </label>

              <label>
                <span>Phone Number</span>
                <div className="input-wrap">
                  <Phone size={17} />
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="numeric" pattern="(?:\+977[- ]?)?(?:9[678]\d{8}|01\d{7})" title="Enter a valid Nepal phone number" placeholder="Your phone number" />
                </div>
              </label>

              <label>
                <span>Delivery Address</span>
                <div className="input-wrap">
                  <MapPin size={17} />
                  <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Where should we deliver?" />
                </div>
              </label>

              <label>
                <span>Delivery Distance</span>
                <div className="input-wrap">
                  <MapPin size={17} />
                  <input type="number" min="0" step="0.1" value={distance} readOnly />
                </div>
              </label>

              <label>
                <span>Order Notes</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know?" rows={4} />
              </label>

              <div className="payment-choice">
                <h3>Payment Method</h3>

                <label className={payment === 'cod' ? 'selected' : ''}>
                  <input
                    type="radio"
                    checked={payment === 'cod'}
                    onChange={() => setPayment('cod')}
                  />
                  <span>
                    <strong>Cash on Delivery</strong>
                    <small>Pay when your food arrives.</small>
                  </span>
                </label>
                {/*  Esewa payment option is included in the code but commented out for now.  */}
                {/*
                <label className={payment === 'esewa' ? 'selected' : ''}>
                  <input
                    type="radio"
                    checked={payment === 'esewa'}
                    onChange={() => setPayment('esewa')}
                  />
                  <span>
                    <strong>eSewa</strong>
                    <small>Pay conveniently using eSewa.</small>
                  </span>
                </label>
                */}
              </div>

              {/* {payment === 'esewa' && (
                <div className="esewa-card">
                  <div>
                    <div className="esewa-mark">eSewa</div>
                    <h3>Pay with eSewa</h3>
                    <p>Pay conveniently using eSewa.</p>
                    <small>
                      eSewa Merchant ID: <b>{restaurantConfig.esewaMerchantId}</b>
                    </small>
                  </div>
                  <div className="qr">
                    ESEWA QR
                    <br />
                    CODE
                    <br />
                    PLACEHOLDER
                  </div>
                </div>
              )} */}

              <button className="btn primary full" type="submit" disabled={submitting}>
                {submitting ? "Sending Order..." : "Place Order"}
              </button>
              {error && <div className="form-error">{error}</div>}
            </form>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>

            {items.map((item) => (
              <div className="order-line" key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <strong>{formatNPR(item.price * item.quantity)}</strong>
              </div>
            ))}

            <hr />

            <div className="order-line">
              <span>Subtotal</span>
              <strong>{formatNPR(subtotal)}</strong>
            </div>

            <div className="order-line">
              <span>Delivery</span>
              <strong>
                {deliveryFee === 0 ? 'FREE' : formatNPR(deliveryFee)}
              </strong>
            </div>

            {distance > 1 && (
              <p className="delivery-charge-note">
                A delivery charge of {formatNPR(100)} is applied for distances
                over 1 km.
              </p>
            )}

            <div className="order-total">
              <span>Total</span>
              <strong>{formatNPR(total)}</strong>
            </div>

            <div className="notice">
              <CreditCard size={17} />
              {/* <span>
                eSewa is shown as a payment option only. Real payment processing
                is not active until a valid integration is configured.
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
