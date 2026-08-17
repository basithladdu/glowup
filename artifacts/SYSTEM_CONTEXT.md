# System Context & Handover Artifacts

## Project: GLOWUP (System Basith)
**User:** Basith (22yo, 5'7", 85kg -> 72kg goal, Kurnool, India)  
**Live Production URL:** https://glowup-wheat-gamma.vercel.app  
**Repository:** https://github.com/basithladdu/glowup (Private)  
**Database:** Supabase Cloud Project `glowup` (`kircxokjlqguyzlkhmop` in `ap-south-1`)  
**Passcode:** `laddu`

---

## 1. Core Objectives & Framework
1. **Caloric Deficit:** 2,000 kcal/day (500 kcal deficit under 2,500 maintenance). Target fat loss: 0.4–0.6 kg/week.
2. **Protein Floor:** 170g/day non-negotiable (Soya chunks at ₹0.47/g, Eggs at ₹1.19/g, Oats at ₹1.15/g, Whey at ₹2.33/g, Chicken at ₹3.90/g).
3. **Skincare Tone Correction:** 
   - AM: AHA Glow facewash → Pilgrim Vitamin C → Minimalist B12 → Lakmé Ultra Matte SPF 50 (Face, neck, arms, hands) → WishCare SPF 50 Lip Balm.
   - Midday: Reapply SPF 50.
   - PM Weekly Rotation: Sun (Kojic/Arbutin), Mon (Aziderm 10%), Tue (Barrier Repair B12 + Glyco 12 Body), Wed (Kojic), Thu (Aziderm + Glyco 12), Fri (Repair B12), Sat (Minimalist 30% Peel every 14 days).
4. **Beard & Hair Growth:**
   - Tugain 5% Minoxidil liquid (1ml Mon–Fri & non-peel Sat night).
   - Dermaroller 0.5mm (Sunday AM only; wait 24h before minoxidil).
   - Ketoconazole 2% Shampoo (Tue & Thu).
   - Redensyl Scalp Serum (Nightly).
5. **V-Taper Hypertrophy (Target Ratio 1.60):**
   - PPL split + Core 4 non-negotiables every session: Face pulls (3x15), Rear delt fly (3x15), Farmer carries (3x40m), Dead hangs (2x30s).
6. **Sleep & Deep Work:**
   - 7.5h–8.5h sleep with bedtime/wake stopwatch.
   - 60–90 min dedicated content creation block (#basithladdu).
7. **ADHD Flow Architecture:**
   - Single "Next Up" sequential action card.
   - Haptic vibration + sound feedback on completion.
   - GitHub-style contribution activity grid with "Never Zero" anti-shame streak mechanics.

---

## 2. Supabase Integration
- **Project Ref:** `kircxokjlqguyzlkhmop`
- **Tables:**
  - `glowup_state`: JSON state (`days`, `weights`, `sleep`, `content`, `meas`, `peel`, `start`).
  - `glowup_events`: Chronological log events stream (`schema: glowup-event-v1`).
- Real-time client-side sync via `@supabase/supabase-js`.
