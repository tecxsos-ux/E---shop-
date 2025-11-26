
import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { state } = useContext(StoreContext);
  const { t } = useLanguage();
  const newArrivals = state.products.filter(p => p.isNew).slice(0, 4);
  const todayOffers = state.products.filter(p => p.discount).slice(0, 4);
  
  // Use slides from global state
  const slides = state.slides;
  const banners = state.banners;

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="flex flex-col gap-12 pb-20 bg-gray-50/50">
      
      {/* Hero Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto lg:h-[550px]">
          
          {/* Main Carousel - Spans 3 columns */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-xl group h-[400px] lg:h-full bg-gray-200">
            {slides.length > 0 ? (
              <>
                {slides.map((slide, index) => (
                  <div 
                    key={slide.id} 
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className={`w-full h-full object-cover transition-transform duration-[6000ms] ${index === currentSlide ? 'scale-110' : 'scale-100'}`} 
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-black/40 to-transparent`}></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-white max-w-2xl">
                       <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold tracking-wider uppercase text-xs mb-4 animate-fade-in-up">
                          {t('home.featured')}
                       </span>
                       <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg animate-fade-in-up delay-100">
                         {slide.title}
                       </h1>
                       <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed animate-fade-in-up delay-200">
                         {slide.subtitle}
                       </p>
                       <Link 
                         to={slide.link} 
                         className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold transition-all hover:bg-indigo-50 hover:shadow-lg hover:scale-105 flex items-center gap-2 animate-fade-in-up delay-300"
                       >
                         {t('home.shopNow')} <ArrowRight className="w-5 h-5" />
                       </Link>
                    </div>
                  </div>
                ))}

                {/* Carousel Controls */}
                <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                  <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
                
                {/* Dots */}
                <div className="absolute bottom-6 left-8 z-20 flex gap-2">
                  {slides.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                    />
                  ))}
                </div>
              </>
            ) : (
               <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No slides available. Please configure in Admin Panel.</p>
               </div>
            )}
          </div>

          {/* Right Side Banners - Spans 1 column */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-auto lg:h-[550px]">
             
             {banners.map(banner => (
                <Link key={banner.id} to={banner.link} className="flex-1 relative rounded-2xl overflow-hidden shadow-lg group h-[260px] lg:h-auto">
                    <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">{banner.subtitle}</span>
                      <h3 className="text-2xl font-bold text-white mb-2">{banner.title}</h3>
                      <span className="text-sm font-medium text-white group-hover:underline flex items-center gap-1">
                          {banner.buttonText} <ArrowRight size={14} />
                      </span>
                    </div>
                </Link>
             ))}

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Truck size={24} /></div>
             <div><h3 className="font-bold text-gray-900">{t('home.freeShipping')}</h3><p className="text-xs text-gray-500 mt-1">{t('home.freeShippingDesc')}</p></div>
           </div>
           <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck size={24} /></div>
             <div><h3 className="font-bold text-gray-900">{t('home.securePayment')}</h3><p className="text-xs text-gray-500 mt-1">{t('home.securePaymentDesc')}</p></div>
           </div>
           <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><ShoppingBag size={24} /></div>
             <div><h3 className="font-bold text-gray-900">{t('home.returns')}</h3><p className="text-xs text-gray-500 mt-1">{t('home.returnsDesc')}</p></div>
           </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
         <div className="flex justify-between items-end mb-8">
            <div>
               <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs">{t('home.collections')}</span>
               <h2 className="text-3xl font-bold text-gray-900 mt-1">{t('home.shopByCategory')}</h2>
            </div>
            <Link to="/shop" className="group flex items-center text-gray-900 font-semibold hover:text-indigo-600 transition">
              {t('home.viewAll')} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {state.categories.map((cat, idx) => (
              <div key={cat.id} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
                 <img src={cat.image || `https://picsum.photos/600/800?random=${10+idx}`} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-bold text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h3>
                    <div className="h-0 group-hover:h-6 overflow-hidden transition-all duration-300">
                       <span className="text-gray-300 text-sm flex items-center gap-2 mt-2">{t('home.browseCollection')} <ArrowRight size={14} /></span>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-8 bg-indigo-600"></span>
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs">{t('home.recentlyAdded')}</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('home.newArrivals')}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map((product) => (
             <Link key={product.id} to={`/product/${product.id}`} className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden">
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-[10px] px-3 py-1.5 uppercase font-bold tracking-widest rounded-full shadow-sm z-10">
                      {t('home.new')}
                    </span>
                  )}

                  {/* Quick Action Button */}
                  <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     <button className="w-full bg-white text-gray-900 py-3 rounded-xl shadow-lg font-bold text-sm hover:bg-gray-50 flex justify-center items-center gap-2">
                        {t('home.viewProduct')} <ArrowRight size={16}/>
                     </button>
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{product.brand}</p>
                      <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-400 font-bold">4.8</span>
                      </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {product.name}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">{t('product.price')}</span>
                        <p className="text-xl font-bold text-gray-900">${product.price}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                        <ShoppingBag size={18} />
                    </div>
                  </div>
                </div>
             </Link>
          ))}
        </div>
      </section>

      {/* Today's Offer */}
      {todayOffers.length > 0 && (
        <section className="bg-gradient-to-br from-indigo-900 to-slate-900 py-20 text-white relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-end mb-10">
                <div>
                   <span className="text-indigo-300 font-bold tracking-wider uppercase text-xs">{t('home.limitedTime')}</span>
                   <h2 className="text-3xl font-bold text-white mt-2">{t('home.todaysDeals')}</h2>
                </div>
                <div className="hidden md:block">
                    <span className="text-sm text-gray-400">{t('home.offersEnd')} <span className="text-white font-mono font-bold">12:34:56</span></span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {todayOffers.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
                      
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 font-bold rounded shadow-md z-10 animate-pulse">
                         -{product.discount}% OFF
                      </div>
                      
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                    
                    <div className="p-5">
                       <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                       <div className="mt-3 flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-xs text-gray-500 line-through">${(product.price * 1.1).toFixed(2)}</span>
                             <span className="text-xl font-bold text-red-600">${product.price}</span>
                          </div>
                          <button className="text-xs font-bold uppercase tracking-wider text-indigo-600 border border-indigo-200 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                             {t('home.grabDeal')}
                          </button>
                       </div>
                    </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
