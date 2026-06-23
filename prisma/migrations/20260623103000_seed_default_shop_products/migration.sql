INSERT INTO "MerchandiseProduct"
  ("id", "slug", "name", "category", "description", "imageUrl", "price", "stockQuantity", "status", "featured", "causeLabel", "updatedAt")
VALUES
  ('preview-heart-run-tee', 'heart-run-t-shirt', 'Heart Run T-shirt', 'Apparel', 'A soft foundation T-shirt for Heart Run supporters, school teams, and community champions.', '/assets/shop/heart-run-t-shirt.png', 1500, 120, 'ACTIVE', true, 'Supports children awaiting heart care', NOW()),
  ('preview-foundation-cap', 'foundation-cap', 'Foundation Cap', 'Accessories', 'A branded cap for events, volunteer days, and everyday support of the foundation mission.', '/assets/shop/foundation-cap.png', 900, 80, 'ACTIVE', false, 'Supports prevention outreach', NOW()),
  ('preview-run-bottle', 'heart-run-water-bottle', 'Heart Run Water Bottle', 'Event gear', 'Reusable event bottle for walkers, runners, and teams raising awareness for young hearts.', '/assets/shop/heart-run-water-bottle.png', 1200, 60, 'ACTIVE', false, 'Supports Heart Run fundraising', NOW()),
  ('preview-supporter-tote', 'supporter-tote-bag', 'Supporter Tote Bag', 'Accessories', 'A clean, practical tote for supporters who want daily visibility for the cause.', '/assets/shop/supporter-tote-bag.png', 1800, 45, 'ACTIVE', true, 'Supports treatment and follow-up care', NOW())
ON CONFLICT ("slug") DO NOTHING;
