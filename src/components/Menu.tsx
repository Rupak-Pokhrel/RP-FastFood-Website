import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { menuItems } from '../data/menu';
import { formatNPR } from '../utils/currency';
import type { Category, MenuItem } from '../types/restaurant';

const categories = ['All', 'Tea & Snacks', 'Momo', 'Chowmein', 'Chicken Specials'] as const;

function MenuCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (i:MenuItem, q:number) => void;
}) {
  const [q, setQ] = useState(1);

  return (
    <article className="food-card">
      <div className="food-image">
        <img src={item.image} alt={item.name} />
        <span>{item.category}</span>
      </div>

      <div className="food-body">
        <div className="food-title">
          <h3>{item.name}</h3>
          <strong>{formatNPR(item.price)}</strong>
        </div>

        <p>{item.description}</p>

        <div className="card-bottom">
          <div className="qty">
            <button
              onClick={() => setQ((v) => Math.max(1, v - 1))}
              aria-label={`Decrease ${item.name} quantity`}
            >
              <Minus size={15} />
            </button>
            <span>{q}</span>
            <button
              onClick={() => setQ((v) => v + 1)}
              aria-label={`Increase ${item.name} quantity`}
            >
              <Plus size={15} />
            </button>
          </div>

          <button className="add-btn" onClick={() => onAdd(item, q)}>
            <ShoppingBag size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Menu({ onAdd }: { onAdd: (i:MenuItem, q:number) => void }) {
  const [active, setActive] = useState<typeof categories[number]>('All');
  const filtered =
    active === 'All'
      ? menuItems
      : menuItems.filter((i) => i.category === (active as Category));

  return (
    <section id="menu" className="section menu-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">OUR MENU</div>
            <h2>Fresh favorites for every craving.</h2>
            <p>
              Simple ingredients, comforting flavors, and prices made for
              everyday meals.
            </p>
          </div>
        </div>

        <div className="filters" role="tablist">
          {categories.map((c) => (
            <button
              key={c}
              className={active === c ? 'active' : ''}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}
