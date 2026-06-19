# Codex UI & Function Audit

## Project Path
`/Users/evan/Desktop/hillwalking-rental-platform`
- Branch: `codex-integration`
- Last commit: `25862a0 Codex integration: audit + complete core rental platform`

## Current State

### Build Status
- `npm run build` — ✅ **PASSES** (TypeScript + Turbopack, 30 static pages)
- `npm run lint` — not yet tested
- `npx prisma generate` — ✅ works with adapter
- `npx prisma migrate dev` — ✅ works (3 migrations)
- `npm run dev` — ✅ starts correctly but background processes die between `exec_command` calls

### Pages: 28 total
- Home, Login, Register, Marketplace, Item Detail, Dashboard, My Items, New Item, Edit Item, Orders, Order Detail, Messages, Message Thread, Favorites, Profile, Rules, About, 404, Forbidden
- Admin: Dashboard, Items, Users, Reports, Announcements, Settings
- Hillwalking: Landing, Checklist, Rent Before Event, My Preparation

### API Routes: 23 total
- Auth (login, register, me, logout)
- Items (list, detail)
- Orders (list, create, detail/update)
- Messages (threads, messages)
- Favorites (list, add, remove)
- Reviews (create)
- Reports (create, update)
- Admin (stats, items, users, announcements)
- Hillwalking (checklist, recommendations)
- Upload

### Components: 39 total
- Layout: Navbar, Footer
- UI: Button, Badge, StatusBadge, RatingStars, VerifiedBadge, Avatar, EmptyState, ConfirmDialog, LoadingSkeleton, Modal, Pagination, SearchBar, Toast, badges, loading
- Items: ItemCard, ItemCardSkeleton, ItemGrid, ItemFilterSidebar, ImageGallery, ItemActions, OwnerCard
- Orders: OrderCard, OrderTimeline
- Messages: ChatWindow, MessageBubble, MessageList
- Forms: ItemForm, LoginForm, RegisterForm, RentalRequestForm, ReportForm, ReviewForm
- Admin: AdminSidebar, AdminStatsCard
- Hillwalking: GearChecklistCard, HillwalkingHero

## Claude Work Detected
- All API routes have real prisma + session usage
- Most pages use `fetch()` to call API routes — not mock data ✅
- Comprehensive Prisma schema (all required models + enums)
- Form components exist but need checking for validation integration
- Hilwalking feature pages (checklist, rent-before-event, my-preparation)
- Admin panel with full layout, sidebar, stats

## Codex Previous Work Detected
- `lib/permissions.ts` — created, comprehensive set of permission functions
- `prisma/seed.ts` — 33 items, 13 users, 10 orders, reviews, reports, announcements, checklist
- Homepage, Login, Register, Marketplace, Item Detail, Dashboard, Favorites, Orders, Messages pages
- UI components: Button, StatusBadge, Badge, RatingStars, VerifiedBadge, Avatar, EmptyState
- `components/ui/badges.tsx`, `components/ui/loading.tsx`
- `app/api/favorites/route.ts`, `app/api/messages/[threadId]/messages/route.ts`
- Fixed Prisma 7 adapter config, added Session model to schema

## UI Issues Found

### P1 — Critical
- **No shared auth state** — every page independently calls `/api/auth/me`, no Zustand auth store, no `useAuth` hook. This causes duplicate requests and inconsistent auth state.
- **Permissions.ts unused** — lib/permissions.ts exists but zero imports across the codebase. API routes have inline permission checks instead.

### P2 — Important  
- **Credit score unused** — `calculateCreditScore` and `calculateMatchScore` defined in lib/credit-score.ts but never imported/called. Users have creditScore fields but they never update.
- **Store.ts only has UI state** — Zustand store has no auth/user state. Navbar fetches auth independently.
- **Duplicate status badge files** — `components/ui/StatusBadge.tsx` (default export) and `components/ui/badges.tsx` (named export) have overlapping functionality.

### P3 — Polish
- **Loading skeletons exist but inconsistently used** — ItemCardSkeleton exists but ItemGrid may not use it
- **Toast usage varies** — some pages use react-hot-toast, others may not show feedback
- **Mobile responsiveness uncertain** — not all pages verified on mobile breakpoints

## Function Issues Found

### P1 — Critical
- **Profile page may not display reviews** — `app/profile/[id]/page.tsx` imports components that might not exist
- **Credit score never updated after reviews** — review creation doesn't call credit score recalculation
- **Admin stats API** — might be missing some stats the frontend expects

### P2 — Important
- **Favorites check on item detail** — my `app/items/[id]/page.tsx` calls `/api/favorites?itemId=...` for favorite status
- **Hillwalking recommendations** — API exists but frontend page might not call it
- **Item posting violation check** — lib/validations.ts exists but no keyword banning integrated

## Database Issues Found
- `_Session` table added via Prisma model — works
- Seed data comprehensive — 33 items, 13 users
- Schema has all required models ✅

## Permission Issues Found
- **Permissions.ts unused** — the file exists and is comprehensive, but API routes use inline checks instead
- Each API route checks `session.role !== "ADMIN"` manually rather than using `canViewAdmin(user)` 
- No suspended user checks in any API route

## Build/Lint Issues Found
- Build passes ✅
- TypeScript strict mode enabled ✅
- No lint tested yet

## Priority Fix Plan

1. **Fix Immediately**
   - Create `useAuth` hook with Zustand store for centralized auth state
   - Wire up permissions.ts in at least admin API routes
   - Add suspended user checking

2. **Fix Next**
   - Integrate credit score updates when reviews are created
   - Add violation keyword check to item posting
   - Ensure all pages have loading/empty/error states

3. **Polish**
   - Verify mobile layouts on key pages
   - Standardize toast usage
   - Clean up duplicate component exports
