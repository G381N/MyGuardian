'use client';

import { useState, useRef, useEffect } from 'react';
import { anonymousConfessionalTranscription } from '@/ai/flows/anonymous-confessional-transcription';
import { anonymousConfessionalGuidance } from '@/ai/flows/anonymous-confessional-guidance';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square, Loader2, Wand2, Edit3, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

type RecordingState = 'idle' | 'recording' | 'stopped' | 'transcribing' | 'guiding';

interface Guidance {
    relevantVerses: string;
    reflection: string;
}

export default function ConfessionalPage() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [transcription, setTranscription] = useState('');
  const [guidance, setGuidance] = useState<Guidance | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioDataUri(reader.result as string);
        };
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setRecordingState('recording');
      setTranscription('');
      setGuidance(null);
      setAudioDataUri(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        variant: 'destructive',
        title: 'Microphone Error',
        description: 'Could not access the microphone. Please check your browser permissions.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecordingState('stopped');
    }
  };
  
  useEffect(() => {
    if (recordingState === 'stopped' && audioDataUri) {
        async function transcribeAudio() {
            setRecordingState('transcribing');
            try {
                const result = await anonymousConfessionalTranscription({ audioDataUri });
                setTranscription(result.transcription);
            } catch (error) {
                console.error('Transcription failed:', error);
                toast({
                    variant: 'destructive',
                    title: 'Transcription Failed',
                    description: 'Could not transcribe the audio. Please try again.',
                });
            } finally {
                setRecordingState('idle');
            }
        }
        transcribeAudio();
    }
  }, [audioDataUri, recordingState, toast]);

  const handleGetGuidance = async () => {
    if (!transcription.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Confession',
        description: 'Please provide a transcription before seeking guidance.',
      });
      return;
    }
    setRecordingState('guiding');
    setGuidance(null);
    try {
      const result = await anonymousConfessionalGuidance({ transcription });
      setGuidance(result);
    } catch (error) {
      console.error('Guidance failed:', error);
      toast({
        variant: 'destructive',
        title: 'Guidance Failed',
        description: 'Could not generate guidance. Please try again.',
      });
    } finally {
      setRecordingState('idle');
    }
  };

  const isProcessing = recordingState === 'transcribing' || recordingState === 'guiding';

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <header>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Anonymous Confessional
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            A private space to unburden your heart. All data is ephemeral and is not stored.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Mic className="h-5 w-5" />
              Step 1: Record Your Thoughts
            </CardTitle>
            <CardDescription>
              Click the button to start recording. Speak freely.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
             {recordingState !== 'recording' ? (
                <Button onClick={handleStartRecording} size="lg" disabled={isProcessing}>
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                </Button>
            ) : (
                <Button onClick={handleStopRecording} size="lg" variant="destructive">
                    <Square className="mr-2 h-5 w-5" />
                    Stop Recording
                </Button>
            )}
            {recordingState === 'recording' && (
                <div className="flex items-center text-sm text-muted-foreground">
                    <span className="relative mr-2 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive"></span>
                    </span>
                    Recording in progress...
                </div>
            )}
          </CardContent>
        </Card>

        {(transcription || recordingState === 'transcribing') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Edit3 className="h-5 w-5" />
                Step 2: Review & Edit
              </CardTitle>
              <CardDescription>
                Review the transcription of your recording. Edit if needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recordingState === 'transcribing' ? (
                <div className="flex h-32 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Your transcribed confession will appear here..."
                  rows={8}
                  className="resize-none"
                />
              )}
              <Button onClick={handleGetGuidance} disabled={isProcessing || !transcription}>
                {recordingState === 'guiding' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                )}
                Seek Guidance
              </Button>
            </CardContent>
          </Card>
        )}
        
        {recordingState === 'guiding' && (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Finding relevant scripture and preparing your guidance...</span>
                    </div>
                </CardContent>
            </Card>
        )}

        {guidance && recordingState === 'idle' && (
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <BookOpen className="h-5 w-5" />
                            Relevant Verses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                            <p className="whitespace-pre-wrap font-body">{guidance.relevantVerses}</p>
                        </blockquote>
                    </CardContent>
                </Card>

                <Separator />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <Wand2 className="h-5 w-5" />
                            Reflection
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Alert className="border-accent bg-accent/10">
                            <Wand2 className="h-4 w-4 !text-accent-foreground" />
                            <AlertTitle className="font-headline text-accent-foreground">A Message of Hope</AlertTitle>
                            <AlertDescription className="text-accent-foreground/80">
                                <p className="whitespace-pre-wrap font-body leading-relaxed">{guidance.reflection}</p>
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
}
