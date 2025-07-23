-- ==========================================================================
-- SUPABASE AUTHENTICATION SETUP
-- ==========================================================================
-- Run these SQL commands in your Supabase SQL Editor to set up authentication
-- Make sure to run them in order as some depend on previous ones
-- ==========================================================================

-- 1. CREATE USER PROFILES TABLE
-- This extends the built-in auth.users table with additional profile information
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- 2. ENABLE ROW LEVEL SECURITY ON USER PROFILES
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. CREATE RLS POLICIES FOR USER PROFILES
-- Allow users to read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow system to insert profiles (for new user registration)
DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_profiles;
CREATE POLICY "Enable insert for service role" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. CREATE FUNCTION TO HANDLE USER PROFILE UPDATES
-- This function updates the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. CREATE TRIGGER FOR UPDATED_AT
DROP TRIGGER IF EXISTS set_updated_at ON public.user_profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. UPDATE EXISTING TABLES TO LINK TO USERS
-- Add user_id column to contact_requests if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_requests' 
    AND column_name = 'user_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.contact_requests 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    
    -- Add index for better performance
    CREATE INDEX IF NOT EXISTS idx_contact_requests_user_id ON public.contact_requests(user_id);
  END IF;
END $$;

-- Add user_id column to chat_conversations if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chat_conversations' 
    AND column_name = 'user_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.chat_conversations 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    
    -- Add index for better performance
    CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
  END IF;
END $$;

-- 7. UPDATE RLS POLICIES FOR EXISTING TABLES
-- Contact Requests - users can only see their own
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own contact requests" ON public.contact_requests;
CREATE POLICY "Users can view own contact requests" 
  ON public.contact_requests 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Allow anyone to insert contact requests (for the contact form)
DROP POLICY IF EXISTS "Anyone can insert contact requests" ON public.contact_requests;
CREATE POLICY "Anyone can insert contact requests" 
  ON public.contact_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Chat Conversations - users can only see their own
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own chat conversations" ON public.chat_conversations;
CREATE POLICY "Users can view own chat conversations" 
  ON public.chat_conversations 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Allow authenticated users to insert chat conversations
DROP POLICY IF EXISTS "Authenticated users can insert chat conversations" ON public.chat_conversations;
CREATE POLICY "Authenticated users can insert chat conversations" 
  ON public.chat_conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- 8. CREATE FUNCTION TO AUTOMATICALLY CREATE USER PROFILE
-- This function creates a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. CREATE TRIGGER FOR NEW USER REGISTRATION
-- This trigger automatically creates a profile when a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. GRANT NECESSARY PERMISSIONS
-- Grant permissions for the service role to manage user profiles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT ALL ON public.contact_requests TO anon, authenticated;
GRANT ALL ON public.chat_conversations TO anon, authenticated;

-- Grant permissions for the functions
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;

-- ==========================================================================
-- VERIFICATION QUERIES
-- ==========================================================================
-- Run these to verify everything was set up correctly

-- Check if user_profiles table exists and has correct structure
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if RLS is enabled on tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'contact_requests', 'chat_conversations');

-- Check if policies exist
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if triggers exist
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- ==========================================================================
-- OPTIONAL: SEED ADMIN USER
-- ==========================================================================
-- If you want to make your user an admin, get your user ID first:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then update your profile role (replace 'your-user-id' with actual UUID):
-- UPDATE public.user_profiles 
-- SET role = 'admin' 
-- WHERE id = 'your-user-id';

-- ==========================================================================
-- CLEANUP (Optional - only run if you need to remove everything)
-- ==========================================================================
-- Uncomment and run these if you need to start over:

/*
-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_updated_at ON public.user_profiles;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Remove columns from existing tables
ALTER TABLE public.contact_requests DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.chat_conversations DROP COLUMN IF EXISTS user_id;

-- Drop user_profiles table
DROP TABLE IF EXISTS public.user_profiles;
*/