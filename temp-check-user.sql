-- Check user profile for steven@spennington.dev
SELECT 
  up.id,
  up.email,
  up.full_name,
  up.role,
  up.created_at,
  up.updated_at
FROM user_profiles up
WHERE up.email = 'steven@spennington.dev';

-- Also check all roles to see what's available
SELECT DISTINCT role FROM user_profiles WHERE role IS NOT NULL;