# MyGuardian

**Version 0.03.1** - Your personal guide for spiritual reflection and growth.

## Features

### ReadBible
- Complete Catholic Public Domain Version (CPDV) Bible text integration
- Book, Chapter, and Verse navigation with filters
- Testament toggle (Old Testament / New Testament)
- Scripture highlighting with AI-powered reflections
- Navigation arrows for easy chapter browsing
- Responsive design with elegant theming

### How to Pray
- Contextual prayer guides for different life situations:
  - Waking up in the morning
  - Before eating
  - Before sleeping
  - Before traveling
  - At the gym
  - Driving to work
  - Before examinations or competitions
- Pre-written prayers in Biblical tone
- Copy and share functionality

### Guardian Angel Chat
- AI-powered spiritual guidance and conversation
- Empathetic responses in the voice of a caring guardian angel

### Anonymous Confessional
- Voice recording for private spiritual reflection
- AI transcription and guidance
- Complete privacy and anonymity

### Daily Scripture & Reflection
- Daily scripture passages from CPDV
- AI-generated reflections for spiritual growth

## Technical Stack

- **Framework**: Next.js 15.3.3 with TypeScript
- **UI**: Tailwind CSS with Radix UI components
- **AI**: Google Genkit for AI-powered features
- **Database**: CSV-based scripture data (CPDV)
- **Deployment**: Firebase App Hosting

## Dataset Notes

The application uses the Catholic Public Domain Version (CPDV) stored in `src/cpdv.csv`. The Book of Maccabees was sourced from the Douay translation due to its absence in the original CPDV dataset, and the parsing gracefully handles the slight formatting differences.

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run Genkit AI development server
npm run genkit:dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

Visit http://localhost:9002 to view the application.

## Recent Changes (v0.03.1)

- **NEW**: ReadBible section with complete CPDV integration
- **NEW**: How to Pray section with contextual prayer guides
- **REPLACED**: ExploreScripture removed in favor of ReadBible
- **IMPROVED**: Scripture service now uses CPDV dataset
- **ENHANCED**: Highlight-to-reflection feature with floating action button
- **REFINED**: Navigation and filtering capabilities
- **UPDATED**: Theme improvements for light and dark modes
