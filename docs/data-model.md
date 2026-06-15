# Data Model Summary

The initial Prisma schema is in `prisma/schema.prisma`.

## Main Entities

- `User`: internal admin users with roles.
- `Donor`: individual or organizational supporters.
- `Donation`: payment records tied to donors, campaigns, or beneficiaries.
- `Campaign`: fundraising appeals with goals and statuses.
- `Beneficiary`: child sponsorship/care profiles with consent controls.
- `Event`: fundraising or awareness events.
- `EventRegistration`: event tickets, QR code, and check-in status.
- `CorporatePartner`: CSR and sponsorship pipeline.

## Privacy Rules

Beneficiary records should separate:

- Private internal identity fields.
- Public-safe profile fields.
- Guardian consent.
- Medical review.
- Story approval status.

No child profile should publish until it reaches `APPROVED`.

## Finance Rules

Donation records need:

- Payment method.
- Payment status.
- Receipt number.
- Campaign or beneficiary attribution.
- Reconciliation status.
- Source tracking.

Bank transfers should remain pending until finance approval.

## Marketing Rules

Donor communication must respect:

- Email opt-in.
- SMS opt-in.
- Anonymous donor preference.
- Child privacy and update approval status.

