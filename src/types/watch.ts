export type WatchCategory =
  | 'Luxury Watches'
  | "Men's Watches"
  | "Women's Watches"
  | 'Sports Watches'
  | 'Smart Watches'
  | 'Automatic Watches'
  | 'Chronograph Watches'
  | 'Casual Watches'
  | 'Limited Edition Watches';

export interface WatchSpecs {
  calibre: string;
  powerReserve: string;
  waterResistance: string;
  movement: 'Automatic' | 'Manual-Winding' | 'Tourbillon' | 'Connected Hybrid' | 'Quartz Chrono';
  crystal: string;
  jewels: number;
  thickness: string;
  frequency: string;
  caseDiameter: string;
}

export interface WatchColorOption {
  name: string;
  hex: string;
  bezelColor?: string;
  dialColor?: string;
}

export interface WatchReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Model3DConfig {
  caseStyle: 'classic-round' | 'royal-oak' | 'tonneau' | 'cushion';
  bezelType: 'fluted' | 'smooth' | 'screwed-octagonal' | 'tachymeter';
  dialPattern: 'sunray' | 'tapisserie' | 'skeleton' | 'guilloche' | 'chronograph';
  dialColor: string;
  metalFinish: 'yellow-gold' | 'rose-gold' | 'steel' | 'black-dlc' | 'platinum';
  strapType: 'metal-bracelet' | 'leather-stitch' | 'rubber-sport' | 'mesh';
  hasTourbillon: boolean;
  hasChronographSubdials: boolean;
  accentColor: string;
}

export interface Watch {
  id: string;
  name: string;
  brand: string;
  category: WatchCategory;
  secondaryCategories?: WatchCategory[];
  originalPricePKR: number;
  discountedPricePKR: number;
  description: string;
  heritageStory: string;
  availableColors: WatchColorOption[];
  strapMaterial: string;
  caseMaterial: string;
  watchSize: string;
  stockAvailability: number;
  rating: number;
  reviews: WatchReview[];
  images: string[];
  model3DConfig: Model3DConfig;
  specs: WatchSpecs;
  isLimitedEdition?: boolean;
  editionLimit?: string;
  featured?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem {
  id: string;
  watch: Watch;
  selectedColor: string;
  selectedStrap: string;
  quantity: number;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  customer: OrderCustomer;
  subtotalPKR: number;
  discountPKR: number;
  taxPKR: number;
  shippingPKR: number;
  totalPKR: number;
  paymentMethod: 'Cash on Delivery (VIP Inspection)' | 'Bank Transfer Wire' | 'Direct Card (Visa / Mastercard)' | 'Luxury Escrow';
  status: 'Order Placed' | 'Quality Inspection' | 'In Armored Transit' | 'Delivered';
  trackingNumber: string;
  luxuryGiftBox: boolean;
  vipInsurance: boolean;
}
