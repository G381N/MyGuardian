'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Plus, Sparkles } from 'lucide-react';
import { Verse, Book, getBooks, getChapter, getTestamentBooks } from '@/services/scripture';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

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
  const { toast } = useToast();

  // Load books on component mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await getBooks();
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
          const testamentBooks = await getTestamentBooks(testament);
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
        const chapterVerses = await getChapter(selectedBook.id, selectedChapter);
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

  const navigateChapter = (direction: 'prev' | 'next') => {
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
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 10) {
      setHighlightedText(selectedText);
    }
  }, []);

  const generateReflection = async () => {
    if (!highlightedText) return;

    setGeneratingReflection(true);
    setReflectionOpen(true);

    try {
      // Simple reflection generation (in a real app, this would call your AI service)
      // For now, we'll create a template-based reflection
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const reflectionText = `Dear beloved child,

These words speak deeply to your heart: "${highlightedText}"

In these sacred verses, God reveals His love and guidance for your journey. Like a gentle shepherd, He speaks through scripture to comfort, strengthen, and direct your path. Let these words settle in your soul, knowing that the Almighty has placed them before you at just the right moment.

Remember, you are never alone. The Creator of the universe walks with you, speaks to you through His word, and loves you with an everlasting love. Allow these truths to transform your heart and guide your steps today.

May this passage be a light unto your path and a lamp unto your feet.

With divine love and guidance,
Your Guardian Angel`;

      setReflection(reflectionText);
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <header className="text-center space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              ReadBible
            </h1>
            <p className="text-lg text-muted-foreground">
              Catholic Public Domain Version
            </p>
          </header>

          {/* Filter Bar */}
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

          {/* Current Location Badge */}
          {selectedBook && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {selectedBook.name} {selectedChapter}
              </Badge>
            </div>
          )}

          {/* Scripture Content */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-sky-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-center font-headline text-2xl">
                {selectedBook?.name} Chapter {selectedChapter}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4" onMouseUp={handleTextSelection}>
                  {verses.map((verse) => (
                    <div key={verse.verse} className="flex gap-3">
                      <span className="text-sm font-medium text-primary min-w-[2rem] text-right">
                        {verse.verse}
                      </span>
                      <p className="text-base leading-relaxed select-text">
                        {verse.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      {highlightedText && (
        <Button
          onClick={generateReflection}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
          size="icon"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}

      {/* Reflection Modal */}
      <Dialog open={reflectionOpen} onOpenChange={setReflectionOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">Divine Reflection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {highlightedText && (
              <Card className="bg-sky-50 dark:bg-blue-950/50 border-sky-200 dark:border-blue-800">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-sky-700 dark:text-sky-300 mb-2">
                    Selected Scripture:
                  </p>
                  <blockquote className="italic text-sky-800 dark:text-sky-200 border-l-4 border-sky-300 dark:border-sky-600 pl-4">
                    "{highlightedText}"
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
              <div className="prose prose-sky dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {reflection}
                </p>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
