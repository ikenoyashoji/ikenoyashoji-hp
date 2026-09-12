-- Non-destructive attribution foundation. Run this migration separately during
-- deployment; application startup intentionally performs no DDL.
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS attribution text DEFAULT '{}';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS first_touch_at timestamp;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS current_touch_at timestamp;

ALTER TABLE page_views ADD COLUMN IF NOT EXISTS attribution text DEFAULT '{}';
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS first_touch_at timestamp;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS current_touch_at timestamp;

ALTER TABLE events ADD COLUMN IF NOT EXISTS attribution text DEFAULT '{}';
ALTER TABLE events ADD COLUMN IF NOT EXISTS first_touch_at timestamp;
ALTER TABLE events ADD COLUMN IF NOT EXISTS current_touch_at timestamp;