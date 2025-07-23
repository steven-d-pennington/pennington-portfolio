# Supabase Setup Guide

## Overview

This guide covers setting up Supabase as the backend database for Steven Pennington's portfolio website. Supabase provides a PostgreSQL database with real-time capabilities, authentication, and a REST API.

## What We're Setting Up

- **PostgreSQL Database**: Store contact form submissions
- **Row Level Security (RLS)**: Secure data access
- **REST API**: Automatic API endpoints
- **Real-time Subscriptions**: Live data updates (optional)

## Prerequisites

- Supabase account (free tier available)
- Basic understanding of SQL
- Portfolio website code ready for deployment

---

## Step 1: Create Supabase Project

### 1.1 Sign Up/Login
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub, Google, or email
3. Click "New Project"

### 1.2 Project Configuration
```
Project Name: steven-pennington-portfolio
Database Password: [Generate a strong password]
Region: [Choose closest to your users]
Pricing Plan: Free tier (up to 500MB database, 50MB bandwidth)
```

### 1.3 Wait for Setup
- Database creation takes 1-2 minutes
- You'll receive an email when ready

---

## Step 2: Database Schema Setup

### 2.1 Access SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### 2.2 Create Contact Requests Table
Copy and paste this SQL:

```sql
-- Create contact_requests table
CREATE TABLE contact_requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_type TEXT,
  budget TEXT,
  timeline TEXT,
  description TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new',
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_email ON contact_requests(email);

-- Add comments for documentation
COMMENT ON TABLE contact_requests IS 'Contact form submissions from portfolio website';
COMMENT ON COLUMN contact_requests.status IS 'Status: new, contacted, completed, spam';
COMMENT ON COLUMN contact_requests.project_type IS 'Type of project requested';
```

### 2.3 Enable Row Level Security (RLS)
```sql
-- Enable RLS on the table
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for contact form)
CREATE POLICY "Allow anonymous contact submissions" 
  ON contact_requests 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all records
CREATE POLICY "Allow authenticated users to read contact requests" 
  ON contact_requests 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create policy to allow authenticated users to update records
CREATE POLICY "Allow authenticated users to update contact requests" 
  ON contact_requests 
  FOR UPDATE 
  TO authenticated 
  USING (true);
```

### 2.4 Create Admin User (Optional)
If you want to view submissions in the Supabase dashboard:

```sql
-- Create a function to automatically set created_by
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set created_by
CREATE TRIGGER on_contact_request_created
  BEFORE INSERT ON contact_requests
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

### 2.5 Verify Setup
Run this query to verify the table was created:

```sql
-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'contact_requests'
ORDER BY ordinal_position;

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'contact_requests';
```

---

## Step 3: Get Environment Variables

### 3.1 Find Your Project URL
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)

### 3.2 Find Your API Keys
In the same **Settings** → **API** section:

1. **anon public key** (starts with `eyJ...`)
2. **service_role key** (starts with `eyJ...`) - Keep this secret!

### 3.3 Environment Variables for Your Portfolio

Add these to your deployment environment:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

**Note**: 
- `NEXT_PUBLIC_` prefix makes these available in the browser
- Only use the `anon` key in your frontend code
- Keep the `service_role` key secret (only for backend operations)

---

## Step 4: Test the Setup

### 4.1 Test Database Connection
Create a test file `test-supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test inserting a record
    const { data, error } = await supabase
      .from('contact_requests')
      .insert([
        {
          name: 'Test User',
          email: 'test@example.com',
          description: 'This is a test submission',
          project_type: 'Test Project'
        }
      ]);

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success! Record inserted:', data);
    }

    // Test reading records
    const { data: readData, error: readError } = await supabase
      .from('contact_requests')
      .select('*')
      .limit(5);

    if (readError) {
      console.error('Read Error:', readError);
    } else {
      console.log('Records found:', readData);
    }

  } catch (err) {
    console.error('Test failed:', err);
  }
}

testConnection();
```

### 4.2 Test Contact Form
1. Deploy your portfolio with the environment variables
2. Submit a test contact form
3. Check the Supabase dashboard → **Table Editor** → **contact_requests**

---

## Step 5: Database Management

### 5.1 View Submissions
1. Go to **Table Editor** in your Supabase dashboard
2. Click on **contact_requests** table
3. View all submissions in real-time

### 5.2 Export Data
```sql
-- Export all contact requests
SELECT * FROM contact_requests ORDER BY created_at DESC;

-- Export recent submissions
SELECT * FROM contact_requests 
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Export by status
SELECT * FROM contact_requests 
WHERE status = 'new'
ORDER BY created_at DESC;
```

### 5.3 Update Submission Status
```sql
-- Mark as contacted
UPDATE contact_requests 
SET status = 'contacted' 
WHERE id = 1;

-- Mark as completed
UPDATE contact_requests 
SET status = 'completed' 
WHERE id = 1;

-- Mark as spam
UPDATE contact_requests 
SET status = 'spam' 
WHERE id = 1;
```

---

## Step 6: Advanced Features (Optional)

### 6.1 Email Notifications
Set up database triggers to send email notifications:

```sql
-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to send email notification
CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS trigger AS $$
BEGIN
  -- This would integrate with your email service
  -- Example: Send to webhook, email service, etc.
  PERFORM net.http_post(
    url := 'https://your-webhook-url.com/contact',
    headers := '{"Content-Type": "application/json"}',
    body := json_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'description', NEW.description
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER contact_notification
  AFTER INSERT ON contact_requests
  FOR EACH ROW EXECUTE PROCEDURE notify_new_contact();
```

### 6.2 Analytics Dashboard
Create views for analytics:

```sql
-- Daily submissions
CREATE VIEW daily_submissions AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as submissions,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_requests,
  COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted
FROM contact_requests
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Project type breakdown
CREATE VIEW project_type_breakdown AS
SELECT 
  project_type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM contact_requests), 2) as percentage
FROM contact_requests
WHERE project_type IS NOT NULL
GROUP BY project_type
ORDER BY count DESC;
```

### 6.3 Data Retention Policy
```sql
-- Delete old spam submissions (older than 30 days)
DELETE FROM contact_requests 
WHERE status = 'spam' 
AND created_at < NOW() - INTERVAL '30 days';

-- Archive old completed submissions (older than 1 year)
-- (You might want to move to an archive table instead of deleting)
```

---

## Step 7: Security Best Practices

### 7.1 API Key Security
- ✅ Use `anon` key in frontend (public)
- ❌ Never expose `service_role` key in frontend
- ✅ Rotate keys regularly
- ✅ Use environment variables

### 7.2 Database Security
- ✅ Row Level Security (RLS) enabled
- ✅ Minimal permissions for anonymous users
- ✅ Input validation in application
- ✅ Rate limiting (implement in your app)

### 7.3 Data Protection
```sql
-- Add data validation
ALTER TABLE contact_requests 
ADD CONSTRAINT valid_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add length constraints
ALTER TABLE contact_requests 
ADD CONSTRAINT name_length 
CHECK (LENGTH(name) BETWEEN 1 AND 100);

ALTER TABLE contact_requests 
ADD CONSTRAINT description_length 
CHECK (LENGTH(description) BETWEEN 10 AND 2000);
```

---

## Troubleshooting

### Common Issues

#### 1. "relation does not exist" error
- Check if table was created successfully
- Verify you're in the correct schema
- Run the CREATE TABLE script again

#### 2. "permission denied" error
- Check if RLS policies are set up correctly
- Verify you're using the correct API key
- Check if the user has proper permissions

#### 3. Environment variables not working
- Verify variable names start with `NEXT_PUBLIC_`
- Check for typos in variable names
- Restart your development server

#### 4. Contact form not submitting
- Check browser console for errors
- Verify Supabase URL and key are correct
- Test with the test script above

### Debug Commands

```sql
-- Check table exists
\dt contact_requests

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'contact_requests';

-- Check recent submissions
SELECT * FROM contact_requests ORDER BY created_at DESC LIMIT 5;

-- Check for errors in logs
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

---

## Monitoring and Maintenance

### 1. Regular Backups
- Supabase provides automatic backups
- Free tier: 7 days of backups
- Paid tier: 30 days of backups

### 2. Performance Monitoring
- Monitor query performance in Supabase dashboard
- Check for slow queries
- Optimize indexes as needed

### 3. Data Cleanup
- Regularly clean up spam submissions
- Archive old completed requests
- Monitor storage usage

### 4. Security Audits
- Review RLS policies regularly
- Check for unauthorized access
- Monitor API usage

---

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## Next Steps

After setting up Supabase:

1. **Test the integration** with your portfolio
2. **Set up monitoring** for new submissions
3. **Configure email notifications** (optional)
4. **Set up analytics** (optional)
5. **Plan data retention** strategy
6. **Document procedures** for your team

Your portfolio is now ready to collect and store contact form submissions securely! 🚀

---

## Chat Conversations Table Setup

### 2.6 Create Chat Conversations Table
Copy and paste this SQL:

```sql
-- Create chat_conversations table
CREATE TABLE chat_conversations (
  id SERIAL PRIMARY KEY,
  user_message TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  conversation_context JSONB
);

-- Create indexes for chat conversations
CREATE INDEX idx_chat_conversations_created_at ON chat_conversations(created_at);
CREATE INDEX idx_chat_conversations_session_id ON chat_conversations(session_id);

-- Add comments for documentation
COMMENT ON TABLE chat_conversations IS 'AI chat conversations from cloud engineering assistant';
COMMENT ON COLUMN chat_conversations.conversation_context IS 'Additional context or metadata for the conversation';
```

### 2.7 Verify Chat Conversations Table
Run this query to verify the table was created:

```sql
-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'chat_conversations'
ORDER BY ordinal_position;
```