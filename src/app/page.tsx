'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getTodaysReading, getRandomReading, type DailyReading } from '@/data/daily-readings';
import { useEffect, useState } from 'react';
import { RefreshCw, Heart, BookOpen } from 'lucide-react';

export default function HomePage() {
  const [currentReading, setCurrentReading] = useState<DailyReading | null>(null);
  const [isRandom, setIsRandom] = useState(false);

  useEffect(() => {
    // Load today's reading on mount
    setCurrentReading(getTodaysReading());
  }, []);

  const handleNewReading = () => {
    setCurrentReading(getRandomReading());
    setIsRandom(true);
  };

  const handleTodaysReading = () => {
    setCurrentReading(getTodaysReading());
    setIsRandom(false);
  };

  if (!currentReading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading daily reading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {isRandom ? "Scripture Reflection" : "Today's Reading"}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {isRandom ? "A moment of divine guidance for your soul" : "Your daily moment of peace and contemplation"}
            </p>
            
            <div className="flex justify-center gap-3 mt-6">
              <Button 
                onClick={handleTodaysReading}
                variant={isRandom ? "outline" : "default"}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Today's Reading
              </Button>
              <Button 
                onClick={handleNewReading}
                variant={isRandom ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Random Scripture
              </Button>
            </div>
          </header>
          
          {/* Topic Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-sm font-medium rounded-full border border-amber-200 dark:border-amber-700">
              Topic: {currentReading.topic}
            </span>
          </div>

          {/* Scripture Card */}
          <Card className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm border-amber-200 dark:border-blue-800 shadow-xl mb-6">
            <CardHeader className="text-center bg-gradient-to-r from-amber-50 to-sky-50 dark:from-gray-900 dark:to-blue-950 border-b border-amber-200 dark:border-blue-800">
              <CardTitle className="font-headline text-2xl text-gray-900 dark:text-gray-100">
                {currentReading.book} {currentReading.chapter}:{currentReading.verses}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <blockquote className="text-center">
                <p className="text-xl leading-8 text-gray-900 dark:text-gray-100 font-headline italic text-justify">
                  "{currentReading.text}"
                </p>
              </blockquote>
            </CardContent>
          </Card>

          {/* Reflection Card */}
          <Card className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm border-amber-200 dark:border-blue-800 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-amber-50 dark:from-blue-950 dark:to-gray-900 border-b border-amber-200 dark:border-blue-800">
              <CardTitle className="font-headline text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Heart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                Divine Reflection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                <p className="text-lg leading-8 text-gray-700 dark:text-gray-300 text-justify">
                  {currentReading.reflection}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {currentReading.keywords.map((keyword) => (
              <span 
                key={keyword}
                className="px-3 py-1 bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 text-xs font-medium rounded-full border border-sky-200 dark:border-sky-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
