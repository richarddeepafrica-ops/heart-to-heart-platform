# Launch Checklist

Use this before putting the Heart to Heart platform on a public domain.

## Required Production Environment

- `DATABASE_URL`: production PostgreSQL connection string.
- `ADMIN_EMAIL`: first administrator email.
- `ADMIN_PASSWORD`: temporary seed password, changed after first login.
- `ADMIN_SESSION_SECRET`: unique secret, at least 32 characters.
- `NEXT_PUBLIC_SITE_URL`: public HTTPS site URL.
- `MPESA_CONSUMER_KEY`: Daraja app consumer key.
- `MPESA_CONSUMER_SECRET`: Daraja app consumer secret.
- `MPESA_ENVIRONMENT`: `sandbox` for testing, `production` for live.
- `MPESA_SHORTCODE`: live/sandbox shortcode.
- `MPESA_PASSKEY`: Daraja Lipa Na M-Pesa passkey.
- `MPESA_CALLBACK_URL`: public HTTPS callback URL ending in `/api/payments/mpesa/callback`.

## Pre-Launch Commands

```powershell
npm install
npm run prisma:generate
npm run typecheck
npm run build
$env:NODE_ENV="production"; npm run check:readiness
```

Run migrations against the production database before launch:

```powershell
npx prisma migrate deploy
npm run prisma:seed
```

## Payment Readiness

- Confirm Daraja credentials belong to the correct shortcode.
- Confirm `MPESA_CALLBACK_URL` is reachable from the public internet.
- Make one sandbox STK Push and confirm the donation moves from `PENDING` to `CONFIRMED`.
- Confirm finance can reconcile, fail, and refund test donations from `/admin/finance`.
- Confirm receipt numbers appear on `/donations/[id]/status`.

## Admin Readiness

- Change `ADMIN_PASSWORD` from the local default.
- Use a strong `ADMIN_SESSION_SECRET`.
- Confirm `/admin` redirects to `/admin/login` when logged out.
- Confirm protected admin APIs reject unauthenticated requests.
- Review `/admin/reports` and download the fundraising CSV.

## Known Post-Launch Enhancements

- Add production password reset.
- Add role-aware admin permissions.
- Add receipt PDF/email delivery.
- Add SMS/WhatsApp provider integrations.
- Add editable event package records for capacity, publish, pause, and archive controls.
