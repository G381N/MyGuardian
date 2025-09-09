"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";

interface TutorialStep {
  title: string;
  content: React.ReactNode;
  image?: string;
  position?: "top" | "right" | "bottom" | "left" | "center";
  target?: string; // CSS selector for the target element
  offsetY?: number; // Optional vertical offset
  offsetX?: number; // Optional horizontal offset
}

interface TutorialProps {
  steps: TutorialStep[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
  tutorialKey?: string; // For storing in localStorage to prevent showing again
}

export function Tutorial({
  steps,
  open,
  onOpenChange,
  onComplete,
  tutorialKey
}: TutorialProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [hasShown, setHasShown] = React.useState(false);
  const [targetElement, setTargetElement] = React.useState<HTMLElement | null>(null);
  const [position, setPosition] = React.useState<{top: number, left: number}>({top: 0, left: 0});
  
  // Use ref to track if onOpenChange has been called
  const hasClosedRef = React.useRef(false);
  
  // Check if tutorial has been completed before
  React.useEffect(() => {
    if (!open || hasClosedRef.current) return;
    
    if (tutorialKey && typeof window !== 'undefined') {
      const completed = localStorage.getItem(`tutorial-${tutorialKey}`);
      if (completed === 'true') {
        hasClosedRef.current = true;
        onOpenChange(false);
      }
    }
  }, [tutorialKey, onOpenChange, open]);
  
  // Reset hasClosedRef when tutorial is opened
  React.useEffect(() => {
    if (open) {
      hasClosedRef.current = false;
    }
  }, [open]);
  
  // Set tutorial as completed
  const completeTutorial = React.useCallback(() => {
    if (tutorialKey && typeof window !== 'undefined') {
      localStorage.setItem(`tutorial-${tutorialKey}`, 'true');
    }
    
    if (onComplete) {
      onComplete();
    }
    
    hasClosedRef.current = true;
    onOpenChange(false);
  }, [onComplete, onOpenChange, tutorialKey]);
  
  // Use refs to prevent unnecessary re-renders
  const updatePositionRef = React.useRef<(() => void) | null>(null);
  const targetRef = React.useRef<HTMLElement | null>(null);
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null);
  
  // Find target element and position tutorial card
  React.useEffect(() => {
    if (!open) return;
    
    // Set a timeout to ensure the tutorial stays open long enough for users to see it
    const stayOpenTimeout = setTimeout(() => {}, 300); // Keep component mounted
    
    if (!steps[currentStep]?.target) {
      // If no target, center in viewport with safer positioning
      if (steps[currentStep]) {
        // Apply any custom offsets for centered tutorials
        const offsetY = steps[currentStep].offsetY || 0;
        const offsetX = steps[currentStep].offsetX || 0;
        
        // More responsive centering based on screen size
        const cardWidth = window.innerWidth < 640 ? Math.min(window.innerWidth - 32, 300) : 350;
        const cardHeight = window.innerWidth < 640 ? 270 : 250;
        
        setPosition({
          top: Math.max(24, (window.innerHeight / 2) - (cardHeight / 2) + offsetY),
          left: Math.max(16, (window.innerWidth / 2) - (cardWidth / 2) + offsetX)
        });
      }
      return () => clearTimeout(stayOpenTimeout);
    }
    
    const target = document.querySelector(steps[currentStep].target as string) as HTMLElement;
    if (!target) return;
    
    targetRef.current = target;
    setTargetElement(target);
    
    const updatePosition = () => {
      if (!targetRef.current) return;
      
      const rect = targetRef.current.getBoundingClientRect();
      const position = steps[currentStep].position || 'bottom';
      
      // More responsive width calculation
      const maxCardWidth = window.innerWidth < 640 ? 300 : 350;
      const cardWidth = Math.min(window.innerWidth - 32, maxCardWidth);
      
      // More accurate card height estimation based on content
      const cardHeight = window.innerWidth < 640 ? 270 : 250; // slightly taller on mobile
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      let top, left;
      
      // Update pulse animation position
      const pulseAnimation = document.querySelector('.tutorial-pulse-animation') as HTMLDivElement;
      if (pulseAnimation) {
        pulseAnimation.style.top = `${rect.top}px`;
        pulseAnimation.style.left = `${rect.left}px`;
        pulseAnimation.style.width = `${rect.width}px`;
        pulseAnimation.style.height = `${rect.height}px`;
      }
      
      // Initial positions based on preferred position with better mobile handling
      const isMobile = window.innerWidth < 640;
      const isVerySmallScreen = window.innerWidth < 360 || window.innerHeight < 600;
      const spacing = isVerySmallScreen ? 8 : (isMobile ? 12 : 16); // Even less spacing on very small screens
      
      switch (position) {
        case 'top':
          top = rect.top - spacing - cardHeight;
          left = rect.left + (rect.width / 2) - (cardWidth / 2);
          // On very small screens, if the element is near the edge, switch to bottom
          if ((isMobile && rect.top < 100) || (isVerySmallScreen && rect.top < 120)) {
            top = rect.bottom + spacing;
          }
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (cardHeight / 2);
          left = rect.right + spacing;
          // On mobile, if there's not enough space to the right, center it
          if (isMobile && rect.right > windowWidth - cardWidth - 40) {
            left = windowWidth / 2 - cardWidth / 2;
          }
          break;
        case 'bottom':
          top = rect.bottom + spacing;
          left = rect.left + (rect.width / 2) - (cardWidth / 2);
          // On very small screens, if the element is near the bottom, switch to top
          if (isMobile && rect.bottom > windowHeight - 150) {
            top = rect.top - spacing - cardHeight;
          }
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (cardHeight / 2);
          left = rect.left - spacing - cardWidth;
          // On mobile, if there's not enough space to the left, center it
          if (isMobile && rect.left < cardWidth + 40) {
            left = windowWidth / 2 - cardWidth / 2;
          }
          break;
        case 'center':
        default:
          top = windowHeight / 2 - cardHeight / 2;
          left = windowWidth / 2 - cardWidth / 2;
          break;
      }
      
      // Apply any custom offsets from the step definition
      const offsetY = steps[currentStep].offsetY || 0;
      const offsetX = steps[currentStep].offsetX || 0;
      
      top += offsetY;
      left += offsetX;
      
      // Make sure card stays within viewport
      // Horizontal adjustments
      if (left < 16) left = 16;
      if (left + cardWidth > windowWidth - 16) left = windowWidth - cardWidth - 16;
      
      // Vertical adjustments with better boundaries for all screen sizes
      if (top < 24) top = 24; // Minimum padding from top
      
      // Ensure the card stays within the visible area with extra padding at the bottom
      const bottomMargin = 20;
      if (top + cardHeight > windowHeight - bottomMargin) {
        top = windowHeight - cardHeight - bottomMargin;
      }
      
      // Additional safety check for small screens
      if (top < 24) top = 24;
      
      // Only update position if it actually changed
      setPosition(prev => {
        if (Math.abs(prev.top - top) > 5 || Math.abs(prev.left - left) > 5) {
          return { top, left };
        }
        return prev;
      });
    };
    
    updatePositionRef.current = updatePosition;
    updatePosition();
    
    // Use a more robust approach to update positioning on viewport changes
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }
    
    resizeObserverRef.current = new ResizeObserver(() => {
      if (updatePositionRef.current) {
        window.requestAnimationFrame(updatePositionRef.current);
      }
    });
    
    resizeObserverRef.current.observe(document.body);
    
    // Also handle orientation changes explicitly
    const handleOrientationChange = () => {
      setTimeout(() => {
        if (updatePositionRef.current) {
          updatePositionRef.current();
        }
      }, 100); // Small delay to ensure dimensions are updated
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Also handle scroll events
    const handleScroll = () => {
      if (updatePositionRef.current) {
        window.requestAnimationFrame(updatePositionRef.current);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add highlighting to target element
    target.classList.add('tutorial-highlight');
    
    // Add a subtle pulsing animation effect to draw attention to the target
    const rect = targetRef.current.getBoundingClientRect();
    const pulseAnimation = document.createElement('div');
    pulseAnimation.classList.add('tutorial-pulse-animation');
    pulseAnimation.style.position = 'fixed';
    pulseAnimation.style.top = `${rect.top}px`;
    pulseAnimation.style.left = `${rect.left}px`;
    pulseAnimation.style.width = `${rect.width}px`;
    pulseAnimation.style.height = `${rect.height}px`;
    pulseAnimation.style.borderRadius = '8px';
    pulseAnimation.style.zIndex = '99';
    pulseAnimation.style.pointerEvents = 'none';
    pulseAnimation.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.3), 0 0 0 4px rgba(245, 158, 11, 0.1)';
    pulseAnimation.style.animation = 'tutorial-pulse 2s infinite';
    document.body.appendChild(pulseAnimation);
    
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (targetRef.current) {
        targetRef.current.classList.remove('tutorial-highlight');
      }
      
      // Remove any pulse animations
      document.querySelectorAll('.tutorial-pulse-animation').forEach(el => {
        el.remove();
      });
    };
  }, [open, currentStep, steps]);
  
  // Mark as shown
  React.useEffect(() => {
    if (open && !hasShown) {
      setHasShown(true);
    }
  }, [open, hasShown]);
  
  if (!open) return null;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[100] transition-opacity duration-200"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Tutorial Card with responsive width for mobile */}
      <Card 
        className="fixed z-[101] w-[calc(100%-32px)] max-w-[300px] sm:max-w-[350px] shadow-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 max-h-[90vh] flex flex-col"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Arrow pointer based on position */}
        {steps[currentStep]?.target && steps[currentStep]?.position && steps[currentStep]?.position !== 'center' && (
          <div 
            className={cn(
              "absolute w-4 h-4 bg-inherit transform rotate-45 border border-amber-200 dark:border-amber-800 z-0",
              steps[currentStep].position === 'top' ? "bottom-[-8px] left-1/2 ml-[-8px] border-b border-r" : "",
              steps[currentStep].position === 'right' ? "left-[-8px] top-1/2 mt-[-8px] border-l border-t" : "",
              steps[currentStep].position === 'bottom' ? "top-[-8px] left-1/2 ml-[-8px] border-t border-l" : "",
              steps[currentStep].position === 'left' ? "right-[-8px] top-1/2 mt-[-8px] border-r border-b" : ""
            )}
          />
        )}
        
        <CardHeader className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/50 dark:to-gray-800 border-b border-amber-200 dark:border-amber-800 p-3 pb-2.5 sm:p-4 sm:pb-3 rounded-t-lg relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-headline text-gray-900 dark:text-white">
              {steps[currentStep]?.title}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50" 
              onClick={() => onOpenChange(false)}
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 pb-2 px-4 sm:pt-5 sm:pb-3 sm:px-5 overflow-y-auto z-10 relative">
          {steps[currentStep]?.image && (
            <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden border border-amber-200 dark:border-amber-800 shadow-sm">
              <img 
                src={steps[currentStep].image} 
                alt={steps[currentStep].title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div className="text-sm text-gray-700 dark:text-gray-200 max-h-[50vh] overflow-y-auto">
            {steps[currentStep]?.content}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-amber-200 dark:border-amber-800 pt-2 pb-2 sm:pt-3 sm:pb-3 px-3 sm:px-4 mt-auto bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-b-lg">
          <div className="flex gap-1.5 sm:gap-2">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="h-7 text-xs border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <ChevronLeft className="h-3 w-3 mr-0.5 sm:mr-1" />
                Back
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-7 text-xs border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                Skip
                <X className="h-3 w-3 ml-0.5 sm:ml-1" />
              </Button>
            )}
          </div>
          
          <div className="flex gap-1.5 sm:gap-2">
            {currentStep < steps.length - 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="h-7 text-xs border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-0.5 sm:ml-1" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={completeTutorial}
                className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white"
              >
                Got it
                <Check className="h-3 w-3 ml-0.5 sm:ml-1" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Progress Indicators - Integrated with the header for better positioning */}
      <div className="absolute -top-0.5 left-0 right-0 flex justify-center z-[102] transform -translate-y-full">
        <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white dark:bg-gray-800 shadow-md border border-amber-200 dark:border-amber-800">
          {steps.map((_, index) => (
            <button 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-amber-600 dark:bg-amber-400 scale-125 shadow-sm' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-amber-300 dark:hover:bg-amber-700 opacity-70 hover:opacity-100'
              }`}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to step ${index + 1}`}
              title={`Step ${index + 1}: ${steps[index].title}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
