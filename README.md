# PolarExt — Zero-Backend Chromium & Firefox MV3 + Polar.sh Starter Kit (v1.2.0)

[![PolarExt — Zero-Backend Chromium & Firefox MV3 + Polar.sh Starter Kit](./og-card.png)](https://jas845323.github.io/polarext/)

**Lemon Squeezy is sunsetting license key validation on March 31, 2027 (Stripe Managed Payments migration launches Dec 2, 2026 without built-in license keys).**

**PolarExt v1.2.0** is a production-hardened Manifest V3 starter kit for monetizing **Chrome, Edge, Brave, Arc & Firefox** extensions directly with **Polar.sh** — zero backend server, zero database, zero monthly infra bills, and **29 automated Vitest tests**.

### Live Links & Free Technical Resources
- **Live Storefront & Interactive In-Browser Extension Simulator:** https://jas845323.github.io/polarext/
- **Interactive Lemon Squeezy → Polar.sh `#swap` Migration Console:** https://jas845323.github.io/polarext/#swap
- **Complete Zero-Backend Migration Guide (API Mapping + MV3 Gotchas):** https://jas845323.github.io/polarext/lemon-squeezy-to-polar-migration.html
- **dev.to Deep-Dive Article:** https://dev.to/jas845323/migrating-an-mv3-chrome-extension-from-lemon-squeezy-to-polarsh-zero-backend-api-mapping--917
- **Privacy Policy (Chrome Web Store Ready):** https://jas845323.github.io/polarext/privacy.html
- **Complete Commercial Starter Kit (`$19` USD one-time launch price, regular `$29`):** https://buy.polar.sh/polar_cl_JOUtaxug7idO6T32vNYuAYgL67hf6MvtT37IR3iRD2N

---

## Lemon Squeezy → Polar.sh Quick Endpoint Mapping

Polar.sh exposes unauthenticated Customer Portal license endpoints requiring only your public `organization_id` UUID (no secret API tokens in your extension bundle):

| Action | Lemon Squeezy (`api.lemonsqueezy.com`) | Polar.sh (`api.polar.sh`) |
| :--- | :--- | :--- |
| Activate | `POST /v1/licenses/activate` | `POST /v1/customer-portal/license-keys/activate` |
| Validate | `POST /v1/licenses/validate` | `POST /v1/customer-portal/license-keys/validate` |
| Deactivate | `POST /v1/licenses/deactivate` | `POST /v1/customer-portal/license-keys/deactivate` |

- `Content-Type`: `application/x-www-form-urlencoded` → `application/json`
- `license_key` → `key` + required `organization_id` (+ optional `benefit_id` to prevent cross-tier key reuse)
- `instance_name` → `label` (required on `/activate`)
- `instance_id` → `activation_id`

---

## What's Inside PolarExt v1.2.0?

- **Hardened Zero-Backend Polar.sh License Engine (`src/lib/polar-license.ts`):** Direct `/activate`, `/validate`, `/deactivate` calls, optional `benefit_id` tier lock, seat limits, metered usage (`increment_usage`), daily `chrome.alarms` revalidation, and a **72-hour offline grace window with monotonic backwards-clock tamper protection**.
- **Daily UTC Free-Trial Quota (`src/lib/trial-quota.ts`):** Local freemium action limiter with automatic Pro unlock bypass.
- **Cross-Browser MV3 (Chromium + Firefox):** `npm run build` (`dist/`) and `npm run build:firefox` (`dist-firefox/` with automated `sidebar_action`, `background.scripts`, and `browser_specific_settings.gecko` transforms).
- **Working Reference Extension (SEO & Link Security Inspector):** Popup, 4-tab Side Panel, `Alt+Shift+P` shortcut, Options page with System/Light/Dark override, 10-page local history, and CSV / JSON / Markdown export.
- **AI Coding-Agent Guardrails:** Ships with `AGENTS.md`, `CLAUDE.md`, and `.cursor/rules/polarext-mv3.mdc` tuned for MV3 CSP safety and Polar API contracts.
- **Turnkey Release Pipeline:** `npm run setup` atomic rebranding CLI, `npm run verify` (**7 test files / 29 passing Vitest tests** + strict TypeScript + Chrome & Firefox builds + CWS ZIP), and high-res store asset generators (`16/32/48/128` icons, `1280x800` screenshots, `1200x630` OG card).

## Commercial License Pricing

- **All-Inclusive Launch Price (First 20 Copies):** **~~$29~~ $19 USD one-time** (instant `polarext-starter-kit-v1.2.0-source.zip` download + private GitHub repository access + v1.x updates; build unlimited personal or client extensions).
