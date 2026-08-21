import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { DEFAULT_INVENTORY } from '../lib/constants';
import type { InventoryItem } from '../types';

export const ShoppingInventory: React.FC = () => {
  // Inventory comes from the persisted store, so toggling stock sticks across reloads
  // and devices instead of resetting to a hardcoded list.
  const { state, setInventoryStock, addInventoryItem, deleteInventoryItem } = useGlowUpStore();
  const items: InventoryItem[] = state.inventory || DEFAULT_INVENTORY;

  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<'nutrition' | 'derm' | 'grooming'>('nutrition');
  const [newQty, setNewQty] = useState('');
  const [newCost, setNewCost] = useState('');

  const toggleBought = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) setInventoryStock(id, !item.inStock);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addInventoryItem({
      id: 'sh_' + Date.now(),
      name: newName.trim(),
      category: newCat,
      qty: newQty.trim() || '1 item',
      estCost: newCost.trim() ? `₹${newCost}` : '₹0',
      inStock: false
    });
    setNewName('');
    setNewQty('');
    setNewCost('');
  };

  const handleDeleteItem = (id: string) => deleteInventoryItem(id);

  const pendingItems = items.filter(i => !i.inStock);
  const boughtItems = items.filter(i => i.inStock);

  return (
    <div className="section-block">
      {/* SHOPPING SUMMARY HEADER */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">inventory</span> shopping list &amp; replenishment</p>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Things I Have To Buy </h2>
          </div>
          <span className="tag-badge tag-best">{pendingItems.length} PENDING</span>
        </div>
        <p className="note">
          Keep your nutritional, dermatological, and grooming arsenal 100% stocked without friction.
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
                    <option value="nutrition">Nutrition / Food</option>
                    <option value="derm">Derm / Skincare</option>
                    <option value="grooming">Grooming / Gear</option>
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
                // Maps a shopping item to the telemetry id it's actually logged under in SkinGrooming
                // (am_/pm_ step ids don't follow a fixed prefix rule, so this has to be explicit).
                const TELEM_KEY_MAP: Record<string, string> = {
                  sh_spf: 'am_spf',
                  sh_khus: 'am_khus',
                  sh_castor: 'pm_castor',
                  sh_minox: 'pm_minox',
                  sh_lipscrub: 'am_lip',
                };
                const telemKey = TELEM_KEY_MAP[item.id];
                const telemData = telemKey ? useGlowUpStore.getState().getDayState().productTelemetry?.[telemKey] : undefined;
                return (
                  <div key={item.id} className="logrow" style={{ opacity: 0.85, padding: '8px 6px', background: 'var(--surface2)', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span className="logname" style={{ fontWeight: 600 }}>{item.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Qty: {item.qty} · Cost: {item.estCost}</span>
                      {telemData && (
                        <span style={{ fontSize: '9.5px', color: 'var(--turmeric)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                          Logged {telemData.count}x · Last: {telemData.lastUsed}
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
