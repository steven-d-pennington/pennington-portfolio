# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Monkey LoveStack" - a professional portfolio website for a full-stack development company. Built with Next.js 15, TypeScript, and Tailwind CSS. Features an AI-powered chat assistant, contact form with Gmail integration, Supabase database integration, and comprehensive deployment configurations.

## Common Development Commands

### Development
- `npm run dev` - Start development server on localhost:3000
- `npm run dev:host` - Start development server accessible on network (port 12000)
- `npm run build` - Build for production
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

**Database Layer**:
- `src/utils/supabase.ts` - Supabase client and helper functions
- Tables: `contact_requests`, `chat_conversations`

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

## Navigation Structure

Current site structure (Projects page hidden):
- Home (`/`) - Hero, skills, featured projects
- About (`/about`) - Personal story, experience
- Services (`/services`) - Service offerings, pricing
- Case Studies (`/case-studies`) - Project showcases
- Contact (`/contact`) - Advanced contact form
- Chat (`/chat`) - AI assistant interface

## Key Files to Understand

When modifying this codebase, these files contain the core business logic:
- `src/app/api/chat/route.ts` - AI assistant configuration and logic
- `src/components/Navigation.tsx` - Site navigation and branding
- `src/app/layout.tsx` - Global app structure and metadata
- `src/utils/supabase.ts` - Database integration patterns