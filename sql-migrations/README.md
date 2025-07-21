# SQL Migrations

This folder contains Supabase database migration scripts for the Monkey LoveStack client dashboard.

## Migration Naming Convention

Migrations should be named with the format:
`YYYY-MM-DD_HH-MM_description.sql`

Example: `2025-01-21_14-30_create-client-dashboard-tables.sql`

## How to Run Migrations

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the migration script
4. Execute the script

## Migration Order

Migrations should be run in chronological order to ensure proper dependency resolution.

## Current Migrations

- `2025-01-21_14-30_create-client-dashboard-tables.sql` - Initial client dashboard schema

## Rollback Scripts

For each migration, consider creating a corresponding rollback script with the suffix `_rollback.sql`