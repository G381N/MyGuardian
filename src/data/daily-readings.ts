/**
 * Hardcoded daily scripture readings with AI-powered reflections
 * Topics: Procrastination, Sin, Lust, Greed, Faith, Love, Hope, Forgiveness, Wisdom, Peace
 */

export interface DailyReading {
  id: number;
  topic: string;
  book: string;
  chapter: number;
  verses: string;
  text: string;
  reflection: string;
  keywords: string[];
}

export const DAILY_READINGS: DailyReading[] = [
  // Procrastination & Diligence
  {
    id: 1,
    topic: "Overcoming Procrastination",
    book: "Proverbs",
    chapter: 6,
    verses: "6-11",
    text: "Go to the ant, thou sluggard; consider her ways, and be wise: Which having no guide, overseer, or ruler, Provideth her meat in the summer, and gathereth her food in the harvest. How long wilt thou sleep, O sluggard? when wilt thou arise out of thy sleep? Yet a little sleep, a little slumber, a little folding of the hands to sleep: So shall thy poverty come as one that travelleth, and thy want as an armed man.",
    reflection: "The ant teaches us profound wisdom about diligence and preparation. Without any external motivation or supervision, she works tirelessly to prepare for the future. God calls us to this same spirit of self-motivated action. Procrastination is not merely delay—it is a poverty of spirit that leaves us spiritually and practically unprepared for life's challenges. When we embrace the ant's example, we discover that consistent, purposeful action becomes a form of worship, honoring God with our time and talents.",
    keywords: ["procrastination", "diligence", "work", "preparation", "wisdom"]
  },
  {
    id: 2,
    topic: "Diligent Action",
    book: "Ecclesiastes",
    chapter: 9,
    verses: "10",
    text: "Whatsoever thy hand findeth to do, do it with thy might; for there is no work, nor device, nor knowledge, nor wisdom, in the grave, whither thou goest.",
    reflection: "Life is brief and precious, and every moment is an opportunity to serve God through our actions. This verse reminds us that our earthly time is limited, making each task we undertake sacred. When we approach our work 'with thy might,' we transform ordinary activities into acts of devotion. The urgency isn't born from anxiety but from love—love for God who has given us this time, and love for others who benefit from our wholehearted efforts.",
    keywords: ["action", "purpose", "mortality", "commitment", "service"]
  },

  // Sin & Redemption
  {
    id: 3,
    topic: "Confession of Sin",
    book: "1 John",
    chapter: 1,
    verses: "8-9",
    text: "If we say that we have no sin, we deceive ourselves, and the truth is not in us. If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
    reflection: "God's mercy shines brightest in our moments of honest confession. To deny our sinfulness is to reject the very foundation of our need for Christ. Yet when we humbly acknowledge our failures, we discover that God's forgiveness is not reluctant or conditional—it flows from His faithful character. This cleansing isn't just about removing guilt; it's about restoration to right relationship with our Creator. In confession, we find not condemnation, but the tender embrace of a Father who has been waiting for our return.",
    keywords: ["sin", "confession", "forgiveness", "cleansing", "mercy"]
  },
  {
    id: 4,
    topic: "Freedom from Sin",
    book: "Romans",
    chapter: 6,
    verses: "12-14",
    text: "Let not sin therefore reign in your mortal body, that ye should obey it in the lusts thereof. Neither yield ye your members as instruments of unrighteousness unto sin: but yield yourselves unto God, as those that are alive from the dead, and your members as instruments of righteousness unto God. For sin shall not have dominion over you: for ye are not under the law, but under grace.",
    reflection: "We are no longer slaves to sin but free children of God. This freedom, however, requires our active participation. Every day we choose which master to serve through our thoughts, words, and actions. When we yield ourselves to God, our very bodies become instruments of His righteousness, creating beauty and blessing in the world. The promise is stunning: sin no longer has dominion over us. Grace has broken every chain, and in that freedom, we find the power to live as God intended.",
    keywords: ["freedom", "sin", "grace", "righteousness", "choice"]
  },

  // Lust & Purity
  {
    id: 5,
    topic: "Purity of Heart",
    book: "Matthew",
    chapter: 5,
    verses: "8",
    text: "Blessed are the pure in heart: for they shall see God.",
    reflection: "Purity of heart is not perfection but single-minded devotion to God. It means our desires, thoughts, and intentions align increasingly with His will. This purity brings the greatest blessing imaginable—we shall see God. Not just in the future, but even now, pure hearts recognize His presence in daily life, in others, and in creation itself. The pursuit of purity isn't about restriction but about clearing our spiritual vision so we can behold the beauty and truth of our Creator more clearly.",
    keywords: ["purity", "heart", "devotion", "vision", "blessing"]
  },
  {
    id: 6,
    topic: "Fleeing Temptation",
    book: "1 Corinthians",
    chapter: 6,
    verses: "18-20",
    text: "Flee fornication. Every sin that a man doeth is without the body; but he that committeth fornication sinneth against his own body. What? know ye not that your body is the temple of the Holy Ghost which is in you, which ye have of God, and ye are not your own? For ye are bought with a price: therefore glorify God in your body, and in your spirit, which are God's.",
    reflection: "Our bodies are sacred temples, dwelling places of the Holy Spirit. This truth transforms how we view physical temptation—it's not just about personal morality but about honoring the sacred space where God chooses to dwell. When we flee from sexual immorality, we're not running from pleasure but running toward the deeper joy of living in harmony with our true design. We belong to God, purchased at the ultimate price of Christ's sacrifice, and this belonging gives us both the motivation and power to glorify Him in every aspect of our lives.",
    keywords: ["purity", "temple", "Spirit", "honor", "belonging"]
  },

  // Greed & Contentment
  {
    id: 7,
    topic: "Contentment",
    book: "Philippians",
    chapter: 4,
    verses: "11-13",
    text: "Not that I speak in respect of want: for I have learned, in whatsoever state I am, therewith to be content. I know both how to be abased, and I know how to abound: every where and in all things I am instructed both to be full and to be hungry, both to abound and to suffer need. I can do all things through Christ which strengtheneth me.",
    reflection: "True contentment is learned, not natural. Paul discovered that circumstances don't determine our peace—our relationship with Christ does. Whether in abundance or need, we can find deep satisfaction because our ultimate treasure is not in what we possess but in who possesses us. This contentment isn't passive resignation but active trust in God's provision and timing. When Christ strengthens us, we find that we need far less than we thought to be truly happy, and we can handle far more than we imagined.",
    keywords: ["contentment", "strength", "circumstances", "trust", "provision"]
  },
  {
    id: 8,
    topic: "Warning Against Greed",
    book: "Luke",
    chapter: 12,
    verses: "15",
    text: "And he said unto them, Take heed, and beware of covetousness: for a man's life consisteth not in the abundance of the things which he possesseth.",
    reflection: "Jesus warns us that life's meaning isn't found in accumulation but in relationship with God and service to others. Covetousness is dangerous because it promises fulfillment while delivering emptiness. The more we chase possessions, the more they possess us. True life—abundant, meaningful, joy-filled life—comes from understanding our identity as beloved children of God. When we grasp this truth, material things become tools for blessing rather than objects of obsession.",
    keywords: ["greed", "covetousness", "abundance", "meaning", "identity"]
  },

  // Faith & Trust
  {
    id: 9,
    topic: "Faith in Trials",
    book: "James",
    chapter: 1,
    verses: "2-4",
    text: "My brethren, count it all joy when ye fall into divers temptations; Knowing this, that the trying of your faith worketh patience. But let patience have her perfect work, that ye may be perfect and entire, wanting nothing.",
    reflection: "James reveals the surprising secret of spiritual maturity: trials become occasions for joy when we understand their purpose. God doesn't waste our suffering but uses it to develop unshakeable faith and Christ-like character. Patience isn't just enduring difficulty but allowing God to complete His transforming work in us. Through trials, we discover that we can trust God not just for salvation but for every detail of our journey. What seems like loss becomes gain when viewed through eyes of faith.",
    keywords: ["faith", "trials", "patience", "maturity", "character"]
  },
  {
    id: 10,
    topic: "Mountain-Moving Faith",
    book: "Matthew",
    chapter: 17,
    verses: "20",
    text: "And Jesus said unto them, Because of your unbelief: for verily I say unto you, If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove; and nothing shall be impossible unto you.",
    reflection: "The power isn't in the size of our faith but in the size of our God. A tiny mustard seed contains within it the potential for a great tree, just as small faith in an infinite God can accomplish the impossible. Jesus isn't promising that every prayer will be answered exactly as we desire, but that when our faith aligns with God's will, no obstacle is insurmountable. The mountains that need moving might be circumstances, relationships, or areas of personal growth—all yield to faith that trusts completely in God's power and goodness.",
    keywords: ["faith", "impossible", "power", "trust", "obstacles"]
  },

  // Love & Relationships
  {
    id: 11,
    topic: "Love One Another",
    book: "1 John",
    chapter: 4,
    verses: "7-8",
    text: "Beloved, let us love one another: for love is of God; and every one that loveth is born of God, and knoweth God. He that loveth not knoweth not God; for God is love.",
    reflection: "Love isn't just something God does—love is who God is. When we love others, we participate in the very nature of God, revealing our spiritual birth and demonstrating our knowledge of Him. This love goes beyond emotion or preference; it's a choice to seek the good of others regardless of how they treat us. In loving others, we discover that we're not just following a command but expressing our truest identity as children of the God who is love itself.",
    keywords: ["love", "God", "relationships", "nature", "identity"]
  },
  {
    id: 12,
    topic: "Perfect Love",
    book: "1 Corinthians",
    chapter: 13,
    verses: "4-7",
    text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things.",
    reflection: "This portrait of love serves as both an inspiration and a mirror. As we read each characteristic, we see both the beauty we're called to embody and our need for God's grace to love this way. True love is patient with others' failures, kind in our words and actions, and free from jealousy or pride. It protects relationships, trusts God's work in others, and never gives up hope. This love isn't earned through willpower but flows from our experience of God's unconditional love for us.",
    keywords: ["love", "patience", "kindness", "hope", "endurance"]
  },

  // Hope & Encouragement
  {
    id: 13,
    topic: "Hope in Suffering",
    book: "Romans",
    chapter: 8,
    verses: "28",
    text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    reflection: "This promise doesn't mean that all things are good in themselves, but that God's sovereign love can bring good from even the darkest circumstances. For those who love God and walk in His calling, no experience—however painful—is wasted. Our Father weaves together the threads of joy and sorrow, success and failure, to create a tapestry of grace that reveals His glory and accomplishes His loving purposes in our lives. This hope sustains us through every trial.",
    keywords: ["hope", "purpose", "sovereignty", "good", "calling"]
  },
  {
    id: 14,
    topic: "Future Glory",
    book: "2 Corinthians",
    chapter: 4,
    verses: "17-18",
    text: "For our light affliction, which is but for a moment, worketh for us a far more exceeding and eternal weight of glory; While we look not at the things which are seen, but at the things which are not seen: for the things which are seen are temporal; but the things which are not seen are eternal.",
    reflection: "Perspective transforms suffering. When we view our present troubles through the lens of eternity, they become 'light affliction' that produces immeasurable glory. This isn't minimizing real pain but recognizing that our current struggles are preparing us for an unimaginable inheritance. By focusing on eternal realities rather than temporary circumstances, we find strength to persevere and purpose in our pain. The invisible truths of God's love, promises, and future plans are more real and lasting than our visible struggles.",
    keywords: ["perspective", "affliction", "glory", "eternal", "hope"]
  },

  // Forgiveness & Mercy
  {
    id: 15,
    topic: "Forgiving Others",
    book: "Matthew",
    chapter: 6,
    verses: "14-15",
    text: "For if ye forgive men their trespasses, your heavenly Father will also forgive you: But if ye forgive not men their trespasses, neither will your Father forgive your trespasses.",
    reflection: "Forgiveness isn't optional for followers of Christ—it's the natural overflow of hearts that have experienced God's mercy. When we withhold forgiveness, we reveal that we haven't fully grasped the magnitude of our own forgiveness. God's forgiveness of us isn't earned but freely given, and we're called to extend that same grace to others. This doesn't mean ignoring sin or avoiding consequences, but releasing our right to vengeance and choosing to seek restoration rather than retaliation.",
    keywords: ["forgiveness", "mercy", "grace", "restoration", "release"]
  },
  {
    id: 16,
    topic: "Unlimited Forgiveness",
    book: "Matthew",
    chapter: 18,
    verses: "21-22",
    text: "Then came Peter to him, and said, Lord, how oft shall my brother sin against me, and I forgive him? till seven times? Jesus saith unto him, I say not unto thee, Until seven times: but, Until seventy times seven.",
    reflection: "Jesus shattered the limits of human forgiveness with this radical teaching. He's not establishing a mathematical formula but revealing that true forgiveness has no boundaries. Just as God's mercy toward us is limitless, our mercy toward others should flow without constraint. This doesn't mean being naive about repeated harm, but it means our hearts remain open to reconciliation whenever genuine repentance occurs. Unlimited forgiveness frees us from the prison of bitterness and reflects the infinite grace we've received.",
    keywords: ["forgiveness", "unlimited", "mercy", "grace", "freedom"]
  },

  // Wisdom & Understanding
  {
    id: 17,
    topic: "Seeking Wisdom",
    book: "James",
    chapter: 1,
    verses: "5-6",
    text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him. But let him ask in faith, nothing wavering. For he that wavereth is like a wave of the sea driven with the wind and tossed.",
    reflection: "God delights to give wisdom to those who ask, and He gives generously without criticism or reluctance. The key is approaching Him with unwavering faith, trusting that He knows what's best and will provide the understanding we need. Doubt creates instability, making us toss between God's wisdom and worldly thinking. When we ask with confidence in God's character and promises, we position ourselves to receive the clarity and insight that will guide our decisions and illuminate our path.",
    keywords: ["wisdom", "asking", "faith", "stability", "guidance"]
  },
  {
    id: 18,
    topic: "Fear of the Lord",
    book: "Proverbs",
    chapter: 9,
    verses: "10",
    text: "The fear of the Lord is the beginning of wisdom: and the knowledge of the holy is understanding.",
    reflection: "True wisdom begins with proper reverence for God—recognizing His holiness, power, and rightful authority over our lives. This 'fear' isn't terror but awe-filled respect that acknowledges our dependence on our Creator. When we approach life from this foundation, we gain perspective that transforms everything else. Knowledge of God's character—His love, justice, mercy, and faithfulness—provides the framework for understanding ourselves, our relationships, and our purpose. All wisdom flows from this wellspring of knowing the Holy One.",
    keywords: ["wisdom", "reverence", "holiness", "understanding", "foundation"]
  },

  // Peace & Rest
  {
    id: 19,
    topic: "Perfect Peace",
    book: "Isaiah",
    chapter: 26,
    verses: "3",
    text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.",
    reflection: "Perfect peace isn't the absence of storms but the presence of God in the midst of them. When our minds are 'stayed' on God—fixed, focused, and anchored in His character and promises—we discover a peace that doesn't depend on circumstances. This peace comes through trust, not understanding. We don't need to comprehend all of God's ways to rest in His goodness. As we deliberately turn our thoughts to Him throughout each day, His peace guards our hearts and minds, creating stability in an unstable world.",
    keywords: ["peace", "trust", "mind", "stability", "presence"]
  },
  {
    id: 20,
    topic: "Rest for the Weary",
    book: "Matthew",
    chapter: 11,
    verses: "28-30",
    text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light.",
    reflection: "Jesus extends the most beautiful invitation ever given to weary souls. He doesn't offer rest as an escape from responsibility but as a new way of carrying life's burdens. His yoke represents partnership—we're not alone in our struggles. Christ's gentleness and humility create a safe space where we can bring our heaviest loads and find His strength sufficient. The rest He offers touches our souls at the deepest level, providing not just physical relief but spiritual renewal and emotional healing.",
    keywords: ["rest", "burden", "yoke", "gentleness", "renewal"]
  }
];

/**
 * Get a daily reading based on the current date
 * Cycles through all readings over a 20-day period
 */
export function getTodaysReading(): DailyReading {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const readingIndex = (dayOfYear - 1) % DAILY_READINGS.length;
  return DAILY_READINGS[readingIndex];
}

/**
 * Get a random reading for variety
 */
export function getRandomReading(): DailyReading {
  const randomIndex = Math.floor(Math.random() * DAILY_READINGS.length);
  return DAILY_READINGS[randomIndex];
}

/**
 * Search readings by topic or keywords
 */
export function searchReadings(query: string): DailyReading[] {
  const searchTerm = query.toLowerCase();
  return DAILY_READINGS.filter(reading => 
    reading.topic.toLowerCase().includes(searchTerm) ||
    reading.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
    reading.book.toLowerCase().includes(searchTerm)
  );
}
