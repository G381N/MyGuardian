'use client';

import { useState, useRef, useEffect } from 'react';
import { guardianAngelChatAdvice } from '@/ai/flows/guardian-angel-chat-advice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
    };
    
    // Clear previous messages to avoid history
    setMessages([userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const result = await guardianAngelChatAdvice({ question: currentInput });
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.advice,
      };
      setMessages([userMessage, assistantMessage]);
    } catch (error) {
      console.error('Chat advice failed:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to get a response. Please try again.',
      });
      // Reset messages on error
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col md:h-screen">
      <header className="border-b p-4">
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Guardian Angel Chat
        </h1>
        <p className="text-sm text-muted-foreground">
          Seek empathetic, pastoral advice grounded in scripture.
        </p>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 sm:p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary/20 text-primary">
                        <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground shadow-sm'
                  )}
                >
                  <p className="whitespace-pre-wrap font-body">{message.content}</p>
                </div>
                {message.role === 'user' && (
                   <Avatar className="h-8 w-8 border">
                     <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User />
                     </AvatarFallback>
                   </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 justify-start">
                <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary/20 text-primary">
                        <Bot />
                    </AvatarFallback>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-card shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t p-4 bg-background">
                  <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your Guardian Angel for guidance..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
            {messages.length > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setMessages([])}
                className="px-3"
                title="Clear conversation"
              >
                ✕
              </Button>
            )}
          </form>
      </div>
    </div>
  );
}
