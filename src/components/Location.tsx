import { ExternalLink, MapPin } from 'lucide-react';
import { restaurantConfig } from '../config/restaurant';

export default function Location() {
  return (
    <section id="location" className="section location-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">FIND US</div>
            <h2>Visit Our Restaurant</h2>
            <p>
              Come visit RP FastFood And Restaurant and enjoy freshly prepared
              food.
            </p>
          </div>
        </div>

        <div className="location-card">
          <div className="map-wrap">
            <iframe
              src={restaurantConfig.mapEmbedSrc}
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="RP FastFood And Restaurant location map"
            />
          </div>

          <div className="location-copy">
            <div className="location-icon">
              <MapPin />
            </div>
            <h3>RP FastFood And Restaurant</h3>
            <p>Find us on the map and get directions to the restaurant.</p>
            <a
              className="btn primary"
              href={restaurantConfig.mapDirectionsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions <ExternalLink size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
