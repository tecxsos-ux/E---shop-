
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { Star, Truck, Shield, RotateCcw, ShoppingCart, Minus, Plus, Check, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Product, Review } from '../types';
import SEO from '../components/SEO';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useContext(StoreContext);
  const { t } = useLanguage();
  const product = state.products.find(p => p.id === id);

  // Dynamic Variants State
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number | string>(1);
  const [isAdding, setIsAdding] = useState(false);
  
  // Carousel Ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const productReviews = state.reviews.filter(r => r.productId === product?.id);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      setSelectedVariants({});
      setQuantity(1);
      setRating(5);
      setComment('');
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="p-10 text-center">
        <SEO title="Product Not Found" />
        {t('product.notFound')} <Link to="/shop" className="text-indigo-600">{t('product.goBack')}</Link>
      </div>
    );
  }

  // Filter Related Products
  const relatedProducts = state.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  const handleVariantSelect = (type: string, value: string) => {
      setSelectedVariants(prev => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    // Validate that all variants have a selection
    if (product.variants && product.variants.length > 0) {
        const missingVariants = product.variants.filter(v => !selectedVariants[v.type]);
        if (missingVariants.length > 0) {
            alert(`Please select ${missingVariants[0].type}`);
            return;
        }
    }
    
    setIsAdding(true);

    const qtyToAdd = typeof quantity === 'number' ? quantity : 1;

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity: qtyToAdd,
        selectedVariants: selectedVariants,
        // Backward compatibility if needed for older logic, though layout now prefers selectedVariants
        selectedColor: selectedVariants['Color'] || selectedVariants['color'],
        selectedSize: selectedVariants['Size'] || selectedVariants['size'],
      }
    });

    setTimeout(() => {
        setIsAdding(false);
    }, 1000);
  };

  const handleQuickAddRelated = (e: React.MouseEvent, item: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Auto-select first available options for quick add
    const autoVariants: Record<string, string> = {};
    item.variants?.forEach(v => {
        if(v.options.length > 0) autoVariants[v.type] = v.options[0];
    });

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...item,
        quantity: 1,
        selectedVariants: autoVariants,
        selectedColor: autoVariants['Color'] || autoVariants['color'],
        selectedSize: autoVariants['Size'] || autoVariants['size'],
      }
    });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
        const val = typeof prev === 'number' ? prev : 1;
        return Math.max(1, val + delta);
    });
  };

  const handleManualQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    if (valStr === '') {
        setQuantity('');
        return;
    }
    const val = parseInt(valStr);
    if (!isNaN(val) && val >= 1) {
      setQuantity(val);
    }
  };

  const handleBlur = () => {
      if (quantity === '' || (typeof quantity === 'number' && quantity < 1)) {
          setQuantity(1);
      }
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (!state.user) return;
      
      const newReview: Review = {
          id: `rev-${Date.now()}`,
          productId: product.id,
          userId: state.user.id,
          userName: state.user.name,
          rating: rating,
          comment: comment,
          date: new Date().toISOString()
      };
      
      dispatch({ type: 'ADD_REVIEW', payload: newReview });
      setComment('');
      setRating(5);
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = direction === 'left' ? -300 : 300;
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayQty = typeof quantity === 'number' ? quantity : 1;
  const totalPrice = (product.price * displayQty).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title={product.name} 
        description={`${product.name} - ${product.description.substring(0, 150)}...`} 
        image={product.image}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative">
            <img src={mainImage || product.image} alt={product.name} className="w-full h-full object-cover object-center" />
            {product.discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold shadow-md">
                    -{product.discount}%
                </span>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[product.image, ...product.images].filter(Boolean).map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${mainImage === img ? 'border-indigo-600 shadow-md scale-95' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="mb-2 flex items-center gap-2">
             <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold uppercase">{product.category}</span>
             {product.isNew && <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full font-bold uppercase">{t('home.newArrivals')}</span>}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
             <Star className="w-4 h-4 fill-current" />
             <Star className="w-4 h-4 fill-current" />
             <Star className="w-4 h-4 fill-current" />
             <Star className="w-4 h-4 fill-current" />
             <Star className="w-4 h-4 fill-current" />
             <span className="text-gray-400 text-sm ml-2">({productReviews.length} {t('product.reviews')})</span>
          </div>
          
          <div className="flex items-end gap-3 mt-4">
             <p className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</p>
             {product.discount && (
                 <p className="text-lg text-gray-400 line-through mb-1">${(product.price * 1.2).toFixed(2)}</p>
             )}
          </div>
          
          <div className="mt-6 prose prose-sm text-gray-500 dark:prose-invert">
            <p>{product.description}</p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Dynamic Variants Rendering */}
            {product.variants?.map((variant, index) => (
                <div key={`${variant.type}-${index}`}>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white capitalize mb-2">
                        {variant.type}: <span className="text-indigo-600 font-normal">{selectedVariants[variant.type]}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {variant.options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleVariantSelect(variant.type, opt)}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                                    selectedVariants[variant.type] === opt 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-500' 
                                    : 'border-gray-200 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{t('product.quantity')}</h3>
              <div className="flex items-center">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition rounded-l-lg"
                    disabled={typeof quantity === 'number' && quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="number"
                    min="1"
                    value={quantity} 
                    onChange={handleManualQuantity}
                    onBlur={handleBlur}
                    className="w-16 text-center border-none p-0 text-gray-900 dark:text-white font-bold focus:ring-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition rounded-r-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-100 dark:shadow-none transition-all duration-300 transform flex items-center justify-center gap-3 ${isAdding ? 'bg-green-600 hover:bg-green-700 scale-95 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1'}`}
            >
              {isAdding ? (
                 <>
                   <Check size={24} className="animate-bounce" /> {t('product.addedToCart')}
                 </>
              ) : (
                 <>
                   <ShoppingCart size={22} /> {t('product.addToCart')} - ${totalPrice}
                 </>
              )}
            </button>
            
            <div className="grid grid-cols-3 gap-4 text-center mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
               <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full text-indigo-600 dark:text-indigo-400"><Truck size={20} /></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('product.fastDelivery')}</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full text-indigo-600 dark:text-indigo-400"><RotateCcw size={20} /></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('product.freeReturns')}</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full text-indigo-600 dark:text-indigo-400"><Shield size={20} /></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('product.warranty')}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-16 mb-20">
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
             <MessageSquare className="text-indigo-600" /> {t('product.reviews')} <span className="text-sm font-normal text-gray-500">({productReviews.length})</span>
         </h2>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             {/* Review Form */}
             <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('product.writeReview')}</h3>
                {state.user ? (
                    <form onSubmit={handleSubmitReview} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('product.rating')}</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`transition-all transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                    >
                                        <Star size={28} fill="currentColor" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('product.comment')}</label>
                            <textarea
                                required
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                placeholder="Share your experience with this product..."
                            />
                        </div>
                        <button 
                            type="submit"
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            {t('product.submitReview')}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">{t('product.loginToReview')}</p>
                        <Link to="/login" className="inline-block bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 px-6 py-2 rounded-lg font-bold hover:bg-indigo-100 transition">{t('nav.signIn')}</Link>
                    </div>
                )}
             </div>

             {/* Review List */}
             <div className="space-y-6">
                 {productReviews.length === 0 ? (
                     <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 italic">{t('product.noReviews')}</p>
                     </div>
                 ) : (
                     productReviews.map(review => (
                         <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex justify-between items-start mb-3">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                                         {review.userName.charAt(0)}
                                     </div>
                                     <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{review.userName}</h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                     </div>
                                 </div>
                                 <div className="flex text-yellow-400 text-sm bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                                     {[...Array(5)].map((_, i) => (
                                         <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300 dark:text-gray-600" : ""} />
                                     ))}
                                 </div>
                             </div>
                             <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pl-[52px]">{review.comment}</p>
                         </div>
                     ))
                 )}
             </div>
         </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-16 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('product.relatedProducts')}</h2>
            
            <div className="relative group/carousel">
                <button 
                    onClick={() => scroll('left')} 
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-110 focus:opacity-100 hidden md:block border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={24} />
                </button>

                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 pb-8 snap-x -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {relatedProducts.map(relProduct => (
                        <Link 
                            key={relProduct.id} 
                            to={`/product/${relProduct.id}`} 
                            className="group block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 transition-all duration-300 hover:-translate-y-1 min-w-[220px] md:min-w-[260px] snap-start"
                        >
                            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img src={relProduct.image} alt={relProduct.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                
                                {relProduct.discount && (
                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 font-bold rounded shadow-sm">
                                    -{relProduct.discount}%
                                    </span>
                                )}

                                <button
                                    onClick={(e) => handleQuickAddRelated(e, relProduct)}
                                    className="absolute bottom-3 right-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white z-10"
                                    title={t('product.addToCart')}
                                >
                                    <ShoppingCart size={18} />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{relProduct.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                {relProduct.discount ? (
                                    <>
                                    <span className="text-gray-900 dark:text-white font-bold">${relProduct.price}</span>
                                    <span className="text-xs text-gray-400 line-through">${(relProduct.price * 1.2).toFixed(2)}</span>
                                    </>
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-300 text-sm font-medium">${relProduct.price}</span>
                                )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <button 
                    onClick={() => scroll('right')} 
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-110 focus:opacity-100 hidden md:block border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
