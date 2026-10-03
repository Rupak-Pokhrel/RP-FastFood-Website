import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { restaurantConfig } from '../config/restaurant';

export default function Navbar({
  cartCount,
  onOrder,
}: {
  cartCount: number;
  onOrder: () => void;
}) {
  const [open, setOpen] = useState(false);

  const links = [
    ['Home', '#home'],
    ['Menu', '#menu'],
    ['About', '#about'],
    ['Reviews', '#reviews'],
    ['Location', '#location'],
    ['Contact', '#contact'],
  ];

  return (
    <header className="navbar">
      <div className="nav-inner">
        <a className="brand" href="#home">
          <div className="logo-slot">
            <img
              src="/RP_FastFood_Logo.png"
              alt="RP FastFood And Restaurant official logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="logo-missing">Official logo</span>
          </div>
          <div>
            <strong>RP FASTFOOD</strong>
            <small>AND RESTAURANT</small>
          </div>
        </a>

        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {links.map(([t, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}>
              {t}
            </a>
          ))}
          <button
            className="mobile-order"
            onClick={() => {
              setOpen(false);
              onOrder();
            }}
          >
            Order Now
          </button>
        </nav>

        <div className="nav-actions">
          <button
            className="cart-button"
            onClick={onOrder}
            aria-label="Open cart"
          >
            <ShoppingBag size={19} />
            <span>Cart</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>

          <button
            className="menu-toggle"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
