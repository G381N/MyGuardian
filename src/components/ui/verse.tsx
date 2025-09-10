'use client';

import React from 'react';

interface VerseProps {
  bookId: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  className?: string;
}

export function Verse({ bookId, book, chapter, verse, text, className = '' }: VerseProps) {
  return (
    <span className={`verse ${className}`}>
      <sup className="verse-number text-xs font-semibold text-amber-600 dark:text-amber-400 mr-1">
        {verse}
      </sup>
      <span className="verse-text">{text}</span>
    </span>
  );
}
