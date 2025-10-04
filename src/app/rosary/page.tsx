// made by gebin george
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronLeft, Heart, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type MysteryType = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';

interface Decade {
  name: string;
  scripture: string;
  scriptureReference: string;
  meditation: string;
}

interface Mystery {
  id: MysteryType;
  name: string;
  day: string;
  color: string;
  icon: string;
  decades: Decade[];
}

const mysteries: Mystery[] = [
  {
    id: 'joyful',
    name: 'Joyful Mysteries',
    day: 'Monday & Saturday',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    icon: '✨',
    decades: [
      {
        name: 'The Annunciation',
        scripture: 'And the angel said unto her, Fear not, Mary: for thou hast found favour with God. And, behold, thou shalt conceive in thy womb, and bring forth a son, and shalt call his name JESUS.',
        scriptureReference: 'Luke 1:30-31',
        meditation: 'Reflect on Mary\'s humility and faith as she accepts God\'s will. Pray for the grace to say "yes" to God in your own life.',
      },
      {
        name: 'The Visitation',
        scripture: 'And it came to pass, that, when Elisabeth heard the salutation of Mary, the babe leaped in her womb; and Elisabeth was filled with the Holy Ghost.',
        scriptureReference: 'Luke 1:41',
        meditation: 'Meditate on Mary\'s charity in serving Elizabeth. Pray for the grace to serve others with joy and love.',
      },
      {
        name: 'The Nativity',
        scripture: 'And she brought forth her firstborn son, and wrapped him in swaddling clothes, and laid him in a manger; because there was no room for them in the inn.',
        scriptureReference: 'Luke 2:7',
        meditation: 'Contemplate the poverty and humility of Christ\'s birth. Pray for detachment from worldly possessions and for the poor.',
      },
      {
        name: 'The Presentation',
        scripture: 'And when the days of her purification according to the law of Moses were accomplished, they brought him to Jerusalem, to present him to the Lord.',
        scriptureReference: 'Luke 2:22',
        meditation: 'Reflect on obedience to God\'s law and the offering of ourselves to God. Pray for purity of heart and obedience.',
      },
      {
        name: 'Finding Jesus in the Temple',
        scripture: 'And it came to pass, that after three days they found him in the temple, sitting in the midst of the doctors, both hearing them, and asking them questions.',
        scriptureReference: 'Luke 2:46',
        meditation: 'Meditate on seeking Jesus with the same diligence Mary showed. Pray for wisdom and understanding of God\'s word.',
      },
    ],
  },
  {
    id: 'sorrowful',
    name: 'Sorrowful Mysteries',
    day: 'Tuesday & Friday',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    icon: '✝️',
    decades: [
      {
        name: 'The Agony in the Garden',
        scripture: 'And being in an agony he prayed more earnestly: and his sweat was as it were great drops of blood falling down to the ground.',
        scriptureReference: 'Luke 22:44',
        meditation: 'Contemplate Christ\'s acceptance of suffering for our sins. Pray for the grace to accept God\'s will in times of trial.',
      },
      {
        name: 'The Scourging at the Pillar',
        scripture: 'Then Pilate therefore took Jesus, and scourged him.',
        scriptureReference: 'John 19:1',
        meditation: 'Reflect on the physical suffering Jesus endured for our sins. Pray for the grace of purity and reparation for sins of the flesh.',
      },
      {
        name: 'The Crowning with Thorns',
        scripture: 'And the soldiers platted a crown of thorns, and put it on his head, and they put on him a purple robe.',
        scriptureReference: 'John 19:2',
        meditation: 'Meditate on the mockery and humiliation Jesus suffered. Pray for moral courage and the grace to overcome pride.',
      },
      {
        name: 'The Carrying of the Cross',
        scripture: 'And he bearing his cross went forth into a place called the place of a skull, which is called in the Hebrew Golgotha.',
        scriptureReference: 'John 19:17',
        meditation: 'Contemplate Jesus carrying the cross to Calvary. Pray for patience in carrying your daily crosses and trials.',
      },
      {
        name: 'The Crucifixion',
        scripture: 'And when they were come to the place, which is called Calvary, there they crucified him, and the malefactors, one on the right hand, and the other on the left.',
        scriptureReference: 'Luke 23:33',
        meditation: 'Reflect on the ultimate sacrifice of Jesus for our salvation. Pray for a deeper love of God and for perseverance.',
      },
    ],
  },
  {
    id: 'glorious',
    name: 'Glorious Mysteries',
    day: 'Wednesday & Sunday',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
    icon: '🌟',
    decades: [
      {
        name: 'The Resurrection',
        scripture: 'He is not here: for he is risen, as he said. Come, see the place where the Lord lay.',
        scriptureReference: 'Matthew 28:6',
        meditation: 'Rejoice in Christ\'s victory over death. Pray for a strong faith and the grace of final perseverance.',
      },
      {
        name: 'The Ascension',
        scripture: 'And while they looked stedfastly toward heaven as he went up, behold, two men stood by them in white apparel.',
        scriptureReference: 'Acts 1:10',
        meditation: 'Meditate on Jesus ascending to heaven. Pray for the desire for heaven and detachment from earthly things.',
      },
      {
        name: 'The Descent of the Holy Spirit',
        scripture: 'And suddenly there came a sound from heaven as of a rushing mighty wind, and it filled all the house where they were sitting.',
        scriptureReference: 'Acts 2:2',
        meditation: 'Contemplate the Holy Spirit descending upon the Apostles. Pray for the gifts and fruits of the Holy Spirit.',
      },
      {
        name: 'The Assumption of Mary',
        scripture: 'For he hath regarded the low estate of his handmaiden: for, behold, from henceforth all generations shall call me blessed.',
        scriptureReference: 'Luke 1:48',
        meditation: 'Reflect on Mary being assumed body and soul into heaven. Pray for a happy death and the grace to be with God forever.',
      },
      {
        name: 'The Coronation of Mary',
        scripture: 'And there appeared a great wonder in heaven; a woman clothed with the sun, and the moon under her feet, and upon her head a crown of twelve stars.',
        scriptureReference: 'Revelation 12:1',
        meditation: 'Meditate on Mary crowned as Queen of Heaven and Earth. Pray for the grace to honor Mary and seek her intercession.',
      },
    ],
  },
  {
    id: 'luminous',
    name: 'Luminous Mysteries',
    day: 'Thursday',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
    icon: '💡',
    decades: [
      {
        name: 'The Baptism of Jesus',
        scripture: 'And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him.',
        scriptureReference: 'Matthew 3:16',
        meditation: 'Reflect on Jesus\' baptism and the beginning of His public ministry. Pray for the grace to live your baptismal promises.',
      },
      {
        name: 'The Wedding at Cana',
        scripture: 'This beginning of miracles did Jesus in Cana of Galilee, and manifested forth his glory; and his disciples believed on him.',
        scriptureReference: 'John 2:11',
        meditation: 'Meditate on Mary\'s intercession and Jesus\' first miracle. Pray for the grace to turn to Mary in all needs.',
      },
      {
        name: 'The Proclamation of the Kingdom',
        scripture: 'The time is fulfilled, and the kingdom of God is at hand: repent ye, and believe the gospel.',
        scriptureReference: 'Mark 1:15',
        meditation: 'Contemplate Jesus proclaiming the Good News. Pray for conversion of heart and zeal for spreading the Gospel.',
      },
      {
        name: 'The Transfiguration',
        scripture: 'And was transfigured before them: and his face did shine as the sun, and his raiment was white as the light.',
        scriptureReference: 'Matthew 17:2',
        meditation: 'Reflect on the glory of Christ revealed. Pray for a deeper understanding of the mystery of Christ\'s divinity.',
      },
      {
        name: 'The Institution of the Eucharist',
        scripture: 'And he took bread, and gave thanks, and brake it, and gave unto them, saying, This is my body which is given for you: this do in remembrance of me.',
        scriptureReference: 'Luke 22:19',
        meditation: 'Meditate on the gift of the Eucharist. Pray for a deeper love and reverence for the Real Presence of Jesus.',
      },
    ],
  },
];

const prayers = {
  signOfCross: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
  apostlesCreed: 'I believe in God, the Father Almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord; Who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried. He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from there He will come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of Saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.',
  ourFather: 'Our Father, Who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
  hailMary: 'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
  gloryBe: 'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.',
  fatimaPrayer: 'O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of Thy mercy. Amen.',
  hailHolyQueen: 'Hail, Holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn, then, most gracious advocate, thine eyes of mercy toward us, and after this, our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.',
};

export default function RosaryPage() {
  const [selectedMystery, setSelectedMystery] = useState<MysteryType | null>(null);
  const [currentDecade, setCurrentDecade] = useState(0);
  const [guidedMode, setGuidedMode] = useState(false);
  const [currentBead, setCurrentBead] = useState(0);

  const handleStartMystery = (mysteryId: MysteryType) => {
    setSelectedMystery(mysteryId);
    setCurrentDecade(0);
    setGuidedMode(false);
    setCurrentBead(0);
  };

  const handleStartGuided = () => {
    setGuidedMode(true);
    setCurrentBead(0);
  };

  const handleNextBead = () => {
    const mystery = mysteries.find(m => m.id === selectedMystery);
    if (!mystery) return;

    // Pattern for each decade: 1 Our Father + 10 Hail Marys + 1 Glory Be + 1 Fatima Prayer = 13 prayers
    const beadsPerDecade = 13;
    const totalBeads = beadsPerDecade * 5;

    if (currentBead < totalBeads - 1) {
      setCurrentBead(currentBead + 1);
      // Update decade when transitioning
      const newDecade = Math.floor((currentBead + 1) / beadsPerDecade);
      if (newDecade !== currentDecade) {
        setCurrentDecade(newDecade);
      }
    }
  };

  const handlePreviousBead = () => {
    if (currentBead > 0) {
      setCurrentBead(currentBead - 1);
      // Update decade when transitioning
      const newDecade = Math.floor((currentBead - 1) / 13);
      if (newDecade !== currentDecade) {
        setCurrentDecade(newDecade);
      }
    }
  };

  const getCurrentPrayer = () => {
    const beadInDecade = currentBead % 13;
    if (beadInDecade === 0) return { name: 'Our Father', text: prayers.ourFather };
    if (beadInDecade <= 10) return { name: `Hail Mary (${beadInDecade}/10)`, text: prayers.hailMary };
    if (beadInDecade === 11) return { name: 'Glory Be', text: prayers.gloryBe };
    return { name: 'Fatima Prayer', text: prayers.fatimaPrayer };
  };

  const selectedMysteryData = mysteries.find(m => m.id === selectedMystery);

  if (selectedMystery && selectedMysteryData) {
    const decade = selectedMysteryData.decades[currentDecade];
    const currentPrayer = getCurrentPrayer();

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedMystery(null);
                setGuidedMode(false);
              }}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Mysteries
            </Button>
          </div>

          <Card className={cn('border-2', selectedMysteryData.color)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedMysteryData.icon}</span>
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      {selectedMysteryData.name}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {selectedMysteryData.day}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className={selectedMysteryData.color}>
                  Decade {currentDecade + 1} of 5
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-600" />
                {decade.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Scripture
                </h3>
                <blockquote className="border-l-4 border-rose-300 dark:border-rose-700 pl-4 italic text-muted-foreground">
                  <p className="mb-2">&ldquo;{decade.scripture}&rdquo;</p>
                  <cite className="text-sm not-italic font-medium">— {decade.scriptureReference}</cite>
                </blockquote>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Meditation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {decade.meditation}
                </p>
              </div>
            </CardContent>
          </Card>

          {!guidedMode ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Prayers for This Decade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-semibold text-sm mb-1">1× Our Father</p>
                    <p className="text-xs text-muted-foreground italic">{prayers.ourFather}</p>
                  </div>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-800">
                    <p className="font-semibold text-sm mb-1">10× Hail Mary</p>
                    <p className="text-xs text-muted-foreground italic">{prayers.hailMary}</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="font-semibold text-sm mb-1">1× Glory Be</p>
                    <p className="text-xs text-muted-foreground italic">{prayers.gloryBe}</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="font-semibold text-sm mb-1">1× Fatima Prayer</p>
                    <p className="text-xs text-muted-foreground italic">{prayers.fatimaPrayer}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button
                    onClick={handleStartGuided}
                    className="flex-1 bg-rose-600 hover:bg-rose-700"
                  >
                    Start Guided Prayer Mode
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentDecade(Math.max(0, currentDecade - 1))}
                    disabled={currentDecade === 0}
                    className="flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Decade
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentDecade(Math.min(4, currentDecade + 1))}
                    disabled={currentDecade === 4}
                    className="flex-1"
                  >
                    Next Decade
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-rose-300 dark:border-rose-700">
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center justify-between">
                  <span>Guided Prayer Mode</span>
                  <Badge variant="secondary">
                    Bead {currentBead + 1} of {13 * 5}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-rose-50 to-purple-50 dark:from-rose-950/30 dark:to-purple-950/30 rounded-lg border-2 border-rose-200 dark:border-rose-800">
                  <h3 className="font-semibold text-lg mb-3 text-rose-700 dark:text-rose-300">
                    {currentPrayer.name}
                  </h3>
                  <p className="text-base leading-relaxed italic">
                    {currentPrayer.text}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePreviousBead}
                    disabled={currentBead === 0}
                    className="flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextBead}
                    disabled={currentBead === 13 * 5 - 1}
                    className="flex-1 bg-rose-600 hover:bg-rose-700"
                  >
                    Next Prayer
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {currentBead === 13 * 5 - 1 && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800 text-center">
                    <p className="font-semibold text-green-700 dark:text-green-300">
                      You have completed the {selectedMysteryData.name}! 🙏
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setGuidedMode(false)}
                      className="mt-3"
                    >
                      Return to Decade View
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            The Holy Rosary
          </h1>
          <p className="text-lg text-muted-foreground">
            A guided meditation on the life of Christ through the eyes of Mary
          </p>
        </header>

        <Card className="bg-gradient-to-br from-rose-100/50 to-purple-100/50 dark:from-rose-950/20 dark:to-purple-950/20 border-rose-200 dark:border-rose-800">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-rose-600" />
              How to Pray the Rosary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Begin with the Sign of the Cross and the Apostles' Creed</li>
              <li>Pray one Our Father, three Hail Marys, and one Glory Be</li>
              <li>For each decade: announce the mystery, pray one Our Father, ten Hail Marys, one Glory Be, and the Fatima Prayer</li>
              <li>Complete all five decades of the chosen mystery</li>
              <li>Conclude with the Hail Holy Queen and the Sign of the Cross</li>
            </ol>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mysteries.map((mystery) => (
            <Card
              key={mystery.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-2"
              onClick={() => handleStartMystery(mystery.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{mystery.icon}</span>
                    <div>
                      <CardTitle className="font-headline text-xl">
                        {mystery.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {mystery.day}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mystery.decades.map((decade, index) => (
                    <div
                      key={index}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="font-semibold">{index + 1}.</span>
                      <span>{decade.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Common Prayers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {Object.entries(prayers).map(([key, prayer]) => (
                  <div key={key} className="space-y-2">
                    <h3 className="font-semibold text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      {prayer}
                    </p>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
