'use client';

import { AppLayout } from '@/components/app-layout';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TutorialProvider } from '@/hooks/use-tutorial';
import LandingPage from '@/components/landing-page';
import { useState, useEffect } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hasStarted, setHasStarted] = useState<boolean | null>(null); // null for loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has previously started the app
    const hasStartedBefore = localStorage.getItem('myguardian-started');
    setHasStarted(hasStartedBefore === 'true');
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    setHasStarted(true);
    localStorage.setItem('myguardian-started', 'true');
  };

  // Show loading state briefly to prevent flash
  if (isLoading) {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>MyGuardian - Your Personal Spiritual Companion</title>
          <meta name="description" content="Understand the Bible better with AI-powered insights, daily readings, and spiritual guidance. Completely anonymous and private." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* Custom favicon with Cross logo */}
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/icon-48.svg" />
          
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="font-body antialiased bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950" suppressHydrationWarning>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>MyGuardian - Your Personal Spiritual Companion</title>
        <meta name="description" content="Understand the Bible better with AI-powered insights, daily readings, and spiritual guidance. Completely anonymous and private." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Custom favicon with Cross logo */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-48.svg" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {!hasStarted ? (
          <LandingPage onGetStarted={handleGetStarted} />
        ) : (
          <TutorialProvider>
            <SidebarProvider defaultOpen={true}>
              <AppLayout>{children}</AppLayout>
            </SidebarProvider>
          </TutorialProvider>
        )}
        <Toaster />
      </body>
    </html>
  );
}
