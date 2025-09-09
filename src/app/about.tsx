'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, MessageSquareQuote, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <Card className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg mb-8">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-b border-amber-200 dark:border-amber-800">
        <CardTitle className="font-headline text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Heart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          My Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <div className="prose prose-amber dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            For years, I found myself distant from scripture. Even when I wanted to engage with God's Word, 
            much of it felt too complex to grasp fully, and finding meaningful personal reflection seemed beyond reach. 
            This disconnect lasted until I watched <em>The Chosen</em> series, which sparked something profound in me.
          </p>
          
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
            I realized I wasn't alone—many seekers desire to know the Lord more deeply but need guidance 
            along the way. As an MCA student in India, I initially created this app for my personal journey, 
            to help me understand and reflect on scripture that once seemed impenetrable.
          </p>
          
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
            What began as a personal tool has grown into something I humbly share with others. 
            MyGuardian represents a small contribution—my attempt to help fellow seekers find their way 
            through scripture with AI-powered guidance that makes the Bible's wisdom more accessible and personal.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link href="/confessional">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex gap-2 items-center justify-center">
                <MessageSquareQuote className="h-5 w-5" />
                Try Confessional
              </Button>
            </Link>
            <Link href="/chat">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex gap-2 items-center justify-center">
                <Zap className="h-5 w-5" />
                Chat with Guardian Angel
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
