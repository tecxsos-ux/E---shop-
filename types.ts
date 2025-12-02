
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  image: string;
  images: string[];
  stock: number;
  variants: Variant[];
  brand: string;
  isNew?: boolean;
  discount?: number;
}

export interface Variant {
  type: string; // Changed from 'color' | 'size' to string to support custom types like "Material", "Style"
  options: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  // For dynamic variants, we might ideally use a map, but keeping these for backward compat
  // and ease of use in the current checkout flow.
  selectedVariants?: Record<string, string>; 
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  avatar?: string;
  location?: string; // e.g., "Paris, France"
  joinedDate?: string;
  lastLogin?: string;
  status?: 'active' | 'inactive';
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export enum OrderStatus {
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Returned = 'Returned'
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: Address;
}

export interface Address {
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  subCategories: string[];
  image?: string;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  color: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  textColorClass?: string; // e.g., "text-yellow-400"
}

export interface Settings {
  brandName: string;
  brandLogo: string;
  primaryColor: string;
  secondaryColor: string;
  brandTextColor: string;
  
  // Header Settings
  headerBackgroundColor?: string;
  headerTextColor?: string;

  // Footer Settings
  footerBackgroundColor?: string;
  footerTextColor?: string;

  taxRate: number; // Percentage
  shippingCost: number; // Flat rate
  
  // Company Info
  companyName: string;
  companyAddress: string;
  companyTaxId: string;
  companyPhone: string;
  companyEmail: string;
  companyWorkingHours: string;
  
  // Social/Contact
  whatsappNumber?: string;
}