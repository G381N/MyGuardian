'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Code, Coffee, Cross, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <header className="text-center space-y-4">
            <Link href="/">
              <Button variant="ghost" className="mb-4 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to App
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Cross className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">
                About My Journey
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The story behind MyGuardian and why I created this spiritual companion
            </p>
          </header>

          {/* Developer Info */}
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-amber-200 dark:border-blue-800 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-full flex items-center justify-center mb-4">
                <Code className="h-12 w-12 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="font-headline text-2xl">The Developer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                    Full-Stack Developer
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    AI Enthusiast
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                    Faith-Driven
                  </Badge>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  Hello everyone, my name is <strong>Gebin</strong>. I am from Bangalore, India, and this is a small 
                  project that I built for myself to ask questions, read the Bible, and become a bit closer to God.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* The Vision */}
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-amber-200 dark:border-blue-800 shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                The Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                It all started when I started hearing songs from Forest Frank, and then I watched the series <em>The Chosen</em>. After watching this, it got me to repent and understand where I lack, and I wanted to get closer to God.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I remember when I was a kid, when I used to read the Bible, it was a bit too complex. 
                I feel it's the same way for people who want to seek but aren't able to. They want to seek 
                guidance but can't because even if they do read the Bible, the words are a bit too complex 
                for people to understand, especially for children.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Now coming to people who don't believe in Jesus—when they read the Word of God, like if they 
                buy a Bible and read it, it's too complex and they don't understand where to start. That's why 
                I made this application to help a person better understand what to do.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Core Values
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Complete privacy and anonymity</li>
                    <li>• Accessible spiritual guidance</li>
                    <li>• Biblical accuracy and reverence</li>
                    <li>• Inclusive and welcoming to all</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    App Features
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    It has all these AI features that will assist a person to get better understanding about 
                    what the Word says. We also have features like the Guardian Angel which will give guidance 
                    about what to do. It's not exactly saying what is right and wrong, but you can ask questions 
                    and it will basically check the Bible and give guidance based on what the Bible says.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Privacy and anonymity - no account needed</li>
                    <li>• Interactive design - works on laptop, phone, or tablet</li>
                    <li>• AI-powered biblical guidance</li>
                    <li>• No data storage - your conversations stay private</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Personal Message */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200 dark:border-amber-800 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="font-headline text-2xl text-amber-800 dark:text-amber-200">
                  A Personal Message
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "This app is just a small effort from my side, hoping it can help someone out there who needs guidance or comfort from the Word of God. I simply used what I know to make something that might make a difference for someone. May it be useful to you on your journey."
                </p>
                <p className="text-amber-700 dark:text-amber-300 font-medium">
                  May God show you the light and show you the things that you need so that you may have a wonderful journey. 🙏
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created with ❤️ by Gebin George for the glory of God • Version 5.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
