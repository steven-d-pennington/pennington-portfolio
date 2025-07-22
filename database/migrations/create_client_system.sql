-- Client System Migration: Separate clients from users
-- This creates a proper business entity structure for client management

-- 1. Create client_companies table
CREATE TABLE IF NOT EXISTS client_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    address TEXT,
    phone TEXT,
    email TEXT, -- Main company email
    billing_address TEXT,
    tax_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
    owner_contact_id UUID, -- Will reference client_contacts(id) - set after contact creation
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create client_contacts table  
CREATE TABLE IF NOT EXISTS client_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_company_id UUID NOT NULL REFERENCES client_companies(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    title TEXT, -- Job title
    department TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'tech', 'media', 'finance', 'member')),
    is_primary_contact BOOLEAN DEFAULT false,
    is_billing_contact BOOLEAN DEFAULT false,
    can_manage_team BOOLEAN DEFAULT false, -- Only owner + system admins can add contacts
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Add foreign key constraint from companies back to owner contact
ALTER TABLE client_companies 
ADD CONSTRAINT fk_owner_contact 
FOREIGN KEY (owner_contact_id) REFERENCES client_contacts(id);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_companies_status ON client_companies(status);
CREATE INDEX IF NOT EXISTS idx_client_companies_company_name ON client_companies(company_name);
CREATE INDEX IF NOT EXISTS idx_client_contacts_company_id ON client_contacts(client_company_id);
CREATE INDEX IF NOT EXISTS idx_client_contacts_email ON client_contacts(email);
CREATE INDEX IF NOT EXISTS idx_client_contacts_role ON client_contacts(role);

-- 5. Add column to projects table to reference client companies
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS client_company_id UUID REFERENCES client_companies(id);

-- 6. Create index for project-client relationship
CREATE INDEX IF NOT EXISTS idx_projects_client_company_id ON projects(client_company_id);

-- 7. Row Level Security (RLS) Policies
ALTER TABLE client_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;

-- Policy: System admins can see all client companies
CREATE POLICY "System admins can view all client companies" 
ON client_companies FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role IN ('admin', 'team_member')
    )
);

-- Policy: System admins can manage all client companies
CREATE POLICY "System admins can manage client companies" 
ON client_companies FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role IN ('admin', 'team_member')
    )
);

-- Policy: System admins can see all client contacts
CREATE POLICY "System admins can view all client contacts" 
ON client_contacts FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role IN ('admin', 'team_member')
    )
);

-- Policy: System admins can manage all client contacts
CREATE POLICY "System admins can manage all client contacts" 
ON client_contacts FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role IN ('admin', 'team_member')
    )
);

-- Policy: Client contacts can only see contacts from their own company
-- (This will be used when we add client dashboard access later)
CREATE POLICY "Client contacts can view own company contacts" 
ON client_contacts FOR SELECT 
TO authenticated 
USING (
    -- Allow if user is a client contact viewing their own company
    client_company_id IN (
        SELECT cc.client_company_id 
        FROM client_contacts cc 
        JOIN user_profiles up ON cc.email = up.email 
        WHERE up.id = auth.uid()
    )
);

-- Policy: Only company owners can add new contacts to their company
-- (This will be used when we add client dashboard access later)
CREATE POLICY "Company owners can manage their team" 
ON client_contacts FOR INSERT 
TO authenticated 
WITH CHECK (
    -- Allow if user is the company owner
    client_company_id IN (
        SELECT cc.client_company_id 
        FROM client_contacts cc 
        JOIN user_profiles up ON cc.email = up.email 
        WHERE up.id = auth.uid() 
        AND cc.can_manage_team = true
    )
);

-- 8. Functions for maintaining data integrity

-- Function to automatically set owner as team manager
CREATE OR REPLACE FUNCTION set_owner_as_team_manager()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is an owner role, set can_manage_team to true
    IF NEW.role = 'owner' THEN
        NEW.can_manage_team = true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set team management for owners
CREATE TRIGGER trigger_set_owner_as_team_manager
    BEFORE INSERT OR UPDATE ON client_contacts
    FOR EACH ROW
    EXECUTE FUNCTION set_owner_as_team_manager();

-- Function to ensure only one owner per company
CREATE OR REPLACE FUNCTION enforce_single_owner_per_company()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if we're trying to create another owner for the same company
    IF NEW.role = 'owner' AND EXISTS (
        SELECT 1 FROM client_contacts 
        WHERE client_company_id = NEW.client_company_id 
        AND role = 'owner' 
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
        RAISE EXCEPTION 'A company can only have one owner. Please change the existing owner role first.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single owner per company
CREATE TRIGGER trigger_enforce_single_owner_per_company
    BEFORE INSERT OR UPDATE ON client_contacts
    FOR EACH ROW
    EXECUTE FUNCTION enforce_single_owner_per_company();

-- 9. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON client_companies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON client_contacts TO authenticated;

-- 10. Comments for documentation
COMMENT ON TABLE client_companies IS 'Business entities that are clients of the company';
COMMENT ON TABLE client_contacts IS 'Individual people at client companies with defined roles';
COMMENT ON COLUMN client_companies.owner_contact_id IS 'References the primary owner contact for this company';
COMMENT ON COLUMN client_contacts.can_manage_team IS 'Whether this contact can add/manage other contacts in their company';
COMMENT ON COLUMN client_contacts.role IS 'Business role: owner (can manage team), tech, media, finance, or general member';

-- Migration complete - Client system ready for use