-- =====================================================
-- Client Dashboard Database Schema Migration (Updated)
-- Created: 2025-01-21 - Updated to work with existing user_profiles
-- Description: Extends existing schema for client project management dashboard
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- EXTEND EXISTING USER_PROFILES TABLE
-- =====================================================

-- Add new columns to existing user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- Update the role constraint to include our new roles
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check CHECK (
    role IN ('user', 'admin', 'moderator', 'client', 'team_member')
);

-- =====================================================
-- CREATE NEW ENUMS (excluding user_role since we're using text)
-- =====================================================

-- Project status enum
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');

-- Invoice status enum
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- Payment method enum
CREATE TYPE payment_method AS ENUM ('credit_card', 'bank_transfer', 'paypal', 'check', 'crypto');

-- Time entry type enum
CREATE TYPE time_entry_type AS ENUM ('development', 'design', 'meeting', 'testing', 'deployment', 'consultation', 'other');

-- =====================================================
-- CREATE NEW TABLES
-- =====================================================

-- Projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    client_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- GitHub integration
    github_repo_url TEXT,
    github_repo_name TEXT, -- e.g., "user/repo"
    github_default_branch TEXT DEFAULT 'main',
    
    -- Project details
    status project_status DEFAULT 'planning',
    start_date DATE,
    end_date DATE,
    estimated_hours INTEGER,
    hourly_rate DECIMAL(10,2),
    fixed_price DECIMAL(10,2),
    
    -- Tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT projects_name_check CHECK (length(name) > 0),
    CONSTRAINT projects_hourly_rate_check CHECK (hourly_rate >= 0),
    CONSTRAINT projects_fixed_price_check CHECK (fixed_price >= 0)
);

-- Project team members (many-to-many relationship)
CREATE TABLE project_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'developer', -- developer, designer, project_manager, etc.
    can_track_time BOOLEAN DEFAULT true,
    can_view_financials BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, user_id)
);

-- Time tracking entries
CREATE TABLE time_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Time details
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    hours_worked DECIMAL(5,2) NOT NULL, -- Manual entry or calculated
    
    -- Entry details
    description TEXT NOT NULL,
    entry_type time_entry_type DEFAULT 'development',
    is_billable BOOLEAN DEFAULT true,
    hourly_rate DECIMAL(10,2), -- Rate at time of entry
    
    -- Metadata
    date_worked DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT time_entries_hours_check CHECK (hours_worked > 0 AND hours_worked <= 24),
    CONSTRAINT time_entries_description_check CHECK (length(description) > 0),
    CONSTRAINT time_entries_time_check CHECK (end_time IS NULL OR end_time > start_time)
);

-- Invoices
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Invoice details
    invoice_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Financial
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5,4) DEFAULT 0, -- e.g., 0.0825 for 8.25%
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status and dates
    status invoice_status DEFAULT 'draft',
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    sent_date DATE,
    paid_date DATE,
    
    -- Tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT invoices_amounts_check CHECK (
        subtotal >= 0 AND 
        tax_amount >= 0 AND 
        total_amount >= 0 AND
        total_amount >= subtotal
    )
);

-- Invoice line items (for detailed billing)
CREATE TABLE invoice_line_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    
    -- Line item details
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Optional reference to time entries
    time_entry_ids UUID[], -- Array of time entry IDs for this line item
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT invoice_line_items_positive_check CHECK (
        quantity > 0 AND 
        unit_price >= 0 AND 
        total_price >= 0
    )
);

-- Payments
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    method payment_method NOT NULL,
    transaction_id TEXT, -- External payment processor ID
    reference_number TEXT, -- Check number, transfer reference, etc.
    
    -- Payment processor details
    processor_name TEXT, -- stripe, paypal, etc.
    processor_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2),
    
    -- Dates
    payment_date DATE DEFAULT CURRENT_DATE,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Notes
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT payments_amount_check CHECK (amount > 0),
    CONSTRAINT payments_fee_check CHECK (processor_fee >= 0)
);

-- GitHub webhook events (for real-time updates)
CREATE TABLE github_webhook_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- GitHub event data
    event_type TEXT NOT NULL, -- push, pull_request, release, etc.
    commit_sha TEXT,
    commit_message TEXT,
    author_name TEXT,
    author_email TEXT,
    branch_name TEXT,
    
    -- Webhook payload (for debugging/audit)
    raw_payload JSONB,
    
    -- Processing status
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT github_events_event_type_check CHECK (length(event_type) > 0)
);

-- Project updates/milestones
CREATE TABLE project_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    
    -- Update content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    update_type TEXT DEFAULT 'general', -- milestone, status_change, general, etc.
    
    -- Visibility
    visible_to_client BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT project_updates_title_check CHECK (length(title) > 0),
    CONSTRAINT project_updates_content_check CHECK (length(content) > 0)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Projects
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_github_repo ON projects(github_repo_name);

-- Project members
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- Time entries
CREATE INDEX idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_date_worked ON time_entries(date_worked);
CREATE INDEX idx_time_entries_billable ON time_entries(is_billable);

-- Invoices
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Payments
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- GitHub events
CREATE INDEX idx_github_events_project_id ON github_webhook_events(project_id);
CREATE INDEX idx_github_events_timestamp ON github_webhook_events(event_timestamp);
CREATE INDEX idx_github_events_processed ON github_webhook_events(processed);

-- Project updates
CREATE INDEX idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX idx_project_updates_visible ON project_updates(visible_to_client);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on new tables (user_profiles already has RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Clients can view own projects" ON projects
    FOR SELECT USING (
        client_id = auth.uid() OR
        EXISTS(SELECT 1 FROM project_members WHERE project_id = projects.id AND user_id = auth.uid()) OR
        EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage all projects" ON projects
    FOR ALL USING (
        EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Time entries policies
CREATE POLICY "Users can view time entries for their projects" ON time_entries
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS(SELECT 1 FROM projects WHERE id = time_entries.project_id AND client_id = auth.uid()) OR
        EXISTS(SELECT 1 FROM project_members WHERE project_id = time_entries.project_id AND user_id = auth.uid()) OR
        EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Team members can insert own time entries" ON time_entries
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS(SELECT 1 FROM project_members WHERE project_id = time_entries.project_id AND user_id = auth.uid() AND can_track_time = true)
    );

-- Invoices policies
CREATE POLICY "Clients can view own invoices" ON invoices
    FOR SELECT USING (
        client_id = auth.uid() OR
        EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Invoice line items policies
CREATE POLICY "Users can view line items for accessible invoices" ON invoice_line_items
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM invoices 
            WHERE id = invoice_line_items.invoice_id AND (
                client_id = auth.uid() OR
                EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
            )
        )
    );

-- Payments policies
CREATE POLICY "Users can view payments for accessible invoices" ON payments
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM invoices 
            WHERE id = payments.invoice_id AND (
                client_id = auth.uid() OR
                EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
            )
        )
    );

-- GitHub events policies
CREATE POLICY "Users can view github events for their projects" ON github_webhook_events
    FOR SELECT USING (
        EXISTS(SELECT 1 FROM projects WHERE id = github_webhook_events.project_id AND client_id = auth.uid()) OR
        EXISTS(SELECT 1 FROM project_members WHERE project_id = github_webhook_events.project_id AND user_id = auth.uid()) OR
        EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Project updates policies
CREATE POLICY "Users can view updates for their projects" ON project_updates
    FOR SELECT USING (
        visible_to_client = true AND (
            EXISTS(SELECT 1 FROM projects WHERE id = project_updates.project_id AND client_id = auth.uid()) OR
            EXISTS(SELECT 1 FROM project_members WHERE project_id = project_updates.project_id AND user_id = auth.uid()) OR
            EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
        )
    );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_updates_updated_at BEFORE UPDATE ON project_updates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'MLS-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('invoice_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1000;

-- Function to automatically set invoice number if not provided
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number = generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invoice_number_trigger 
    BEFORE INSERT ON invoices
    FOR EACH ROW EXECUTE FUNCTION set_invoice_number();

-- =====================================================
-- INITIAL DATA / SEED DATA
-- =====================================================

-- Update your existing user to admin role (replace YOUR_USER_ID with your actual auth.users id)
-- UPDATE user_profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';

COMMENT ON TABLE projects IS 'Client projects with GitHub integration and financial tracking';
COMMENT ON TABLE time_entries IS 'Time tracking for billable and non-billable work';
COMMENT ON TABLE invoices IS 'Client invoices with automated numbering';
COMMENT ON TABLE github_webhook_events IS 'Real-time GitHub activity for client transparency';

-- =====================================================
-- END OF MIGRATION
-- =====================================================