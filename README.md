# Steve's Portfolio Website

A modern, professional portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features PWA capabilities and is optimized for Cloudflare Pages deployment.

## Features

- 🎨 **Modern Design** - Clean, professional design with responsive layout
- ⚡ **PWA Ready** - Progressive Web App with offline capabilities
- 📱 **Mobile First** - Fully responsive design for all devices
- 🚀 **Fast Performance** - Optimized for speed and SEO
- ☁️ **Cloudflare Ready** - Configured for easy deployment on Cloudflare Pages

## Pages

- **Home** - Hero section, skills showcase, featured projects
- **About** - Personal story, skills, experience, values
- **Portfolio** - Project showcase with filtering capabilities
- **Services** - Service offerings, process, pricing
- **Contact** - Contact form with project bid request functionality

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PWA**: next-pwa
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd profile
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

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

### PWA Configuration

Update the PWA manifest in `public/manifest.json`:
- Update app name and description
- Add your own icons (replace placeholder icons)
- Update theme colors

### Icons

Replace the placeholder icons in the `public/` directory with your own:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## Deployment

### Cloudflare Pages

1. Push your code to a GitHub repository
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create a new project and connect your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node.js version**: 18 or higher

### Environment Variables

No environment variables are required for basic functionality. For production, consider adding:

- `NEXT_PUBLIC_SITE_URL` - Your site URL
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (if using)

### Build Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── portfolio/         # Portfolio page
│   ├── services/          # Services page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Navigation.tsx     # Navigation component
│   └── Footer.tsx         # Footer component
public/
├── manifest.json          # PWA manifest
└── icons/                # PWA icons
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please contact me through the contact form on the website.
