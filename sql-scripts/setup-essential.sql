-- ==========================================================================
-- ESSENTIAL AUTHENTICATION SETUP (Step 1 of 2)
-- ==========================================================================
-- Copy and paste this into Supabase SQL Editor and run it first
-- ==========================================================================

-- 1. CREATE USER PROFILES TABLE
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

-- 3. CREATE BASIC RLS POLICIES
-- Allow users to read their own profile
CREATE POLICY IF NOT EXISTS "Users can view own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow system to insert profiles (for new user registration)
CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 4. CREATE FUNCTION TO HANDLE USER PROFILE CREATION
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

-- 5. CREATE TRIGGER FOR NEW USER REGISTRATION
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. GRANT BASIC PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;