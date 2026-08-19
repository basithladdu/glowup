import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

interface ShoppingItem {
  id: string;
  name: string;
  category: 'nutrition' | 'derm' | 'grooming';
  qty: string;
  estCost: string;
  bought: boolean;
}

export const ShoppingInventory: React.FC = () => {
  const { saveState } = useGlowUpStore();

  const [items, setItems] = useState<ShoppingItem[]>([
    { id: 'sh_chk', name: 'Raw Chicken Breast (1–2 kg)', category: 'nutrition', qty: '2 kg', estCost: '₹480', bought: true },
    { id: 'sh_eggs', name: 'Whole Eggs (Crate of 30)', category: 'nutrition', qty: '1 Crate', estCost: '₹210', bought: true },
    { id: 'sh_dates', name: 'Lion / Kimia Medjool Dates (500g Box)', category: 'nutrition', qty: '500g', estCost: '₹280', bought: false },
    { id: 'sh_whey', name: 'Nakpro Malai Kulfi Whey Isolate', category: 'nutrition', qty: '1 kg Tub', estCost: '₹1,699', bought: true },
    { id: 'sh_soya', name: 'Fortune Soya Chunks (Pack of 500g)', category: 'nutrition', qty: '500g', estCost: '₹75', bought: true },
    { id: 'sh_milk', name: 'Fresh Buffalo Milk / Nandini Curd', category: 'nutrition', qty: '1 L', estCost: '₹70', bought: false },
    { id: 'sh_castor', name: 'Pure Cold-Pressed Castor Oil (Lashes & Brows)', category: 'grooming', qty: '100ml', estCost: '₹180', bought: false },
    { id: 'sh_coconut', name: 'Pure Cold-Pressed Virgin Coconut Oil (Scalp & Hair)', category: 'grooming', qty: '250ml', estCost: '₹150', bought: false },
    { id: 'sh_lipscrub', name: 'Nicole Sugar Berry Lip Scrub (Pink Lips Exfoliator)', category: 'derm', qty: '30g', estCost: '₹220', bought: false },
    { id: 'sh_socks', name: 'Breathable Cotton Gym Socks (6-Pack)', category: 'grooming', qty: '6 Pairs', estCost: '₹299', bought: false },
    { id: 'sh_tape', name: '3M Micropore Nasal Sleep Mouth Tape', category: 'grooming', qty: '2 Rolls', estCost: '₹120', bought: true },
    { id: 'sh_spf', name: 'Lakmé Sun Expert SPF 50 PA+++ Sunscreen', category: 'derm', qty: '100ml', estCost: '₹340', bought: true },
    { id: 'sh_peel', name: 'The Minimalist AHA 30% + BHA 2% Peel', category: 'derm', qty: '30ml', estCost: '₹599', bought: true },
    { id: 'sh_aziderm', name: 'Aziderm 10% Azelaic Acid Gel', category: 'derm', qty: '15g Tube', estCost: '₹280', bought: true },
    { id: 'sh_glyco', name: 'Glyco 6% / Glyco 12% Glycolic Acid', category: 'derm', qty: '30g', estCost: '₹210', bought: true },
    { id: 'sh_minox', name: 'Minoxidil 5% Topical Solution', category: 'grooming', qty: '60ml', estCost: '₹550', bought: true }
  ]);

  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<'nutrition' | 'derm' | 'grooming'>('nutrition');
  const [newQty, setNewQty] = useState('');
  const [newCost, setNewCost] = useState('');

  const toggleBought = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, bought: !item.bought } : item));
    saveState({ area: 'shopping', item: id, exact_update: `Toggled shopping item ${id}` });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newItem: ShoppingItem = {
      id: 'sh_' + Date.now(),
      name: newName.trim(),
      category: newCat,
      qty: newQty.trim() || '1 item',
      estCost: newCost.trim() ? `₹${newCost}` : '₹0',
      bought: false
    };
    setItems(prev => [newItem, ...prev]);
    setNewName('');
    setNewQty('');
    setNewCost('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const pendingItems = items.filter(i => !i.bought);
  const boughtItems = items.filter(i => i.bought);

  return (
    <div className="section-block">
      {/* SHOPPING SUMMARY HEADER */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">inventory</span> shopping list &amp; replenishment</p>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Things I Have To Buy 🛒</h2>
          </div>
          <span className="tag-badge tag-best">{pendingItems.length} PENDING</span>
        </div>
        <p className="note">
          Keep your gym staples, high-protein pantry, derm actives, and grooming gear fully stocked to never break routine momentum.
        </p>
      </div>

      <div className="desktop-grid-equal">
        {/* LEFT COLUMN: PENDING ITEMS */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '14px', margin: 0, color: 'var(--turmeric)' }}>⏳ Needs Replenishment ({pendingItems.length})</h3>
          </div>

          {!pendingItems.length ? (
            <div className="empty">Everything is stocked! No items to buy right now.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendingItems.map((item) => (
                <div key={item.id} className="task-item">
                  <div className="task-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="task-title">{item.name}</span>
                      <span className="freq-pill">{item.qty}</span>
                    </div>
                    <div className="task-sub" style={{ color: 'var(--turmeric)' }}>Est: {item.estCost}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button className="task-btn" onClick={() => toggleBought(item.id)}>
                      ✓ Mark Bought
                    </button>
                    <button className="del" onClick={() => handleDeleteItem(item.id)}>×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ALREADY BOUGHT & ADD NEW ITEM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* ADD ITEM FORM */}
          <div className="card">
            <p className="eyebrow"><span className="n">+</span> add item to shopping list</p>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Item name (e.g. 500g Chicken, Gym Socks, Vaseline...)"
                required
              />
              <div className="frow">
                <div>
                  <label className="fl">Category</label>
                  <select value={newCat} onChange={(e: any) => setNewCat(e.target.value)}>
                    <option value="nutrition">🍗 Nutrition / Food</option>
                    <option value="derm">🧴 Derm / Skincare</option>
                    <option value="grooming">🧦 Grooming / Gear</option>
                  </select>
                </div>
                <div>
                  <label className="fl">Quantity</label>
                  <input value={newQty} onChange={(e) => setNewQty(e.target.value)} placeholder="e.g. 2 kg, 6 pairs" />
                </div>
                <div>
                  <label className="fl">Est. Price (₹)</label>
                  <input type="number" value={newCost} onChange={(e) => setNewCost(e.target.value)} placeholder="₹300" />
                </div>
              </div>
              <button type="submit" className="btn primary" style={{ width: '100%' }}>
                + Add To Buy List
              </button>
            </form>
          </div>

          {/* BOUGHT INVENTORY & TELEMETRY */}
          <div className="card">
            <h3 style={{ fontSize: '13px', margin: '0 0 8px', color: 'var(--sage)' }}>✓ In Stock &amp; Active Inventory ({boughtItems.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {boughtItems.map((item) => {
                const telemKey = item.id.replace('sh_', 'pm_').replace('sh_spf', 'am_spf').replace('sh_khus', 'am_khus');
                const telemData = useGlowUpStore.getState().getDayState().productTelemetry?.[telemKey];
                return (
                  <div key={item.id} className="logrow" style={{ opacity: 0.85, padding: '8px 6px', background: 'var(--surface2)', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span className="logname" style={{ fontWeight: 600 }}>{item.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Qty: {item.qty} · Cost: {item.estCost}</span>
                      {telemData && (
                        <span style={{ fontSize: '9.5px', color: 'var(--turmeric)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                          ⚡ Logged {telemData.count}x · Last: {telemData.lastUsed}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button className="task-btn" style={{ fontSize: '9px', padding: '3px 6px' }} onClick={() => toggleBought(item.id)}>
                        ↩ Buy Again
                      </button>
                      <button className="del" onClick={() => handleDeleteItem(item.id)}>×</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
