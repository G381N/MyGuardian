'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize, Minimize, BookOpen, Filter, Heart, Search } from 'lucide-react';

interface MobileBibleReaderProps {
  currentBook: string;
  currentChapter: number;
  onPrevious: () => void;
  onNext: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onFilterOpen?: () => void;
  onBookSelect?: () => void;
  onAIFeature?: () => void;
  onSearch?: () => void;
}

export function MobileBibleReader({
  currentBook,
  currentChapter,
  onPrevious,
  onNext,
  isFullscreen,
  toggleFullscreen,
  canGoPrevious,
  canGoNext,
  onFilterOpen,
  onBookSelect,
  onAIFeature,
  onSearch
}: MobileBibleReaderProps) {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
      <div className="flex gap-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg border border-amber-200 dark:border-blue-800 backdrop-blur-md">
        {/* Previous Chapter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        {/* Book Picker Button */}
        {onBookSelect && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBookSelect}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30"
          >
            <BookOpen className="h-5 w-5" />
          </Button>
        )}
        
        {/* Filter Button */}
        {onFilterOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterOpen}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30"
          >
            <Filter className="h-5 w-5" />
          </Button>
        )}
        
        {/* Search Button */}
        {onSearch && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSearch}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
        
        {/* AI Feature Button */}
        {onAIFeature && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAIFeature}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30"
          >
            <Heart className="h-5 w-5" />
          </Button>
        )}
        
        {/* Fullscreen Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30"
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>
        
        {/* Next Chapter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!canGoNext}
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
