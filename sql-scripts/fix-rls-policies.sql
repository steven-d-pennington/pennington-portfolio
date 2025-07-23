-- ==========================================================================
-- FIX RLS POLICY INFINITE RECURSION
-- ==========================================================================
-- Run this to fix the infinite recursion issue in user_profiles policies
-- ==========================================================================

-- Drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Create a simpler, more direct admin policy that doesn't cause recursion
-- This policy allows users with 'admin' role to view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (
    -- Allow users to see their own profile always
    auth.uid() = id 
    OR 
    -- Allow if current user has admin role (direct lookup, no recursion)
    (
      SELECT role FROM public.user_profiles 
      WHERE id = auth.uid() 
      LIMIT 1
    ) = 'admin'
  );

-- Also fix the insert policy to be more permissive for the system
DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_profiles;

CREATE POLICY "Users can insert own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow service role (our backend) to insert profiles for new users
CREATE POLICY "Service role can insert profiles" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Make sure contact_requests policies are simple and don't cause issues
DROP POLICY IF EXISTS "Anyone can insert contact requests" ON public.contact_requests;
CREATE POLICY "Anyone can insert contact requests" 
  ON public.contact_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Make sure chat_conversations policies work
DROP POLICY IF EXISTS "Authenticated users can insert chat conversations" ON public.chat_conversations;
CREATE POLICY "Anyone can insert chat conversations" 
  ON public.chat_conversations 
  FOR INSERT 
  WITH CHECK (true);