"use client";

import * as React from "react";
import { useTutorial } from "@/hooks/use-tutorial";
import { Tutorial } from "@/components/ui/tutorial";

export function GettingStartedTutorial() {
  const { activeTutorial, dismissTutorial } = useTutorial();
  const isOpen = activeTutorial === "getting-started";

  const steps = [
    {
      title: "Welcome to MyGuardian",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-amber-700 dark:text-amber-400">Your personal spiritual companion</p>
          <p>MyGuardian offers AI-powered guidance, scripture insights, and a space for personal reflection.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Let's take a quick tour of the main features! You can access this tutorial anytime by clicking the <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded-md text-xs"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg> Tutorial</span> button.</p>
        </div>
      ),
      position: "center" as const,
    },
    {
      title: "Navigating MyGuardian",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-amber-700 dark:text-amber-400">Getting around the app</p>
          <p>The sidebar contains all the main sections of MyGuardian. You can open or close it using the cross icon in the top left.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Each section is color-coded to help you identify its purpose at a glance.</p>
        </div>
      ),
      position: "right" as const,
      target: ".sidebar-menu-button"
    },
    {
      title: "Guardian Angel Chat",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-blue-600 dark:text-blue-400">Your personal spiritual guide</p>
          <p>Ask questions about faith, seek guidance on difficult decisions, or simply chat with your Guardian Angel.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Powered by AI with spiritual and biblical understanding, your Guardian is here to support your journey.</p>
        </div>
      ),
      position: "top" as const,
      target: "[data-tutorial='guardian-nav']",
      offsetY: -80, // Add a significant negative offset to move it up
    },
    {
      title: "Bible Exploration",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-green-600 dark:text-green-400">Interactive scripture with AI insights</p>
          <p>Read the Bible and highlight any text to receive AI-powered reflections and interpretations.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Simply select text while reading to unlock deeper understanding tailored to your selections.</p>
        </div>
      ),
      position: "bottom" as const,
      target: "[data-tutorial='bible-nav']",
    },
    {
      title: "Confessional",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-purple-600 dark:text-purple-400">A private space for reflection</p>
          <p>Share your thoughts, struggles, or questions in this completely private space.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Receive compassionate guidance based on scripture and spiritual wisdom, with no data stored.</p>
        </div>
      ),
      position: "bottom" as const,
      target: "[data-tutorial='confessional-nav']",
    },
    {
      title: "You're Ready to Begin",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-amber-600 dark:text-amber-400">Your spiritual journey starts now</p>
          <p>Feel free to explore all the features MyGuardian has to offer at your own pace.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Each section has its own tutorial that you can access anytime by clicking the <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded-md text-xs"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg> Tutorial</span> button.</p>
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
            <p className="font-medium text-amber-800 dark:text-amber-300">Privacy First</p>
            <p className="text-sm text-amber-700 dark:text-amber-400">MyGuardian respects your privacy. No conversations are stored on our servers, and all interactions remain completely anonymous.</p>
          </div>
          <p className="mt-3 font-medium">Tap "Got it" to start exploring!</p>
        </div>
      ),
      position: "center" as const,
    },
  ];

  return (
    <Tutorial
      steps={steps}
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dismissTutorial("getting-started");
      }}
      tutorialKey="getting-started"
    />
  );
}

export function BiblePageTutorial() {
  const { activeTutorial, dismissTutorial } = useTutorial();
  const isOpen = activeTutorial === "bible-page";

  const steps = [
    {
      title: "Bible Exploration",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-green-600 dark:text-green-400">Interactive scripture with AI insights</p>
          <p>Welcome to the Bible page, where you can read scripture and receive AI-powered insights to deepen your understanding.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Here you'll learn how to navigate, read, and get personalized insights on any passage.</p>
        </div>
      ),
      position: "center" as const,
    },
    {
      title: "Select a Book",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-green-600 dark:text-green-400">Finding your way through scripture</p>
          <p>Use the book selector to choose which part of the Bible you want to explore.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">You can search by name or browse through Old and New Testament sections.</p>
        </div>
      ),
      position: "top" as const,
      target: "[data-tutorial='book-selector']",
    },
    {
      title: "Highlight for Insights",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-green-600 dark:text-green-400">Unlock deeper understanding</p>
          <p>Select any text while reading to highlight it and receive AI-powered reflections and interpretations.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            <span className="inline-block p-1 bg-amber-100 dark:bg-amber-900/30 rounded text-xs">💡 Tip: On mobile, tap and hold to select text, then release to see insights.</span>
          </p>
        </div>
      ),
      position: "bottom" as const,
      target: "[data-tutorial='scripture-content']",
    },
    {
      title: "Navigate Chapters",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-green-600 dark:text-green-400">Moving through the Bible</p>
          <p>Use these navigation buttons to move between different chapters of the current book.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">You can easily move forward and backward, or jump to a specific chapter using the filters menu.</p>
        </div>
      ),
      position: "top" as const,
      target: "[data-tutorial='chapter-navigation']",
    }
  ];

  return (
    <Tutorial
      steps={steps}
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dismissTutorial("bible-page");
      }}
      tutorialKey="bible-page"
    />
  );
}

export function ConfessionPageTutorial() {
  const { activeTutorial, dismissTutorial } = useTutorial();
  const isOpen = activeTutorial === "confession-page";

  const steps = [
    {
      title: "Welcome to Confessional",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-purple-600 dark:text-purple-400">A sacred space for reflection</p>
          <p>This is a private sanctuary for personal reflection, confession, and spiritual guidance.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Everything shared here is completely private—no data is stored and your interactions remain anonymous.</p>
        </div>
      ),
      position: "center" as const,
    },
    {
      title: "Share Your Thoughts",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-purple-600 dark:text-purple-400">Express yourself freely</p>
          <p>Type your reflections, concerns, questions, or confessions in this space.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            <span className="inline-block p-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs">🔒 Your thoughts remain private and are used only to provide personalized guidance.</span>
          </p>
        </div>
      ),
      position: "top" as const,
      target: "[data-tutorial='confession-input']",
    },
    {
      title: "Receive Guidance",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-purple-600 dark:text-purple-400">Spiritual wisdom and comfort</p>
          <p>After sharing, you'll receive thoughtful guidance that combines spiritual wisdom with scriptural context.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Each response is crafted to provide comfort, perspective, and a path forward based on your unique situation.</p>
        </div>
      ),
      position: "bottom" as const,
      target: "[data-tutorial='confession-response']",
    },
    {
      title: "Start Fresh",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-purple-600 dark:text-purple-400">Begin anew whenever you need</p>
          <p>When you're ready for a new reflection or have a different topic to discuss, you can start a fresh conversation.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Each conversation is a new opportunity for insight, healing, and spiritual growth.</p>
        </div>
      ),
      position: "bottom" as const,
      target: "[data-tutorial='confession-reset']",
    }
  ];

  return (
    <Tutorial
      steps={steps}
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dismissTutorial("confession-page");
      }}
      tutorialKey="confession-page"
    />
  );
}

export function GuardianPageTutorial() {
  const { activeTutorial, dismissTutorial } = useTutorial();
  const isOpen = activeTutorial === "guardian-page";

  const steps = [
    {
      title: "Guardian Angel Chat",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-blue-600 dark:text-blue-400">Your spiritual companion</p>
          <p>Welcome to the Guardian Angel chat, your personal space for spiritual conversation and divine guidance.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Your Guardian is here to listen, support, and guide you on your spiritual journey with wisdom drawn from scripture.</p>
        </div>
      ),
      position: "center" as const,
      offsetY: -80, // Add larger negative offset to move it up significantly
    },
    {
      title: "Ask Anything",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-blue-600 dark:text-blue-400">Seek wisdom and understanding</p>
          <p>Ask about scripture interpretation, ethical dilemmas, spiritual practices, or simply share what's on your mind.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            <span className="inline-block p-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">💭 Try questions like "How can I find inner peace?" or "Explain the parable of the prodigal son"</span>
          </p>
        </div>
      ),
      position: "top" as const,
      target: "[data-tutorial='guardian-input']",
    },
    {
      title: "Conversation History",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-blue-600 dark:text-blue-400">Your spiritual dialogue</p>
          <p>Your conversation with your Guardian Angel appears in this area, with your messages in blue and responses in white.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Each conversation is designed to be meaningful but remains private and is not stored permanently.</p>
        </div>
      ),
      position: "top" as const, // Changed from bottom to top
      target: "[data-tutorial='guardian-messages']",
      offsetY: -40, // Add negative offset to move it up
    },
    {
      title: "Scriptural Context",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-blue-600 dark:text-blue-400">Grounded in biblical wisdom</p>
          <p>Your Guardian Angel references scripture to provide context and depth to its guidance, connecting your questions to timeless wisdom.</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            <span className="inline-block p-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">✨ The responses balance spiritual insight, scriptural reference, and practical advice.</span>
          </p>
        </div>
      ),
      position: "right" as const,
      target: "[data-tutorial='guardian-scripture']",
    }
  ];

  return (
    <Tutorial
      steps={steps}
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dismissTutorial("guardian-page");
      }}
      tutorialKey="guardian-page"
    />
  );
}
