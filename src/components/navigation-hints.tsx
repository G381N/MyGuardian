'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationHintsProps {
  isFullscreen: boolean;
  isMobile: boolean;
}

export function NavigationHints({ isFullscreen, isMobile }: NavigationHintsProps) {
  if (!isFullscreen || !isMobile) return null;
  
  return (
    <>
      {/* Left navigation hint */}
      <div className="fixed left-0 top-0 bottom-0 w-12 z-40 flex items-center justify-center pointer-events-none">
        <div className="bg-black/10 dark:bg-white/10 rounded-r-full p-2 backdrop-blur-sm">
          <ChevronLeft className="h-6 w-6 text-black/40 dark:text-white/40" />
        </div>
      </div>
      
      {/* Right navigation hint */}
      <div className="fixed right-0 top-0 bottom-0 w-12 z-40 flex items-center justify-center pointer-events-none">
        <div className="bg-black/10 dark:bg-white/10 rounded-l-full p-2 backdrop-blur-sm">
          <ChevronRight className="h-6 w-6 text-black/40 dark:text-white/40" />
        </div>
      </div>
    </>
  );
}
