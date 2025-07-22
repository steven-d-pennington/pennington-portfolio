-- Create user_invitations table for managing invitation workflow
CREATE TABLE IF NOT EXISTS user_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'client', 'team_member', 'moderator')),
    company_name TEXT,
    phone TEXT,
    address TEXT,
    timezone TEXT DEFAULT 'UTC',
    invited_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    invitation_token UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    accepted_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    
    -- Ensure no duplicate pending invitations for same email
    CONSTRAINT unique_pending_invitation UNIQUE (email, status) DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_token ON user_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_user_invitations_status ON user_invitations(status);
CREATE INDEX IF NOT EXISTS idx_user_invitations_expires_at ON user_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_invitations_invited_by ON user_invitations(invited_by);

-- Row Level Security (RLS) policies
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can see all invitations
CREATE POLICY "Admins can view all invitations" 
ON user_invitations FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

-- Policy: Admins can insert invitations
CREATE POLICY "Admins can create invitations" 
ON user_invitations FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

-- Policy: Admins can update invitations (cancel, resend)
CREATE POLICY "Admins can update invitations" 
ON user_invitations FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

-- Policy: Anyone can view invitation by token (for acceptance page)
CREATE POLICY "Anyone can view invitation by token" 
ON user_invitations FOR SELECT 
TO anon, authenticated 
USING (invitation_token = invitation_token);

-- Policy: Anyone can update invitation status to accepted (for acceptance)
CREATE POLICY "Anyone can accept invitation by token" 
ON user_invitations FOR UPDATE 
TO anon, authenticated 
USING (status = 'pending' AND expires_at > NOW());

-- Function to automatically expire invitations
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
    UPDATE user_invitations 
    SET status = 'expired' 
    WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to prevent duplicate pending invitations
CREATE OR REPLACE FUNCTION check_duplicate_pending_invitation()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there's already a pending invitation for this email
    IF EXISTS (
        SELECT 1 FROM user_invitations 
        WHERE email = NEW.email 
        AND status = 'pending' 
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
        RAISE EXCEPTION 'A pending invitation already exists for this email address';
    END IF;
    
    -- Check if user already exists
    IF EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE email = NEW.email
    ) THEN
        RAISE EXCEPTION 'A user with this email address already exists';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_duplicate_pending_invitation
    BEFORE INSERT OR UPDATE ON user_invitations
    FOR EACH ROW
    EXECUTE FUNCTION check_duplicate_pending_invitation();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_invitations TO authenticated;
GRANT SELECT ON user_invitations TO anon;