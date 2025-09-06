'use client';

import { useState } from 'react';
import { contextualPassageRetrieval } from '@/ai/flows/contextual-passage-retrieval';
import { analyzeScripture } from '@/ai/flows/ai-powered-interpretation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Wand2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

type ExplorationState = 'idle' | 'searching' | 'interpreting' | 'done';

interface Result {
  passage: string;
  interpretation: string;
}

export default function ExplorePage() {
  const [input, setInput] = useState('');
  const [state, setState] = useState<ExplorationState>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setResult(null);
    setState('searching');

    try {
      // Step 1: Retrieve contextual passage
      const passageResult = await contextualPassageRetrieval({ userInput: input });
      if (!passageResult || !passageResult.passage) {
        throw new Error('No passage was retrieved.');
      }
      setResult({ passage: passageResult.passage, interpretation: '' });
      setState('interpreting');

      // Step 2: Get AI-powered interpretation
      const interpretationResult = await analyzeScripture({
        passage: passageResult.passage,
        userInput: input,
      });

      setResult({
        passage: passageResult.passage,
        interpretation: interpretationResult.interpretation,
      });
      setState('done');

    } catch (error) {
      console.error('Exploration failed:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Could not complete the scripture exploration. Please try a different query.',
      });
      setState('idle');
    }
  };

  const isLoading = state === 'searching' || state === 'interpreting';

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <header>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explore Scripture
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Enter a topic, question, or feeling to find and interpret relevant scripture.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'finding strength in hard times'"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Explore
          </Button>
        </form>

        {isLoading && (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{state === 'searching' ? 'Finding relevant scripture...' : 'Interpreting the passage...'}</span>
                    </div>
                </CardContent>
            </Card>
        )}

        {result && state === 'done' && (
          <div className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <BookOpen />
                  Retrieved Scripture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                  <p className="whitespace-pre-wrap font-body">{result.passage}</p>
                </blockquote>
              </CardContent>
            </Card>

            <Separator />
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Wand2 />
                  AI-Powered Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap font-body leading-relaxed">
                  {result.interpretation}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
