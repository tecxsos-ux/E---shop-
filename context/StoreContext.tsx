
import React, { createContext, useReducer, useEffect } from 'react';
import { Product, CartItem, User, Order, Category, OrderStatus, Slide, Banner, Settings, Review } from '../types';

interface State {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  user: User | null; // Current logged in user
  users: User[]; // All registered users (for admin)
  orders: Order[];
  reviews: Review[];
  slides: Slide[];
  banners: Banner[];
  filters: {
    category: string | null;
    subCategory: string | null;
    search: string;
  };
  settings: Settings;
  isLoading: boolean;
  isDbConnected: boolean;
}

// --- Initial Mock Data (Fallback) ---
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Minimalist Leather Watch',
    description: 'A sleek and modern timepiece suitable for any occasion.',
    price: 129.99,
    category: 'Accessories',
    subCategory: 'Watches',
    image: 'https://picsum.photos/400/400?random=1',
    images: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/400/400?random=10'],
    stock: 50,
    variants: [{ type: 'color', options: ['Black', 'Brown'] }],
    brand: 'Timeless',
    isNew: true
  },
  {
    id: '2',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immerse yourself in high-fidelity audio with active noise cancellation.',
    price: 299.99,
    category: 'Electronics',
    subCategory: 'Audio',
    image: 'https://picsum.photos/400/400?random=2',
    images: ['https://picsum.photos/400/400?random=2'],
    stock: 25,
    variants: [{ type: 'color', options: ['Silver', 'Matte Black'] }],
    brand: 'SonicStream',
    discount: 10
  },
  {
    id: '3',
    name: 'Classic Denim Jacket',
    description: 'A wardrobe staple, durable and stylish denim jacket.',
    price: 89.50,
    category: 'Clothing',
    subCategory: 'Outerwear',
    image: 'https://picsum.photos/400/400?random=3',
    images: ['https://picsum.photos/400/400?random=3'],
    stock: 100,
    variants: [{ type: 'size', options: ['S', 'M', 'L', 'XL'] }],
    brand: 'UrbanThread',
  },
  {
    id: '4',
    name: 'Smart Home Speaker',
    description: 'Control your home with voice commands and enjoy room-filling sound.',
    price: 149.00,
    category: 'Electronics',
    subCategory: 'Home',
    image: 'https://picsum.photos/400/400?random=4',
    images: ['https://picsum.photos/400/400?random=4'],
    stock: 15,
    variants: [{ type: 'color', options: ['White', 'Charcoal'] }],
    brand: 'TechLife',
    isNew: true
  }
];

const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', subCategories: ['Audio', 'Home', 'Mobile'], image: 'https://picsum.photos/600/800?random=10' },
  { id: '2', name: 'Clothing', subCategories: ['Outerwear', 'T-Shirts', 'Pants'], image: 'https://picsum.photos/600/800?random=11' },
  { id: '3', name: 'Accessories', subCategories: ['Watches', 'Bags', 'Jewelry'], image: 'https://picsum.photos/600/800?random=12' },
];

const initialReviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userId: 'u2',
    userName: 'Sophie Dupont',
    rating: 5,
    comment: 'Absolutely love this watch! Simple and elegant.',
    date: '2024-03-12T10:00:00Z'
  },
  {
    id: 'r2',
    productId: '1',
    userId: 'u_krish',
    userName: 'Krish Admin',
    rating: 4,
    comment: 'Great value for money, though the strap is a bit stiff at first.',
    date: '2024-03-15T14:30:00Z'
  }
];

const initialSlides: Slide[] = [
  {
    id: "1",
    title: "Summer Collection 2024",
    subtitle: "Redefine Your Style Statement",
    description: "Discover the latest trends in luxury fashion. Exclusive items curated just for you.",
    image: "https://picsum.photos/1600/900?random=101",
    link: "/shop?category=Clothing",
    color: "from-indigo-900/90"
  },
  {
    id: "2",
    title: "Next Gen Electronics",
    subtitle: "Upgrade Your Digital Life",
    description: "Experience superior performance with our latest tech gadgets and accessories.",
    image: "https://picsum.photos/1600/900?random=102",
    link: "/shop?category=Electronics",
    color: "from-blue-900/90"
  },
  {
    id: "3",
    title: "Premium Accessories",
    subtitle: "The Perfect Finishing Touch",
    description: "Elevate your daily look with our hand-picked selection of watches and jewelry.",
    image: "https://picsum.photos/1600/900?random=103",
    link: "/shop?category=Accessories",
    color: "from-emerald-900/90"
  }
];

const initialBanners: Banner[] = [
  {
    id: "banner1",
    title: "Streetwear",
    subtitle: "TRENDING",
    image: "https://picsum.photos/600/800?random=201",
    link: "/shop?category=Clothing",
    buttonText: "Browse Collection"
  },
  {
    id: "banner2",
    title: "Audio Gear",
    subtitle: "BEST SELLERS",
    image: "https://picsum.photos/600/800?random=202",
    link: "/shop?category=Electronics",
    buttonText: "Shop Now"
  }
];

const initialUsers: User[] = [
  { 
    id: 'u1', 
    name: 'Admin User', 
    email: 'admin@luxe.com', 
    role: 'admin', 
    location: 'New York, USA', 
    joinedDate: '2023-01-15T09:00:00Z', 
    lastLogin: new Date().toISOString(),
    status: 'active'
  },
  { 
    id: 'u_krish', 
    name: 'Krish Admin', 
    email: 'krish1988@live.com', 
    role: 'admin', 
    location: 'Admin HQ', 
    joinedDate: new Date().toISOString(), 
    lastLogin: new Date().toISOString(),
    status: 'active'
  },
  { 
    id: 'u2', 
    name: 'Sophie Dupont', 
    email: 'sophie@example.fr', 
    role: 'customer', 
    location: 'Paris, France', 
    joinedDate: '2023-11-20T14:30:00Z', 
    lastLogin: '2024-03-10T10:15:00Z',
    status: 'active'
  },
];

const defaultSettings: Settings = {
    brandName: 'Phallbun',
    brandLogo: '',
    primaryColor: '#4f46e5',
    secondaryColor: '#d97706',
    brandTextColor: '#111827',
    headerBackgroundColor: '#ffffff',
    headerTextColor: '#4b5563',
    footerBackgroundColor: '#111827',
    footerTextColor: '#ffffff',
    taxRate: 8,
    shippingCost: 15,
    companyName: 'Phallbun Online Sales',
    companyAddress: '123 E-Commerce Blvd, Digital City, 90210',
    companyTaxId: 'US-88392102',
    companyPhone: '+1 (555) 123-4567',
    companyEmail: 'support@phallbun.com',
    companyWorkingHours: 'Mon - Fri: 9:00 AM - 6:00 PM'
};

const initialState: State = {
  products: initialProducts,
  categories: initialCategories,
  cart: [],
  wishlist: [],
  user: null,
  users: initialUsers,
  orders: [],
  reviews: initialReviews,
  slides: initialSlides,
  banners: initialBanners,
  filters: {
    category: null,
    subCategory: null,
    search: '',
  },
  settings: defaultSettings,
  isLoading: true,
  isDbConnected: false
};

// --- Actions ---
type Action =
  | { type: 'LOAD_DATA'; payload: Partial<State> }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: CartItem }
  | { type: 'DECREASE_QTY'; payload: CartItem }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; payload: string }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'REGISTER_USER'; payload: User }
  | { type: 'LOGIN_USER'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: OrderStatus } }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'DELETE_REVIEW'; payload: string }
  | { type: 'SET_FILTER_CATEGORY'; payload: string | null }
  | { type: 'SET_FILTER_SUBCATEGORY'; payload: string | null }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'ADD_SLIDE'; payload: Slide }
  | { type: 'UPDATE_SLIDE'; payload: Slide }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'UPDATE_BANNER'; payload: Banner }
  | { type: 'UPDATE_SETTINGS'; payload: Settings }
  | { type: 'SET_DB_STATUS'; payload: boolean };

const storeReducer = (state: State, action: Action): State => {
  // --- Backend Sync Helper (Fire and Forget) ---
  const sync = (endpoint: string, method: string, body: any) => {
    if (!state.isDbConnected) return; // Only sync if connected
    fetch(`http://localhost:5000/api/${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).catch(err => console.log("Backend sync failed:", err));
  };

  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload, isLoading: false };
    case 'SET_DB_STATUS':
      return { ...state, isDbConnected: action.payload };  
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.findIndex(
        item => item.id === action.payload.id && 
                item.selectedColor === action.payload.selectedColor && 
                item.selectedSize === action.payload.selectedSize
      );
      if (existingItemIndex > -1) {
        const newCart = [...state.cart];
        newCart[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, cart: newCart };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case 'REMOVE_FROM_CART':
      return { 
        ...state, 
        cart: state.cart.filter(item => 
          !(item.id === action.payload.id && 
            item.selectedColor === action.payload.selectedColor && 
            item.selectedSize === action.payload.selectedSize)
        ) 
      };
    case 'DECREASE_QTY': {
       const existingItemIndex = state.cart.findIndex(
        item => item.id === action.payload.id && 
                item.selectedColor === action.payload.selectedColor && 
                item.selectedSize === action.payload.selectedSize
      );
      if (existingItemIndex > -1) {
        const newCart = [...state.cart];
        if(newCart[existingItemIndex].quantity > 1) {
            newCart[existingItemIndex].quantity -= 1;
        } else {
             newCart.splice(existingItemIndex, 1);
        }
        return { ...state, cart: newCart };
      }
      return state;
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_WISHLIST':
      const exists = state.wishlist.includes(action.payload);
      return {
        ...state,
        wishlist: exists 
          ? state.wishlist.filter(id => id !== action.payload)
          : [...state.wishlist, action.payload]
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'REGISTER_USER':
       sync('users', 'POST', action.payload);
       return { ...state, users: [...state.users, action.payload], user: action.payload };
    case 'LOGIN_USER':
       const loggedUser = state.users.find(u => u.email.toLowerCase() === action.payload.toLowerCase());
       return loggedUser ? { ...state, user: loggedUser } : state;
    case 'ADD_PRODUCT':
      sync('products', 'POST', action.payload);
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
       // Note: Add PUT endpoint to server if needed
       return {
         ...state,
         products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
       };
    case 'ADD_ORDER':
      sync('orders', 'POST', action.payload);
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER_STATUS':
      sync(`orders/${action.payload.id}`, 'PUT', { status: action.payload.status });
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.payload.id ? { ...o, status: action.payload.status } : o)
      };
    case 'ADD_REVIEW':
      sync('reviews', 'POST', action.payload);
      return { ...state, reviews: [action.payload, ...state.reviews] };
    case 'DELETE_REVIEW':
      sync(`reviews/${action.payload}`, 'DELETE', {});
      return { ...state, reviews: state.reviews.filter(r => r.id !== action.payload) };
    case 'SET_FILTER_CATEGORY':
      return { ...state, filters: { ...state.filters, category: action.payload, subCategory: null } };
    case 'SET_FILTER_SUBCATEGORY':
      return { ...state, filters: { ...state.filters, subCategory: action.payload } };
    case 'SET_SEARCH':
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case 'ADD_SLIDE':
      sync('slides', 'POST', action.payload);
      return { ...state, slides: [...state.slides, action.payload] };
    case 'UPDATE_SLIDE':
      return { ...state, slides: state.slides.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SLIDE':
      return { ...state, slides: state.slides.filter(s => s.id !== action.payload) };
    case 'ADD_CATEGORY':
      sync('categories', 'POST', action.payload);
      return { ...state, categories: [...state.categories, action.payload] };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case 'UPDATE_BANNER':
      return { ...state, banners: state.banners.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'UPDATE_SETTINGS':
      sync('settings', 'POST', action.payload);
      return { ...state, settings: action.payload };
    default:
      return state;
  }
};

export const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  refreshData: () => Promise<void>;
}>({ state: initialState, dispatch: () => null, refreshData: async () => {} });

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const fetchData = async () => {
    try {
      const API = 'http://localhost:5000/api';
      
      // 1. Check health
      const healthRes = await fetch(`${API}/health`).catch(() => null);
      if (!healthRes || !healthRes.ok) throw new Error("Backend offline");

      dispatch({ type: 'SET_DB_STATUS', payload: true });

      // 2. Fetch all data in parallel
      const [productsRes, catsRes, slidesRes, usersRes, ordersRes, settingsRes, reviewsRes] = await Promise.all([
         fetch(`${API}/products`),
         fetch(`${API}/categories`),
         fetch(`${API}/slides`),
         fetch(`${API}/users`),
         fetch(`${API}/orders`),
         fetch(`${API}/settings`),
         fetch(`${API}/reviews`)
      ]);

      const products = await productsRes.json();
      const categories = await catsRes.json();
      const slides = await slidesRes.json();
      const users = await usersRes.json();
      const orders = await ordersRes.json();
      const settings = await settingsRes.json();
      const reviews = await reviewsRes.json();

      dispatch({
        type: 'LOAD_DATA',
        payload: {
          products: products.length > 0 ? products : initialProducts,
          categories: categories.length > 0 ? categories : initialCategories,
          slides: slides.length > 0 ? slides : initialSlides,
          users: users.length > 0 ? users : initialUsers,
          orders: orders.length > 0 ? orders : [],
          reviews: reviews.length > 0 ? reviews : initialReviews,
          settings: Object.keys(settings).length > 0 ? settings : defaultSettings
        }
      });
      console.log("✅ Data successfully loaded from Backend.");
    } catch (err) {
      console.warn("⚠️ Server connection failed or API is offline. Using local mock data.", err);
      // Fallback to mock is already in initialState, just set loading false and db false
      dispatch({ type: 'LOAD_DATA', payload: {} });
      dispatch({ type: 'SET_DB_STATUS', payload: false });
    }
  };

  // --- Fetch Data from Backend on Load ---
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <StoreContext.Provider value={{ state, dispatch, refreshData: fetchData }}>
      {children}
    </StoreContext.Provider>
  );
};
