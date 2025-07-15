# Steve Pennington's Portfolio Website

A modern, professional portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features AI-powered chat assistant, contact form with Gmail integration, Supabase database, and multiple deployment options.

## 🌟 Features

- 🎨 **Modern Design** - Clean, professional design with responsive layout
- 🤖 **AI Chat Assistant** - OpenAI GPT-4o-mini powered cloud engineering assistant
- 📧 **Contact Form** - Gmail integration with automatic email responses
- 💾 **Database Integration** - Supabase PostgreSQL for contact forms and chat persistence
- 📱 **Mobile First** - Fully responsive design for all devices
- 🚀 **Fast Performance** - Optimized for speed and SEO
- ☁️ **Multi-Platform Deploy** - Ready for Vercel, Netlify, Railway, AWS, or Cloudflare

## 📋 Pages & Features

- **Home** - Hero section, skills showcase, featured projects
- **About** - Personal story, skills, experience, values  
- **Portfolio** - Project showcase with filtering capabilities
- **Services** - Service offerings, process, pricing
- **Contact** - Advanced contact form with project details and Gmail integration
- **Chat** - AI-powered cloud engineering assistant with conversation persistence
- **Privacy Policy** - Comprehensive privacy policy for data handling

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT-4o-mini
- **Email**: Gmail API with OAuth2
- **Deployment**: Vercel-ready (also supports Netlify, Railway, AWS, Cloudflare)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database features)
- OpenAI API key (for chat assistant)
- Gmail OAuth credentials (for contact form)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/steven-d-pennington/pennington-portfolio.git
cd pennington-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Gmail API Configuration
GMAIL_USER_EMAIL=your_gmail_email
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
```

4. Set up the database (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions)

5. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Environment Variables

The application requires several environment variables for full functionality:

#### Required for Chat Feature
- `OPENAI_API_KEY` - Your OpenAI API key for the chat assistant

#### Required for Contact Form  
- `GMAIL_USER_EMAIL` - Your Gmail address for sending emails
- `GMAIL_CLIENT_ID` - Google OAuth2 client ID
- `GMAIL_CLIENT_SECRET` - Google OAuth2 client secret  
- `GMAIL_REFRESH_TOKEN` - Google OAuth2 refresh token

#### Required for Database Features
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### Setup Guides

- **Database Setup**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Gmail API Setup**: Instructions in [LOCAL_TESTING.md](./LOCAL_TESTING.md)
- **Deployment**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🎨 Customization

### Personal Information

Update the following files with your information:

- `src/app/layout.tsx` - Update metadata and title
- `src/components/Navigation.tsx` - Update your name
- `src/components/Footer.tsx` - Update contact links and social media
- `src/app/page.tsx` - Update hero section and featured projects
- `src/app/about/page.tsx` - Update personal story, skills, and experience
- `src/app/portfolio/page.tsx` - Add your actual projects
- `src/app/services/page.tsx` - Update services and pricing
- `src/app/contact/page.tsx` - Update contact information
- `src/app/api/chat/route.ts` - Customize the AI assistant's system prompt

### AI Chat Assistant

The chat assistant is configured as a cloud engineering specialist. To customize:

1. Edit the `CLOUD_ENGINEER_SYSTEM_PROMPT` in `src/app/api/chat/route.ts`
2. Modify the expertise areas and guidelines
3. Adjust the OpenAI model parameters (temperature, max_tokens, etc.)

### Contact Form

The contact form includes:
- Basic contact information
- Project details (type, budget, timeline)
- Automatic email responses via Gmail API
- Database storage in Supabase

## 📦 Available Scripts

### Environment Variables

## 📦 Available Scripts

- `npm run dev` - Development server with Turbopack
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run dev:host` - Development server accessible on network
- `npm run test:supabase` - Test Supabase connection

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

### Quick Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push to main

### Other Deployment Options

- **Netlify**: Full-stack deployment with serverless functions
- **Railway**: Container-based deployment with database
- **AWS**: Using provided CloudFormation templates

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── api/               # API routes
│   │   ├── chat/          # AI chat assistant endpoint
│   │   ├── contact/       # Contact form endpoint
│   │   └── health/        # Health check endpoint
│   ├── chat/              # Chat interface page
│   ├── contact/           # Contact page with form
│   ├── portfolio/         # Portfolio page
│   ├── privacy-policy/    # Privacy policy page
│   ├── services/          # Services page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Navigation.tsx     # Navigation component
│   └── Footer.tsx         # Footer component
└── utils/                 # Utility functions
    └── supabase.ts        # Supabase client and helpers
public/
├── manifest.json          # PWA manifest
├── vercel.json           # Vercel deployment config
└── icons/                # App icons and images
aws/                      # AWS deployment scripts
├── deploy.ps1            # PowerShell deployment script
├── deploy.sh             # Bash deployment script
└── cloudformation/       # AWS CloudFormation templates
docs/                     # Documentation
├── SUPABASE_SETUP.md     # Database setup guide
├── LOCAL_TESTING.md      # Local development guide
└── DEPLOYMENT_GUIDE.md   # Deployment instructions
```

## 🔗 API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/chat` - AI chat assistant
- `POST /api/contact` - Contact form submission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For questions or support:
- Open an issue on GitHub
- Contact through the website's contact form
- Email: steve-d-pennington@gmail.com

## 🔒 Privacy & Security

This application collects and stores:
- Contact form submissions in Supabase database
- Chat conversations (if persistence is enabled)
- Basic usage analytics

All data is handled according to our [Privacy Policy](./src/app/privacy-policy/page.tsx).

## 🔧 Development Notes

### Testing

- `npm run test:supabase` - Test database connection
- Local testing guide: [LOCAL_TESTING.md](./LOCAL_TESTING.md)

### Environment Setup

- Development: `.env.local`
- Production: Set environment variables in your deployment platform
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for platform-specific instructions
