'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Bot, MessageSquareQuote, Book, Heart, Cross, Sparkles, Zap, X, HelpCircle } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TutorialProvider, useTutorial } from '@/hooks/use-tutorial';
import { GettingStartedTutorial } from '@/components/tutorials';

const navItems = [
  { 
    href: '/', 
    icon: BookOpen, 
    label: "Today's Reading",
    description: "Daily scripture & reflection",
    color: "text-amber-600 dark:text-amber-400"
  },
  { 
    href: '/confessional', 
    icon: MessageSquareQuote, 
    label: 'Confessional',
    description: "Anonymous spiritual guidance",
    color: "text-purple-600 dark:text-purple-400",
    tutorialId: "confession-page",
    tutorialAttr: "confessional-nav"
  },
  { 
    href: '/chat', 
    icon: Zap, 
    label: 'Guardian Angel',
    description: "AI-powered biblical counsel",
    color: "text-blue-600 dark:text-blue-400",
    tutorialId: "guardian-page",
    tutorialAttr: "guardian-nav"
  },
  { 
    href: '/read-bible', 
    icon: Book, 
    label: 'ReadBible',
    description: "CPDV with AI reflections",
    color: "text-green-600 dark:text-green-400",
    tutorialId: "bible-page",
    tutorialAttr: "bible-nav"
  },
  { 
    href: '/how-to-pray', 
    icon: Heart, 
    label: 'How to Pray',
    description: "Contextual prayer guidance",
    color: "text-rose-600 dark:text-rose-400"
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();
  const { setActiveTutorial, resetTutorials } = useTutorial();

  const handleTutorialClick = React.useCallback((event: React.MouseEvent) => {
    // Prevent event propagation to avoid any parent click handlers
    event.preventDefault();
    event.stopPropagation();
    
    // Small delay to ensure any click events are fully processed
    setTimeout(() => {
      setActiveTutorial("getting-started");
    }, 50);
  }, [setActiveTutorial]);

  return (
    <>
      <Sidebar className="border-r border-amber-200 dark:border-amber-800">
        <SidebarHeader className="border-b border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
          <div className="flex items-center p-4 relative">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700 cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
              aria-label={open ? "Close sidebar" : "Open sidebar"}
            >
              <Cross className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </button>
            <Link href="/" className="flex flex-col ml-3 hover:opacity-80 transition-opacity">
              <h1 className="font-headline text-xl font-bold text-gray-900 dark:text-white">MyGuardian</h1>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Your Spiritual Companion</p>
            </Link>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="bg-gradient-to-b from-white via-amber-50/30 to-orange-50/30 dark:from-gray-900 dark:via-amber-950/20 dark:to-orange-950/20 scrollbar-hide overflow-y-auto">
          <div className="p-2">
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      className={`
                        sidebar-menu-button
                        group relative h-auto p-3 rounded-xl transition-all duration-200
                        ${pathname === item.href 
                          ? 'bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700 shadow-sm' 
                          : 'hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border hover:border-amber-100 dark:hover:border-amber-800'
                        }
                      `}
                      tooltip={{ children: item.label, side: 'right', align: 'center' }}
                      data-tutorial={item.tutorialAttr}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 ${item.color}`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          <span className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.label}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">{item.description}</span>
                        </div>
                        {pathname === item.href && (
                          <div className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </SidebarContent>

        <SidebarFooter className="border-t border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs">
                  v5.0.0
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/30 flex items-center gap-1.5"
                onClick={(e) => handleTutorialClick(e)}
              >
                <HelpCircle className="h-4 w-4" />
                Tutorial
              </Button>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p className="font-medium">🔒 Completely Anonymous</p>
              <p>No data stored • Privacy guaranteed</p>
              <div className="pt-2">
                <Link href="/" className="text-amber-600 dark:text-amber-400 hover:underline">About My Journey</Link>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/50 dark:to-orange-950/50 backdrop-blur-sm md:hidden px-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
            >
              <Cross className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </button>
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <h1 className="font-headline text-lg font-bold text-gray-900 dark:text-white">MyGuardian</h1>
            </Link>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/30 flex items-center gap-1.5"
            onClick={(e) => handleTutorialClick(e)}
          >
            <HelpCircle className="h-4 w-4" />
            Tutorial
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
      
      {/* Desktop Sidebar Toggle - Shows when sidebar is closed on desktop */}
      {!open && (
        <button
          onClick={toggleSidebar}
          className="hidden md:flex fixed top-4 left-4 z-50 p-2.5 rounded-full bg-amber-100/90 dark:bg-amber-900/70 border border-amber-200 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-all duration-200 shadow-md backdrop-blur-sm items-center justify-center"
          aria-label="Open sidebar"
        >
          <Cross className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </button>
      )}
      
      {/* Tutorials */}
      <GettingStartedTutorial />
    </>
  );
}
