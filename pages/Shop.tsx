
import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Filter, ShoppingBag, Star, Heart, X, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';

const Shop: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const { t } = useLanguage();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter Logic
  const filteredProducts = state.products.filter(p => {
    if (state.filters.category && p.category !== state.filters.category) return false;
    if (state.filters.subCategory && p.subCategory !== state.filters.subCategory) return false;
    if (state.filters.search && !p.name.toLowerCase().includes(state.filters.search.toLowerCase())) return false;
    return true;
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Auto-select first available options for quick add to prevent errors
    const defaultColor = product.variants?.find(v => v.type === 'color')?.options[0];
    const defaultSize = product.variants?.find(v => v.type === 'size')?.options[0];

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity: 1,
        selectedColor: defaultColor,
        selectedSize: defaultSize,
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile Filter Dialog */}
      {mobileFiltersOpen && (
        <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity" onClick={() => setMobileFiltersOpen(false)}></div>

          <div className="fixed inset-0 z-40 flex">
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl animate-fade-in-up">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">{t('shop.filters')}</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
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

      <div className="flex items-end justify-between border-b border-gray-200 pb-6 pt-24 md:pt-6 mb-8">
        <div>
           <span className="text-indigo-600 font-semibold tracking-wider uppercase text-xs">{t('shop.curated')}</span>
           <h1 className="text-4xl font-bold tracking-tight text-gray-900 mt-1">
             {state.filters.category ? state.filters.category : t('shop.allProducts')}
           </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">{t('shop.showingResults')} {filteredProducts.length}</span>
          <button 
            type="button" 
            className="p-2 text-gray-600 hover:text-indigo-600 lg:hidden border rounded-lg"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <span className="sr-only">{t('shop.filters')}</span>
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <section aria-labelledby="products-heading" className="pb-24">
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
                    className={`flex items-center w-full px-3 py-2 rounded-lg transition-all ${state.filters.category === null ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    {t('shop.allProducts')}
                  </button>
                </li>
                {state.categories.map((category) => (
                  <li key={category.id}>
                    <button 
                      type="button" 
                      onClick={() => dispatch({type: 'SET_FILTER_CATEGORY', payload: category.name})}
                      className={`flex items-center w-full px-3 py-2 rounded-lg transition-all ${state.filters.category === category.name ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
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
                            className={`flex items-center w-full px-3 py-2 rounded-lg transition-all ${state.filters.subCategory === sub ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
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
                    <button type="button" className="w-full bg-white text-indigo-600 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition">{t('shop.viewOffers')}</button>
                </div>
            </div>
          </form>

          {/* Product Grid */}
          <div className="lg:col-span-3">
             {filteredProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                 <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-bold text-gray-900">{t('shop.noProducts')}</h3>
                 <p className="mt-2 text-gray-500">{t('shop.adjustFilters')}</p>
                 <button onClick={() => dispatch({type: 'SET_FILTER_CATEGORY', payload: null})} className="mt-6 text-indigo-600 font-medium hover:underline">{t('shop.clearFilters')}</button>
               </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100">
                      
                      {/* Image Container */}
                      <div className="relative h-72 overflow-hidden bg-gray-100">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                        
                        {/* Favorite Button */}
                        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                            <Heart size={18} />
                        </button>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isNew && (
                                <span className="bg-gray-900 text-white text-[10px] px-2 py-1 uppercase font-bold tracking-widest rounded shadow-sm">
                                {t('home.new')}
                                </span>
                            )}
                            {product.discount && (
                                <span className="bg-red-500 text-white text-[10px] px-2 py-1 uppercase font-bold tracking-widest rounded shadow-sm">
                                -{product.discount}%
                                </span>
                            )}
                        </div>

                        {/* Quick Add To Cart Button */}
                        <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                           <button 
                               onClick={(e) => handleQuickAdd(e, product)}
                               className="w-full bg-white/95 backdrop-blur text-gray-900 py-3 rounded-xl shadow-lg font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                           >
                               <ShoppingCart size={16} /> {t('product.addToCart')}
                           </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{product.brand}</p>
                             <div className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-500 font-bold">4.8</span>
                             </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        
                        <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-50">
                          <div>
                             {product.discount ? (
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 line-through">${(product.price * 1.1).toFixed(2)}</span>
                                    <span className="text-xl font-bold text-red-600">${product.price}</span>
                                </div>
                             ) : (
                                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                             )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
             )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
