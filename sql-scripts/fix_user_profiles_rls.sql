-- Fix RLS policies for user_profiles table
-- This should allow users to access their own profiles

-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Drop any existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_profiles;

-- Create proper RLS policies
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON user_profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile  
CREATE POLICY "Users can update own profile" 
ON user_profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile (for account creation)
CREATE POLICY "Users can insert own profile" 
ON user_profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Check the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_profiles';