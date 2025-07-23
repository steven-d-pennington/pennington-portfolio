# SQL Scripts Directory

This directory contains SQL scripts for database setup, migrations, and troubleshooting.

## Setup Scripts
- `supabase-schema.sql` - Main database schema setup
- `supabase-auth-setup.sql` - Authentication setup for Supabase
- `setup.sql` - General database setup
- `setup-essential.sql` - Essential database setup

## Troubleshooting Scripts
- `disable-rls-temp.sql` - Temporarily disable Row Level Security (RLS)
- `fix-rls-policies.sql` - Fix Row Level Security policies
- `fix_user_profiles_rls.sql` - Fix user profiles RLS policies
- `simple-fix.sql` - Simple database fixes

## Usage
These scripts are typically run directly in your Supabase SQL editor or via command line tools. Always backup your database before running any scripts.

## Note
For tracked migrations, see the `sql-migrations/` directory which contains timestamped migration files.