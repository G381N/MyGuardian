'use client';

import { useState, useRef, useEffect } from 'react';
import { guardianAngelChatAdvice } from '@/ai/flows/guardian-angel-chat-advice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, User, Bot, Loader2, MessageCircle, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="flex h-[calc(100vh-3.5rem)] flex-col md:h-screen">
        <header className="border-b border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700">
              <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Guardian Angel Chat
              </h1>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                AI-powered biblical counsel
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Seek empathetic, pastoral advice grounded in scripture. Each conversation is private and stateless.
          </p>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {messages.length === 0 && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <Card className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-700">
                <CardContent className="pt-6 text-center">
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/50 w-fit mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    Welcome to Guardian Angel Chat
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Ask any question about faith, life challenges, or spiritual guidance. 
                    I'll provide biblical wisdom and pastoral care.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Scripture-based
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                      🔒 Anonymous
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 sm:p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-700 shadow-sm">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                          <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md rounded-xl p-4 shadow-sm',
                      message.role === 'user'
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-blue-100 dark:border-blue-800'
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-700 shadow-sm">
                       <AvatarFallback className="bg-blue-600 dark:bg-blue-700 text-white">
                          <User className="h-5 w-5" />
                       </AvatarFallback>
                     </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-700 shadow-sm">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                          <Bot className="h-5 w-5" />
                      </AvatarFallback>
                  </Avatar>
                  <div className="max-w-md rounded-xl p-4 bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-800 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Guardian Angel is thinking...</span>
                      </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="border-t border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your Guardian Angel for guidance..."
                disabled={isLoading}
                className="pr-12 h-12 text-base border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 focus:border-blue-400 dark:focus:border-blue-500 shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <MessageCircle className="h-4 w-4 text-blue-400 dark:text-blue-500" />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
            {messages.length > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setMessages([])}
                className="h-12 px-4 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                title="Clear conversation"
              >
                ✕
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
