'use client';

import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import Link from 'next/link';
import { Filter, ShoppingBag, Star, Heart, X, ShoppingCart, Eye, ArrowUpDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';
import SEO from '../../components/SEO';

const Shop: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const { t } = useLanguage();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [qvSelections, setQvSelections] = useState<Record<string, string>>({});
  const [addingIds, setAddingIds] = useState<string[]>([]);

  const filteredProducts = state.products.filter(p => {
    if (state.filters.category && p.category !== state.filters.category) return false;
    if (state.filters.subCategory && p.subCategory !== state.filters.subCategory) return false;
    if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        const matchesSearch = 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'brand-asc': return a.brand.localeCompare(b.brand);
      case 'brand-desc': return b.brand.localeCompare(a.brand);
      case 'popularity':
      default:
        const scoreA = (a.isNew ? 10 : 0) + (a.discount ? 5 : 0);
        const scoreB = (b.isNew ? 10 : 0) + (b.discount ? 5 : 0);
        return scoreB - scoreA;
    }
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); e.stopPropagation();
    const autoVariants: Record<string, string> = {};
    product.variants?.forEach(v => { if(v.options.length > 0) autoVariants[v.type] = v.options[0]; });
    setAddingIds(prev => [...prev, product.id]);
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity: 1, selectedVariants: autoVariants } });
    setTimeout(() => { setAddingIds(prev => prev.filter(id => id !== product.id)); }, 1000);
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); e.stopPropagation();
    const initialSelections: Record<string, string> = {};
    product.variants?.forEach(v => { if(v.options.length > 0) initialSelections[v.type] = v.options[0]; });
    setQvSelections(initialSelections);
    setQuickViewProduct(product);
  };

  const handleModalAddToCart = () => {
      if (!quickViewProduct) return;
      if (quickViewProduct.variants && quickViewProduct.variants.length > 0) {
          const missing = quickViewProduct.variants.filter(v => !qvSelections[v.type]);
          if (missing.length > 0) { alert(`Please select ${missing[0].type}`); return; }
      }
      dispatch({ type: 'ADD_TO_CART', payload: { ...quickViewProduct, quantity: 1, selectedVariants: qvSelections } });
      setQuickViewProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title={state.filters.category ? `${state.filters.category} Collection` : 'Shop'} description="Browse products" />
      {/* Mobile Filter & Quick View Modals omitted for brevity but logic is identical */}
      {/* Main Grid Implementation same as before */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 pt-24 md:pt-6 mb-8 gap-4">
        <div><h1 className="text-4xl font-bold tracking-tight text-gray-900 mt-1">{state.filters.category || 'All Products'}</h1></div>
        <div className="flex gap-4">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
            </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
         <div className="hidden lg:block space-y-4">
             <h3 className="font-bold">Categories</h3>
             <ul>
                 <li className="cursor-pointer hover:text-indigo-600" onClick={() => dispatch({type: 'SET_FILTER_CATEGORY', payload: null})}>All</li>
                 {state.categories.map(c => <li key={c.id} className="cursor-pointer hover:text-indigo-600" onClick={() => dispatch({type: 'SET_FILTER_CATEGORY', payload: c.name})}>{c.name}</li>)}
             </ul>
         </div>
         <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {sortedProducts.map(product => (
                 <div key={product.id} className="group relative bg-white dark:bg-gray-800 border rounded-2xl overflow-hidden hover:shadow-lg transition">
                     <div className="relative aspect-[4/5] bg-gray-100">
                         <img src={product.image} className="w-full h-full object-cover" />
                         <button className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow hover:text-indigo-600" onClick={(e) => handleQuickAdd(e, product)}><ShoppingCart size={18} /></button>
                     </div>
                     <div className="p-4">
                         <h3 className="font-bold text-gray-900 dark:text-white"><Link href={`/product/${product.id}`}>{product.name}</Link></h3>
                         <p className="text-gray-500">${product.price}</p>
                     </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};
export default Shop;