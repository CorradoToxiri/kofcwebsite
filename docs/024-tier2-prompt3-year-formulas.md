# Admin UI — Tier 2, Prompt 3: Auto-calculating year values

Final Tier 2 prompt. Three self-contained, date-driven changes. No settings table involved — these are computed from the current date, not editable values.

## 1 — Years-serving count (the "58 years" value)

Replace the hardcoded "58" / "Fifty-eight" years-serving values with a computed value anchored to the charter date **March 10, 1968**.

Rule: years = currentYear − 1968, minus 1 if today is before March 10 of the current year. So it reads 58 until March 9 2027, then flips to 59 on March 10 2027.

Occurrences (verify against code): Home (stat "X Years serving the parish" and history heading "Fifty-eight years of brothers"), About (H1 "Fifty-eight years of brothers" and meta description "our 58-year history").

Note both numeric ("58") and spelled-out ("Fifty-eight") forms exist. For the spelled-out form: either compute the word form, or reword to use the numeral if that's cleaner — your call, but keep the sentence natural. Flag which occurrences you changed and how.

## 2 — Copyright year

Footer copyright year = current calendar year (currently "2026"). Compute it, don't hardcode.

## 3 — Calendar page Columbian-year intro (reuse Officers logic)

The Calendar page intro shows a static "COLUMBIAN YEAR 2025–2026". The Officers page already computes the Columbian year correctly (flips July 1 — currently showing 2026–2027). 

- Locate the Officers page's Columbian-year logic. If it's inline, **extract it into a shared util** (e.g. `src/lib/utils/columbianYear.ts`) and update the Officers page to import from it (behavior unchanged).
- Use that shared util on the **Calendar page intro** so it shows the same auto-rolling Columbian year as Officers.
- This is separate from the March-10 years-serving rule above — the Columbian year flips July 1, the years-serving count flips March 10. Keep them distinct.

## Do NOT
- Do NOT touch the settings-driven values from prompt 2.
- Do NOT scan/change other Columbian-year strings elsewhere — only the Calendar intro.
- Do NOT change the Officers page's displayed output (only refactor its logic into a shared util if needed).

## Verify (non-obvious only)
- Years-serving computes correctly around the March 10 boundary (test a date before and after — e.g. simulate 2027-03-09 → 58, 2027-03-10 → 59).
- Columbian-year util produces identical output on Officers (unchanged) and Calendar (now dynamic); Calendar shows the same year range as Officers currently does.
- Copyright = current year.

Build, verify locally, hard-refresh, stop for review. Do NOT commit. This completes the Tier 2 feature — after this, the full set (settings editor + wired pages + formulas) will be committed together by me after testing.
