import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import FloatingChat from "@/components/FloatingChat";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UnifiedAuthProvider } from "@/components/UnifiedAuthProvider";
import RouteGuard from "@/components/RouteGuard";
import AuthErrorHandler from "@/components/AuthErrorHandler";
import { Analytics } from "@vercel/analytics/next";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monkey LoveStack | Full-Stack Development & Cloud Solutions",
  description: "Full-stack development company specializing in bringing ideas to life on the web. We build modern applications and handle deployment to any cloud provider or on-premises infrastructure. Experts in cloud migrations and modernizing monolithic applications.",
  keywords: "full-stack development, cloud migration, application modernization, web development, cloud deployment, AWS, Azure, Google Cloud, monolithic to microservices",
  authors: [{ name: "Monkey LoveStack" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Steven Pennington" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <UnifiedAuthProvider>
                <RouteGuard>
                  <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col w-full overflow-x-hidden">
                    <NavigationWrapper />
                    <main className="flex-grow w-full overflow-x-hidden">
                      {children}
                    </main>
                    <Footer />
                    <CookieConsent />
                    <FloatingChat />
                    <AuthErrorHandler />
                  </div>
                </RouteGuard>
              </UnifiedAuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
