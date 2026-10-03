import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src="/RP_FastFood_Logo.png"
              alt="RP FastFood And Restaurant official logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="logo-missing">Official logo</span>
          </div>
          <h3>RP FASTFOOD AND RESTAURANT</h3>
          <p>Fresh Taste. Great Price. Made With Love.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
          <a href="#reviews">Reviews</a>
          <a href="#location">Location</a>
          <a href="#contact">Contact</a>
        </div>

        <div>
          <h4>Services</h4>
          <span>Dine-In</span>
          <span>Takeaway</span>
          <span>Food Delivery</span>
        </div>

        <div>
          <h4>Payment</h4>
          <span>Cash on Delivery</span>
          {/* <span>eSewa</span> */}
          <div className="footer-badge">
            FREE DELIVERY
            <br />
            WITHIN 1 KM
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 RP FastFood And Restaurant. All Rights Reserved.</span>
        <a href="#home">
          Back to top <ArrowUpRight size={15} />
        </a>
      </div>
    </footer>
  );
}
