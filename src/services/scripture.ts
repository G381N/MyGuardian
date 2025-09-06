'use server';

import * as fs from 'fs/promises';
import * as path from 'path';

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

let kjvData: Verse[] = [];

async function loadKJVData(): Promise<Verse[]> {
  if (kjvData.length > 0) {
    return kjvData;
  }

  const filePath = path.join(process.cwd(), 'src', 'kjv.csv');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    
    // Skip header row
    const data = lines.slice(1).map((line) => {
      const [id, book, chapter, verse, text] = line.split(',');
      return {
        book,
        chapter: parseInt(chapter, 10),
        verse: parseInt(verse, 10),
        text: text ? text.replace(/"/g, '') : '',
      };
    }).filter(v => v.text && v.book); // Filter out empty lines or parsing errors

    kjvData = data;
    return kjvData;
  } catch (error) {
    console.error('Failed to read or parse kjv.csv:', error);
    return [];
  }
}

// Load the data when the server starts
loadKJVData();

export async function getRandomVerse(seed?: string): Promise<Verse> {
  const verses = await loadKJVData();
  if (verses.length === 0) {
    throw new Error('Scripture data is not loaded.');
  }

  // Simple pseudo-random generator based on a seed (e.g., date string)
  // This ensures the "random" verse is the same for a given seed.
  let index;
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    index = Math.abs(hash) % verses.length;
  } else {
    index = Math.floor(Math.random() * verses.length);
  }
  
  return verses[index];
}

export async function searchVerses(query: string): Promise<Verse[]> {
  const verses = await loadKJVData();
  if (verses.length === 0) {
    return [];
  }

  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  const results = verses.filter(verse => {
      const verseText = verse.text.toLowerCase();
      return searchTerms.some(term => verseText.includes(term));
  });

  return results.slice(0, 50); // Limit results to avoid overload
}
