import { Watch } from '../types/watch';

export const INITIAL_WATCHES: Watch[] = [
  {
    id: 'luxora-daytona-gold',
    name: "Cosmograph Celestial Gold 40",
    brand: "Rolex Heritage by LUXORA",
    category: "Luxury Watches",
    secondaryCategories: ["Men's Watches", "Automatic Watches", "Chronograph Watches"],
    originalPricePKR: 11500000,
    discountedPricePKR: 9850000,
    rating: 4.98,
    reviews: [
      {
        id: 'rev-1',
        author: 'Shahmir Khan',
        city: 'Islamabad',
        rating: 5,
        date: '2 weeks ago',
        title: 'Breathtaking craftsmanship on the wrist',
        comment: 'Received via armored courier in F-7 Islamabad. The 18k yellow gold fluted bezel and emerald sunray dial reflect light with unreal brilliance. The weight and 3D precision are unmatched.',
        verified: true
      },
      {
        id: 'rev-2',
        author: 'Malik Tariq',
        city: 'Lahore',
        rating: 5,
        date: '1 month ago',
        title: 'Definitive luxury statement',
        comment: 'The chronograph tactile feedback is pure Swiss perfection. Beautiful packaging with certificate of authenticity.',
        verified: true
      }
    ],
    description: "An icon of horological supremacy. Crafted in solid 18K Yellow Gold with a deep Emerald Sunray Guilloche dial, contrasting black chronograph rings, and ceramic tachymetric scale. Equipped with the legendary Calibre 4130 self-winding chronograph movement.",
    heritageStory: "First engineered for racing luminaries on the sands of Daytona, this bespoke celestial edition marries vintage racing pedigree with royal Geneva opulence.",
    availableColors: [
      { name: 'Celestial Emerald', hex: '#064e3b', dialColor: '#053e2e' },
      { name: 'Onyx Midnight', hex: '#09090b', dialColor: '#09090b' },
      { name: 'Champagne Royal', hex: '#d4af37', dialColor: '#8f7422' }
    ],
    strapMaterial: "18K Solid Yellow Gold Oysterlink with Oysterlock safety clasp",
    caseMaterial: "18K Solid Yellow Gold & Ceramic Bezel",
    watchSize: "40mm",
    stockAvailability: 4,
    images: [],
    model3DConfig: {
      caseStyle: 'classic-round',
      bezelType: 'tachymeter',
      dialPattern: 'chronograph',
      dialColor: '#064e3b',
      metalFinish: 'yellow-gold',
      strapType: 'metal-bracelet',
      hasTourbillon: false,
      hasChronographSubdials: true,
      accentColor: '#f59e0b'
    },
    specs: {
      calibre: "LX-4130 Perpetual Chronograph",
      powerReserve: "72 Hours",
      waterResistance: "100m / 330ft",
      movement: "Automatic",
      crystal: "Scratch-resistant Sapphire with Cyclops lens",
      jewels: 44,
      thickness: "12.2mm",
      frequency: "28,800 vph (4 Hz)",
      caseDiameter: "40mm"
    },
    isLimitedEdition: true,
    editionLimit: "12 / 50 Worldwide",
    featured: true,
    isNewArrival: false
  },
  {
    id: 'luxora-royal-oak-tourbillon',
    name: "Royal Oak Double Balance Skeleton",
    brand: "Audemars Piguet Art by LUXORA",
    category: "Automatic Watches",
    secondaryCategories: ["Luxury Watches", "Men's Watches", "Limited Edition Watches"],
    originalPricePKR: 19800000,
    discountedPricePKR: 17500000,
    rating: 4.96,
    reviews: [
      {
        id: 'rev-3',
        author: 'Zainab Bilgrami',
        city: 'Karachi, Clifton',
        rating: 5,
        date: '3 weeks ago',
        title: 'Masterpiece of micro-engineering',
        comment: 'The openworked skeleton movement with visible double balance wheel oscillating at 21,600 vph is hypnotic. The octagonal bevels catch every ambient ray.',
        verified: true
      }
    ],
    description: "The apex of contemporary Haute Horlogerie. Featuring an intricately skeletonized dial revealing the gold-plated double balance wheel mechanism, mounted inside an octagonal hand-satin-brushed 18K Rose Gold case secured with 8 white gold hexagonal screws.",
    heritageStory: "Born from Gérald Genta's revolutionary 1972 octagonal silhouette, reimagined with full architectural skeletonization and double-impulse balance wheel harmony.",
    availableColors: [
      { name: 'Rose Gold Skeleton', hex: '#e8a598', dialColor: '#1c1917' },
      { name: 'Titanium Frost', hex: '#94a3b8', dialColor: '#0f172a' }
    ],
    strapMaterial: "18K Rose Gold integrated bracelet with AP folding clasp",
    caseMaterial: "18K Rose Gold with satin-brushed & mirror-polished bevels",
    watchSize: "41mm",
    stockAvailability: 2,
    images: [],
    model3DConfig: {
      caseStyle: 'royal-oak',
      bezelType: 'screwed-octagonal',
      dialPattern: 'skeleton',
      dialColor: '#18181b',
      metalFinish: 'rose-gold',
      strapType: 'metal-bracelet',
      hasTourbillon: true,
      hasChronographSubdials: false,
      accentColor: '#ef4444'
    },
    specs: {
      calibre: "LX-3132 Dual-Balance In-House",
      powerReserve: "45 Hours",
      waterResistance: "50m / 165ft",
      movement: "Tourbillon",
      crystal: "Glareproofed Sapphire crystal and exhibition caseback",
      jewels: 38,
      thickness: "9.9mm",
      frequency: "21,600 vph (3 Hz)",
      caseDiameter: "41mm"
    },
    isLimitedEdition: true,
    editionLimit: "07 / 25 Pieces",
    featured: true,
    isNewArrival: true
  },
  {
    id: 'luxora-nautilus-celestial',
    name: "Nautilus Grand Celestial Moonphase",
    brand: "Patek Philippe Masterwork",
    category: "Limited Edition Watches",
    secondaryCategories: ["Luxury Watches", "Automatic Watches", "Men's Watches"],
    originalPricePKR: 32000000,
    discountedPricePKR: 28900000,
    rating: 5.0,
    reviews: [
      {
        id: 'rev-4',
        author: 'Senator H. Durrani',
        city: 'Islamabad',
        rating: 5,
        date: '5 days ago',
        title: 'Beyond an instrument - a family heirloom',
        comment: 'You never actually own a Patek Philippe, you merely look after it for the next generation. The celestial star chart and deep midnight sunburst dial are sublime.',
        verified: true
      }
    ],
    description: "The definitive collector's grail. Featuring an astronomical dial depicting the exact angular motion of the northern hemisphere night sky, Sirius meridian transit, and realistic lunar orbit phases. Encased in Platinum 950 with an integrated midnight blue crocodile strap.",
    heritageStory: "An homage to the great Geneva astronomical clocks. The celestial module comprises 279 micro-components operating in quiet mathematical symphony.",
    availableColors: [
      { name: 'Midnight Celestial Blue', hex: '#0f172a', dialColor: '#0a1128' },
      { name: 'Onyx Pure Noir', hex: '#000000', dialColor: '#020203' }
    ],
    strapMaterial: "Hand-stitched Mississippiensis Alligator Leather in Midnight Navy",
    caseMaterial: "Platinum 950 with flawless Top Wesselton Diamond set at 6 o'clock",
    watchSize: "42mm",
    stockAvailability: 1,
    images: [],
    model3DConfig: {
      caseStyle: 'classic-round',
      bezelType: 'smooth',
      dialPattern: 'sunray',
      dialColor: '#0c1a3a',
      metalFinish: 'platinum',
      strapType: 'leather-stitch',
      hasTourbillon: false,
      hasChronographSubdials: true,
      accentColor: '#38bdf8'
    },
    specs: {
      calibre: "LX-240 LU CL C Astronomical Automatic",
      powerReserve: "48 Hours",
      waterResistance: "30m / 100ft",
      movement: "Automatic",
      crystal: "Double-domed antireflective sapphire",
      jewels: 45,
      thickness: "10.58mm",
      frequency: "21,600 vph",
      caseDiameter: "42mm"
    },
    isLimitedEdition: true,
    editionLimit: "03 / 10 Masterpieces",
    featured: true,
    isNewArrival: false
  },
  {
    id: 'luxora-richard-mille-rm11',
    name: "RM 11-03 Flyback Chrono Carbon",
    brand: "Richard Mille Avant-Garde",
    category: "Sports Watches",
    secondaryCategories: ["Chronograph Watches", "Limited Edition Watches", "Men's Watches"],
    originalPricePKR: 45000000,
    discountedPricePKR: 39500000,
    rating: 4.97,
    reviews: [
      {
        id: 'rev-5',
        author: 'Arham Vohra',
        city: 'Karachi, DHA',
        rating: 5,
        date: '2 months ago',
        title: 'Formula 1 racing on your wrist',
        comment: 'TTP forged carbon case is featherlight yet virtually indestructible. The flyback pusher responsiveness gives an intoxicating mechanical snap.',
        verified: true
      }
    ],
    description: "Extreme sports engineering inspired by aerodynamics of Formula 1 supercars. NTPT Carbon case with Grade 5 titanium spline screws, variable-geometry rotor, skeletonized grade 5 titanium baseplate, and neon yellow accents.",
    heritageStory: "Developed to endure 5,000 Gs of violent lateral acceleration while maintaining chronometric precision under extreme G-force spikes.",
    availableColors: [
      { name: 'Carbon & Racing Yellow', hex: '#facc15', dialColor: '#171717' },
      { name: 'Carbon & Monaco Red', hex: '#ef4444', dialColor: '#171717' }
    ],
    strapMaterial: "High-grade vulcanized FKM racing rubber with titanium folding clasp",
    caseMaterial: "Carbon TPT with Grade 5 Titanium inner chassis",
    watchSize: "44.5mm x 49.9mm",
    stockAvailability: 2,
    images: [],
    model3DConfig: {
      caseStyle: 'tonneau',
      bezelType: 'screwed-octagonal',
      dialPattern: 'skeleton',
      dialColor: '#18181b',
      metalFinish: 'black-dlc',
      strapType: 'rubber-sport',
      hasTourbillon: false,
      hasChronographSubdials: true,
      accentColor: '#eab308'
    },
    specs: {
      calibre: "LX-RMAC3 Automatic Flyback",
      powerReserve: "55 Hours",
      waterResistance: "50m",
      movement: "Automatic",
      crystal: "Sapphire 1,800 Vickers with anti-glare treatment",
      jewels: 68,
      thickness: "16.15mm",
      frequency: "28,800 vph",
      caseDiameter: "44.5mm"
    },
    isLimitedEdition: true,
    editionLimit: "18 / 30 Worldwide",
    featured: true,
    isNewArrival: true
  },
  {
    id: 'luxora-submariner-kermit',
    name: "Submariner Date 'Emerald Abyss'",
    brand: "Rolex Heritage by LUXORA",
    category: "Sports Watches",
    secondaryCategories: ["Men's Watches", "Automatic Watches"],
    originalPricePKR: 4950000,
    discountedPricePKR: 4250000,
    rating: 4.95,
    reviews: [
      {
        id: 'rev-6',
        author: 'Usman Farooq',
        city: 'Lahore, Gulberg',
        rating: 5,
        date: '1 week ago',
        title: 'The ultimate daily luxury companion',
        comment: 'The glidelock extension system on the clasp is phenomenal in summer. Cerachrom green bezel turns from deep forest to emerald in sunlight.',
        verified: true
      }
    ],
    description: "The definitive reference divers' watch. Unidirectional rotatable 60-minute Cerachrom ceramic bezel in signature emerald green. Chromalight display with long-lasting blue luminescence on black dial, powered by the calibre 3235 with Parachrom hairspring.",
    heritageStory: "Originally created in 1953 as the first diver's wristwatch waterproof to a depth of 100 meters, perfected today to withstand 300 meters of deep ocean abyss.",
    availableColors: [
      { name: 'Ceramic Emerald Green', hex: '#15803d', dialColor: '#09090b' },
      { name: 'Deep Sea Cerulean', hex: '#1e3a8a', dialColor: '#09090b' }
    ],
    strapMaterial: "Oystersteel 904L with Rolex Glidelock fine-adjustment extension",
    caseMaterial: "Oystersteel 904L with Triplock triple waterproofness system",
    watchSize: "41mm",
    stockAvailability: 6,
    images: [],
    model3DConfig: {
      caseStyle: 'classic-round',
      bezelType: 'smooth',
      dialPattern: 'sunray',
      dialColor: '#09090b',
      metalFinish: 'steel',
      strapType: 'metal-bracelet',
      hasTourbillon: false,
      hasChronographSubdials: false,
      accentColor: '#22c55e'
    },
    specs: {
      calibre: "LX-3235 Perpetual Self-Winding",
      powerReserve: "70 Hours",
      waterResistance: "300m / 1,000ft",
      movement: "Automatic",
      crystal: "Scratch-resistant sapphire with Cyclops magnifier",
      jewels: 31,
      thickness: "12mm",
      frequency: "28,800 vph",
      caseDiameter: "41mm"
    },
    featured: false,
    isNewArrival: false
  },
  {
    id: 'luxora-aquanaut-diamond-luce',
    name: "Aquanaut Luce Diamond Pure",
    brand: "Patek Philippe Masterwork",
    category: "Women's Watches",
    secondaryCategories: ["Luxury Watches", "Automatic Watches"],
    originalPricePKR: 9800000,
    discountedPricePKR: 8650000,
    rating: 4.99,
    reviews: [
      {
        id: 'rev-7',
        author: 'Dr. Ayesha Qureshi',
        city: 'Lahore, DHA Phase 6',
        rating: 5,
        date: '3 weeks ago',
        title: 'Elegance redefined',
        comment: 'The bezel set with 48 brilliant-cut Top Wesselton diamonds sparkles like crushed ice. The composite strap is supremely comfortable.',
        verified: true
      }
    ],
    description: "Contemporary, sporty-chic elegance for the discerning modern woman. Octagonal rounded bezel illuminated by a row of 48 flawless diamonds (~1.17 ct). Embossed dial with luminescent numerals and hands, coupled with an ultra-resilient white composite strap.",
    heritageStory: "Launched to capture the vibrant, active lifestyle of modern high society, pairing casual sportiness with high jewelry brilliance.",
    availableColors: [
      { name: 'Pure Diamond White', hex: '#f8fafc', dialColor: '#f1f5f9' },
      { name: 'Rose Gold & Chocolate', hex: '#78350f', dialColor: '#451a03' }
    ],
    strapMaterial: "Ultra-resistant composite material with patented fold-over clasp",
    caseMaterial: "18K Rose Gold with 48 Brilliant-cut Diamonds (1.17 ct)",
    watchSize: "38.8mm",
    stockAvailability: 3,
    images: [],
    model3DConfig: {
      caseStyle: 'royal-oak',
      bezelType: 'smooth',
      dialPattern: 'tapisserie',
      dialColor: '#f8fafc',
      metalFinish: 'rose-gold',
      strapType: 'rubber-sport',
      hasTourbillon: false,
      hasChronographSubdials: false,
      accentColor: '#38bdf8'
    },
    specs: {
      calibre: "LX-26-330 S C Automatic",
      powerReserve: "45 Hours",
      waterResistance: "120m",
      movement: "Automatic",
      crystal: "Sapphire crystal front and exhibition caseback",
      jewels: 30,
      thickness: "8.52mm",
      frequency: "28,800 vph",
      caseDiameter: "38.8mm"
    },
    featured: true,
    isNewArrival: true
  },
  {
    id: 'luxora-smart-horizon-ultra',
    name: "LUXORA Smart Horizon Connected Titan",
    brand: "LUXORA Horology Lab",
    category: "Smart Watches",
    secondaryCategories: ["Men's Watches", "Sports Watches"],
    originalPricePKR: 520000,
    discountedPricePKR: 425000,
    rating: 4.88,
    reviews: [
      {
        id: 'rev-8',
        author: 'Hamza Sheikh',
        city: 'Karachi',
        rating: 5,
        date: '4 days ago',
        title: 'The Apple Watch Hermès killer',
        comment: 'Grade 5 titanium sculpted like a Patek, but houses a 2000 nits LTPO micro-OLED display, dual-frequency GPS, health bio-sensors, and 7-day battery. Unreal value.',
        verified: true
      }
    ],
    description: "The marriage of Swiss haute horology casing with state-of-the-art silicon intellect. CNC-milled Grade 5 aerospace titanium chassis, sapphire crystal touch capacitive dial, bio-optical heart rate and ECG telemetry, biometric sleep tracking, and instant iOS/Android synchronization.",
    heritageStory: "Conceived by LUXORA engineers in Neuchâtel to prove that digital intelligence and bespoke high horology case finishing can coexist seamlessly.",
    availableColors: [
      { name: 'Titanium Stealth Black', hex: '#27272a', dialColor: '#09090b' },
      { name: 'Aerospace Raw Silver', hex: '#e2e8f0', dialColor: '#0f172a' }
    ],
    strapMaterial: "Modular quick-release French Barenia calfskin & Fluoroelastomer sport band",
    caseMaterial: "Aerospace Grade 5 Titanium with DLC scratch-proof coating",
    watchSize: "44mm",
    stockAvailability: 12,
    images: [],
    model3DConfig: {
      caseStyle: 'cushion',
      bezelType: 'smooth',
      dialPattern: 'sunray',
      dialColor: '#09090b',
      metalFinish: 'black-dlc',
      strapType: 'rubber-sport',
      hasTourbillon: false,
      hasChronographSubdials: false,
      accentColor: '#3b82f6'
    },
    specs: {
      calibre: "LX-Quantum S9 Dual-Core Processor",
      powerReserve: "168 Hours (7 Days Connected)",
      waterResistance: "50m Swimproof",
      movement: "Connected Hybrid",
      crystal: "Sapphire Crystal with Anti-Fingerprint oleophobic coating",
      jewels: 0,
      thickness: "10.8mm",
      frequency: "120Hz LTPO OLED Display",
      caseDiameter: "44mm"
    },
    featured: false,
    isNewArrival: true
  },
  {
    id: 'luxora-santos-skeleton-dlc',
    name: "Santos de Nocturne Skeleton",
    brand: "Cartier Prestige by LUXORA",
    category: "Casual Watches",
    secondaryCategories: ["Luxury Watches", "Men's Watches", "Automatic Watches"],
    originalPricePKR: 5400000,
    discountedPricePKR: 4800000,
    rating: 4.93,
    reviews: [
      {
        id: 'rev-9',
        author: 'Daniyal Mir',
        city: 'Rawalpindi',
        rating: 5,
        date: '2 weeks ago',
        title: 'Timeless Roman numerals formed by the movement bridges',
        comment: 'A true work of art. The bridges of the movement actually form the Roman numerals. Extremely sleek on formal suits or casual linen.',
        verified: true
      }
    ],
    description: "A geometric tour de force. The iconic square curved case with visible polished perimeter screws. The bridges of the hand-wound mechanical movement are sculpted to form the Roman numerals XII, III, VI, and IX, revealing every beating gear within.",
    heritageStory: "Created in 1904 by Louis Cartier for pioneer aviator Alberto Santos-Dumont to check time while operating flight controls, immortalized here with skeleton architecture.",
    availableColors: [
      { name: 'ADLC Jet Black', hex: '#18181b', dialColor: '#000000' },
      { name: 'Polished Steel & Gold', hex: '#d4af37', dialColor: '#1e293b' }
    ],
    strapMaterial: "QuickSwitch interchangeable matte black alligator leather and steel bracelet",
    caseMaterial: "Stainless steel coated with amorphous diamond-like carbon (ADLC)",
    watchSize: "39.8mm",
    stockAvailability: 4,
    images: [],
    model3DConfig: {
      caseStyle: 'cushion',
      bezelType: 'smooth',
      dialPattern: 'skeleton',
      dialColor: '#09090b',
      metalFinish: 'black-dlc',
      strapType: 'leather-stitch',
      hasTourbillon: false,
      hasChronographSubdials: false,
      accentColor: '#38bdf8'
    },
    specs: {
      calibre: "LX-9611 MC Hand-Wound Manufacture",
      powerReserve: "72 Hours",
      waterResistance: "100m",
      movement: "Manual-Winding",
      crystal: "Beveled scratch-resistant sapphire crystal",
      jewels: 20,
      thickness: "9.08mm",
      frequency: "28,800 vph",
      caseDiameter: "39.8mm"
    },
    featured: false,
    isNewArrival: false
  },
  {
    id: 'luxora-tag-monaco-gulf',
    name: "Monaco Calibre Heuer 02 Gulf Racing",
    brand: "TAG Heuer Racing",
    category: "Chronograph Watches",
    secondaryCategories: ["Sports Watches", "Casual Watches", "Men's Watches"],
    originalPricePKR: 2400000,
    discountedPricePKR: 2150000,
    rating: 4.91,
    reviews: [
      {
        id: 'rev-10',
        author: 'Bilal Baig',
        city: 'Faisalabad',
        rating: 5,
        date: '3 weeks ago',
        title: 'Steve McQueen King of Cool vibes',
        comment: 'The square dial with Gulf stripes in orange and light blue is unmistakable. The 80-hour power reserve Heuer 02 movement is bulletproof.',
        verified: true
      }
    ],
    description: "The immortal square chronograph made legendary by Steve McQueen in the 1971 film Le Mans. Adorned with the iconic light blue and orange Gulf racing stripes, dual square subdials at 3 and 9 o'clock, and crown positioned on the left.",
    heritageStory: "The world's first water-resistant square-cased automatic chronograph, engineered to withstand the gruelling 24 Hours of Le Mans endurance race.",
    availableColors: [
      { name: 'Gulf Racing Blue & Orange', hex: '#0284c7', dialColor: '#0369a1' },
      { name: 'Monaco Vintage Black', hex: '#18181b', dialColor: '#09090b' }
    ],
    strapMaterial: "Perforated blue calfskin leather racing strap with orange lining",
    caseMaterial: "Fine-brushed and polished stainless steel",
    watchSize: "39mm x 39mm",
    stockAvailability: 5,
    images: [],
    model3DConfig: {
      caseStyle: 'cushion',
      bezelType: 'smooth',
      dialPattern: 'chronograph',
      dialColor: '#0369a1',
      metalFinish: 'steel',
      strapType: 'leather-stitch',
      hasTourbillon: false,
      hasChronographSubdials: true,
      accentColor: '#f97316'
    },
    specs: {
      calibre: "LX-Heuer 02 Automatic In-House",
      powerReserve: "80 Hours",
      waterResistance: "100m",
      movement: "Automatic",
      crystal: "Beveled domed sapphire crystal",
      jewels: 33,
      thickness: "15.2mm",
      frequency: "28,800 vph",
      caseDiameter: "39mm"
    },
    featured: false,
    isNewArrival: false
  },
  {
    id: 'luxora-vacheron-overseas-blue',
    name: "Overseas Tourbillon Ultra-Thin Blue",
    brand: "Vacheron Constantin",
    category: "Luxury Watches",
    secondaryCategories: ["Automatic Watches", "Limited Edition Watches", "Men's Watches"],
    originalPricePKR: 26500000,
    discountedPricePKR: 23800000,
    rating: 4.98,
    reviews: [
      {
        id: 'rev-11',
        author: 'Naveed Jamali',
        city: 'Karachi, Defense Phase 8',
        rating: 5,
        date: '1 month ago',
        title: 'Maltese Cross tourbillon cage is poetry in motion',
        comment: 'At only 5.65mm thin, this tourbillon slips under any bespoke French cuff effortlessly. Hallmark of Geneva certified excellence.',
        verified: true
      }
    ],
    description: "The epitome of high-society travel. Six-sided bezel recalling the Maltese Cross, deep translucent lacquered blue sunburst dial, and an openworked tourbillon cage at 6 o'clock shaped like the emblem of Vacheron Constantin with 22K peripheral gold rotor.",
    heritageStory: "Vacheron Constantin, the world's oldest watch manufacture in continuous operation since 1755, created the Overseas to celebrate modern wanderlust.",
    availableColors: [
      { name: 'Translucent Royal Blue', hex: '#1d4ed8', dialColor: '#172554' },
      { name: 'Silvered Velvet', hex: '#e2e8f0', dialColor: '#cbd5e1' }
    ],
    strapMaterial: "Three interchangeable straps: 18K Pink Gold bracelet, blue rubber, and blue alligator leather",
    caseMaterial: "18K 5N Pink Gold with soft iron casing ring for anti-magnetic protection",
    watchSize: "42.5mm",
    stockAvailability: 1,
    images: [],
    model3DConfig: {
      caseStyle: 'classic-round',
      bezelType: 'fluted',
      dialPattern: 'sunray',
      dialColor: '#172554',
      metalFinish: 'rose-gold',
      strapType: 'metal-bracelet',
      hasTourbillon: true,
      hasChronographSubdials: false,
      accentColor: '#60a5fa'
    },
    specs: {
      calibre: "LX-2160 Ultra-Thin Peripheral Rotor",
      powerReserve: "80 Hours",
      waterResistance: "50m",
      movement: "Tourbillon",
      crystal: "Anti-reflective sapphire crystal and caseback",
      jewels: 30,
      thickness: "5.65mm (Movement) / 10.39mm (Total)",
      frequency: "18,000 vph (2.5 Hz)",
      caseDiameter: "42.5mm"
    },
    isLimitedEdition: true,
    editionLimit: "05 / 20 Editions",
    featured: true,
    isNewArrival: false
  }
];
