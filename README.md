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
npm run prisma:generate
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
- Shared brand header
- Shared campaign/progress components
- Typed content seed data
- Prisma schema for donations, donors, campaigns, events, beneficiaries, partners, payments, communications, marketing campaigns, and audit logs
- Reusable Prisma client
- Preview-safe API routes for campaigns, donations, and marketing campaigns
- Preview-safe campaign creation from the admin campaign builder
- Architecture and implementation documentation

Not implemented yet:

- Authentication
- Live database provisioning and migrations
- Full CMS/admin CRUD screens
- M-Pesa STK Push
- Card payments
- Email/SMS integrations
- File uploads
- Production deployment

## API Routes

- `GET /api/campaigns` returns campaign progress. Without `DATABASE_URL`, it serves preview data.
- `POST /api/campaigns` validates a campaign draft and creates it when the database is connected. Without `DATABASE_URL`, it returns a preview campaign response.
- `POST /api/donations` validates a donation request and creates a pending gift when the database is connected. Without `DATABASE_URL`, it returns a preview donation response.
- `POST /api/marketing-campaigns` creates a draft campaign for email, SMS, WhatsApp, social, or multi-channel outreach. Without `DATABASE_URL`, it returns a preview response.

## Current Verification

The scaffold has passed:

```powershell
npm run typecheck
npm run build
$env:DATABASE_URL='postgresql://user:password@localhost:5432/heart_to_heart'; npx prisma validate
```

## Next Engineering Steps

1. Connect PostgreSQL and run Prisma migration.
2. Add authentication and role-based admin access.
3. Convert donation checkout from prototype into real Next.js routes/actions.
4. Implement M-Pesa STK Push and callback handling.
5. Add email, SMS, and WhatsApp provider integrations.
6. Build admin CRUD for campaigns, events, beneficiaries, donors, partners, marketing, and reports.
