import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { restaurantConfig } from '../config/restaurant';

export default function Contact() {
  const phoneDisabled = restaurantConfig.phone.includes('RESTAURANT');

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="contact-card">
          <div>
            <div className="eyebrow">CONTACT US</div>
            <h2>Ready for something delicious?</h2>
          </div>

          <div className="contact-actions">
            <div className="contact-detail">
              <Phone size={19} />
              <div>
                <small>Phone</small>
                <strong>{restaurantConfig.phone}</strong>
              </div>
            </div>

            <div className="contact-detail">
              <MessageCircle size={19} />
              <div>
                <small>WhatsApp</small>
                <strong>{restaurantConfig.whatsapp}</strong>
              </div>
            </div>

            <div className="contact-detail">
              <MapPin size={19} />
              <div>
                <small>Location</small>
                <strong>See map</strong>
              </div>
            </div>

            <div className="button-row">
              <a
                className={`btn light ${phoneDisabled ? 'disabled' : ''}`}
                href={phoneDisabled ? '#' : `tel:${restaurantConfig.phone}`}
                onClick={(e) => phoneDisabled && e.preventDefault()}
              >
                Call to Order
              </a>

              <a
                className={`btn outline-light ${
                  restaurantConfig.whatsapp.includes('RESTAURANT')
                    ? 'disabled'
                    : ''
                }`}
                href={
                  restaurantConfig.whatsapp.includes('RESTAURANT')
                    ? '#'
                    : `https://wa.me/${restaurantConfig.whatsapp.replace(
                        /\D/g,
                        ''
                      )}`
                }
                onClick={(e) =>
                  restaurantConfig.whatsapp.includes('RESTAURANT') &&
                  e.preventDefault()
                }
              >
                WhatsApp Us
              </a>

              <a
                className="btn outline-light"
                href={restaurantConfig.mapDirectionsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
