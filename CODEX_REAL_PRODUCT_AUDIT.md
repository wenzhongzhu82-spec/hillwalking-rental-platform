# Codex Real Product Audit

## Project Path
`/Users/evan/Desktop/hillwalking-rental-platform`
- Branch: `codex-integration`
- Last commits: `270ce99 Codex UI/function audit` → `25862a0 Codex integration`

## Goal
Verify the site is a real usable rental platform, not a static demo. Check every feature for real database integration, proper permissions, and complete user flows.

## Existing Reports Read
- `CODEX_UI_FUNCTION_AUDIT.md` ✅
- `CODEX_INTEGRATION_FIX_REPORT.md` ✅
- `CODEX_TASKS.md` ✅

## Build / Lint / Prisma Status
| Command | Status |
|---|---|
| `npm install` | ✅ |
| `npx prisma generate` | ✅ |
| `npx prisma migrate dev` | ✅ |
| `DATABASE_URL=... npx tsx prisma/seed.ts` | ✅ (33 items, 13 users, 10 orders) |
| `npm run build` | ✅ (passes cleanly) |
| `npm run lint` | ⚠️ 3 warnings (harmless React hooks patterns) |

## Data Source Verification Per Page

| Page | Data Source | Real API? |
|---|---|---|
| Home `/` | `fetch("/api/items")` | ✅ Real |
| Marketplace `/marketplace` | `fetch("/api/items?search=&categoryId=&sort=&page=")` | ✅ Real |
| Item Detail `/items/[id]` | `fetch("/api/items/${id}")` | ✅ Real |
| Login `/login` | `fetch("/api/auth/login")` | ✅ Real |
| Register `/register` | `fetch("/api/auth/register")` | ✅ Real |
| Dashboard `/dashboard` | `fetch("/api/auth/me")`, `fetch("/api/orders")`, `fetch("/api/messages/threads")` | ✅ Real |
| My Items `/my-items` | `fetch("/api/items?status=AVAILABLE")` + client filter by owner | ⚠️ Client-side owner filter |
| New Item `/my-items/new` | Form → `fetch("/api/items")` POST | ✅ Real |
| Edit Item `/my-items/[id]/edit` | Needs checking | ? |
| Orders `/orders` | Server-side `prisma.order.findMany()` | ✅ Real |
| Order Detail `/orders/[id]` | Server-side `prisma.order.findUnique()` | ✅ Real |
| Messages `/messages` | Server-side `prisma.messageThread.findMany()` | ✅ Real |
| Message Thread `/messages/[threadId]` | Needs checking | ? |
| Favorites `/favorites` | `fetch("/api/favorites")` | ✅ Real |
| Rules `/rules` | Static content | ✅ (no data needed) |
| About `/about` | Static content | ✅ |
| Profile `/profile/[id]` | Needs checking | ? |

## Admin Pages

| Page | Data Source | Real API? |
|---|---|---|
| `/admin` | Server-side `prisma` queries | ✅ Real |
| `/admin/items` | `fetch("/api/admin/items")` | ✅ Real |
| `/admin/users` | `fetch("/api/admin/users")` | ✅ Real |
| `/admin/reports` | `fetch("/api/reports/${id}")` | ✅ Real |
| `/admin/announcements` | Needs checking | ? |

## Hillwalking Pages

| Page | Data Source | Real API? |
|---|---|---|
| `/hillwalking` | Needs checking | ? |
| `/hillwalking/checklist` | `fetch("/api/hillwalking/checklist")` | ✅ Real |
| `/hillwalking/rent-before-event` | Static? MatchScore computed client-side? | ⚠️ Needs check |
| `/hillwalking/my-preparation` | `fetch("/api/hillwalking/checklist")` | ✅ Real |

## Issues Found

### P1 — Critical (Real functionality gaps)
1. **`app/my-items/page.tsx` filters by owner on client side** — fetches ALL items then filters. Should add `ownerId` param to items API.
2. **No Privacy page** — linked from Footer but doesn't exist (404).
3. **No Contact page** — linked from Footer but doesn't exist (404).
4. **Permissions.ts completely unused** — `lib/permissions.ts` exists with comprehensive functions but zero imports across the codebase.

### P2 — Important (Verification needed)
5. **Message thread page** — needs verification that it correctly fetches and displays messages.
6. **Edit Item page** — needs verification that it loads item data and updates correctly.
7. **Admin announcements page** — needs verification of real CRUD.
8. **Hillwalking landing page** — needs check for real vs static content.
9. **Rent Before Event page** — matchScore appears computed from fetched data but needs verification.
10. **Profile page** — needs verification.

### P3 — Polish
11. MyItemsContent and MyItems page are duplicate/similar — could be consolidated
12. Footer links to `/privacy` and `/contact` but these pages don't exist
13. No mobile layout verification done

## Permission Issues
- `lib/permissions.ts` comprehensive but not imported anywhere
- Each API route has inline permission checks (e.g., `session.role !== "ADMIN"`) — works but inconsistent
- No suspended user check in any API route

## Priority Fix Plan
1. Create `/privacy` page
2. Add `ownerId` filter to items API
3. Create `/hillwalking` landing page if missing
4. Verify message thread page
5. Verify edit item page
6. Wire permissions.ts into key API routes
7. Fix Footer links
8. Update README
