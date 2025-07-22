-- =====================================================
-- ROLLBACK: Extended Client Dashboard Schema
-- Created: 2025-01-21
-- Description: Rollback script for extended client dashboard schema
-- =====================================================

-- WARNING: This will permanently delete all client dashboard data!

-- Drop triggers first
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_time_entries_updated_at ON time_entries;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
DROP TRIGGER IF EXISTS update_project_updates_updated_at ON project_updates;
DROP TRIGGER IF EXISTS set_invoice_number_trigger ON invoices;

-- Drop functions (but keep update_updated_at_column as it might be used elsewhere)
DROP FUNCTION IF EXISTS generate_invoice_number();
DROP FUNCTION IF EXISTS set_invoice_number();

-- Drop sequence
DROP SEQUENCE IF EXISTS invoice_number_seq;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS project_updates;
DROP TABLE IF EXISTS github_webhook_events;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoice_line_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS time_entries;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;

-- Drop custom types (but not user_role since we didn't create it)
DROP TYPE IF EXISTS project_status;
DROP TYPE IF EXISTS invoice_status;
DROP TYPE IF EXISTS payment_method;
DROP TYPE IF EXISTS time_entry_type;

-- Revert user_profiles table changes
ALTER TABLE user_profiles 
DROP COLUMN IF EXISTS company_name,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS timezone;

-- Restore original role constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check CHECK (
    role = ANY (ARRAY['user'::text, 'admin'::text, 'moderator'::text])
);

COMMENT ON SCHEMA public IS 'Client dashboard extensions have been rolled back';

-- =====================================================
-- END OF ROLLBACK
-- =====================================================