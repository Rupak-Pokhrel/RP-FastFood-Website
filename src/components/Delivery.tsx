import { Bike, MapPin, ShieldCheck } from 'lucide-react';

export default function Delivery({ onOrder }: { onOrder: () => void }) {
  return (
    <section className="delivery-section">
      <div className="container delivery-card">
        <div className="delivery-copy">
          <div className="eyebrow light">
            <Bike size={17} /> SPECIAL OFFER
          </div>
          <h2>FREE FOOD DELIVERY</h2>
          <div className="km-badge">
            <MapPin size={20} /> WITHIN 1 KM
          </div>
          <p>
            Order your favorite food today and enjoy free delivery within 1 KM.
          </p>
          <p className="muted-light">
            Delivery is available beyond 1 KM. Additional delivery charges may
            apply.
          </p>
          <button className="btn light" onClick={onOrder}>
            Order Now
          </button>
          <div className="delivery-note">
            <ShieldCheck size={17} /> Free delivery applies within 1 KM only.
          </div>
        </div>
        <img
          className="delivery-visual"
          src="/src/assets/illustrations/delivery6.png"
          alt="Scooter delivery illustration"
        />
      </div>
    </section>
  );
}
