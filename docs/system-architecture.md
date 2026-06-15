# Heart to Heart Foundation Production Architecture

## Goal

Build a fundraising operating system, not only a website.

The platform should support:
- Public website and content.
- Donations and recurring giving.
- Campaign landing pages.
- Sponsor-a-child journeys.
- Events registration and QR check-in.
- Corporate giving and partner pipeline.
- Donor CRM.
- Marketing automation.
- Finance reconciliation.
- Public impact reporting.

## Recommended Stack

- Frontend: Next.js App Router with TypeScript.
- Backend: Next.js server actions/API routes for the first version.
- Database: PostgreSQL.
- ORM: Prisma.
- CMS: either Payload CMS, Directus, or custom admin modules depending on team needs.
- Payments: M-Pesa STK Push first, then card provider, then bank transfer proof workflow.
- Messaging: email and SMS provider integration.
- Analytics: GA4, Meta Pixel, LinkedIn Insight Tag, plus server-side campaign attribution.

## Core Modules

1. Public Site
   - Home, about, programs, impact, stories, reports, partners.

2. Fundraising
   - One-time donations.
   - Monthly donations.
   - Campaign-specific donations.
   - Beneficiary-specific sponsorship.
   - Receipts.

3. Campaigns
   - Campaign builder.
   - Goal/progress tracking.
   - UTM/source links.
   - Campaign performance reports.

4. Events
   - Event pages.
   - Ticket products.
   - Registration and payment.
   - QR tickets.
   - Check-in.
   - Post-event reports.

5. Donor CRM
   - Donor profiles.
   - Segments.
   - Giving history.
   - Communication preferences.
   - Follow-up tasks.

6. Beneficiary Management
   - Private profile fields.
   - Public-safe story fields.
   - Guardian consent.
   - Medical review.
   - Approval workflow.

7. Corporate Giving
   - Sponsorship tiers.
   - Partner inquiries.
   - CSR pipeline.
   - Partner reports.

8. Finance
   - Payment queue.
   - Reconciliation.
   - Receipt status.
   - Exports.

9. Impact Reporting
   - Public dashboard.
   - Annual reports.
   - Campaign ROI.
   - Event ROI.
   - Board-ready summaries.

