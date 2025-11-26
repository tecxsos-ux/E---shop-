import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { state } = useContext(StoreContext);
  const newArrivals = state.products.filter(p => p.isNew).slice(0, 4);
  const todayOffers = state.products.filter(p => p.discount).slice(0, 4);

  return (
    <div className="flex flex-col gap-16 pb-20 bg-gray-50/50">
      {/* Hero Slider / Banner */}
      <section className="relative bg-gray-900 text-white h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/1920/1080?grayscale" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-600/30 border border-indigo-500 text-indigo-300 font-semibold tracking-wider uppercase text-xs mb-4 backdrop-blur-sm">Summer Collection 2024</span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">Redefine Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Style Statement</span></h1>
            <p className="mt-6 text-xl text-gray-300 max-w-lg leading-relaxed">Discover the latest trends in luxury fashion and technology. Exclusive items, curated just for you.</p>
            <div className="mt-10 flex gap-4">
              <Link to="/shop" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 flex items-center gap-2">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/shop" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-md border border-white/10">
                View Lookbook
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="flex items-center gap-4 p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 hover:-translate-y-1 transition-transform duration-300">
             <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner"><Truck size={28} /></div>
             <div><h3 className="font-bold text-gray-900 text-lg">Free Shipping</h3><p className="text-sm text-gray-500 mt-1">On all orders over $200</p></div>
           </div>
           <div className="flex items-center gap-4 p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 hover:-translate-y-1 transition-transform duration-300">
             <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner"><ShieldCheck size={28} /></div>
             <div><h3 className="font-bold text-gray-900 text-lg">Secure Payment</h3><p className="text-sm text-gray-500 mt-1">100% secure payment</p></div>
           </div>
           <div className="flex items-center gap-4 p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 hover:-translate-y-1 transition-transform duration-300">
             <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-inner"><ShoppingBag size={28} /></div>
             <div><h3 className="font-bold text-gray-900 text-lg">30 Day Returns</h3><p className="text-sm text-gray-500 mt-1">Hassle free returns</p></div>
           </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
         <div className="flex justify-between items-end mb-8">
            <div>
               <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs">Collections</span>
               <h2 className="text-3xl font-bold text-gray-900 mt-1">Shop by Category</h2>
            </div>
            <Link to="/shop" className="group flex items-center text-gray-900 font-semibold hover:text-indigo-600 transition">
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {state.categories.map((cat, idx) => (
              <div key={cat.id} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
                 <img src={`https://picsum.photos/600/800?random=${10+idx}`} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-bold text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h3>
                    <div className="h-0 group-hover:h-6 overflow-hidden transition-all duration-300">
                       <span className="text-gray-300 text-sm flex items-center gap-2 mt-2">Browse Collection <ArrowRight size={14} /></span>
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
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs">Recently Added</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">New Arrivals</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map((product) => (
             <Link key={product.id} to={`/product/${product.id}`} className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden">
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-[10px] px-3 py-1.5 uppercase font-bold tracking-widest rounded-full shadow-sm z-10">
                      New
                    </span>
                  )}

                  {/* Quick Action Button */}
                  <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     <button className="w-full bg-white text-gray-900 py-3 rounded-xl shadow-lg font-bold text-sm hover:bg-gray-50 flex justify-center items-center gap-2">
                        View Product <ArrowRight size={16}/>
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
                        <span className="text-xs text-gray-400">Price</span>
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
                   <span className="text-indigo-300 font-bold tracking-wider uppercase text-xs">Limited Time</span>
                   <h2 className="text-3xl font-bold text-white mt-2">Today's Deals</h2>
                </div>
                <div className="hidden md:block">
                    <span className="text-sm text-gray-400">Offers end in: <span className="text-white font-mono font-bold">12:34:56</span></span>
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
                             Grab Deal
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