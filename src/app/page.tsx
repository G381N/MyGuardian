'use client';

import { generateDailyReflection } from '@/ai/flows/daily-scripture-reflection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';

interface ReflectionData {
  passage: string;
  reflection: string;
}

export default function HomePage() {
  const [reflectionData, setReflectionData] = useState<ReflectionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getDailyReflection() {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const data = await generateDailyReflection({ date: today });
        setReflectionData(data);
      } catch (error) {
        console.error('Failed to generate daily reflection:', error);
        setError('Could not load reflection. Please try again later.');
      }
    }
    getDailyReflection();
  }, []);

  const passage = reflectionData?.passage ?? 'Loading scripture...';
  const reflection = reflectionData?.reflection ?? 'Loading reflection...';

  if (error) {
    return (
       <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl text-center">
            <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Today's Reading & Reflection
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            A moment of peace and contemplation for your day.
          </p>
        </header>
        
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Daily Scripture</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
              <p className="whitespace-pre-wrap font-body">{passage}</p>
            </blockquote>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">AI-Powered Reflection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap font-body leading-relaxed">
              {reflection}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
