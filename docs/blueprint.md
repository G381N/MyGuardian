# **App Name**: MyGuardian

## Core Features:

- Today's Reading & Reflection: Displays a daily scripture passage and a concise AI-generated reflection based on the KJV text.
- Anonymous Confessional: Offers a private space for users to record and transcribe their thoughts via voice, receiving an AI-guided response without data persistence. Includes edit of the voice transcription.
- Guardian Angel Chat: Provides a chat-like interface that uses the KJV scripture to give empathetic, pastoral advice in response to user questions. Relies on AI to provide insights.
- Voice-to-Text Conversion: Integrates ChatGPT-style voice recording with transcription capabilities, allowing users to input their confessions or queries through speech.
- Contextual Passage Retrieval: Uses user inputs to contextually retrieve relevant scripture passages from the KJV CSV data store using precomputed local embeddings for semantic search.
- AI-Powered Interpretation Tool: Leverages a large language model tool with a strict prompt template to analyze scripture passages in relation to user inputs. The LLM will either extract passages, or rely on the tool's retrieval capabilities.
- Ephemeral Data Handling: Ensures user privacy through temporary data processing, with all audio blobs, transcriptions, and session data being immediately deleted post-processing.

## Style Guidelines:

- Light Mode: Primary color: Sky Blue (#87CEEB) — evokes calm, heavenly presence.
- Light Mode: Background color: Pure White (#FFFFFF) — clean, angelic foundation.
- Light Mode: Secondary background: Soft Cloud Blue (#E6F2FA) — subtle, airy backdrop for cards/sections.
- Light Mode: Accent color: Light Golden Glow (#FFD700) — gentle highlights, evoking divine warmth.
- Light Mode: Text color: Deep Navy (#001F3F) — strong but balanced against white backgrounds.
- Light Mode: Subtext/Muted color: Cool Gray (#666666) — softer text elements without clutter.
- Dark Mode: Primary color: Deep Midnight Blue (#0A0A23) — creates a contemplative, protective atmosphere.
- Dark Mode: Background color: Charcoal Black (#000000) — deep contrast and grounding.
- Dark Mode: Secondary background: Twilight Blue (#1A1A40) — adds depth and variation.
- Dark Mode: Accent color: Sky Blue Glow (#5DAEFF) — luminous highlights that feel celestial.
- Dark Mode: Text color: Off-White (#F5F5F5) — readable but soft.
- Dark Mode: Subtext/Muted color: Steel Gray (#A0A0A0) — secondary text that blends well into dark mode.
- Headline font: 'Playfair', a serif, for elegance; body font: 'PT Sans', a sans-serif, for readability.
- Use simple, line-based icons to represent different actions and categories. Favor symbolism over literal representations.
- Employ a clean, single-column layout to minimize distractions and ensure content is the focus.
- Incorporate subtle transitions and animations for a smooth, seamless user experience.
- use framer motion for animations and custom font packs