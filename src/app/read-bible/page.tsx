'use client';

import { useState, useEffect, useCallback, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronDown, ChevronLeft, ChevronRight, Filter, X, Maximize, Minimize, Heart, ArrowLeft, ArrowRight, BookOpen, Search, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTutorial } from '@/hooks/use-tutorial';
import { BiblePageTutorial } from '@/components/tutorials';
import { MobileBibleReader } from '@/components/mobile-bible-reader';
import { MobileBibleTopNav } from '@/components/mobile-bible-top-nav';
import { NavigationHints } from '@/components/navigation-hints';
import { Verse } from '@/components/ui/verse';

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

interface Testament {
  id: string;
  name: string;
  books: Book[];
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
  const [bookSelectorOpen, setBookSelectorOpen] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [testaments, setTestaments] = useState<Testament[]>([]);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { setActiveTutorial } = useTutorial();

  // Load books on component mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch('/api/scripture?action=books');
        if (!response.ok) throw new Error('Failed to fetch books');
        
        const booksData = await response.json();
        setBooks(booksData);
        setFilteredBooks(booksData);
        
        // Organize books by testament
        const oldTestamentBooks = booksData.filter((book: Book) => book.id < 40);
        const newTestamentBooks = booksData.filter((book: Book) => book.id >= 40);
        
        setTestaments([
          { id: 'old', name: 'Old Testament', books: oldTestamentBooks },
          { id: 'new', name: 'New Testament', books: newTestamentBooks }
        ]);
        
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
      setBookSelectorOpen(false);
    }
  };

  const handleMobileBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setBookSelectorOpen(false);
  };

  const getFilteredTestaments = () => {
    if (!bookSearchQuery.trim()) return testaments;
    
    return testaments.map(testament => ({
      ...testament,
      books: testament.books.filter(book => 
        book.name.toLowerCase().includes(bookSearchQuery.toLowerCase())
      )
    })).filter(testament => testament.books.length > 0);
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

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
    // Only process if not in an input field
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
    
    // Active dialogs/overlays should prevent navigation
    if (filterOpen || bookSelectorOpen || reflectionOpen) return;

    if (e.key === 'ArrowRight') {
      navigateChapter('next');
      e.preventDefault(); // Prevent scroll
    } else if (e.key === 'ArrowLeft') {
      navigateChapter('prev');
      e.preventDefault(); // Prevent scroll
    } else if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
      e.preventDefault();
    }
  }, [navigateChapter, isFullscreen, filterOpen, bookSelectorOpen, reflectionOpen]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown as any);
    return () => {
      document.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [handleKeyDown]);

  // For fullscreen navigation via mouse clicks
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

  const generateReflection = async (text: string) => {
    if (!text || !selectedBook) return;

    setGeneratingReflection(true);
    console.log("Generating reflection for:", text);

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
      console.log("Reflection result:", result);
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

  const contentRef = useRef<HTMLDivElement>(null);

  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 10) {
      // Check if the selection is within scripture content
      let isValidSelection = false;
      
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectionNode = range.commonAncestorContainer;
        
        // Find the scripture content container
        const scriptureContainer = document.querySelector('.scripture-content');
        
        // Check if the selection is within the scripture content
        if (scriptureContainer && 
            (scriptureContainer.contains(selectionNode) || 
             scriptureContainer.contains(selectionNode.parentElement))) {
          isValidSelection = true;
        }
      }
      
      if (!isValidSelection) {
        console.log("Selection outside scripture content - ignoring");
        return;
      }
      
      setHighlightedText(selectedText);
      setReflectionOpen(true);
      
      // Call the API to generate reflection
      await generateReflection(selectedText);
      
      // For mobile, clear the selection after capturing to avoid UI issues
      if (isMobile) {
        setTimeout(() => {
          if (selection && selection.removeAllRanges) {
            selection.removeAllRanges();
          }
        }, 500);
      }
    }
  }, [isMobile, generateReflection]);
  
  // For mobile touch selection - enhanced for better reliability
  const handleTouchEnd = useCallback(() => {
    // Delayed execution to allow selection to complete on mobile
    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      
      if (selectedText && selectedText.length > 10) {
        // Check if the selection is within scripture content
        let isValidSelection = false;
        
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const selectionNode = range.commonAncestorContainer;
          
          // Find the scripture content container
          const scriptureContainer = document.querySelector('.scripture-content');
          
          // Check if the selection is within the scripture content
          if (scriptureContainer && 
              (scriptureContainer.contains(selectionNode) || 
               scriptureContainer.contains(selectionNode.parentElement))) {
            isValidSelection = true;
          }
        }
        
        if (!isValidSelection) {
          console.log("Touch selection outside scripture content - ignoring");
          return;
        }
        
        setHighlightedText(selectedText);
        setReflectionOpen(true);
        generateReflection(selectedText);
        
        // Clear selection after a delay
        setTimeout(() => {
          if (selection && selection.removeAllRanges) {
            selection.removeAllRanges();
          }
        }, 300);
      }
    }, 300); // Increased delay for more reliable selection capture
  }, [generateReflection]);

  // Search function
  const performSearch = async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      toast({
        title: "Search Error",
        description: "Please enter at least 2 characters to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      const response = await fetch(`/api/scripture?action=search&query=${encodeURIComponent(query.trim())}`);
      if (!response.ok) throw new Error('Search failed');
      
      const results = await response.json();
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No verses found matching your search query.",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${results.length} verse${results.length === 1 ? '' : 's'} matching "${query}".`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search scripture. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Navigate to a specific verse from search results
  const navigateToVerse = (verse: Verse) => {
    const targetBook = books.find(book => book.id === verse.bookId);
    if (targetBook) {
      setSelectedBook(targetBook);
      setSelectedChapter(verse.chapter);
      setSearchOpen(false);
      
      // Scroll to the specific verse after a short delay
      setTimeout(() => {
        const verseElement = document.querySelector(`[data-verse="${verse.verse}"]`);
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the verse temporarily
          verseElement.classList.add('search-highlight');
          setTimeout(() => {
            verseElement.classList.remove('search-highlight');
          }, 3000);
        }
      }, 500);
      
      toast({
        title: "Navigated to Verse",
        description: `${verse.book} ${verse.chapter}:${verse.verse}`,
      });
    }
  };

  // Handler for tutorial button with debounce to prevent flickering
  const handleTutorialClick = useCallback((event?: React.MouseEvent) => {
    // Prevent default and stop propagation if event is provided
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Prevent multiple rapid clicks with a timeout
    const tutorialId = "bible-page";
    
    // Small delay to ensure event handling is complete
    setTimeout(() => {
      setActiveTutorial(tutorialId);
      
      // Store in session that we've clicked the tutorial button
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tutorial-clicked", "true");
      }
    }, 50);
  }, [setActiveTutorial]);

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
      {/* Mobile top navigation bar in fullscreen mode */}
      {isFullscreen && isMobile && (
        <MobileBibleTopNav 
          bookName={selectedBook?.name || ''}
          chapterNumber={selectedChapter}
          chapterTitle={selectedBook?.name === 'Genesis' && selectedChapter === 1 ? 'The Beginning' : undefined}
          onTutorialClick={handleTutorialClick}
        />
      )}
      
      {/* Navigation hints for mobile fullscreen mode */}
      <NavigationHints isFullscreen={isFullscreen} isMobile={isMobile} />
      
      {/* We removed the duplicate mobile bottom navigation - keeping only the original bottom navbar */}
      
      <div className={`${isFullscreen ? 'h-screen overflow-y-auto scrollbar-hide fullscreen-content pt-[40px] pb-16' : 'p-4 sm:p-6 md:p-8'} relative`}>
        <div className={`mx-auto ${isFullscreen ? 'max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl px-0' : 'max-w-5xl'} ${isFullscreen ? '' : 'space-y-6'}`}>
          {/* Header */}
          {!isFullscreen && (
            <header className="text-center space-y-2 relative">
              {/* Fullscreen Toggle Button for Desktop */}
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFullscreen}
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                  aria-label="Toggle fullscreen mode"
                >
                  <Maximize className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </Button>
              )}
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                ReadBible
              </h1>
              <p className="text-lg text-muted-foreground">
                Catholic Public Domain Version
              </p>
            </header>
          )}

          {/* Filter Bar - Desktop */}
          {!isFullscreen && !isMobile && (
            <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters & Navigation</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                  {/* Testament Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Testament</label>
                    <Select value={testament} onValueChange={(value: 'all' | 'old' | 'new') => setTestament(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent 
                        side="bottom" 
                        align="start" 
                        position="item-aligned"
                      >
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
                      <SelectContent side="bottom" align="start" className="max-h-[300px] overflow-y-auto">
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
                      <SelectContent 
                        side="bottom" 
                        align="start" 
                        className="max-h-[300px] overflow-y-auto"
                        position="item-aligned"
                      >
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
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" onClick={() => navigateChapter('prev')} className="flex-1">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        <span>Previous Chapter</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateChapter('next')} className="flex-1">
                        <span>Next Chapter</span>
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {/* Mobile Filter Button */}
          {!isFullscreen && isMobile && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setFilterOpen(true)}
              className="fixed bottom-6 left-6 h-12 w-12 rounded-full shadow-lg z-40 bg-amber-50/90 dark:bg-amber-900/90 backdrop-blur-sm border border-amber-200 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/80"
              aria-label="Open filters"
            >
              <Filter className="h-5 w-5" />
            </Button>
          )}

          {/* Current Location Badge */}
          {selectedBook && !isMobile && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {selectedBook.name} {selectedChapter}
              </Badge>
            </div>
          )}

          {/* Mobile Fullscreen Toggle (In floating button bar at bottom) */}
          {isMobile && !isFullscreen && (
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
              {/* Divine Reflection Button */}
              {highlightedText && !reflectionOpen && (
                <Button
                  onClick={() => setReflectionOpen(true)}
                  className="h-10 w-10 rounded-full shadow-lg bg-amber-500/90 hover:bg-amber-600/90 z-40 text-white dark:text-amber-50"
                  size="icon"
                  aria-label="Open divine reflection"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              )}
              {/* Fullscreen Button */}
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleFullscreen}
                className="h-12 w-12 rounded-full shadow-lg bg-amber-50/90 dark:bg-amber-900/90 backdrop-blur-sm border border-amber-200 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/80"
                aria-label="Enter fullscreen mode"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Left and Right Navigation Arrows - REMOVED to prevent duplication with NavigationHints */}

          {/* Mobile Bible Reader Component - Floating Bottom Navbar */}
          {isFullscreen && isMobile && (
            <MobileBibleReader
              currentBook={selectedBook?.name || ''}
              currentChapter={selectedChapter}
              onPrevious={() => navigateChapter('prev')}
              onNext={() => navigateChapter('next')}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
              canGoPrevious={!(selectedBook?.id === 1 && selectedChapter === 1)}
              canGoNext={!(selectedBook?.id === 66 && selectedChapter === 22)}
              onFilterOpen={() => setFilterOpen(true)}
              onBookSelect={() => setBookSelectorOpen(true)}
              onAIFeature={() => setReflectionOpen(true)}
              onSearch={() => setSearchOpen(true)}
            />
          )}
          
          {/* Bottom Navigation Bar (Fullscreen) for Desktop - Enhanced Design */}
          {isFullscreen && !isMobile && (
            <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
              <div className="flex items-center gap-3 py-3 px-6 bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-lg max-w-fit mx-auto">
                {/* Navigation Section */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigateChapter('prev')}
                    disabled={selectedBook?.id === 1 && selectedChapter === 1}
                    className="flex items-center gap-2 rounded-xl text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 px-4"
                    size="sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                  
                  {/* Current Location Display */}
                  <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                      {selectedBook?.name} {selectedChapter}
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigateChapter('next')}
                    disabled={selectedBook?.id === 66 && selectedChapter >= Math.max(...(selectedBook?.chapters || [1]))}
                    className="flex items-center gap-2 rounded-xl text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 px-4"
                    size="sm"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Divider */}
                <div className="w-px h-8 bg-amber-200 dark:bg-amber-800"></div>
                
                {/* Action Buttons Section */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBookSelectorOpen(true)}
                    className="rounded-xl text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center gap-2"
                    title="Select Book"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden lg:inline">Book</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchOpen(true)} 
                    className="rounded-xl text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center gap-2"
                    title="Search Scripture"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden lg:inline">Search</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReflectionOpen(true)}
                    className="rounded-xl text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center gap-2"
                    title="AI Reflection"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="hidden lg:inline">Reflect</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterOpen(true)}
                    className="rounded-xl text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center gap-2"
                    title="Chapter Options"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden lg:inline">Options</span>
                  </Button>
                </div>
                
                {/* Divider */}
                <div className="w-px h-8 bg-amber-200 dark:bg-amber-800"></div>
                
                {/* Exit Fullscreen */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFullscreen(false)}
                  className="rounded-xl text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center gap-2"
                  title="Exit Fullscreen"
                >
                  <Minimize className="h-4 w-4" />
                  <span className="hidden lg:inline">Exit</span>
                </Button>
              </div>
            </div>
          )}

          {/* Scripture Content */}
          <Card className={`bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm border-amber-200 dark:border-blue-800 shadow-xl ${isFullscreen ? 'mt-0 border-t-0 rounded-t-none' : ''}`}>
            <CardContent className={`${isFullscreen ? 'p-4 sm:p-8 pt-3' : 'p-8 sm:p-12'}`}>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div 
                    className="prose prose-xl prose-gray dark:prose-invert max-w-none selection:bg-amber-100 dark:selection:bg-amber-800/40 selection:text-amber-900 dark:selection:text-amber-100 scripture-content" 
                    onMouseUp={handleTextSelection}
                    onTouchEnd={handleTouchEnd}
                    data-tutorial="scripture-content"
                    ref={contentRef}
                  >
                    <div className="text-xl leading-8 text-gray-900 dark:text-gray-100 font-headline select-text text-justify">
                      {/* Only show hint text if not in fullscreen mode */}
                      {isMobile && !isFullscreen && (
                        <div className="mb-4 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800" data-ui-element="true">
                          <p>Highlight any text to receive AI-powered spiritual insights</p>
                        </div>
                      )}
                      <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-amber-600 dark:first-letter:text-amber-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:mt-2 indent-0">
                        {verses.map((verse, index) => (
                          <span key={verse.verse} data-verse={verse.verse}>
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
            <div className="flex justify-center items-center gap-3 md:gap-4 pb-6" data-tutorial="chapter-navigation">
              <Button 
                variant="outline" 
                onClick={() => navigateChapter('prev')} 
                disabled={!selectedBook}
                className="flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1 md:mr-2" />
                <span className="sm:hidden">Prev</span>
                <span className="hidden sm:inline">Previous Chapter</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigateChapter('next')} 
                disabled={!selectedBook}
                className="flex items-center justify-center"
              >
                <span className="sm:hidden">Next</span>
                <span className="hidden sm:inline">Next Chapter</span>
                <ChevronRight className="h-4 w-4 ml-1 md:ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Divine Reflection Button */}
      {!isMobile && !isFullscreen && highlightedText && !reflectionOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
          <Button
            onClick={() => setReflectionOpen(true)}
            className="h-10 w-10 rounded-full shadow-lg bg-amber-500 hover:bg-amber-600 text-white"
            size="icon"
            aria-label="Open divine reflection"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
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

      {/* Mobile Book Selection Sheet */}
      <Sheet open={bookSelectorOpen} onOpenChange={setBookSelectorOpen}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-[80vh] overflow-hidden flex flex-col">
          <SheetHeader className="px-1">
            <SheetTitle className="font-headline text-xl">
              Select a Bible Book
            </SheetTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search books..." 
                className="pl-8"
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
              />
              {bookSearchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1 h-8 w-8 p-0" 
                  onClick={() => setBookSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-1 mt-4 overflow-y-auto pr-4 pb-6">
            <div className="space-y-6 pb-2" data-tutorial="book-selector">
              {getFilteredTestaments().map((testament) => (
                <div key={testament.id} className="space-y-2">
                  <h3 className="font-semibold text-amber-700 dark:text-amber-300 text-sm uppercase tracking-wider">
                    {testament.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {testament.books.map((book) => (
                      <Button
                        key={book.id}
                        variant={selectedBook?.id === book.id ? "default" : "outline"}
                        className="h-auto py-2 justify-start font-normal text-sm"
                        onClick={() => handleMobileBookSelect(book)}
                      >
                        {book.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              
              {getFilteredTestaments().length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No books found matching "{bookSearchQuery}"
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      
      {/* Mobile Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-headline text-xl flex items-center gap-2">
              <Filter className="h-5 w-5 text-amber-600" />
              Bible Filters
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-8">
            {/* Testament Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Testament</label>
              <Select value={testament} onValueChange={(value: 'all' | 'old' | 'new') => setTestament(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="bottom" align="start" position="popper">
                  <SelectItem value="all">All Books</SelectItem>
                  <SelectItem value="old">Old Testament</SelectItem>
                  <SelectItem value="new">New Testament</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Book Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Book</label>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilterOpen(false);
                  setTimeout(() => setBookSelectorOpen(true), 300);
                }}
                className="w-full justify-between"
              >
                <span>{selectedBook?.name || "Select a book"}</span>
                <BookOpen className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Chapter Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chapter</label>
              <Select value={selectedChapter.toString()} onValueChange={handleChapterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="bottom" align="start" position="popper" className="max-h-[200px] overflow-y-auto">
                  {selectedBook?.chapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter.toString()}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Navigation Buttons */}
            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium">Navigate</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigateChapter('prev');
                    setFilterOpen(false);
                  }}
                  className="w-full flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span>Previous</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigateChapter('next');
                    setFilterOpen(false);
                  }}
                  className="w-full flex items-center justify-center"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {/* Tutorial */}
      <BiblePageTutorial />
      
      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="text-center font-headline flex items-center justify-center gap-2">
              <Search className="h-5 w-5 text-amber-600" />
              Search Scripture
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 flex-1 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Input
                placeholder="Try: love, faith, psalm 23, john 3:16..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim().length > 1) {
                    performSearch(searchQuery);
                  }
                }}
                disabled={isSearching}
              />
              <Button 
                onClick={() => performSearch(searchQuery)}
                disabled={isSearching || searchQuery.trim().length < 2}
                className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>
            
            {/* Quick search examples */}
            {!isSearching && searchResults.length === 0 && searchQuery.trim().length === 0 && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium mb-2">Quick search examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {['love', 'faith and hope', 'psalm 23', 'john 3:16', '"be still"'].map((example) => (
                      <button
                        key={example}
                        onClick={() => {
                          setSearchQuery(example);
                          performSearch(example);
                        }}
                        className="px-3 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="flex-1 overflow-hidden">
                <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Found {searchResults.length} result{searchResults.length === 1 ? '' : 's'}:
                </div>
                <ScrollArea className="h-72 sm:h-80">
                  <div className="space-y-3 pr-4">
                    {searchResults.map((verse, index) => (
                      <div
                        key={`${verse.bookId}-${verse.chapter}-${verse.verse}`}
                        className="p-3 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer transition-colors"
                        onClick={() => navigateToVerse(verse)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                            {verse.book} {verse.chapter}:{verse.verse}
                          </span>
                          <Button variant="ghost" size="sm" className="text-xs p-1 h-auto">
                            Go to verse →
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                          {verse.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Searching scripture...</p>
                </div>
              </div>
            )}
            
            {!isSearching && searchResults.length === 0 && searchQuery.trim().length > 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  No verses found for "{searchQuery}"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
