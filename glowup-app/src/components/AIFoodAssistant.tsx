import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { parseFoodMacrosAI } from '../lib/gemini';
import type { MacroItem } from '../types';
import { MacroCharts } from './MacroCharts';

export const AIFoodAssistant: React.FC = () => {
  const { state, addFoodItems, removeFoodItem, getDayState, getDayTotals, addCustomRecipe } = useGlowUpStore();
  const dayState = getDayState();
  const dayTotals = getDayTotals();
  const myMeals = state.customRecipes || [];

  const [prompt, setPrompt] = useState(
    '250g of rice, 50g dal, nakpro malai kulfi whey 1 scoop protein, 200g chicken, 250ml milk, and 150g beef fry'
  );
  const [loading, setLoading] = useState(false);
  const [parsedCards, setParsedCards] = useState<MacroItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSaveMeal, setShowSaveMeal] = useState(false);
  const [mealName, setMealName] = useState('');

  const presets = [
    { label: '250g Rice + Dal + Whey + 200g Chicken + Milk + 150g Beef Fry', text: '250g of rice, 50g dal, nakpro malai kulfi whey 1 scoop protein, 200g chicken, 250ml milk, and 150g beef fry' },
    { label: '150g Rice + 80g Soya + Curd', text: '150g cooked rice, 80g soya chunks with dal, and 100g curd' },
    { label: '4 Eggs + 2 Rotis + Milk', text: '4 whole boiled eggs, 2 whole wheat rotis, and 1 glass buffalo milk (250ml)' },
    { label: '70g Oats + Milk + 1 Scoop Whey', text: '70g oats cooked in 250ml milk with 1 scoop whey isolate' },
    { label: '130g Chicken + Rice', text: '130g grilled chicken breast, 150g rice, and 1 bowl cucumber salad' },
  ];

  const handleCalculate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await parseFoodMacrosAI(prompt);
      setParsedCards(results);
    } catch (err: any) {
      setError(err.message || 'AI parsing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogAll = () => {
    if (!parsedCards.length) return;
    addFoodItems(parsedCards);
    setParsedCards([]);
  };

  const handleRemoveCard = (index: number) => {
    setParsedCards(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAsMyMeal = () => {
    if (!mealName.trim() || !parsedCards.length) return;
    addCustomRecipe({
      id: 'meal_' + Date.now(),
      n: mealName.trim(),
      k: Math.round(totKcalForSave()),
      p: Number(totPForSave().toFixed(1)),
      c: Number(totCForSave().toFixed(1)),
      f: Number(totFForSave().toFixed(1)),
      cost: ''
    });
    setMealName('');
    setShowSaveMeal(false);
  };

  const totKcalForSave = () => parsedCards.reduce((sum, item) => sum + item.k, 0);
  const totPForSave = () => parsedCards.reduce((sum, item) => sum + item.p, 0);
  const totCForSave = () => parsedCards.reduce((sum, item) => sum + item.c, 0);
  const totFForSave = () => parsedCards.reduce((sum, item) => sum + item.f, 0);

  const handleQuickLogMyMeal = (recipe: { n: string; k: number; p: number; c: number; f: number }) => {
    addFoodItems([{ n: recipe.n, k: recipe.k, p: recipe.p, c: recipe.c, f: recipe.f }]);
  };

  const totKcal = parsedCards.reduce((sum, item) => sum + item.k, 0);
  const totP = parsedCards.reduce((sum, item) => sum + item.p, 0);
  const totC = parsedCards.reduce((sum, item) => sum + item.c, 0);
  const totF = parsedCards.reduce((sum, item) => sum + item.f, 0);

  return (
    <div className="section-block">
      <div className="desktop-grid-equal">
        {/* LEFT COLUMN: DAILY MACRO TOTALS, AI PROMPT & LOGGED MEALS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* DAILY NUTRITION RINGS & TOTALS */}
          <div className="card macro-summary-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="eyebrow" style={{ color: 'var(--turmeric)' }}>daily macro totals</p>
                <h2 style={{ fontSize: '20px', margin: 0 }}>
                  {dayTotals.p}g / 170g <small style={{ fontSize: '12px', color: dayTotals.p >= 170 ? 'var(--sage)' : 'var(--muted)' }}>Protein Floor</small>
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: dayTotals.k <= 2000 ? 'var(--sage)' : 'var(--vermilion)' }}>
                  {dayTotals.k} / 2,000 kcal
                </span>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>500 kcal Deficit Cap</div>
              </div>
            </div>
          </div>

          {/* AI NATURAL LANGUAGE FOOD & MACRO ASSISTANT */}
          <div className="card ai-food-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '22px' }}></span>
                <div>
                  <h2 style={{ fontSize: '16px', margin: 0, color: 'var(--turmeric)' }}>AI Food &amp; Macro Assistant</h2>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>Gemini AI · Strict JSON Schema</span>
                </div>
              </div>
            </div>

            <p className="note" style={{ marginBottom: '10px' }}>
              Type or voice what you ate with grams or portions. AI will calculate accurate macros, generate <b>all the individual food cards</b>, and log them in 1 tap.
            </p>

            {/* MY MEALS — custom, one-tap, no AI round-trip. Matters more than generic presets. */}
            {myMeals.length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <p className="eyebrow" style={{ margin: '0 0 6px' }}><span className="n">yours</span> your saved custom meals — 1-tap log</p>
                <div className="ai-preset-chips">
                  {myMeals.map((m) => (
                    <button
                      key={m.id}
                      className="ai-chip"
                      style={{ borderColor: 'rgba(138,168,95,0.4)', color: 'var(--sage)' }}
                      onClick={() => handleQuickLogMyMeal(m)}
                      title={`${m.k}kcal · ${m.p}g P · ${m.c}g C · ${m.f}g F`}
                    >
                      {m.n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preset Prompt Chips */}
            <p className="eyebrow" style={{ margin: '0 0 6px' }}><span className="n">generic</span> quick-fill examples (edit the text below)</p>
            <div className="ai-preset-chips">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  className="ai-chip"
                  onClick={() => setPrompt(p.text)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '8px' }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 250g rice, 200g chicken breast, 1 scoop whey, 150g beef fry..."
                rows={3}
                className="ai-textarea"
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                className="btn primary"
                style={{ flex: 1 }}
                disabled={loading}
                onClick={handleCalculate}
              >
                {loading ? '⏳ Calculating with Gemini AI...' : 'Calculate & Show Macro Cards'}
              </button>
              <button className="btn sm" style={{ background: 'var(--surface3)' }} onClick={() => { setPrompt(''); setParsedCards([]); }}>
                Clear
              </button>
            </div>

            {error && (
              <div className="note" style={{ color: 'var(--vermilion)', marginTop: '8px' }}>
                ⚠{error}
              </div>
            )}

            {/* ALL THE CARDS CONTAINER */}
            {parsedCards.length > 0 && (
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p className="eyebrow" style={{ margin: 0 }}><span className="n">parsed</span> all food cards generated</p>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--turmeric)' }}>
                    {parsedCards.length} items detected
                  </span>
                </div>

                {/* Total Meal Macros Bar */}
                <div className="card" style={{ background: 'var(--surface3)', borderColor: 'var(--line2)', padding: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, color: 'var(--paper)' }}>
                      TOTAL MEAL MACROS
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, color: 'var(--sage)' }}>
                      {totP.toFixed(1)}g Protein
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center' }}>
                    <div style={{ background: 'var(--surface2)', padding: '5px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>CALORIES</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--turmeric)' }}>{Math.round(totKcal)}</div>
                    </div>
                    <div style={{ background: 'var(--surface2)', padding: '5px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>PROTEIN</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--sage)' }}>{totP.toFixed(1)}g</div>
                    </div>
                    <div style={{ background: 'var(--surface2)', padding: '5px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>CARBS</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--indigo)' }}>{totC.toFixed(1)}g</div>
                    </div>
                    <div style={{ background: 'var(--surface2)', padding: '5px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>FAT</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--rose)' }}>{totF.toFixed(1)}g</div>
                    </div>
                  </div>
                </div>

                {/* List of ALL CARDS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {parsedCards.map((card, idx) => (
                    <div key={idx} className="ai-parsed-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--paper)' }}>{card.n}</span>
                        <button
                          onClick={() => handleRemoveCard(idx)}
                          style={{ background: 'none', border: 0, color: 'var(--muted)', fontSize: '16px', cursor: 'pointer' }}
                        >
                          ×
                        </button>
                      </div>
                      <div className="ai-macro-pills">
                        <span className="ai-macro-pill kcal">{Math.round(card.k)} kcal</span>
                        <span className="ai-macro-pill prot">{card.p}g Protein</span>
                        <span className="ai-macro-pill carb">{card.c}g Carbs</span>
                        <span className="ai-macro-pill fat">{card.f}g Fat</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn sage"
                  style={{ width: '100%', marginTop: '12px', padding: '12px', fontSize: '13.5px', fontWeight: 700 }}
                  onClick={handleLogAll}
                >
                  ✓ Log ALL Cards to Today's Meals (+ Sync Macros)
                </button>

                {!showSaveMeal ? (
                  <button className="btn sm" style={{ width: '100%', marginTop: '8px', background: 'var(--surface3)' }} onClick={() => setShowSaveMeal(true)}>
                    Save This Combo as My Meal (for 1-tap next time)
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    <input
                      autoFocus
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                      placeholder="Name it, e.g. My Usual Lunch"
                    />
                    <button className="btn sage sm" onClick={handleSaveAsMyMeal}>Save</button>
                    <button className="btn sm" style={{ background: 'var(--surface3)' }} onClick={() => setShowSaveMeal(false)}>✕</button>
                  </div>
                )}
              </div>
            )}
          </div>


          {/* LOGGED MEALS ON THIS DATE */}
          <div className="card">
            <p className="eyebrow"><span className="n">log</span> meals eaten on this date</p>
            {!dayState.food.length ? (
              <div className="empty">No food logged on this date. Use the AI Assistant above to log meals.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {dayState.food.map((f, i) => (
                  <div key={i} className="logrow">
                    <span className="logname">{f.n}</span>
                    <span className="logmac">{Math.round(f.k)} kcal · {f.p}g P</span>
                    <button className="del" onClick={() => removeFoodItem(i)} title="Remove item">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 14-DAY MACRO & CALORIE TRAJECTORY CHARTS */}
        <div>
          <MacroCharts />
        </div>
      </div>
    </div>
  );
};
