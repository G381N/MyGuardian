"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

export type TutorialId = 
  | "getting-started" 
  | "bible-page" 
  | "confession-page" 
  | "guardian-page";

type TutorialContextType = {
  activeTutorial: TutorialId | null;
  setActiveTutorial: (id: TutorialId | null) => void;
  dismissTutorial: (id: TutorialId) => void;
  hasDismissedTutorial: (id: TutorialId) => boolean;
  resetTutorials: () => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [activeTutorial, setActiveTutorialState] = useState<TutorialId | null>(null);
  const [dismissedTutorials, setDismissedTutorials] = useState<Record<string, boolean>>({});
  const initializedRef = useRef(false);
  const autoShowTriggeredRef = useRef(false);
  
  // Load dismissed tutorials from localStorage on mount (only once)
  useEffect(() => {
    if (typeof window !== "undefined" && !initializedRef.current) {
      try {
        const savedDismissed = localStorage.getItem("dismissed-tutorials");
        if (savedDismissed) {
          setDismissedTutorials(JSON.parse(savedDismissed));
        }
        initializedRef.current = true;
      } catch (error) {
        console.error("Error loading dismissed tutorials:", error);
      }
    }
  }, []);

  // Show getting-started tutorial automatically on first visit if not dismissed
  // With forced display on component mount and more reliable mobile handling
  useEffect(() => {
    if (initializedRef.current && 
        !dismissedTutorials["getting-started"] && 
        activeTutorial === null &&
        !autoShowTriggeredRef.current) {
      
      // Mark that we've attempted to show the tutorial
      autoShowTriggeredRef.current = true;
      
      // Use a longer delay on mobile to ensure the UI is fully rendered
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const timer = setTimeout(() => {
        setActiveTutorialState("getting-started");
      }, isMobile ? 2500 : 1500);
      
      return () => clearTimeout(timer);
    }
  }, [dismissedTutorials, activeTutorial]);

  // Save to localStorage when dismissed tutorials change
  useEffect(() => {
    if (initializedRef.current && typeof window !== "undefined") {
      localStorage.setItem("dismissed-tutorials", JSON.stringify(dismissedTutorials));
    }
  }, [dismissedTutorials]);

  // Safe setter function that won't cause an infinite loop
  const setActiveTutorial = useCallback((id: TutorialId | null) => {
    setActiveTutorialState(id);
  }, []);

  const dismissTutorial = useCallback((id: TutorialId) => {
    setDismissedTutorials(prev => {
      // Only update if the value is changing
      if (!prev[id]) {
        return { ...prev, [id]: true };
      }
      return prev;
    });
    
    setActiveTutorialState(current => {
      // Only update if the value is changing
      return current === id ? null : current;
    });
  }, []);

  const hasDismissedTutorial = useCallback((id: TutorialId) => {
    return !!dismissedTutorials[id];
  }, [dismissedTutorials]);

  const resetTutorials = useCallback(() => {
    // Clear dismissed tutorials and explicitly show the getting started tutorial
    setDismissedTutorials({});
    
    // A slight delay before showing the tutorial again
    setTimeout(() => {
      setActiveTutorialState("getting-started");
    }, 300);
    
    // Reset the auto-show trigger
    autoShowTriggeredRef.current = false;
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    activeTutorial,
    setActiveTutorial,
    dismissTutorial,
    hasDismissedTutorial,
    resetTutorials,
  }), [activeTutorial, setActiveTutorial, dismissTutorial, hasDismissedTutorial, resetTutorials]);

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
