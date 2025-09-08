'use client';

import { AppLayout } from '@/components/app-layout';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import LandingPage from '@/components/landing-page';
import { useState } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hasStarted, setHasStarted] = useState(false);

  const handleGetStarted = () => {
    setHasStarted(true);
  };

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
          <SidebarProvider>
            <AppLayout>{children}</AppLayout>
          </SidebarProvider>
        )}
        <Toaster />
      </body>
    </html>
  );
}
