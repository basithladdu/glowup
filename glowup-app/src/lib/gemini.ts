import { GEMINI_API_KEY, GEMINI_MODELS } from './constants';
import type { MacroItem } from '../types';

export async function parseFoodMacrosAI(userPrompt: string): Promise<MacroItem[]> {
  let lastError: Error | null = null;
  
  for (const model of GEMINI_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [{
          parts: [{
            text: `You are an expert sports nutritionist and food macro calculator.
The user describes what they ate in natural language: "${userPrompt}".
Important nutritional guidelines:
- Assume rice weight refers to cooked rice (~130 kcal / 100g, 2.7g P, 28g C) unless specified as raw.
- Assume chicken refers to cooked/grilled chicken breast (~145 kcal / 100g, 31g P, 2.5g F).
- Assume dal cooked is ~100 kcal / 100g, 6g P.
- Assume beef fry is ~250 kcal / 100g, 26g P, 2.5g C, 15g F (e.g. 150g is ~375 kcal, 39g P, 4g C, 22g F).
- Assume 1 scoop whey protein is ~120-130 kcal, 24g P, 3-4g C, 1.5g F.
- Assume 250ml milk is ~150 kcal, 8g P, 12g C, 7.5g F.

Break down every food item mentioned with accurate grams, calories, and macronutrients.
CRITICAL: Respond ONLY with a valid JSON array of objects. Do not include markdown ticks or any other text.
Each object must have these exact keys:
- "n": string (descriptive food name with gram/portion, e.g. "Cooked Rice (250g)" or "Nakpro Malai Kulfi Whey (1 scoop)")
- "k": integer (calories in kcal)
- "p": number (protein in grams, rounded to 1 decimal)
- "c": number (carbohydrates in grams, rounded to 1 decimal)
- "f": number (fat in grams, rounded to 1 decimal)`
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`API error (${res.status}): ${errText}`);
        continue;
      }

      const data = await res.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const rawText = data.candidates[0].content.parts[0].text;
        const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJsonStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            n: item.n || item.name || 'Food Item',
            k: Math.round(Number(item.k) || 0),
            p: Number(Number(item.p).toFixed(1)) || 0,
            c: Number(Number(item.c).toFixed(1)) || 0,
            f: Number(Number(item.f).toFixed(1)) || 0
          }));
        }
      }
    } catch (err: any) {
      lastError = err;
    }
  }
  
  throw lastError || new Error("Unable to parse food macros with AI. Please try again.");
}
