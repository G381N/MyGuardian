'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Sun, 
  Utensils, 
  Moon, 
  Plane, 
  Dumbbell, 
  Car, 
  GraduationCap, 
  ChevronDown,
  Copy,
  Share,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrayerContext {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  guide: string;
  prayer: string;
}

const prayerContexts: PrayerContext[] = [
  {
    id: 'morning',
    title: 'Waking Up in the Morning',
    icon: Sun,
    description: 'Start your day with gratitude and divine guidance',
    guide: 'Begin each morning by acknowledging God\'s gift of a new day. Take a moment to stretch, breathe deeply, and offer your heart to the Lord. Express gratitude for rest received and ask for strength and wisdom for the day ahead. Let your first thoughts be of thanksgiving and surrender to God\'s will.',
    prayer: `Heavenly Father, I thank You for the gift of this new day and for the rest You have given me through the night. As the sun rises, may Your light shine upon my path and guide my steps.

Grant me wisdom in all my decisions, strength for the challenges ahead, and a heart filled with Your love. Help me to see You in every moment and to be Your hands and feet to those I encounter.

Bless my family, my work, and all those in need of Your mercy. May this day bring glory to Your holy name.

In the name of Jesus Christ, our Lord and Savior, I pray. Amen.`
  },
  {
    id: 'eating',
    title: 'Before Eating',
    icon: Utensils,
    description: 'Blessing your meals with gratitude and remembrance',
    guide: 'Before each meal, pause to acknowledge God as the source of all good things. Remember those who are hungry and in need. Give thanks not only for the food before you, but for the hands that prepared it and the abundance God provides. Make your meal a moment of communion with the divine.',
    prayer: `Thank You, Lord, for the food that You have provided us today. We are grateful for Your abundant blessings and Your constant care for our needs.

Bless this food that You have prepared for us, and bless the hands that have prepared it with love and care. May this meal nourish our bodies and strengthen us to do Your will in all that we undertake.

Grant us grateful hearts that never take for granted the bounty You provide, and help us to always remember those who are in need of their daily bread.

We ask this in Christ our Lord. Amen.`
  },
  {
    id: 'sleeping',
    title: 'Before Sleeping',
    icon: Moon,
    description: 'Ending your day in peace and divine protection',
    guide: 'As you prepare for rest, reflect on the day that has passed. Offer thanks for blessings received and ask forgiveness for any failings. Entrust your loved ones and concerns to God\'s care. Release the worries of the day and rest in the peace that comes from knowing you are held in divine love.',
    prayer: `Lord, as I lay down to rest, I place this day into Your loving hands. I thank You for all the blessings You have bestowed upon me - both seen and unseen.

Forgive me for the times I have fallen short of Your love today. Help me to grow in holiness and draw ever closer to You. I entrust my family, friends, and all those I love to Your protecting care.

Watch over me through the night and grant me peaceful rest. May Your angels guard my sleep and may I wake refreshed to serve You tomorrow.

Into Your hands, O Lord, I commend my spirit. May Your peace fill my heart and home.

Through Jesus Christ our Lord. Amen.`
  },
  {
    id: 'traveling',
    title: 'Before Traveling',
    icon: Plane,
    description: 'Seeking divine protection and guidance on your journey',
    guide: 'Before any journey, whether near or far, place yourself under God\'s protection. Ask for safe passage, patience with delays or difficulties, and openness to the encounters along the way. Remember that every journey is an opportunity to grow in faith and trust in divine providence.',
    prayer: `Almighty God, You are the protector of all who trust in You. As I begin this journey, I place myself under Your loving care and protection.

Grant me safe passage to my destination and bring me home safely to those who love me. Give wisdom to those who guide my travel - pilots, drivers, and all who ensure safe passage.

Help me to be patient with delays, kind to fellow travelers, and aware of Your presence throughout this journey. May this travel be blessed and may I return with a grateful heart.

Saint Christopher, patron of travelers, pray for us. Guardian angels, watch over us and guide our way.

Through Jesus Christ our Lord. Amen.`
  },
  {
    id: 'gym',
    title: 'At the Gym',
    icon: Dumbbell,
    description: 'Honoring God through care of your body as His temple',
    guide: 'Approach physical exercise as a way of honoring God through caring for the body He has given you. See your workout as an act of stewardship and thanksgiving. Pray for strength, perseverance, and the discipline to maintain healthy habits. Let your physical training be a reminder of the spiritual training required for holiness.',
    prayer: `Lord, You have blessed me with this body as a temple of Your Holy Spirit. As I exercise today, help me to honor You through the care I take of myself.

Grant me strength for this workout, perseverance when it becomes difficult, and wisdom to know my limits. Help me to be grateful for the ability to move and be active.

May this time of physical training remind me of the discipline needed for spiritual growth. Just as I strengthen my body, help me to strengthen my soul through prayer, virtue, and service to others.

Bless all those who exercise alongside me. May we encourage one another and find joy in the gift of health.

Through Jesus Christ our Lord. Amen.`
  },
  {
    id: 'driving',
    title: 'Driving to Work',
    icon: Car,
    description: 'Transforming your commute into a moment of prayer',
    guide: 'Use your daily commute as a time of prayer and reflection. Ask God to prepare your heart for the day\'s work and to help you be a blessing to your colleagues. Pray for patience in traffic, safety on the roads, and the grace to see your work as a form of service to God and others.',
    prayer: `Heavenly Father, as I travel to work today, I offer this time to You. Prepare my heart for the tasks ahead and help me to approach my work with diligence and joy.

Grant me patience in traffic, safety on the roads, and courtesy toward other drivers. Help me to use this commute time wisely - in prayer, reflection, or simply enjoying the beauty of Your creation.

Bless my workplace and all my colleagues. May I be a source of encouragement and peace to those around me. Help me to see my work as a way of serving You and contributing to the common good.

May this day be productive and filled with Your grace. Guide my words, actions, and decisions that they may bring glory to Your name.

Through Jesus Christ our Lord. Amen.`
  },
  {
    id: 'examination',
    title: 'Before an Examination or Competition',
    icon: GraduationCap,
    description: 'Seeking divine assistance for important challenges',
    guide: 'Before any test or competition, acknowledge that your talents come from God and ask for His help in using them well. Pray for calm nerves, clear thinking, and the ability to recall what you have studied. Trust in God\'s plan for your life, knowing that your worth is not determined by results but by your identity as His beloved child.',
    prayer: `Lord God, giver of all wisdom and knowledge, I come before You as I prepare for this examination/competition. You have blessed me with talents and abilities, and I ask for Your help in using them well.

Calm my nerves and grant me clarity of mind. Help me to recall what I have studied and to think clearly under pressure. Give me confidence that comes from trusting in You rather than in my own abilities alone.

Whatever the outcome, help me to remember that my worth comes from being Your beloved child, not from any test score or achievement. May I compete or take this exam with integrity, doing my best while leaving the results in Your loving hands.

Bless all others who face this same challenge. May we support one another and compete or test with fairness and respect.

Through Jesus Christ our Lord. Amen.`
  }
];

export default function HowToPrayPage() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const copyPrayer = async (prayer: string) => {
    try {
      await navigator.clipboard.writeText(prayer);
      toast({
        title: 'Prayer Copied',
        description: 'The prayer has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Unable to copy the prayer. Please try again.',
      });
    }
  };

  const sharePrayer = async (title: string, prayer: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Prayer for ${title}`,
          text: prayer,
        });
      } catch (error) {
        // User cancelled or sharing failed
        await copyPrayer(prayer);
      }
    } else {
      await copyPrayer(prayer);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-900 dark:to-rose-950">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <header className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Heart className="h-8 w-8 text-rose-500" />
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How to Pray
              </h1>
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover meaningful ways to connect with God throughout your daily activities. 
              Each context includes guidance and a beautiful prayer to help deepen your spiritual life.
            </p>
            
            {/* Disclaimer Card */}
            <Card className="mx-auto mt-4 max-w-2xl bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-4 pb-4">
                <h3 className="font-headline text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">
                  A Humble Note
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                  These prayers are offered as a helpful starting point for those who sometimes struggle to find 
                  the right words in different situations. There is no "perfect prayer" - the most powerful prayers 
                  come directly from your heart in your own words. These examples are simply meant to inspire and guide, 
                  not replace your personal connection with God. Remember that silent prayer, listening, and simply being 
                  present with God are equally valuable forms of prayer.
                </p>
              </CardContent>
            </Card>
          </header>

          {/* Prayer Context Cards */}
          <div className="grid gap-6">
            {prayerContexts.map((context) => {
              const IconComponent = context.icon;
              const isExpanded = expandedCards.has(context.id);
              
              return (
                <Card key={context.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-rose-200 dark:border-rose-800 transition-all duration-200 hover:shadow-lg">
                  <Collapsible open={isExpanded} onOpenChange={() => toggleCard(context.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-rose-50/50 dark:hover:bg-rose-950/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-900">
                              <IconComponent className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="text-left">
                              <CardTitle className="font-headline text-xl">{context.title}</CardTitle>
                              <CardDescription className="text-sm">{context.description}</CardDescription>
                            </div>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-6">
                        {/* Guide Section */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
                              Guide
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {context.guide}
                          </p>
                        </div>

                        {/* Prayer Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                              Prayer
                            </Badge>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyPrayer(context.prayer)}
                                className="h-8 px-3"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => sharePrayer(context.title, context.prayer)}
                                className="h-8 px-3"
                              >
                                <Share className="h-3 w-3 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                          <Card className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/50 dark:to-blue-950/50 border-sky-200 dark:border-sky-800">
                            <CardContent className="pt-4">
                              <p className="text-sm leading-relaxed whitespace-pre-line font-medium text-sky-900 dark:text-sky-100">
                                {context.prayer}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>

          {/* Footer */}
          <Card className="bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-950/50 dark:to-pink-950/50 border-rose-200 dark:border-rose-800">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
                "Pray without ceasing" - 1 Thessalonians 5:17
              </p>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 mb-4">
                Remember, God hears every prayer offered with a sincere heart, in any place, at any time.
              </p>
              
              <div className="mt-4 pt-4 border-t border-rose-200 dark:border-rose-800 text-left">
                <p className="text-xs text-rose-700 dark:text-rose-300 italic">
                  <strong>About this feature:</strong> MyGuardian offers these prayer examples to assist those who may 
                  struggle with putting together words in specific scenarios. While these structured prayers can be helpful, 
                  they are not meant to replace spontaneous, heartfelt prayer. The best prayer is always the one that comes 
                  genuinely from your heart. Consider these as training wheels that can help you develop your own unique 
                  prayer style and relationship with God.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
