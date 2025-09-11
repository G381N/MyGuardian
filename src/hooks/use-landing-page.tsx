'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LandingPageContextType {
  hasStarted: boolean;
  goToLandingPage: () => void;
  handleGetStarted: () => void;
  isLoading: boolean;
}

const LandingPageContext = createContext<LandingPageContextType | undefined>(undefined);

export function LandingPageProvider({ children }: { children: ReactNode }) {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
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

  const goToLandingPage = () => {
    setHasStarted(false);
    localStorage.removeItem('myguardian-started');
  };

  return (
    <LandingPageContext.Provider value={{ hasStarted, goToLandingPage, handleGetStarted, isLoading }}>
      {children}
    </LandingPageContext.Provider>
  );
}

export function useLandingPage() {
  const context = useContext(LandingPageContext);
  if (context === undefined) {
    throw new Error('useLandingPage must be used within a LandingPageProvider');
  }
  return context;
}
