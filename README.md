# Heart to Heart Foundation Platform

This folder is the production application scaffold for the Heart to Heart Foundation fundraising platform.

The existing static prototype remains one level up. This app is the beginning of the real system.

## Stack

- Next.js App Router
- TypeScript
- Prisma
- PostgreSQL
- Public assets copied from the prototype

## Local Setup

```powershell
npm install
copy .env.example .env
npm run db:up
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Then open:

```text
http://127.0.0.1:3000
```

## Current Scaffold

Implemented:

- Production app folder
- Next.js homepage shell
- Admin dashboard shell
- Admin login with signed HTTP-only sessions
- Shared brand header
- Shared campaign/progress components
- Typed content seed data
- Prisma schema for donations, donors, campaigns, events, beneficiaries, partners, payments, communications, marketing campaigns, and audit logs
- Docker Compose PostgreSQL setup for local development
- Prisma migration and seed script for admin user, campaigns, events, and partners
- Reusable Prisma client
- Preview-safe API routes for campaigns, donations, and marketing campaigns
- Preview-safe campaign creation from the admin campaign builder
- Database-backed admin campaign listing, editing, and archiving when `DATABASE_URL` is connected
- Database-backed contextual donations for campaigns, child sponsorships, event gifts, and event registrations
- Admin donations page backed by latest database donation records
- Sandbox-ready M-Pesa STK Push initiation and callback status handling
- Public donation status pages for pending, confirmed, and failed gifts
- Architecture and implementation documentation

Not implemented yet:

- Production authentication provider / password reset
- Full CMS/admin CRUD screens outside campaigns
- M-Pesa STK Push
- Card payments
- Email/SMS integrations
- File uploads
- Production deployment

## API Routes

- `GET /api/campaigns` returns campaign progress. Without `DATABASE_URL`, it serves preview data.
- `POST /api/campaigns` validates a campaign draft and creates it when the database is connected. Without `DATABASE_URL`, it returns a preview campaign response.
- `POST /api/donations` validates a donation request and creates a pending gift when the database is connected. It records campaign, child, event, and package context when provided. Without `DATABASE_URL`, it returns a preview donation response.
- `POST /api/payments/mpesa/callback` accepts Daraja STK callback payloads and updates payment/donation status.
- `POST /api/marketing-campaigns` creates a draft campaign for email, SMS, WhatsApp, social, or multi-channel outreach. Without `DATABASE_URL`, it returns a preview response.

## Local Admin Login

The seeded local admin user follows `.env`:

```text
Email: admin@hearttoheart.local
Password: change-this-password
```

Change these values before deploying anywhere public.

## Current Verification

The scaffold has passed:

```powershell
npm run typecheck
npm run build
npm run db:up
$env:DATABASE_URL='postgresql://heart_to-heart:heart_to-heart_dev@localhost:5433/heart_to_heart'; npx prisma validate
```

## Next Engineering Steps

1. Add Daraja sandbox credentials and test a real STK Push with a public callback URL.
2. Add receipt PDF/email generation after confirmed payments.
3. Add email, SMS, and WhatsApp provider integrations.
4. Build admin CRUD for events, beneficiaries, donors, partners, marketing, and reports.
5. Add role-aware admin access and production password reset.
