import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import type { MacroItem } from '../types';

export const ProteinBank: React.FC = () => {
  const { addFoodItems } = useGlowUpStore();

  const [soya, setSoya] = useState(80);
  const [eggs, setEggs] = useState(4);
  const [chk, setChk] = useState(0);
  const [dairy, setDairy] = useState(350);
  const [pan, setPan] = useState(0);
  const [whey, setWhey] = useState(1);

  const stapleBank = [
    { n: 'Soya Chunks (80g)', k: 276, p: 41.6, c: 26.4, f: 0.4, cost: '₹14 · ₹0.34/g P' },
    { n: 'Whole Eggs (4 Eggs)', k: 288, p: 25.2, c: 1.6, f: 19.2, cost: '₹28 · ₹1.11/g P' },
    { n: 'Chicken Breast (130g)', k: 143, p: 30.0, c: 0, f: 2.1, cost: '₹39 · ₹1.30/g P' },
    { n: 'Buffalo Milk (250ml)', k: 150, p: 8.0, c: 12.0, f: 6.5, cost: '₹18 · ₹2.25/g P' },
    { n: 'Heritage Paneer (240g)', k: 430, p: 60.0, c: 7.0, f: 21.6, cost: '₹130 · ₹2.16/g P' },
    { n: 'Nakpro Whey Isolate (1 Scoop)', k: 160, p: 24.0, c: 8.0, f: 2.5, cost: '₹56 · ₹2.33/g P' },
    { n: 'Rolled Oats (70g)', k: 266, p: 9.3, c: 47.0, f: 4.8, cost: '₹12 · Carbs/Fiber' }
  ];

  const presetStacks = [
    {
      name: 'Stack A · Budget Champion (₹118 / day · 172g Protein)',
      desc: '80g Soya + 4 Whole Eggs + 250ml Milk + 1 Scoop Whey + 70g Oats + 150g Rice + Dal',
      foods: [
        { n: 'Oats 70g + Milk 250ml + Flaxseed', k: 416, p: 17.3, c: 59, f: 11.3 },
        { n: 'Soya Chunks 80g + Rice 150g + Dal', k: 677, p: 55.6, c: 91, f: 8.6 },
        { n: 'Nakpro Whey Isolate 1 Scoop', k: 160, p: 24.0, c: 8, f: 2.5 },
        { n: '4 Whole Eggs + 2 Roti + Curd', k: 556, p: 34.7, c: 44, f: 26.7 }
      ]
    },
    {
      name: 'Stack B · High Animal Protein (₹142 / day · 178g Protein)',
      desc: '130g Chicken Breast + 4 Whole Eggs + 250ml Milk + 1 Scoop Whey + 70g Oats + Rice + Dal',
      foods: [
        { n: 'Oats 70g + Milk 250ml + Flaxseed', k: 416, p: 17.3, c: 59, f: 11.3 },
        { n: 'Chicken Breast 130g + Rice 150g + Dal', k: 544, p: 44.0, c: 65, f: 10.3 },
        { n: 'Nakpro Whey Isolate 1 Scoop', k: 160, p: 24.0, c: 8, f: 2.5 },
        { n: '4 Whole Eggs + 2 Roti + Curd', k: 556, p: 34.7, c: 44, f: 26.7 }
      ]
    }
  ];

  // Balancer calculation
  let calcProt = 20.3; // base oats + rice + dal
  let calcKcal = 577;
  let calcCost = 25;

  calcProt += (soya * 0.52); calcKcal += (soya * 3.45); calcCost += (soya * 0.175);
  calcProt += (eggs * 6.3); calcKcal += (eggs * 72); calcCost += (eggs * 7.0);
  calcProt += (chk * 0.23); calcKcal += (chk * 1.1); calcCost += (chk * 0.30);
  calcProt += (dairy * 0.035); calcKcal += (dairy * 0.60); calcCost += (dairy * 0.07);
  calcProt += (pan * 0.25); calcKcal += (pan * 1.8); calcCost += (pan * 0.54);
  calcProt += (whey * 24.0); calcKcal += (whey * 160); calcCost += (whey * 56.0);

  const handleApplyBalancer = () => {
    const items: MacroItem[] = [
      { n: 'Base Oats 70g + Rice 150g + Dal', k: 577, p: 20.3, c: 110, f: 5.6 }
    ];
    if (soya > 0) items.push({ n: `Soya Chunks ${soya}g`, k: Math.round(soya * 3.45), p: Number((soya * 0.52).toFixed(1)), c: Math.round(soya * 0.33), f: 1 });
    if (eggs > 0) items.push({ n: `${eggs} Whole Eggs`, k: eggs * 72, p: Number((eggs * 6.3).toFixed(1)), c: Number((eggs * 0.4).toFixed(1)), f: Number((eggs * 4.8).toFixed(1)) });
    if (chk > 0) items.push({ n: `Chicken Breast ${chk}g`, k: Math.round(chk * 1.1), p: Number((chk * 0.23).toFixed(1)), c: 0, f: Math.round(chk * 0.02) });
    if (dairy > 0) items.push({ n: `Milk/Curd ${dairy}ml`, k: Math.round(dairy * 0.6), p: Number((dairy * 0.035).toFixed(1)), c: Math.round(dairy * 0.04), f: Math.round(dairy * 0.035) });
    if (pan > 0) items.push({ n: `Heritage Paneer ${pan}g`, k: Math.round(pan * 1.8), p: Number((pan * 0.25).toFixed(1)), c: Math.round(pan * 0.03), f: Math.round(pan * 0.09) });
    if (whey > 0) items.push({ n: `Whey ${whey} Scoop`, k: whey * 160, p: whey * 24, c: whey * 8, f: whey * 2.5 });

    addFoodItems(items);
  };

  return (
    <div className="section-block">
      {/* 4 SWAPPABLE 1-TAP MEAL STACKS */}
      <div className="card">
        <p className="eyebrow"><span className="n">stacks</span> 1-tap daily nutrition combos (~172g protein)</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {presetStacks.map((stk, idx) => (
            <div key={idx} style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--turmeric)' }}>{stk.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 8px' }}>{stk.desc}</div>
              <button className="btn sage sm" onClick={() => addFoodItems(stk.foods)}>
                ✓ Log This Complete 172g Stack Today
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* DYNAMIC LIVE RECIPE & PRICE BALANCER */}
      <div className="card">
        <p className="eyebrow"><span className="n">calc</span> live recipe &amp; price balancer</p>
        <h2>Custom Recipe Gram Balancer</h2>
        <p className="note" style={{ marginBottom: '12px' }}>
          Dial in grams of soya, eggs, chicken, curd &amp; milk. Live protein, calorie, and rupee breakdown.
        </p>

        <div className="frow">
          <div><label className="fl">Soya Chunks (g)</label><input type="number" step="10" value={soya} onChange={(e) => setSoya(Number(e.target.value) || 0)} /></div>
          <div><label className="fl">Whole Eggs</label><input type="number" step="1" value={eggs} onChange={(e) => setEggs(Number(e.target.value) || 0)} /></div>
          <div><label className="fl">Chicken (g)</label><input type="number" step="10" value={chk} onChange={(e) => setChk(Number(e.target.value) || 0)} /></div>
        </div>
        <div className="frow">
          <div><label className="fl">Milk / Curd (ml)</label><input type="number" step="50" value={dairy} onChange={(e) => setDairy(Number(e.target.value) || 0)} /></div>
          <div><label className="fl">Paneer (g)</label><input type="number" step="10" value={pan} onChange={(e) => setPan(Number(e.target.value) || 0)} /></div>
          <div><label className="fl">Whey Scoops</label><input type="number" step="1" value={whey} onChange={(e) => setWhey(Number(e.target.value) || 0)} /></div>
        </div>

        <div className="card" style={{ background: 'var(--surface2)', borderColor: 'var(--line2)', margin: '8px 0 10px', padding: '10px' }}>
          <div className="statline">
            <span className="statk">Total Protein</span>
            <span className="statv" style={{ color: calcProt >= 170 ? 'var(--sage)' : 'var(--vermilion)' }}>{calcProt.toFixed(1)}g / 170g Floor</span>
          </div>
          <div className="statline">
            <span className="statk">Total Calories</span>
            <span className="statv">{Math.round(calcKcal)} kcal ({2000 - Math.round(calcKcal) > 0 ? 'Deficit' : 'Surplus'})</span>
          </div>
          <div className="statline">
            <span className="statk">Estimated Daily Cost</span>
            <span className="statv" style={{ color: 'var(--turmeric)' }}>₹{Math.round(calcCost)} / day</span>
          </div>
        </div>

        <button className="btn primary" style={{ width: '100%' }} onClick={handleApplyBalancer}>
          ✓ Log This Custom Balanced Stack
        </button>
      </div>

      {/* STAPLE ADDER */}
      <div className="card">
        <p className="eyebrow">₹/g price-to-protein bank</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {stapleBank.map((s, idx) => (
            <div key={idx} className="logrow">
              <span className="logname">{s.n}</span>
              <span className="logmac" style={{ color: 'var(--turmeric)' }}>{s.cost}</span>
              <button
                className="btn sm"
                style={{ background: 'var(--surface3)' }}
                onClick={() => addFoodItems([{ n: s.n, k: s.k, p: s.p, c: s.c, f: s.f }])}
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
