# 🏔️ Hillwalking Rental Platform

**Peer-to-peer outdoor gear rental platform.** Rent hillwalking and outdoor equipment from people in your community — backpacks, waterproof gear, trekking poles, camping equipment, and more.

Originally designed for SCIE (Shenzhen College of International Education) students, now extendable to any community, school, or organization.

## ✨ Features

- **Public Registration** — Sign up with email or Google account. Anyone can join.
- **Community System** — Join communities (schools, clubs, cities). Browse gear within or across communities.
- **Marketplace** — Browse, search, and filter gear by category, price, availability, and community
- **Item Listings** — Post gear with descriptions, photos, pricing, safety notes, and availability dates
- **Rental Orders** — Full lifecycle: request → accept → pickup → use → return → review
- **Messaging** — In-app chat between borrowers and lenders per item
- **Notifications** — Real-time notification system with bell icon badge for order updates, messages, reviews
- **Favorites** — Save items for later
- **Reviews & Ratings** — Rate rental experiences with punctuality, accuracy, and communication scores
- **Credit Score System** — Dynamic credit score based on order history and reviews
- **Hillwalking Checklist** — Interactive gear preparation: Required, Recommended, Weather-Specific
- **Rent Before Event** — Enter a trip date, get recommended available items with match scores
- **Admin Panel** — Manage users, review items, handle reports, manage communities, create announcements
- **Email Verification** — Verify your email after registration
- **Password Reset** — Forgot password flow
- **Rate Limiting** — Login, register, message, and report rate limits
- **Terms of Service & Privacy Policy** — Legal pages for public deployment
- **Mobile Responsive** — Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | SQLite (dev) / PostgreSQL (production) |
| ORM | Prisma 7.8 |
| Auth | Custom session-based (bcrypt) |
| Validation | Zod v4 |
| Icons | lucide-react |
| State | Zustand |
| Animation | framer-motion |
| Toasts | react-hot-toast |

## 📁 Project Structure

```
hillwalking-rental-platform/
├── app/                    # Next.js App Router pages
│   ├── api/               # API route handlers (28+ endpoints)
│   ├── admin/             # Admin dashboard pages
│   ├── communities/       # Community list, detail, and creation
│   ├── hillwalking/       # Hillwalking-specific pages
│   ├── marketplace/       # Item browsing & search
│   ├── items/[id]/        # Item detail page
│   ├── orders/            # Order list & detail
│   ├── messages/          # Messaging interface
│   ├── notifications/     # Notification center
│   ├── dashboard/         # User dashboard
│   ├── my-items/          # Item management
│   ├── favorites/         # User favorites
│   ├── profile/[id]/      # User profile pages
│   ├── settings/          # User settings
│   ├── login/, register/  # Auth pages
│   ├── forgot-password/, reset-password/, verify-email/  # Auth flows
│   ├── terms/, privacy/   # Legal pages
│   └── rules/, about/     # Information pages
├── components/            # React components
│   ├── layout/           # Navbar, Footer
│   ├── ui/               # Button, Badge, Modal, Avatar, etc.
│   ├── items/            # ItemCard, ItemGrid, ItemFilterSidebar
│   ├── forms/            # ItemForm, LoginForm, RegisterForm, etc.
│   ├── orders/           # OrderCard, OrderTimeline
│   ├── messages/         # MessageBubble, MessageList, ChatWindow
│   ├── admin/            # AdminSidebar, AdminStatsCard
│   └── hillwalking/      # GearChecklistCard, HillwalkingHero
├── lib/                   # Shared libraries
│   ├── prisma.ts         # Database client
│   ├── session.ts        # Cookie-based auth sessions
│   ├── auth.ts           # Password hashing (bcrypt)
│   ├── validations.ts    # Zod schemas
│   ├── constants.ts      # App constants & enums
│   ├── permissions.ts    # Authorization checks
│   ├── credit-score.ts   # Credit score algorithm
│   ├── utils.ts          # Utility functions
│   └── store.ts          # Zustand UI + Auth store
├── prisma/
│   ├── schema.prisma     # Database schema (15+ models)
│   ├── seed.ts           # Seed data (30 items, 10 users, 10 orders, etc.)
│   └── migrations/       # Database migrations
├── public/
│   └── uploads/          # Local image uploads (dev only)
└── .env.example          # Environment variables template
```

## 🚀 Getting Started

### Local Development (SQLite)

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed with sample data
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample data |
| `npx prisma studio` | Open Prisma Studio GUI |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Run database migrations (dev) |
| `npx prisma migrate deploy` | Apply migrations (production) |

## 🔧 Environment Variables

Copy `.env.example` to `.env`:

### Development (SQLite)
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production (PostgreSQL)
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Email (SMTP)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your@email.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@your-domain.com"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Cloudinary (image upload)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_UPLOAD_PRESET="hillwalking-rental"
```

## 🔑 Test Accounts

All test accounts use password: **`password123`**

| Role | Email | Description |
|------|-------|-------------|
| Admin | admin@scie.test | Full admin access |
| Teacher | teacher@scie.test | Admin + teacher profile |
| Lender | lender@scie.test | User with items listed |
| Borrower | borrower@scie.test | Active borrower |
| Additional | lender1-4@scie.test, borrower1-3@scie.test | Student profiles |

## 📦 Database

### Schema (15+ models)

Key models: User, Item, Category, Order, MessageThread, Message, Review, Favorite, Report, Announcement, GearChecklistItem, UserGearChecklist, HillwalkingEvent, Community, VerificationToken, Session

### Migrations

```bash
# Development
npx prisma migrate dev --name description

# Production
npx prisma migrate deploy

# Reset (destroys data)
npx prisma migrate reset
```

## 🚢 Deploying to Vercel

### Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Set Up PostgreSQL
Choose a provider:
- **Supabase**: Create project → get connection string → add to Vercel env
- **Neon**: Create project → get connection string → add to Vercel env
- **Vercel Postgres**: Create from Vercel dashboard

### Step 3: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure build settings:
   - Framework: Next.js
   - Build command: `npx prisma generate && next build`
   - Output directory: `.next`

### Step 4: Set Environment Variables
In Vercel dashboard → Settings → Environment Variables, add ALL variables from `.env.example`:
- `DATABASE_URL` (required)
- `NEXT_PUBLIC_APP_URL` (required)
- Email/SMTP variables (for email verification)
- Google OAuth variables (for Google Sign-In)
- Cloudinary variables (for image uploads)

### Step 5: Deploy and Migrate
```bash
# After first deploy, run migration
npx prisma migrate deploy

# Create admin user (via Vercel CLI or API)
# Or run seed (for demo/dev data only)
npm run seed
```

### Step 6: Create Admin User
After deployment, either:
- Register normally and promote via database
- Or use the seed script (demo only)
- Or create a script to promote the first user to admin

## 🔮 Future Integrations

### Real Payments
The platform currently displays prices but does NOT process payments. To add payments:
1. Create a Stripe account
2. Add Stripe keys to environment variables
3. Implement payment intents in order creation flow
4. Add webhook handlers for payment status
5. Set `ENABLE_REAL_PAYMENTS=true`

### Email Provider
For email verification and password reset in production:
1. Sign up for an email service (Resend, SendGrid, AWS SES, or Nodemailer with SMTP)
2. Configure environment variables
3. Verification emails and password reset emails will be sent automatically

### Real-Time Messaging
Current messaging uses page refresh/polling. For real-time:
1. Use Pusher, Ably, or Socket.IO
2. Or use Vercel's server-sent events
3. Update ChatWindow component

### Google OAuth
The platform is prepared for Google Sign-In:
1. Create OAuth credentials in Google Cloud Console
2. Set redirect URI to `https://your-domain.com/api/auth/callback/google`
3. Add credentials to environment variables

### Image CDN
For production image handling:
1. Use Cloudinary (recommended) — configure env vars
2. Or use Supabase Storage — configure env vars
3. Or use Vercel Blob Storage

## 📝 License

This project is built as an open platform for outdoor gear rental. All rights reserved.

## 🆘 Support

For issues or questions, please file an issue on GitHub or contact the maintainer.
