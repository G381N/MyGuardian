'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface MobileBibleTopNavProps {
  bookName: string;
  chapterNumber: number;
  chapterTitle?: string;
  onTutorialClick: (event: React.MouseEvent) => void;
}

export function MobileBibleTopNav({
  bookName,
  chapterNumber,
  chapterTitle,
  onTutorialClick
}: MobileBibleTopNavProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-12 bg-white/95 dark:bg-gray-800/95 border-b border-amber-200 dark:border-blue-800 backdrop-blur-md flex items-center justify-between px-4 shadow-lg">
      <div className="flex-1 overflow-hidden">
        <h2 className="font-headline text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          <span className="font-bold text-amber-700 dark:text-amber-400">{bookName}</span> – <span>Chapter {chapterNumber}</span>
          {chapterTitle && <span className="ml-1">– <span className="italic text-amber-600 dark:text-amber-300">{chapterTitle}</span></span>}
        </h2>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => onTutorialClick(e)}
        className="rounded-full ml-2 h-8 w-8 p-0 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}
