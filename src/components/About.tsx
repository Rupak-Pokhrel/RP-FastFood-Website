import { Heart, Leaf, Utensils } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container about-grid">
        <div className="about-art">
          <div
            className="about-image-container"
            style={{
              width: 'min(100%, 420px)',
              height: 'auto',
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            <img
              src="src/assets/images/About.png"
              alt="About RP FastFood And Restaurant"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                maxHeight: '420px',
                objectFit: 'contain',
              }}
            />
          </div>
          {/* <div className="about-orb">RP</div> */}
          <div className="mini-card one">
            <Leaf size={19} />
            <span>Freshly prepared</span>
          </div>
          <div className="mini-card two">
            <Heart size={19} />
            <span>Made with care</span>
          </div>
        </div>

        <div>
          <div className="eyebrow">ABOUT US</div>
          <h2>Food that feels local, warm, and familiar.</h2>
          <p>
            RP FastFood And Restaurant is a local food destination offering
            delicious, freshly prepared meals at affordable prices.
          </p>
          <p>
            We serve a variety of popular favorites including momos, chowmein,
            chicken specialties, tea, snacks, and more.
          </p>
          <p>
            Our goal is simple: great taste, quality food, friendly service, and
            a satisfying experience for every customer.
          </p>

          <div className="about-points">
            <span>
              <Utensils size={18} /> Comfort food favorites
            </span>
            <span>
              <Leaf size={18} /> Freshly prepared
            </span>
            <span>
              <Heart size={18} /> Friendly service
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
