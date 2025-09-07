'use server';

import * as fs from 'fs/promises';
import * as path from 'path';

export interface Verse {
  bookId: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  count: number;
}

export interface Book {
  id: number;
  name: string;
  chapters: number[];
}

let cpdvData: Verse[] = [];
let booksData: Book[] = [];

async function loadCPDVData(): Promise<Verse[]> {
  if (cpdvData.length > 0) {
    return cpdvData;
  }

  const filePath = path.join(process.cwd(), 'src', 'cpdv.csv');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    
    // Skip header row and parse CPDV format
    const data = lines.slice(1).map((line) => {
      // Handle CSV parsing with potential commas in quoted text
      const match = line.match(/^(\d+),([^,]+),(\d+),"([^"]*)"(?:\|.*)?.*,(\d+),(\d+)$/);
      if (match) {
        const [, bookId, book, chapter, text, count, verse] = match;
        return {
          bookId: parseInt(bookId, 10),
          book: book.trim(),
          chapter: parseInt(chapter, 10),
          verse: parseInt(verse, 10),
          text: text.replace(/"/g, '').trim(),
          count: parseInt(count, 10),
        };
      }
      
      // Fallback parsing for lines that don't match (like Maccabees)
      const parts = line.split(',');
      if (parts.length >= 6) {
        const bookId = parseInt(parts[0], 10);
        const book = parts[1];
        const chapter = parseInt(parts[2], 10);
        let text = parts[3];
        const count = parseInt(parts[parts.length - 2], 10);
        const verse = parseInt(parts[parts.length - 1], 10);
        
        // Clean up text
        if (text.startsWith('"') && text.endsWith('"')) {
          text = text.slice(1, -1);
        }
        
        if (!isNaN(bookId) && book && !isNaN(chapter) && !isNaN(verse) && text) {
          return {
            bookId,
            book: book.trim(),
            chapter,
            verse,
            text: text.trim(),
            count: isNaN(count) ? text.length : count,
          };
        }
      }
      
      return null;
    }).filter((v): v is Verse => v !== null && v.text.length > 0 && v.book.length > 0);

    cpdvData = data;
    
    // Generate books data
    const bookMap = new Map<number, { name: string; chapters: Set<number> }>();
    
    data.forEach(verse => {
      if (!bookMap.has(verse.bookId)) {
        bookMap.set(verse.bookId, { name: verse.book, chapters: new Set() });
      }
      bookMap.get(verse.bookId)!.chapters.add(verse.chapter);
    });
    
    booksData = Array.from(bookMap.entries()).map(([id, { name, chapters }]) => ({
      id,
      name,
      chapters: Array.from(chapters).sort((a, b) => a - b),
    })).sort((a, b) => a.id - b.id);
    
    return cpdvData;
  } catch (error) {
    console.error('Failed to read or parse cpdv.csv:', error);
    return [];
  }
}

// Load the data when the server starts
loadCPDVData();

export async function getRandomVerse(seed?: string): Promise<Verse> {
  const verses = await loadCPDVData();
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
  const verses = await loadCPDVData();
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

export async function getBooks(): Promise<Book[]> {
  await loadCPDVData(); // Ensure data is loaded
  return booksData;
}

export async function getChapters(bookId: number): Promise<number[]> {
  await loadCPDVData();
  const book = booksData.find(b => b.id === bookId);
  return book ? book.chapters : [];
}

export async function getVerses(bookId: number, chapter: number): Promise<Verse[]> {
  const verses = await loadCPDVData();
  return verses.filter(v => v.bookId === bookId && v.chapter === chapter);
}

export async function getVerse(bookId: number, chapter: number, verse: number): Promise<Verse | null> {
  const verses = await loadCPDVData();
  return verses.find(v => v.bookId === bookId && v.chapter === chapter && v.verse === verse) || null;
}

export async function getChapter(bookId: number, chapter: number): Promise<Verse[]> {
  return getVerses(bookId, chapter);
}

export async function getBookByName(bookName: string): Promise<Book | null> {
  await loadCPDVData();
  return booksData.find(b => b.name.toLowerCase() === bookName.toLowerCase()) || null;
}

export async function getTestamentBooks(testament: 'old' | 'new'): Promise<Book[]> {
  await loadCPDVData();
  // Old Testament books typically have IDs 1-39, New Testament 40-66
  // This is a rough approximation and might need adjustment based on the actual CPDV dataset
  if (testament === 'old') {
    return booksData.filter(b => b.id <= 39);
  } else {
    return booksData.filter(b => b.id >= 40);
  }
}
