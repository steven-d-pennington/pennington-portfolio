-- ==========================================================================
-- SIMPLE RLS FIX - Remove problematic policies
-- ==========================================================================

-- Drop ALL policies that might cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Anyone can insert profiles" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Temporarily disable RLS to test
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;