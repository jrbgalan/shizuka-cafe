export * from '@/data/menuTypes';

export interface Product {
  id: string;
  image: string;
  images?: string[];
  slug: string;
  name: string;
  jp?: string;
  origin: string;
  roast: string;
  process: string;
  price: number; // in PHP
  weight: string;
  tastingNotes: string[];
  description: string;
  imageLabel?: string;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  inStock?: boolean;
  grindOptions?: string[];
}

export type JournalCategory =
  | 'All'
  | 'Coffee Notes'
  | 'Brewing Guides'
  | 'Origins'
  | 'Café Life'
  | 'Seasonal'
  | 'Recipes'
  | string;

export interface Author {
  name: string;
  role: string;
  avatarLabel: string;
}

export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'image' | 'list';
  content?: string;
  items?: string[];
  caption?: string;
  label?: string;
  src?: string;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: ContentBlock[];
  category: JournalCategory;
  author?: Author;
  date: string;
  readTime?: string;
  coverImageLabel?: string;
  coverImage?: string;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  quantity?: number;
  size?: string;
  grind?: string;
  weight?: string;
  imageLabel?: string;
  image?: string;
  jp?: string;
  options?: Record<string, unknown>;
  type?: 'product' | 'menu';
  notes?: string;
  slug?: string;
}

export interface Currency {
  code: string;
  symbol: string;
  label: string;
  rate: number;
  locale: string;
}

export interface Language {
  code: string;
  label: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  role?: 'user' | 'admin' | string;
  createdAt?: string;
  avatar?: string;
  phone?: string;
  address?: Record<string, unknown>;
}

export interface AuthError {
  type: 'user_not_registered' | 'auth_required' | 'invalid_credentials' | string;
  message?: string;
}

export interface Experience {
  id: string;
  title: string;
  jp?: string;
  description: string;
  imageLabel?: string;
  href?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role?: string;
}

export interface GalleryItem {
  id: string;
  label: string;
  caption: string;
  src?: string;
}

export interface CafeEvent {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  price: number;
  spots: number;
  description: string;
  imageLabel?: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  description: string;
}

export interface SiteAddress {
  line1: string;
  city: string;
  region: string;
  country: string;
  postcode: string;
}

export interface SiteHour {
  day: string;
  time: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  to: string;
}

export interface SiteConfig {
  name: string;
  nameJP: string;
  tagline: string;
  taglineJP: string;
  established: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  address: SiteAddress;
  hours: SiteHour[];
  socials: SocialLink[];
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ShippingAddress {
  address1: string;
  address2?: string;
  city: string;
  region: string;
  postal: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost?: number;
  shipping?: number | ShippingAddress;
  shippingAddress?: ShippingAddress;
  total: number;
  promo?: string | null;
  customer: CustomerInfo;
  delivery?: {
    coords?: [number, number] | { lat: number; lng: number };
    distanceKm?: number;
    estimatedMins?: number;
  };
  payment?: string | {
    method: string;
    last4?: string;
  };
  status: string;
  [key: string]: unknown;
}


