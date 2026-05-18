# eProcess — Interactive demo prototype

Clickable **magic-patterns** prototype for the Ecobank / eProcess wealth & goal-planning platform. Use it to demo scope, UX, and flows before core systems are wired.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Surfaces

| Route | Purpose |
|-------|---------|
| `/` | Landing + **scope map** (12 capability areas → live screens) |
| `/login` | SSO + MFA story (pillar 12) |
| `/rm` | RM hub — agenda, warnings, module map |
| `/rm/onboarding` | CRM pre-fill & profiling wizard |
| `/rm/goals` | SMART goal template library |
| `/rm/client-360` | CRM 360, household/SME, goals, integrations, AI insights |
| `/rm/meeting` | 6-step advisory session (what-if, sleeves, products, handoff) |
| `/present/meeting` | Fullscreen co-planning for branch / projector |
| `/rm/markets` | Localization — tax, clusters, planning flows |
| `/admin/markets` | Admin JSON config sandbox |
| `/rm/compliance` | Suitability prompts, document vault |
| `/rm/learn` | **Module 8** — FPS certifications, 5-domain radar, HR L&D sync, regional career paths |
| `/client` | Client web — goals, investments, nudges, multi-currency |
| `/client-mobile` | Mobile shell — omnichannel handoff |

Toggle **EN / FR / PT** from the RM or client header (copy deck; new screens included).

Design tokens for Figma handoff: [`design/tokens.json`](design/tokens.json).

## 15-minute demo script

1. **`/`** — Scope map → **Sign in** → MFA → RM workstation.
2. **`/rm/onboarding`** — CRM pre-fill, missing fields → **Client 360**.
3. **`/rm/goals`** — SMART templates → **Meeting** step 2 (what-if sliders).
4. Steps 3–6 — Risk, sleeves, products → **Push recap** → `/client-mobile?handoff=1`.
5. **`/rm/compliance`** — Embedded suitability flow + sealed docs.
6. **`/rm/learn`** — FPS catalogue (in-app), competency radar, career paths (GH / UEMOA / Lusophone), **Sync now** → HR L&D panel.
7. **`/rm/markets`** — Switch Ghana → Côte d’Ivoire → Angola.
8. Optional: **`/present/meeting`** for fullscreen client-facing walkthrough.

## Scope traceability

| # | Capability | Primary screen |
|---|------------|----------------|
| 1 | Goal planning & simulations | `/rm/goals`, `/rm/meeting` step 2 |
| 2 | CRM & lifecycle | `/rm/onboarding`, `/rm/client-360` |
| 3 | Investment & wealth | `/client?tab=investments` |
| 4 | Multi-country deployment | `/rm/markets` |
| 5 | Localized planning | `/rm/markets` |
| 6 | Compliance & suitability | `/rm/compliance` |
| 7 | Advisor enablement | `/rm/meeting` |
| 8 | Learning & uplift | `/rm/learn` (catalog, domains, HR sync, career paths) |
| 9 | Omnichannel | `/client-mobile` handoff |
| 10 | API-first | Integration health on 360 |
| 11 | AI insights | Insights panel on 360 |
| 12 | Security | `/login`, RBAC badge in RM shell |

## Build

```bash
npm run build
npm start
```

**Offline / USB demo** (static HTML in `out/`):

```bash
npm run build:static
npx serve out
```

Mock data: `src/lib/demo-data.ts` — replace with CRM, core banking, and risk adapters when implementing.
