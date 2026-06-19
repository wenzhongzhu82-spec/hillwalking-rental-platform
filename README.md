# 🏔️ SCIE Hillwalking Gear Rental & Exchange

The official gear rental platform for Shenzhen College of International Education (SCIE) students. Borrow and lend hillwalking equipment within the trusted school community — backpacks, waterproof gear, trekking poles, camping equipment, and more.

## Features

- **Marketplace** — Browse, search, and filter gear by category, price, and availability
- **Item Listings** — Post your gear with descriptions, photos, pricing, and safety notes
- **Rental Orders** — Request, accept, manage, and complete rentals with full status tracking
- **Messaging** — Chat directly with lenders and borrowers in-thread
- **Favorites** — Save items for later
- **Reviews & Ratings** — Rate your rental experience and build trust
- **Hillwalking Checklist** — Interactive gear preparation checklist with required/recommended/weather-specific categories
- **Rent Before Event** — Find gear available for your next hillwalking trip
- **Admin Panel** — Manage users, review items, handle reports, create announcements
- **Verified Community** — School email registration, in-campus pickup, admin moderation

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 with custom forest green + cream + orange theme
- **Database**: SQLite (local development)
- **ORM**: Prisma 7.8
- **Auth**: Custom cookie-based session management
- **Validation**: Zod v4
- **Icons**: lucide-react
- **State**: Zustand (client-side UI state)
- **Animation**: framer-motion
- **Toasts**: react-hot-toast

## Project Structure

```
hillwalking-rental-platform/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (auth, items, orders, messages, favorites)
│   ├── admin/              # Admin panel pages
│   ├── dashboard/          # User dashboard
│   ├── hillwalking/        # Hillwalking-specific pages
│   ├── items/[id]/         # Item detail page
│   ├── marketplace/        # Gear marketplace
│   ├── messages/           # Chat messages
│   ├── orders/             # Order management
│   └── ...                 # Login, register, rules, about, etc.
├── components/             # React components
│   ├── layout/             # Navbar, Footer
│   ├── ui/                 # Shared UI (Button, Badge, Avatar, etc.)
│   ├── items/              # Item card, grid
│   ├── orders/             # Order timeline
│   └── hillwalking/        # Hillwalking-specific components
├── lib/                    # Shared libraries
│   ├── auth.ts             # Password hashing
│   ├── constants.ts        # Enums, labels, locations
│   ├── credit-score.ts     # Credit & match scoring
│   ├── permissions.ts      # Role-based access control
│   ├── prisma.ts           # Prisma client singleton
│   ├── session.ts          # Cookie session management
│   ├── store.ts            # Zustand UI store
│   ├── utils.ts            # Utility functions
│   └── validations.ts      # Zod validation schemas
├── prisma/                 # Database schema & migrations
│   ├── schema.prisma       # Prisma schema (all models)
│   ├── seed.ts             # Seed data script
│   └── migrations/         # SQL migration files
└── public/                 # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Setup

```bash
# 1. Clone and enter the project
cd hillwalking-rental-platform

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev

# 6. Seed the database with sample data
DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts

# 7. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Accounts

All accounts use password: `password123`

| Role | Email | Description |
|---|---|---|
| Admin | `admin@scie.test` | Platform administrator |
| Teacher | `teacher@scie.test` | Teacher & club advisor |
| Lender | `lender@scie.test` | Student with items to rent |
| Borrower | `borrower@scie.test` | Student looking to rent |

Additional student accounts: `ryan.zhang@scie.test`, `sophie.li@scie.test`, etc. (all use `password123`)

## Environment Variables

See `.env.example` for all required variables:

```
DATABASE_URL="file:./dev.db"
SCHOOL_EMAIL_DOMAINS="@scie.test,@scie.com.cn,@stu.scie.com.cn"
NEXT_PUBLIC_APP_NAME="SCIE Hillwalking Gear Rental"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENABLE_REAL_PAYMENTS="false"
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run seed         # Run database seed script
npm run db:migrate   # Run Prisma migrations
npm run db:reset     # Reset database
npm run db:setup     # Full setup: generate + migrate + seed
```

## Core User Flows

### Borrower Flow
1. Browse marketplace or search for gear
2. View item details
3. Contact lender (creates message thread)
4. Request a rental (creates order)
5. Track order status through the pipeline
6. Leave a review after completion

### Lender Flow
1. Post gear with description, pricing, and availability
2. Receive rental requests
3. Accept or reject requests
4. Mark pickup/delivery status
5. Confirm return
6. Receive reviews and build reputation

### Admin Flow
1. Access `/admin` dashboard
2. Review pending items for approval
3. Manage users (verify, suspend, restore)
4. Handle reports and disputes
5. Create announcements

## Planned Future Work

- Real school email verification (SCIE domain)
- Real payment integration (stripe or similar)
- Mobile app (PWA)
- Advanced search filters
- Event-based gear recommendations
- Custom image upload with object storage

## Codex Collaboration Notes

This project was initialized by Claude Code and enhanced by Codex. The `codex-integration` branch contains:
- `CODEX_AUDIT.md` — Original project audit
- `CODEX_TASKS.md` — Task tracking board
- `CODEX_FINAL_REPORT.md` — Final integration report

## License

Internal use for SCIE students and staff.
