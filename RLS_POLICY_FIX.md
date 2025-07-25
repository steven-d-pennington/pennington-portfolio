# RLS Policy Fix for Client Contacts

## Issue
The `client_contacts` table has an RLS policy with infinite recursion, preventing client contacts from accessing their own data.

## Solution
You need to execute this SQL in the Supabase Dashboard SQL Editor:

```sql
-- First, drop any existing problematic policies
DROP POLICY IF EXISTS "client_contacts_policy" ON client_contacts;
DROP POLICY IF EXISTS "Users can view own client contact" ON client_contacts;
DROP POLICY IF EXISTS "Enable read access for all users" ON client_contacts;

-- Create a simple, safe policy for client contacts to read their own data
CREATE POLICY "client_contacts_read_own" ON client_contacts
    FOR SELECT 
    USING (auth.uid() = id);

-- Create a policy for service role (API usage)
CREATE POLICY "client_contacts_service_role" ON client_contacts
    FOR ALL
    TO service_role
    USING (true);

-- Ensure RLS is enabled
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
```

## Alternative: Disable RLS Temporarily
If the above doesn't work, you can temporarily disable RLS for testing:

```sql
-- TEMPORARY: Disable RLS for testing
ALTER TABLE client_contacts DISABLE ROW LEVEL SECURITY;
```

## After Running the SQL
1. The client login should work without 500 errors
2. Client contacts can access their own data
3. The dashboard will load properly

## Test After Fix
- Visit: http://localhost:3000/client-login
- Login: client@monkeylovestack.com / TestClient123!
- Should see dashboard with all projects