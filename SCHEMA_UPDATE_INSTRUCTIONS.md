# Database Schema Update Instructions

## ⚠️ CRITICAL: Manual Schema Change Required

The code has been updated to work with both old and new schema, but you need to manually update the foreign key constraint in the Supabase dashboard.

## Steps to Update Schema:

### 1. Open Supabase Dashboard
- Go to https://supabase.com/dashboard
- Navigate to your project
- Go to SQL Editor

### 2. Execute Schema Change SQL

**COPY AND PASTE THIS EXACT SQL:**

```sql
-- Step 1: Drop existing foreign key constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_client_id_fkey;

-- Step 2: Add new foreign key constraint to client_companies  
ALTER TABLE projects ADD CONSTRAINT projects_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES client_companies(id);
```

### 3. Verify Schema Change
Run this query to verify the constraint was updated:

```sql
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='projects'
    AND kcu.column_name='client_id';
```

**Expected Result:** Should show `foreign_table_name` as `client_companies` (not `user_profiles`)

### 4. After Schema Update - Run Data Migration

Once the schema is updated, run this command to migrate existing project data:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://htfbommrxngachnglbwk.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZmJvbW1yeG5nYWNobmdsYndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI2MTI0OSwiZXhwIjoyMDY3ODM3MjQ5fQ.8gORDd1IlvDmIK6E1kzH-vK1whf5NpcQQNzzegDNxBY node safe-migration.js --execute
```

### 5. Verify Migration Success

Run the inspection script to verify data migration:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://htfbommrxngachnglbwk.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZmJvbW1yeG5nYWNobmdsYndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI2MTI0OSwiZXhwIjoyMDY3ODM3MjQ5fQ.8gORDd1IlvDmIK6E1kzH-vK1whf5NpcQQNzzegDNxBY node inspect-database.js
```

**Expected Result:** All projects should have `client_id` values that match `client_companies.id` (not `user_profiles.id`)

## What This Changes:

- **Before:** `projects.client_id` → `user_profiles.id`
- **After:** `projects.client_id` → `client_companies.id`

## Safety Measures:

✅ **Backup Created:** `backup-projects-1753367954870.json`
✅ **Code is Backward Compatible:** App works with both old and new schema
✅ **Migration Plan Verified:** All 12 projects will be moved to "Monkey LoveShack" company
✅ **Rollback Available:** Can restore from backup if needed

## After Completion:

Once schema and data migration are complete, the app will properly use the client_companies table for all project-client relationships, setting the foundation for:

- Client contact authentication
- Client dashboard
- Proper client company management
- Client contact invitations

## ⚠️ Do Not Proceed Without Completing This Step

The schema change is required before continuing with client authentication and dashboard features.