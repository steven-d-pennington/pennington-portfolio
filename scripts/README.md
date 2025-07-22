# Database Seeding Scripts

This directory contains scripts for populating the database with comprehensive test data.

## Available Scripts

### `npm run seed`
Populates the database with comprehensive test data including:

- **7 Test Users** across different roles (clients, team members)
- **9 Sample Projects** with various statuses (planning, active, completed, on hold, cancelled)
- **Project Assignments** connecting team members to projects
- **200+ Time Entries** with realistic work patterns across different types
- **Project Updates** showing milestone progress and communications
- **Invoices & Payments** with financial tracking data
- **GitHub Webhook Events** simulating repository activity

### Test Data Overview

#### Users Created:
- **Alex Chen** (TechStartup Inc) - Client
- **Sarah Johnson** (Team Member) - Lead Developer
- **Michael Rodriguez** (Enterprise Solutions) - Client  
- **Emma Wilson** (Team Member) - Developer
- **David Kim** (HealthTech Solutions) - Client
- **Maria Garcia** (Team Member) - Consultant
- **James Brown** (RetailMax Corporation) - Client

#### Projects Created:
- **E-commerce Platform Redesign** (Active) - Modern React/AWS rebuild
- **Mobile Banking App** (Planning) - Cross-platform banking solution
- **Healthcare Data Analytics** (Active) - HIPAA-compliant dashboard
- **Inventory Management** (Completed) - Enterprise inventory system
- **API Gateway Migration** (On Hold) - Legacy system upgrade
- **Customer Portal Enhancement** (Active) - AI-powered portal
- **DevOps Pipeline Setup** (Completed) - CI/CD implementation
- **Blockchain Integration POC** (Cancelled) - Supply chain tracking
- **Legacy System Modernization** (Planning) - COBOL to Java migration

## Prerequisites

1. **Environment Variables Required:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Database Schema:** Ensure all tables are created and RLS policies are active

## Usage

```bash
# Seed database with comprehensive test data
npm run seed

# Clear existing test data (keeps real users like steven@spennington.dev)
npm run seed:clear
```

## Features Tested

The seeded data enables testing of:

✅ **Project Management**
- Project CRUD operations across all status types
- Client assignment and project ownership
- Team member assignments and role management

✅ **Time Tracking**
- Realistic time entries across different work types
- Billable/non-billable hours tracking
- Project-based time reporting

✅ **Financial Management**
- Invoice generation from time entries
- Fixed-price and hourly billing models
- Payment tracking with multiple payment methods
- Revenue and outstanding invoice calculations

✅ **Project Communication**
- Milestone tracking and progress updates
- Client-visible vs internal communications
- Project history and change requests

✅ **GitHub Integration**
- Repository linking to projects
- Simulated webhook events (commits, PRs, releases)
- Development activity tracking

✅ **Dashboard Analytics**
- Project count statistics
- Time worked summaries
- Financial metrics and trends
- Recent activity feeds

## Data Characteristics

- **Realistic Dates:** Past 3 months of activity with future project dates
- **Diverse Hourly Rates:** $140-$200/hour across different skill sets
- **Mixed Billing Models:** Both hourly and fixed-price projects
- **Geographic Diversity:** Users across different US time zones
- **Project Variety:** Enterprise, startup, healthcare, and retail clients
- **Activity Patterns:** Weekday-focused with realistic work hour distributions

## Safety Features

- **Preserves Real Data:** Only removes test users and their associated records
- **Foreign Key Safe:** Deletes records in proper order to respect constraints
- **Transaction Safety:** Uses Supabase admin client with proper error handling
- **Idempotent:** Can be run multiple times safely

## Development Benefits

This seeding provides a rich dataset for:
- UI component testing with realistic data volumes
- Dashboard performance optimization
- Report generation validation  
- Client workflow testing
- Financial calculation verification
- Search and filter functionality testing