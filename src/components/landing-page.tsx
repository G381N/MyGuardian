'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cross, 
  BookOpen, 
  Heart, 
  Shield, 
  Users, 
  Zap,
  Lock,
  Eye,
  ArrowRight,
  Sparkles,
  MessageSquareQuote,
  Bot
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: BookOpen,
      title: "ReadBible",
      description: "Experience the CPDV Bible with AI-powered reflections and seamless navigation",
      benefits: ["Fullscreen reading mode", "Instant AI reflections", "Chapter navigation"]
    },
    {
      icon: Heart,
      title: "Daily Scripture",
      description: "Curated daily readings on essential topics for spiritual growth",
      benefits: ["20 handpicked scriptures", "Professional reflections", "Topic-based rotation"]
    },
    {
      icon: MessageSquareQuote,
      title: "Anonymous Confessional",
      description: "Private spiritual guidance with complete anonymity",
      benefits: ["AI-powered counsel", "Scriptural foundation", "Complete privacy"]
    },
    {
      icon: Bot,
      title: "Guardian Angel Chat",
      description: "Ask questions and receive biblical guidance instantly",
      benefits: ["Scripture-based answers", "Instant responses", "Spiritual counsel"]
    },
    {
      icon: Cross,
      title: "How to Pray",
      description: "Learn meaningful prayer for every life situation",
      benefits: ["Contextual prayers", "Step-by-step guidance", "Daily application"]
    }
  ];

  const benefits = [
    {
      icon: Lock,
      title: "Completely Anonymous",
      description: "No personal data stored. Your spiritual journey remains private."
    },
    {
      icon: Eye,
      title: "No Registration Required",
      description: "Start your spiritual journey immediately without any signup process."
    },
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Get instant, contextual biblical insights powered by advanced AI."
    },
    {
      icon: Shield,
      title: "Scripture-Based Guidance",
      description: "All advice and reflections are grounded in biblical truth."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Logo and Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 sm:mb-8">
            <div className="p-3 sm:p-4 rounded-full bg-amber-100 dark:bg-amber-900/50 border-2 border-amber-200 dark:border-amber-700">
              <Cross className="h-8 w-8 sm:h-12 sm:w-12 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                MyGuardian
              </h1>
              <p className="text-base sm:text-lg text-amber-600 dark:text-amber-400 font-medium">
                Your Personal Spiritual Companion
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <p className="mx-auto text-lg sm:text-xl leading-7 sm:leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mb-6 sm:mb-8 px-2">
            Created to help people better understand the Bible and the Word of God. 
            Get deeper context, spiritual insights, and personalized guidance—all while 
            maintaining complete anonymity and privacy.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200 dark:border-amber-700 text-center">
                <CardContent className="pt-4 sm:pt-6 pb-3 sm:pb-4 px-3 sm:px-6">
                  <benefit.icon className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 dark:text-amber-400 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white mb-1 sm:mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-amber-600 hover:bg-amber-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Get Started
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white/50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Everything You Need for Spiritual Growth
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-6 sm:leading-8 text-gray-600 dark:text-gray-300">
              Five powerful tools designed to deepen your relationship with God and understanding of His Word.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700 hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <CardTitle className="font-headline text-lg sm:text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1.5 sm:space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Trust Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 sm:mb-8">
              Your Privacy is Sacred
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <Card className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-700">
                <CardContent className="pt-4 sm:pt-6 text-center">
                  <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-green-600 dark:text-green-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-base sm:text-lg text-green-900 dark:text-green-100 mb-2">
                    Zero Data Storage
                  </h3>
                  <p className="text-sm sm:text-base text-green-700 dark:text-green-200">
                    No personal information, conversation history, or spiritual questions are ever saved or stored.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-700">
                <CardContent className="pt-4 sm:pt-6 text-center">
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 dark:text-blue-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-base sm:text-lg text-blue-900 dark:text-blue-100 mb-2">
                    Completely Anonymous
                  </h3>
                  <p className="text-sm sm:text-base text-blue-700 dark:text-blue-200">
                    Use all features without creating an account. Your spiritual journey stays between you and God.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-700 rounded-xl p-6 sm:p-8">
              <blockquote className="text-base sm:text-lg italic text-amber-800 dark:text-amber-200 mb-3 sm:mb-4">
                "For where two or three gather in my name, there am I with them."
              </blockquote>
              <p className="text-sm sm:text-base text-amber-700 dark:text-amber-300 font-medium">
                — Matthew 18:20
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700">
        <div className="mx-auto max-w-2xl text-center px-4 sm:px-6">
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-amber-100 text-base sm:text-lg mb-6 sm:mb-8">
            Start exploring the Word of God with AI-powered insights and guidance.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            variant="secondary"
            className="bg-white text-amber-600 hover:bg-amber-50 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Cross className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Enter MyGuardian
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
