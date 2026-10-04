import { useEffect, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Delivery from './components/Delivery';
import Menu from './components/Menu';
import Reviews from './components/Reviews';
import About from './components/About';
import Location from './components/Location';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { useCart } from './hooks/useCart';
import type { MenuItem } from './types/restaurant';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  if (window.location.pathname.startsWith('/admin')) return <AdminDashboard />;
  return <CustomerApp />;
}

function CustomerApp() {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [distance, setDistance] = useState(1);

  const [pendingHash, setPendingHash] = useState<string | null>(null);

  const order = () => setCartOpen(true);

  // Leave checkout and jump to a section of the home page (#home, #menu, ...).
  const goTo = (hash: string) => {
    setCheckout(false);
    setPendingHash(hash);
  };

  // Back from checkout to the cart drawer on the home page.
  const backToCart = () => {
    setCheckout(false);
    setCartOpen(true);
  };

  useEffect(() => {
    if (checkout) {
      window.scrollTo(0, 0);
      return;
    }
    if (pendingHash) {
      document.querySelector(pendingHash)?.scrollIntoView();
      window.history.replaceState(null, '', pendingHash);
      setPendingHash(null);
    }
  }, [checkout, pendingHash]);

  const add = (item: MenuItem, q: number) => {
    cart.add(item, q);
    setCartOpen(true);
  };

  if (checkout) {
    return (
      <>
        <Navbar cartCount={cart.count} onOrder={backToCart} onNavigate={goTo} />
        <Checkout
          items={cart.items}
          subtotal={cart.subtotal}
          distance={distance}
          onBack={backToCart}
          onPlaced={() => {
            cart.clear();
            goTo('#menu');
          }}
        />
        <Footer />
      </>
    );
  }

  return (
    <div>
      <Navbar cartCount={cart.count} onOrder={order} />
      <main>
        <Hero onOrder={order} />
        <Delivery onOrder={order} />
        <Menu onAdd={add} />
        <Reviews />
        <About />
        <Location />
        <Contact />
      </main>
      <Footer />

      {cartOpen && (
        <>
          <div className="scrim" onClick={() => setCartOpen(false)} />
          <Cart
            items={cart.items}
            subtotal={cart.subtotal}
            deliveryDistance={distance}
            setDistance={setDistance}
            onChange={cart.change}
            onRemove={cart.remove}
            onCheckout={() => {
              setCartOpen(false);
              setCheckout(true);
            }}
            onClose={() => setCartOpen(false)}
          />
        </>
      )}

      {!cartOpen && cart.count > 0 && (
        <button className="floating-cart" onClick={order}>
          <ShoppingBag size={20} />
          <span>
            {cart.count} item{cart.count > 1 ? 's' : ''}
          </span>
        </button>
      )}
    </div>
  );
}
