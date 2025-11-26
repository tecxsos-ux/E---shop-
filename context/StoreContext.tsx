
import React, { createContext, useReducer, useEffect } from 'react';
import { Product, CartItem, User, Order, Category, OrderStatus, Slide, Banner, Settings } from '../types';

interface State {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  slides: Slide[];
  banners: Banner[];
  filters: {
    category: string | null;
    subCategory: string | null;
    search: string;
  };
  settings: Settings;
}

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

const initialState: State = {
  products: initialProducts,
  categories: initialCategories,
  cart: [],
  user: { id: 'u1', name: 'Admin User', email: 'admin@luxe.com', role: 'admin' },
  orders: [
    {
       id: 'ORD-1001',
       userId: 'u1',
       date: new Date().toISOString(),
       status: OrderStatus.Delivered,
       subtotal: 129.99,
       tax: 10.40,
       shippingCost: 0,
       total: 140.39,
       shippingAddress: { line1: '123 Fake St', city: 'Springfield', postalCode: '90210', country: 'USA' },
       items: [{ ...initialProducts[0], quantity: 1 }]
    }
  ],
  slides: initialSlides,
  banners: initialBanners,
  filters: {
    category: null,
    subCategory: null,
    search: '',
  },
  settings: {
    brandName: 'LuxeMarket',
    brandLogo: '',
    primaryColor: '#4f46e5', // Default Indigo-600 hex
    brandTextColor: '#111827', // Default Gray-900
    taxRate: 8, // 8% default
    shippingCost: 15 // $15 default flat rate
  }
};

type Action =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: CartItem }
  | { type: 'DECREASE_QTY'; payload: CartItem }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: OrderStatus } }
  | { type: 'SET_FILTER_CATEGORY'; payload: string | null }
  | { type: 'SET_FILTER_SUBCATEGORY'; payload: string | null }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'ADD_SLIDE'; payload: Slide }
  | { type: 'UPDATE_SLIDE'; payload: Slide }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'UPDATE_BANNER'; payload: Banner }
  | { type: 'UPDATE_SETTINGS'; payload: Settings };

const storeReducer = (state: State, action: Action): State => {
  switch (action.type) {
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
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
       return {
         ...state,
         products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
       };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.payload.id ? { ...o, status: action.payload.status } : o)
      };
    case 'SET_FILTER_CATEGORY':
      return { ...state, filters: { ...state.filters, category: action.payload, subCategory: null } };
    case 'SET_FILTER_SUBCATEGORY':
      return { ...state, filters: { ...state.filters, subCategory: action.payload } };
    case 'SET_SEARCH':
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case 'ADD_SLIDE':
      return { ...state, slides: [...state.slides, action.payload] };
    case 'UPDATE_SLIDE':
      return { ...state, slides: state.slides.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SLIDE':
      return { ...state, slides: state.slides.filter(s => s.id !== action.payload) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case 'UPDATE_BANNER':
      return { ...state, banners: state.banners.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
};

export const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
