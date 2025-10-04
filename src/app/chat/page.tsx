// made by gebin george
'use client';

import { useState, useRef, useEffect } from 'react';
import { guardianAngelChatAdvice } from '@/ai/flows/guardian-angel-chat-advice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, User, Loader2, MessageCircle, Sparkles, Zap, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTutorial } from '@/hooks/use-tutorial';
import { GuardianPageTutorial } from '@/components/tutorials';

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
  const { setActiveTutorial } = useTutorial();
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
      <div className="flex h-screen flex-col">
        <header className="flex-shrink-0 border-b border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                Guardian Angel Chat
              </h1>
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
                AI-powered biblical counsel
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTutorial("guardian-page")}
              className="h-8 w-8 text-blue-600 hover:bg-blue-100/50 flex-shrink-0"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Seek empathetic, pastoral advice grounded in scripture. Each conversation is private and stateless.
          </p>
        </header>

        <div className="flex-1 overflow-hidden relative min-h-0">
          {messages.length === 0 && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
              <Card className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-700">
                <CardContent className="pt-6 text-center">
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/50 w-fit mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-2">
                    Welcome to Guardian Angel Chat
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Ask any question about faith, life challenges, or spiritual guidance. 
                    I'll provide biblical wisdom and pastoral care.
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Scripture-based
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs">
                      🔒 Anonymous
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 pb-4" data-tutorial="guardian-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-blue-200 dark:border-blue-700 shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] sm:max-w-md rounded-xl p-3 sm:p-4 shadow-sm',
                      message.role === 'user'
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-blue-100 dark:border-blue-800'
                    )}
                    data-tutorial={message.role === 'assistant' ? 'guardian-scripture' : ''}
                  >
                    <p className="whitespace-pre-wrap text-xs sm:text-sm leading-5 sm:leading-6">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-blue-200 dark:border-blue-700 shadow-sm flex-shrink-0">
                       <AvatarFallback className="bg-blue-600 dark:bg-blue-700 text-white">
                          <User className="h-4 w-4 sm:h-5 sm:w-5" />
                       </AvatarFallback>
                     </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2 sm:gap-4 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-blue-200 dark:border-blue-700 shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                      </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[85%] sm:max-w-md rounded-xl p-3 sm:p-4 bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-800 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Guardian Angel is thinking...</span>
                      </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-shrink-0 border-t border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-3 sm:p-4">
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative min-w-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your Guardian Angel for guidance..."
                disabled={isLoading}
                className="pr-10 h-10 sm:h-12 text-sm sm:text-base border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 focus:border-blue-400 dark:focus:border-blue-500 shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                data-tutorial="guardian-input"
              />
              <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 dark:text-blue-500" />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="h-10 sm:h-12 px-3 sm:px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-sm flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </Button>
            {messages.length > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setMessages([])}
                className="h-10 sm:h-12 px-3 sm:px-4 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex-shrink-0"
                title="Clear conversation"
              >
                ✕
              </Button>
            )}
          </form>
        </div>
      </div>
      <GuardianPageTutorial />
    </div>
  );
}
