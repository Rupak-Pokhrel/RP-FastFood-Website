import { ArrowRight, MapPin, ShoppingBag, Sparkles } from 'lucide-react';
import heroImage from '../assets/illustrations/delivery3.png';

export default function Hero({ onOrder }: { onOrder: () => void }) {
  return (
    <section id="home" className="hero">
      <div className="hero-pattern" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
          LOCAL FLAVOR • FRESHLY PREPARED
          </div>
          <h1>
            Fresh Taste.
            <br />
            <span>Great Price.</span>
            <br />
            Made With Love.
          </h1>
          <p>
            Enjoy delicious momo, chowmein, chicken specialties, tea, snacks,
            and more freshly prepared for you.
          </p>

          <div className="hero-actions">
            <button className="btn primary" onClick={onOrder}>
              Order Now
            </button>
            <a className="btn secondary" href="#menu">
              View Menu
            </a>
          </div>

          <div className="delivery-pill">
            <span>
              <MapPin size={18} />
            </span>
            <div>
              <strong>FREE FOOD DELIVERY WITHIN 1 KM</strong>
              <small>Fresh meals, right to your doorstep.</small>
            </div>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-glow" />
          <img
            src={heroImage}
            alt="Friendly delivery rider on a scooter carrying a restaurant food box"
          />
          <div className="floating-card">
            <ShoppingBag size={19} />
            <div>
              <strong>Ready to deliver</strong>
              <small>Fast • Fresh • Local</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
