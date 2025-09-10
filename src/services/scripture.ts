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
      if (!line.trim()) return null;
      
      // Split by comma but handle quoted text properly
      const parts: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i-1] === ',')) {
          inQuotes = true;
          continue;
        } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
          inQuotes = false;
          continue;
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim());
          current = '';
          continue;
        }
        current += char;
      }
      parts.push(current.trim());
      
      if (parts.length >= 6) {
        const bookId = parseInt(parts[0], 10);
        const book = parts[1];
        const chapter = parseInt(parts[2], 10);
        let text = parts[3];
        const count = parseInt(parts[4], 10);
        const verse = parseInt(parts[5], 10);
        
        // Clean up text - fix encoding issues and special characters
        text = text
          .replace(/�/g, '"')     // Replace diamond symbols with proper quotes
          .replace(/"/g, '"')     // Replace opening smart quotes
          .replace(/"/g, '"')     // Replace closing smart quotes
          .replace(/'/g, "'")     // Replace smart apostrophes
          .replace(/'/g, "'")     // Replace opening smart apostrophes
          .replace(/–/g, "-")     // Replace en dash
          .replace(/—/g, "--")    // Replace em dash
          .replace(/…/g, "...")   // Replace ellipsis
          .replace(/\u00A0/g, " ") // Replace non-breaking spaces
          .replace(/\u2013/g, "-") // Replace en dash (unicode)
          .replace(/\u2014/g, "--") // Replace em dash (unicode)
          .replace(/\u2018/g, "'") // Replace left single quotation mark
          .replace(/\u2019/g, "'") // Replace right single quotation mark
          .replace(/\u201C/g, '"') // Replace left double quotation mark
          .replace(/\u201D/g, '"') // Replace right double quotation mark
          .replace(/\u2026/g, "...") // Replace horizontal ellipsis
          .replace(/\s+/g, " ")    // Replace multiple spaces with single space
          .trim();
        
        if (!isNaN(bookId) && book && !isNaN(chapter) && !isNaN(verse) && text) {
          return {
            bookId,
            book: book.trim(),
            chapter,
            verse,
            text,
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

  const normalizedQuery = query.toLowerCase().trim();
  
  // Check if query is a specific verse reference (e.g., "john 3:16", "psalm 23:1")
  const verseRefMatch = normalizedQuery.match(/^(\w+)\s*(\d+):(\d+)$/);
  if (verseRefMatch) {
    const [, bookName, chapterStr, verseStr] = verseRefMatch;
    const chapterNum = parseInt(chapterStr);
    const verseNum = parseInt(verseStr);
    
    const specificVerse = verses.find(v => 
      v.book.toLowerCase().includes(bookName) && 
      v.chapter === chapterNum && 
      v.verse === verseNum
    );
    
    return specificVerse ? [specificVerse] : [];
  }
  
  // Check if query is a chapter reference (e.g., "psalm 23", "john 3")
  const chapterRefMatch = normalizedQuery.match(/^(\w+)\s*(\d+)$/);
  if (chapterRefMatch) {
    const [, bookName, chapterStr] = chapterRefMatch;
    const chapterNum = parseInt(chapterStr);
    
    const chapterVerses = verses.filter(v => 
      v.book.toLowerCase().includes(bookName) && 
      v.chapter === chapterNum
    );
    
    if (chapterVerses.length > 0) {
      return chapterVerses.slice(0, 20); // Limit to first 20 verses of chapter
    }
  }

  // Regular text search
  const searchTerms = normalizedQuery.split(' ').filter(term => term.length > 1);
  
  if (searchTerms.length === 0) {
    return [];
  }
  
  const results = verses.filter(verse => {
    const verseText = verse.text.toLowerCase();
    const bookName = verse.book.toLowerCase();
    
    // Exact phrase search if query is in quotes
    if (normalizedQuery.startsWith('"') && normalizedQuery.endsWith('"')) {
      const phrase = normalizedQuery.slice(1, -1);
      return verseText.includes(phrase);
    }
    
    // Multiple term search - all terms must be present
    if (searchTerms.length > 1) {
      return searchTerms.every(term => 
        verseText.includes(term) || bookName.includes(term)
      );
    }
    
    // Single term search
    const term = searchTerms[0];
    return verseText.includes(term) || bookName.includes(term);
  });

  // Sort results by relevance
  const sortedResults = results.sort((a, b) => {
    const aText = a.text.toLowerCase();
    const bText = b.text.toLowerCase();
    
    // Prioritize exact matches
    const aExact = searchTerms.some(term => aText.includes(term));
    const bExact = searchTerms.some(term => bText.includes(term));
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    // Then by book order
    return a.bookId - b.bookId || a.chapter - b.chapter || a.verse - b.verse;
  });

  return sortedResults.slice(0, 50); // Limit results to avoid overload
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
