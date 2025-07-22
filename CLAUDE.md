# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Monkey LoveStack" - a professional portfolio website for a full-stack development company. Built with Next.js 15, TypeScript, and Tailwind CSS. Features an AI-powered chat assistant, contact form with Gmail integration, Supabase database integration, and comprehensive deployment configurations.

## Common Development Commands

### Development
- `npm run dev` - Start development server with Turbopack on localhost:3000
- `npm run dev:safe` - Start development server with webpack (fallback mode)
- `npm run dev:host` - Start development server accessible on network (port 12000)
- `npm run build` - Build for production with Turbopack
- `npm run build:webpack` - Build for production with webpack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Testing & Debugging
- `npm run test:supabase` - Test Supabase database connection
- `npm run test:chat` - Test chat API integration

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini for chat assistant
- **Email**: Gmail API with OAuth2 integration
- **Deployment**: Configured for Vercel, AWS, Netlify, Railway

### Key Components Structure

**Core Layout & Navigation**:
- `src/app/layout.tsx` - Root layout with ThemeProvider, Navigation, Footer, and global components
- `src/components/Navigation.tsx` - Main navigation with mobile menu and theme toggle
- `src/components/ThemeProvider.tsx` - Light/dark theme management
- `src/components/FloatingChat.tsx` - AI chat widget integration

**API Routes**:
- `src/app/api/chat/route.ts` - OpenAI GPT integration with conversation persistence
- `src/app/api/contact/route.ts` - Contact form with Gmail API and Supabase storage
- `src/app/api/health/route.ts` - Health check endpoint
- `src/app/api/projects/route.ts` - Project management (CRUD operations)
- `src/app/api/projects/[id]/route.ts` - Individual project operations
- `src/app/api/dashboard/stats/route.ts` - Dashboard analytics and statistics
- `src/app/api/debug/user-role/route.ts` - Debug user role management
- `src/app/api/test-auth/route.ts` - Authentication testing endpoint

**Database Layer**:
- `src/utils/supabase.ts` - Multi-client Supabase configuration
- `src/lib/server-database.ts` - Server-side database operations with RLS
- `src/types/database.ts` - Complete TypeScript database type definitions
- **Main Tables**: `user_profiles`, `projects`, `project_members`, `time_entries`, `invoices`, `payments`, `github_webhook_events`, `project_updates`

### Configuration Files

**Next.js Configuration**:
- `next.config.ts` - Deployment optimized with unoptimized images
- `tsconfig.json` - Strict TypeScript with path aliases (`@/*` → `./src/*`)

**Styling**:
- `tailwind.config.js` - Custom color variables, dark mode support
- `src/app/globals.css` - CSS custom properties for theming

**Code Quality**:
- `eslint.config.mjs` - Next.js recommended ESLint configuration

## Development Patterns

### Environment Variables
Required for full functionality:
```
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Chat
OPENAI_API_KEY=

# Email Integration
GMAIL_USER_EMAIL=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
```

### Theme System
- Uses CSS custom properties in `globals.css`
- Tailwind configured with `darkMode: 'class'`
- ThemeProvider manages light/dark theme state
- All components use CSS variables for consistent theming

### AI Chat Assistant
- Configured as cloud engineering specialist for Monkey LoveStack
- System prompt emphasizes full-stack development and cloud solutions
- Conversation history maintained (last 10 messages)
- Optional persistence to Supabase database

### Database Schema
- Contact requests store project details, budget, timeline
- Chat conversations optionally persisted for analytics
- Graceful fallback when Supabase unavailable

## Deployment Configurations

- **Vercel**: Primary deployment target with `vercel.json`
- **AWS**: CloudFormation templates in `/aws/cloudformation/`
- **Docker**: Multi-stage Dockerfile for containerized deployment
- Static export capability with `next export` support

## Dashboard System (Current Focus)

### Complete Project Management Dashboard
**Location**: `/dashboard/projects`
**Access**: Admin, Client, Team Member roles only
**Features**:
- ✅ **Full CRUD operations** - Create, view, edit, delete projects
- ✅ **Role-based access control** with Row Level Security
- ✅ **Real-time dashboard stats** (project counts, hours, invoices)
- ✅ **Advanced project details** with inline editing
- ✅ **Client assignment** and team member management
- ✅ **Financial tracking** (hourly rates, fixed pricing, estimates)
- ✅ **GitHub repository integration** (repo linking)
- ✅ **Project status workflows** (planning → active → completed)

### Authentication System
**Login**: `/login` - Email/password and Google OAuth
**Signup**: `/signup` - New user registration
**Features**:
- ✅ **Multi-provider auth** (email/password + Google OAuth)
- ✅ **User profile management** with roles (user, client, admin, team_member)
- ✅ **Session management** with automatic refresh
- ✅ **Supabase integration** with RLS policies

### Database Schema (9-Table System)
**Core Tables**:
- `user_profiles` - Extended user information and roles
- `projects` - Project details with GitHub integration
- `project_members` - Many-to-many project team assignments
- `time_entries` - Time tracking with billable hours
- `invoices` - Invoice management with automated numbering
- `invoice_line_items` - Detailed billing line items
- `payments` - Payment tracking with multiple methods
- `github_webhook_events` - Real-time GitHub activity
- `project_updates` - Project milestones and communications

### **🎯 NEXT MILESTONE: User Management System**
**Status**: Ready to begin implementation
**Target**: `/dashboard/users` page for comprehensive user/client management

## Navigation Structure

Current site structure with dashboard:
- Home (`/`) - Hero, skills, featured projects
- About (`/about`) - Personal story, experience
- Services (`/services`) - Service offerings, pricing
- Case Studies (`/case-studies`) - Project showcases
- Contact (`/contact`) - Advanced contact form
- Chat (`/chat`) - AI assistant interface
- **Dashboard** (`/dashboard/projects`) - **PROJECT MANAGEMENT SYSTEM** ✅
- **User Management** (`/dashboard/users`) - **NEXT TO BUILD** 🎯

## Key Files to Understand

When modifying this codebase, these files contain the core business logic:

**Dashboard System Core**:
- `src/app/dashboard/projects/page.tsx` - Main project dashboard interface
- `src/components/dashboard/CreateProjectModal.tsx` - Project creation modal
- `src/components/dashboard/ProjectDetailsModal.tsx` - Project editing and viewing
- `src/components/dashboard/QuickStatsCard.tsx` - Dashboard statistics cards
- `src/lib/server-database.ts` - Server-side database operations with RLS

**Authentication & Session Management**:
- `src/components/AuthProvider.tsx` - Authentication context and state management
- `src/app/login/page.tsx` - Multi-provider login interface  
- `src/app/signup/page.tsx` - User registration interface
- `src/utils/supabase.ts` - Multi-client Supabase configuration (browser, server, admin)

**API Layer**:
- `src/app/api/projects/route.ts` - Project CRUD operations
- `src/app/api/dashboard/stats/route.ts` - Dashboard analytics
- `src/types/database.ts` - Complete TypeScript type definitions

**Legacy Core** (still active):
- `src/app/api/chat/route.ts` - AI assistant configuration and logic
- `src/components/Navigation.tsx` - Site navigation with dashboard integration
- `src/app/layout.tsx` - Global app structure and metadata