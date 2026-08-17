# GlowUp Tracker

`daily-log.jsonl` is the append-only source of truth for chat and CLI updates.

Rules:

- Preserve exact user wording in `exact_update`.
- Record `source` as `chat` or `cli`.
- Use `done`, `skipped`, `planned`, `blocked`, or `unknown` for `status`.
- Never infer completion from silence.
- Corrections append a new event; they do not rewrite history.
- Keep raw source material in `../raw/` and derived routines separate.

Useful searches:

```powershell
rg '"status":"done"' GlowUp/tracker
rg '"date":"2026-07-19"' GlowUp/tracker
rg '"area":"nutrition"' GlowUp/tracker
```

