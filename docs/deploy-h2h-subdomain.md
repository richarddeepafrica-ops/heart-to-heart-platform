# Deploying h2h.techsasaonline.com

The platform is a server-rendered Next.js application. It needs a Node.js runtime and PostgreSQL; uploading the source to ordinary PHP-only shared hosting is not sufficient.

## 1. Hosting requirements

- Node.js 20 or newer
- PostgreSQL database reachable from the application server
- Ability to set environment variables
- Persistent HTTPS and a reverse proxy to the Node process
- At least 512 MB RAM; 1 GB or more is recommended for builds

If the HostAfrica package exposes **Setup Node.js App** in cPanel, it can host the application. Otherwise deploy the app to a managed Node host and point the subdomain there.

## 2. Production variables

Copy the keys from `.env.production.example` into the hosting environment. Do not upload the local `.env` file.

Required before launch:

- `NEXT_PUBLIC_SITE_URL=https://h2h.techsasaonline.com`
- Production `DATABASE_URL`
- Real `ADMIN_EMAIL` and a strong temporary `ADMIN_PASSWORD`
- A unique `ADMIN_SESSION_SECRET` of at least 32 random characters
- Daraja credentials and `MPESA_CALLBACK_URL=https://h2h.techsasaonline.com/api/payments/mpesa/callback`

Keep `MPESA_ENVIRONMENT=sandbox` until an end-to-end payment and callback test passes.

## 3. Build and database

Run from the application directory:

```bash
npm ci
npx prisma migrate deploy
npm run prisma:seed
npm run check:production
npm start
```

The host should set its assigned `PORT`; Next.js reads it automatically. The application listens on `0.0.0.0` so the hosting proxy can reach it.

After the first seed, change the administrator password through the staff workflow. Do not run the seed command casually against a populated production database because it also refreshes baseline demo records.

## 4. DNS

The subdomain is not currently published in DNS. Add one of these records where `techsasaonline.com` DNS is managed:

- Same HostAfrica server: an `A` record named `h2h` pointing to `102.209.117.236`.
- Managed Node host: the `CNAME` record supplied by that host, normally named `h2h`.

Do not create both records. When using cPanel on the current server, first create the Node application and use its documented application root, then add or map the subdomain to it.

## 5. HTTPS and verification

Issue an AutoSSL/Let's Encrypt certificate after DNS resolves. Then verify:

```text
https://h2h.techsasaonline.com/api/health
https://h2h.techsasaonline.com/admin/login
https://h2h.techsasaonline.com/shop
```

The health endpoint must return HTTP 200 with `database: connected`. Test admin login, one sandbox donation, the Daraja callback, email delivery, shop checkout, event registration, and PDF/CSV report downloads before showing the demo.
