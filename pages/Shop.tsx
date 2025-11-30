
import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Filter, ShoppingBag, Star, Heart, X, ShoppingCart, Eye, ArrowUpDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';

const Shop: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const { t } = useLanguage();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('popularity');
  
  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [qvOptions, setQvOptions] = useState<{color: string; size: string}>({ color: '', size: '' });

  // Adding Animation State (Track which IDs are adding)
  const [addingIds, setAddingIds] = useState<string[]>([]);

  // Filter Logic
  const filteredProducts = state.products.filter(p => {
    // 1. Category Filter
    if (state.filters.category && p.category !== state.filters.category) return false;
    
    // 2. SubCategory Filter
    if (state.filters.subCategory && p.subCategory !== state.filters.subCategory) return false;
    
    // 3. Search Filter (Enhanced)
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

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'brand-asc':
        return a.brand.localeCompare(b.brand);
      case 'brand-desc':
        return b.brand.localeCompare(a.brand);
      case 'popularity':
      default:
        // Prioritize "New" items and then discounts for simulated popularity
        const scoreA = (a.isNew ? 10 : 0) + (a.discount ? 5 : 0);
        const scoreB = (b.isNew ? 10 : 0) + (b.discount ? 5 : 0);
        return scoreB - scoreA;
    }
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Auto-select first available options for quick add to prevent errors
    const defaultColor = product.variants?.find(v => v.type === 'color')?.options[0];
    const defaultSize = product.variants?.find(v => v.type === 'size')?.options[0];

    // Trigger Animation
    setAddingIds(prev => [...prev, product.id]);

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity: 1,
        selectedColor: defaultColor,
        selectedSize: defaultSize,
      }
    });

    // Remove ID after timeout
    setTimeout(() => {
        setAddingIds(prev => prev.filter(id => id !== product.id));
    }, 1000);
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Initialize options
    const defaultColor = product.variants?.find(v => v.type === 'color')?.options[0] || '';
    const defaultSize = product.variants?.find(v => v.type === 'size')?.options[0] || '';
    
    setQvOptions({ color: defaultColor, size: defaultSize });
    setQuickViewProduct(product);
  };

  const handleModalAddToCart = () => {
      if (!quickViewProduct) return;
      
      const sizeVariant = quickViewProduct.variants.find(v => v.type === 'size');
      const colorVariant = quickViewProduct.variants.find(v => v.type === 'color');

      if (sizeVariant && !qvOptions.size) {
        alert(t('product.selectSize'));
        return;
      }
      if (colorVariant && !qvOptions.color) {
        alert(t('product.selectColor'));
        return;
      }

      dispatch({
          type: 'ADD_TO_CART',
          payload: {
              ...quickViewProduct,
              quantity: 1,
              selectedColor: qvOptions.color || undefined,
              selectedSize: qvOptions.size || undefined
          }
      });
      setQuickViewProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile Filter Dialog */}
      {mobileFiltersOpen && (
        <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-filters-title">
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity" onClick={() => setMobileFiltersOpen(false)}></div>

          <div className="fixed inset-0 z-40 flex">
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl animate-fade-in-up">
              <div className="flex items-center justify-between px-4">
                <h2 id="mobile-filters-title" className="text-lg font-medium text-gray-900">{t('shop.filters')}</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile Filters Form */}
              <form className="mt-4 border-t border-gray-200">
                  <div className="px-4 py-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">{t('shop.categories')}</h3>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <button 
                          type="button" 
                          onClick={() => {
                              dispatch({type: 'SET_FILTER_CATEGORY', payload: null});
                              setMobileFiltersOpen(false);
                          }}
                          className={`flex items-center w-full px-3 py-2 rounded-lg transition-all ${state.filters.category === null ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                          {t('shop.allProducts')}
                        </button>
                      </li>
                      {state.categories.map((category) => (
                        <li key={category.id}>
                          <button 
                            type="button" 
                            onClick={() => {
                                dispatch({type: 'SET_FILTER_CATEGORY', payload: category.name});
                                setMobileFiltersOpen(false);
                            }}
                            className={`flex items-center w-full px-3 py-2 rounded-lg transition-all ${state.filters.category === category.name ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                          >
                            {category.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {state.filters.category && (
                    <div className="px-4 py-6 border-t border-gray-200">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">{t('shop.subCategories')}</h3>
                      <ul className="space-y-3 text-sm">
                        {state.categories.find(c => c.name === state.filters.category)?.subCategories.map((sub) => (
                            <li key={sub}>
                              <button 
                                  type="button" 
                                  onClick={() => {
                                      dispatch({type: 'SET_FILTER_SUBCATEGORY', payload: sub});
                                      setMobileFiltersOpen(false);
                                  }}
                                  className={`flex items-center w-full px-3 py-2 rounded-lg transition-all ${state.filters.subCategory === sub ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                  {sub}
                                </button>
                            </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="modal-product-title">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setQuickViewProduct(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]">
                <button 
                    onClick={() => setQuickViewProduct(null)}
                    className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white text-gray-500 hover:text-gray-900 z-10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>
                
                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-gray-100 relative">
                    <img 
                        src={quickViewProduct.image} 
                        alt={quickViewProduct.name} 
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <div className="mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{quickViewProduct.brand}</span>
                    </div>
                    <h2 id="modal-product-title" className="text-2xl font-bold text-gray-900 mb-2">{quickViewProduct.name}</h2>
                    <div className="flex items-center gap-2 mb-4" aria-label="Rated 4.8 out of 5 stars">
                        <div className="flex text-yellow-400" aria-hidden="true">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <span className="text-sm text-gray-500">(128 reviews)</span>
                    </div>
                    
                    <div className="mb-6">
                        <span className="text-3xl font-bold text-gray-900">${quickViewProduct.price}</span>
                        {quickViewProduct.discount && (
                            <span className="ml-2 text-sm text-red-500 font-medium line-through">
                                ${(quickViewProduct.price * 1.2).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <p className="text-gray-600 mb-6 line-clamp-3">
                        {quickViewProduct.description}
                    </p>

                    {/* Variants */}
                    <div className="space-y-4 mb-8">
                        {quickViewProduct.variants.find(v => v.type === 'color') && (
                            <div>
                                <span className="block text-sm font-medium text-gray-700 mb-2">{t('product.color')}</span>
                                <div className="flex gap-2" role="radiogroup" aria-label={t('product.color')}>
                                    {quickViewProduct.variants.find(v => v.type === 'color')?.options.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setQvOptions({...qvOptions, color: opt})}
                                            aria-checked={qvOptions.color === opt}
                                            role="radio"
                                            className={`px-3 py-1.5 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${qvOptions.color === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {quickViewProduct.variants.find(v => v.type === 'size') && (
                            <div>
                                <span className="block text-sm font-medium text-gray-700 mb-2">{t('product.size')}</span>
                                <div className="flex gap-2" role="radiogroup" aria-label={t('product.size')}>
                                    {quickViewProduct.variants.find(v => v.type === 'size')?.options.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setQvOptions({...qvOptions, size: opt})}
                                            aria-checked={qvOptions.size === opt}
                                            role="radio"
                                            className={`px-3 py-1.5 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${qvOptions.size === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                        <button 
                            onClick={handleModalAddToCart}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <ShoppingCart size={18} /> {t('product.addToCart')}
                        </button>
                        <Link 
                            to={`/product/${quickViewProduct.id}`} 
                            className="text-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition focus:outline-none focus:underline"
                        >
                            {t('shop.viewDetails')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 pt-24 md:pt-6 mb-8 gap-4">
        <div>
           <span className="text-indigo-600 font-semibold tracking-wider uppercase text-xs">{t('shop.curated')}</span>
           <h1 className="text-4xl font-bold tracking-tight text-gray-900 mt-1">
             {state.filters.category ? state.filters.category : (state.filters.search ? `Search results for "${state.filters.search}"` : t('shop.allProducts'))}
           </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="relative group">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors focus-within:ring-2 focus-within:ring-indigo-500">
                    <ArrowUpDown size={14} className="text-gray-400" aria-hidden="true" />
                    <label htmlFor="sort-select" className="sr-only">{t('shop.sortBy')}</label>
                    <select 
                       id="sort-select"
                       value={sortBy} 
                       onChange={(e) => setSortBy(e.target.value)}
                       className="appearance-none bg-transparent border-none focus:ring-0 p-0 text-gray-700 font-medium cursor-pointer pr-4"
                       style={{ backgroundImage: 'none' }}
                    >
                       <option value="popularity">{t('shop.sortPopularity')}</option>
                       <option value="price-asc">{t('shop.sortPriceLowHigh')}</option>
                       <option value="price-desc">{t('shop.sortPriceHighLow')}</option>
                       <option value="name-asc">{t('shop.sortNameAZ')}</option>
                       <option value="name-desc">{t('shop.sortNameZA')}</option>
                       <option value="brand-asc">{t('shop.sortBrandAZ')}</option>
                       <option value="brand-desc">{t('shop.sortBrandZA')}</option>
                    </select>
                </div>
             </div>
          </div>

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{t('shop.showingResults')} {sortedProducts.length}</span>
            <button 
                type="button" 
                className="p-2 text-gray-600 hover:text-indigo-600 lg:hidden border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setMobileFiltersOpen(true)}
                aria-label={t('shop.filters')}
            >
                <Filter className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <section aria-labelledby="products-heading" className="pb-24">
        <h2 id="products-heading" className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          
          {/* Filters - Desktop */}
          <form className="hidden lg:block space-y-8 pr-4 border-r border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">{t('shop.categories')}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button 
                    type="button" 
                    onClick={() => dispatch({type: 'SET_FILTER_CATEGORY', payload: null})}
                    className={`flex items-center w-full px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${state.filters.category === null ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    {t('shop.allProducts')}
                  </button>
                </li>
                {state.categories.map((category) => (
                  <li key={category.id}>
                    <button 
                      type="button" 
                      onClick={() => dispatch({type: 'SET_FILTER_CATEGORY', payload: category.name})}
                      className={`flex items-center w-full px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${state.filters.category === category.name ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {state.filters.category && (
              <div className="pt-6 border-t border-gray-100">
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">{t('shop.subCategories')}</h3>
                 <ul className="space-y-3 text-sm">
                   {state.categories.find(c => c.name === state.filters.category)?.subCategories.map((sub) => (
                      <li key={sub}>
                         <button 
                            type="button" 
                            onClick={() => dispatch({type: 'SET_FILTER_SUBCATEGORY', payload: sub})}
                            className={`flex items-center w-full px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${state.filters.subCategory === sub ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                          >
                            {sub}
                          </button>
                      </li>
                   ))}
                 </ul>
              </div>
            )}
            
            <div className="pt-6 border-t border-gray-100">
                <div className="bg-indigo-600 rounded-xl p-6 text-white text-center">
                    <h4 className="font-bold text-lg mb-2">{t('shop.saleTitle')}</h4>
                    <p className="text-indigo-100 text-sm mb-4">{t('shop.saleDesc')}</p>
                    <button type="button" className="w-full bg-white text-indigo-600 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">{t('shop.viewOffers')}</button>
                </div>
            </div>
          </form>

          {/* Product Grid */}
          <div className="lg:col-span-3">
             {sortedProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                 <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-bold text-gray-900">{t('shop.noProducts')}</h3>
                 <p className="mt-2 text-gray-500">{t('shop.adjustFilters')}</p>
                 <button onClick={() => {
                     dispatch({type: 'SET_FILTER_CATEGORY', payload: null});
                     dispatch({type: 'SET_SEARCH', payload: ''});
                 }} className="mt-6 text-indigo-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">{t('shop.clearFilters')}</button>
               </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedProducts.map((product) => {
                    const isInWishlist = state.wishlist.includes(product.id);
                    const isAdding = addingIds.includes(product.id);
                    
                    return (
                    <div key={product.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700">
                      
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Link to={`/product/${product.id}`} className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-label={`${t('home.viewProduct')} ${product.name}`}>
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                                loading="lazy"
                            />
                        </Link>
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
                            {product.isNew && (
                                <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur text-gray-900 dark:text-white text-[10px] px-2.5 py-1 uppercase font-bold tracking-widest rounded-lg shadow-sm">
                                {t('home.new')}
                                </span>
                            )}
                            {product.discount && (
                                <span className="bg-red-500/90 backdrop-blur text-white text-[10px] px-2.5 py-1 uppercase font-bold tracking-widest rounded-lg shadow-sm">
                                -{product.discount}%
                                </span>
                            )}
                        </div>

                        {/* Wishlist Button */}
                        <button 
                            className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center backdrop-blur rounded-full transition-all shadow-sm z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 focus:opacity-100 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isInWishlist ? 'bg-white text-red-500' : 'bg-white/90 dark:bg-gray-900/90 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800'}`}
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
                            }}
                            title={t('product.addToWishlist')}
                            aria-label={t('product.addToWishlist')}
                        >
                            <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                        </button>

                        {/* Quick Actions (View + Add) */}
                        <div className="absolute bottom-3 left-3 right-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 z-20 focus-within:translate-y-0">
                           <button 
                               onClick={(e) => handleQuickView(e, product)}
                               className="w-12 h-12 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur text-gray-900 dark:text-white rounded-xl shadow-lg hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                               title={t('product.quickView')}
                               aria-label={t('product.quickView')}
                           >
                               <Eye size={20} />
                           </button>
                           <button 
                               onClick={(e) => handleQuickAdd(e, product)}
                               disabled={isAdding}
                               className={`flex-1 backdrop-blur h-12 rounded-xl shadow-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isAdding ? 'bg-green-600 text-white' : 'bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600'}`}
                               aria-label={`${t('product.addToCart')} - ${product.name}`}
                           >
                               {isAdding ? <Check size={18} /> : <ShoppingCart size={18} />} {isAdding ? t('product.addedToCart') : t('product.addToCart')}
                           </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-grow flex flex-col gap-2">
                        <div className="flex justify-between items-center mb-1">
                             <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                 {product.brand}
                             </div>
                             <div className="flex items-center gap-1" aria-label="Rated 4.8 out of 5 stars">
                                <Star size={12} className="text-amber-400 fill-current" aria-hidden="true" />
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">4.8</span>
                             </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[3rem]">
                            <Link to={`/product/${product.id}`} className="focus:outline-none focus:underline">
                                {product.name}
                            </Link>
                        </h3>
                        
                        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50 dark:border-gray-700">
                          <div className="flex flex-col">
                             {product.discount ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-red-600 dark:text-red-400" aria-label={`Sale price $${product.price}`}>${product.price}</span>
                                    <span className="text-xs text-gray-400 line-through" aria-label={`Original price $${(product.price * 1.1).toFixed(2)}`}>${(product.price * 1.1).toFixed(2)}</span>
                                </div>
                             ) : (
                                <span className="text-lg font-bold text-gray-900 dark:text-white" aria-label={`Price $${product.price}`}>${product.price}</span>
                             )}
                          </div>
                          <span className="text-xs text-gray-400 font-medium">{product.category}</span>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
             )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
