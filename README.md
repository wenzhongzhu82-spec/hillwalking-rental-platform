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

## 🚢 生产环境部署

### 📋 部署前准备清单

在上线之前，你需要完成以下几个步骤，每个步骤大约需要 5-15 分钟。

---

### 第一步：创建 PostgreSQL 数据库

Vercel 的 Serverless 函数**不能**使用本地 SQLite 文件。你需要一个云端的 PostgreSQL 数据库。

**推荐方案：Supabase（免费额度足够）**

1. 打开 [supabase.com/dashboard](https://supabase.com/dashboard)
2. 注册或登录 Supabase
3. 点击 **"New project"**
4. 填入：
   - **Name**: `hillwalking-rental`
   - **Database Password**: 自己设一个密码，**务必记住**
   - **Region**: 选 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`，离中国大陆最近
5. 点击 **"Create new project"**，等 2-3 分钟创建完成
6. 进入项目后，左侧菜单 → **Settings** → **Database**
7. 找到 **Connection string** 区域，选择 **URI** 标签，**Session** 模式
8. 复制连接字符串，长得像这样：
   ```
   postgresql://postgres.[项目ID]:[你的密码]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```
9. 在末尾加上 `?sslmode=require`，变成：
   ```
   postgresql://postgres.[项目ID]:[你的密码]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require
   ```

---

### 第二步：部署前代码修改

⚠️ **重要**：部署前需要改一个文件。把 `prisma/schema.prisma` 第 6 行的 `provider` 从 `"sqlite"` 改成 `"postgresql"`：

```prisma
datasource db {
  provider = "postgresql"   // ← 把 sqlite 改成 postgresql
}
```

然后提交这个改动：
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

---

### 第三步：在 Vercel 上部署

1. 打开 [vercel.com/new](https://vercel.com/new)
2. 用 GitHub 账号登录
3. 找到 `hillwalking-rental-platform` 仓库，点击 **Import**
4. 配置：
   - **Framework Preset**: Next.js（会自动检测）
   - **Build Command**: `npx prisma generate && next build`
   - **Output Directory**: `.next`
5. 展开 **Environment Variables**，添加以下变量：
   - `DATABASE_URL` = 第一步复制的 PostgreSQL 连接字符串
   - `NEXT_PUBLIC_APP_URL` = `https://你的项目名.vercel.app`
   - `NEXTAUTH_SECRET` = 随机32位字符串（随便打一串乱码）
   - `NODE_ENV` = `production`
6. 点击 **Deploy**
7. 等待 2-3 分钟
8. ⚠️ **第一次部署会失败** — 因为数据库表还没创建。这是正常的。

---

### 第四步：运行数据库迁移

部署后，本地终端执行：

```bash
cd ~/Desktop/hillwalking-rental-platform

# 用 Supabase 连接字符串运行迁移
# 把下面的 URL 替换成你第一步复制的连接字符串
DATABASE_URL="postgresql://postgres.xxx:密码@aws-xxx.pooler.supabase.com:5432/postgres?sslmode=require" npx prisma migrate deploy
```

看到 `All migrations have been successfully applied` 就算成功。

---

### 第五步：创建管理员账号

1. 打开 Vercel 项目 → **Deployments** → 点击最新的部署 → 点击 **Redeploy** 重新部署
2. 这次部署应该成功
3. 打开你的网站 `https://你的项目名.vercel.app`
4. 点击 **Register** 注册一个新账号
5. 登录后，打开 Supabase 项目 → 左侧 **SQL Editor**
6. 输入并执行：
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = '你刚注册的邮箱';
   ```
7. 刷新页面，你应该能看到 Admin 入口

---

### 第六步（可选）：配置邮件服务

推荐 **Resend**（免费 100 封/天）：

1. 注册 [resend.com](https://resend.com)
2. 获取 API Key
3. 在 Vercel 项目 → Settings → Environment Variables 添加：
   ```
   EMAIL_SERVER_HOST="smtp.resend.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="resend"
   EMAIL_SERVER_PASSWORD="re_xxxxxxxxxx"  (你的 Resend API Key)
   EMAIL_FROM="Hillwalking Rental <noreply@你的域名.com>"
   ```

---

### 第七步（可选）：配置 Cloudinary 图片存储

1. 注册 [cloudinary.com](https://cloudinary.com)（免费）
2. 获取 Cloud name、API Key、API Secret
3. 在 Vercel 环境变量中添加

如果不配，图片上传功能在生产环境不可用。

---

### 第八步（可选）：配置 Google 登录

1. 打开 [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)
2. 创建 OAuth 2.0 客户端 ID，选择 Web application
3. 添加重定向 URI：`https://你的域名.vercel.app/api/auth/callback/google`
4. 在 Vercel 环境变量中添加 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`

---

### 本地开发

```bash
cd ~/Desktop/hillwalking-rental-platform
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
# 打开 http://localhost:3000
```

### 测试账号（seed 数据）

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@scie.test | password123 |
| 老师 | teacher@scie.test | password123 |
| 出租者 | lender@scie.test | password123 |
| 租借者 | borrower@scie.test | password123 |
