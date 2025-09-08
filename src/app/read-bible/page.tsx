'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ChevronDown, ChevronLeft, ChevronRight, Filter, X, Maximize, Minimize, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// Define types locally to avoid server import issues
interface Verse {
  bookId: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  count: number;
}

interface Book {
  id: number;
  name: string;
  chapters: number[];
}

export default function ReadBiblePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [testament, setTestament] = useState<'all' | 'old' | 'new'>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflection, setReflection] = useState<string>('');
  const [generatingReflection, setGeneratingReflection] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  // Load books on component mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch('/api/scripture?action=books');
        if (!response.ok) throw new Error('Failed to fetch books');
        
        const booksData = await response.json();
        setBooks(booksData);
        setFilteredBooks(booksData);
        if (booksData.length > 0) {
          setSelectedBook(booksData[0]);
        }
      } catch (error) {
        console.error('Failed to load books:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load Bible books. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [toast]);

  // Filter books by testament
  useEffect(() => {
    const filterBooks = async () => {
      if (testament === 'all') {
        setFilteredBooks(books);
      } else {
        try {
          const response = await fetch(`/api/scripture?action=testament-books&testament=${testament}`);
          if (!response.ok) throw new Error('Failed to fetch testament books');
          
          const testamentBooks = await response.json();
          setFilteredBooks(testamentBooks);
        } catch (error) {
          console.error('Failed to filter books:', error);
          setFilteredBooks(books);
        }
      }
    };

    filterBooks();
  }, [testament, books]);

  // Load chapter verses when book or chapter changes
  useEffect(() => {
    const loadChapter = async () => {
      if (!selectedBook) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/scripture?action=chapter&bookId=${selectedBook.id}&chapter=${selectedChapter}`);
        if (!response.ok) throw new Error('Failed to fetch chapter');
        
        const chapterVerses = await response.json();
        setVerses(chapterVerses);
      } catch (error) {
        console.error('Failed to load chapter:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load chapter. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [selectedBook, selectedChapter, toast]);

  const handleBookChange = (bookId: string) => {
    const book = filteredBooks.find(b => b.id.toString() === bookId);
    if (book) {
      setSelectedBook(book);
      setSelectedChapter(1);
    }
  };

  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(parseInt(chapter, 10));
  };

  const navigateChapter = useCallback((direction: 'prev' | 'next') => {
    if (!selectedBook) return;

    if (direction === 'prev') {
      if (selectedChapter > 1) {
        setSelectedChapter(selectedChapter - 1);
      } else {
        // Navigate to previous book's last chapter
        const currentIndex = filteredBooks.findIndex(b => b.id === selectedBook.id);
        if (currentIndex > 0) {
          const prevBook = filteredBooks[currentIndex - 1];
          setSelectedBook(prevBook);
          setSelectedChapter(Math.max(...prevBook.chapters));
        }
      }
    } else {
      if (selectedChapter < Math.max(...selectedBook.chapters)) {
        setSelectedChapter(selectedChapter + 1);
      } else {
        // Navigate to next book's first chapter
        const currentIndex = filteredBooks.findIndex(b => b.id === selectedBook.id);
        if (currentIndex < filteredBooks.length - 1) {
          const nextBook = filteredBooks[currentIndex + 1];
          setSelectedBook(nextBook);
          setSelectedChapter(Math.min(...nextBook.chapters));
        }
      }
    }
  }, [selectedBook, selectedChapter, filteredBooks]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFullscreenNavigation = useCallback((e: MouseEvent) => {
    if (!isFullscreen) return;
    
    const target = e.target as HTMLElement;
    // Ignore clicks on buttons or interactive elements
    if (target.closest('button') || target.closest('[role="button"]') || target.closest('select')) return;
    
    const clickX = e.clientX;
    const screenWidth = window.innerWidth;
    
    if (clickX < screenWidth * 0.25) {
      navigateChapter('prev');
    } else if (clickX > screenWidth * 0.75) {
      navigateChapter('next');
    }
  }, [isFullscreen, navigateChapter]);

  useEffect(() => {
    if (isFullscreen) {
      // Auto-fit content and hide system scrollbars
      document.body.style.overflow = 'hidden';
      
      // Reset scroll position when entering fullscreen
      const container = document.querySelector('.fullscreen-content');
      if (container) {
        container.scrollTop = 0;
      }
      
      document.addEventListener('click', handleFullscreenNavigation);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('click', handleFullscreenNavigation);
      };
    }
  }, [isFullscreen, handleFullscreenNavigation]);

  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 10) {
      setHighlightedText(selectedText);
      setReflectionOpen(true);
      await generateReflection(selectedText);
    }
  }, [selectedBook, selectedChapter]);

  const generateReflection = async (text: string) => {
    if (!text || !selectedBook) return;

    setGeneratingReflection(true);

    try {
      const response = await fetch('/api/biblical-reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedText: text,
          context: `${selectedBook.name} Chapter ${selectedChapter}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate reflection');
      }

      const result = await response.json();
      setReflection(result.reflection);
    } catch (error) {
      console.error('Failed to generate reflection:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate reflection. Please try again.',
      });
    } finally {
      setGeneratingReflection(false);
    }
  };

  if (loading && !selectedBook) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Bible...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className={`${isFullscreen ? 'h-screen overflow-y-auto scrollbar-hide fullscreen-content' : 'p-4 sm:p-6 md:p-8'} relative`}>
        <div className={`mx-auto ${isFullscreen ? 'max-w-4xl px-8 py-6' : 'max-w-5xl'} space-y-6`}>
          {/* Header */}
          {!isFullscreen && (
            <header className="text-center space-y-2">
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                ReadBible
              </h1>
              <p className="text-lg text-muted-foreground">
                Catholic Public Domain Version
              </p>
            </header>
          )}

          {/* Filter Bar */}
          {!isFullscreen && (
            <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters & Navigation
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Testament Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Testament</label>
                    <Select value={testament} onValueChange={(value: 'all' | 'old' | 'new') => setTestament(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Books</SelectItem>
                        <SelectItem value="old">Old Testament</SelectItem>
                        <SelectItem value="new">New Testament</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Book Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Book</label>
                    <Select value={selectedBook?.id.toString() || ''} onValueChange={handleBookChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBooks.map((book) => (
                          <SelectItem key={book.id} value={book.id.toString()}>
                            {book.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Chapter Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chapter</label>
                    <Select value={selectedChapter.toString()} onValueChange={handleChapterChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedBook?.chapters.map((chapter) => (
                          <SelectItem key={chapter} value={chapter.toString()}>
                            Chapter {chapter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Navigation */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Navigate</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateChapter('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateChapter('next')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Current Location Badge */}
          {selectedBook && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {selectedBook.name} {selectedChapter}
              </Badge>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>

          {/* Left Navigation Arrow (Fullscreen) */}
          {isFullscreen && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button variant="ghost" size="icon" onClick={() => navigateChapter('prev')}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
          )}

          {/* Right Navigation Arrow (Fullscreen) */}
          {isFullscreen && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button variant="ghost" size="icon" onClick={() => navigateChapter('next')}>
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          )}

          {/* Bottom Navigation Bar (Fullscreen) */}
          {isFullscreen && (
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-amber-200 dark:border-blue-800 p-4 z-20">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <Button 
                  variant="outline" 
                  onClick={() => navigateChapter('prev')}
                  disabled={selectedBook?.id === 1 && selectedChapter === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous Chapter
                </Button>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsFullscreen(false)}
                    className="h-9 w-9"
                  >
                    <Minimize className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigateChapter('next')}
                  disabled={selectedBook?.id === 66 && selectedChapter >= Math.max(...(selectedBook?.chapters || [1]))}
                  className="flex items-center gap-2"
                >
                  Next Chapter
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Scripture Content */}
          <Card className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm border-amber-200 dark:border-blue-800 shadow-xl">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-amber-50 to-sky-50 dark:from-gray-900 dark:to-blue-950 border-b border-amber-200 dark:border-blue-800">
              <CardTitle className="font-headline text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {selectedBook?.name}
              </CardTitle>
              <div className="text-2xl font-semibold text-amber-700 dark:text-amber-300 mb-4">
                Chapter {selectedChapter}
              </div>
              {selectedBook?.name === 'Genesis' && selectedChapter === 1 && (
                <div className="text-lg font-medium text-gray-600 dark:text-gray-400 italic">
                  "The Beginning"
                </div>
              )}
            </CardHeader>
            <CardContent className="p-8 sm:p-12">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="prose prose-xl prose-gray dark:prose-invert max-w-none" onMouseUp={handleTextSelection}>
                    <div className="text-xl leading-8 text-gray-900 dark:text-gray-100 font-headline select-text text-justify">
                      <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-amber-600 dark:first-letter:text-amber-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:mt-2 indent-0">
                        {verses.map((verse, index) => (
                          <span key={verse.verse}>
                            <sup className="text-sm font-bold text-amber-600 dark:text-amber-400 mr-1 relative -top-1">
                              {verse.verse}
                            </sup>
                            {verse.text}
                            {index < verses.length - 1 ? ' ' : ''}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  
                  {verses.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        No verses found for this chapter.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom Navigation */}
          {!isFullscreen && (
            <div className="flex justify-center items-center gap-4 pb-6">
              <Button variant="outline" onClick={() => navigateChapter('prev')} disabled={!selectedBook}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Chapter
              </Button>
              <Button variant="outline" onClick={() => navigateChapter('next')} disabled={!selectedBook}>
                Next Chapter
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {highlightedText && !reflectionOpen && (
        <Button
          onClick={() => setReflectionOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
          size="icon"
        >
          <Heart className="h-6 w-6" />
        </Button>
      )}

      {/* Reflection Sidebar */}
      <Sheet open={reflectionOpen} onOpenChange={setReflectionOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-headline text-xl flex items-center gap-2">
              <Heart className="h-5 w-5 text-amber-600" />
              Divine Reflection
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            {highlightedText && (
              <Card className="bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                    Selected Scripture:
                  </p>
                  <blockquote className="text-amber-800 dark:text-amber-200 border-l-4 border-amber-300 dark:border-amber-600 pl-4">
                    <p className="line-clamp-2 text-sm">
                      {highlightedText.length > 100 
                        ? `${highlightedText.substring(0, 100)}...` 
                        : highlightedText
                      }
                    </p>
                  </blockquote>
                </CardContent>
              </Card>
            )}
            
            <Separator />
            
            {generatingReflection ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating reflection...</p>
                </div>
              </div>
            ) : reflection ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {reflection}
                </p>
              </div>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
