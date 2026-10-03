import { Star } from 'lucide-react';
import { reviews } from '../data/reviews';

export default function Reviews() {
  return (
    <section id="reviews" className="section reviews-section">
      <div className="container">
        <div className="section-head centered">
          <div>
            <div className="eyebrow">CUSTOMER REVIEWS</div>
            <h2>Loved for the taste. Remembered for the value.</h2>
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map((r) => (
            <article className="review-card" key={r.id}>
              <div className="stars">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={17} fill="currentColor" />
                ))}
              </div>
              <p>“{r.text}”</p>
              <strong>{r.name}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
