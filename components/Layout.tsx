
import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, Search, LayoutDashboard, Globe } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../context/translations';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useContext(StoreContext);
  const { t, language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const cartTotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  const currentLang = languages.find(l => l.code === language);
  const { settings } = state;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic Theme Styles */}
      <style>
        {`
          .text-indigo-600 { color: ${settings.primaryColor} !important; }
          .bg-indigo-600 { background-color: ${settings.primaryColor} !important; }
          .bg-indigo-700 { background-color: ${settings.primaryColor} !important; filter: brightness(0.9); }
          .hover\\:bg-indigo-700:hover { background-color: ${settings.primaryColor} !important; filter: brightness(0.85); }
          .hover\\:text-indigo-600:hover { color: ${settings.primaryColor} !important; }
          .border-indigo-600 { border-color: ${settings.primaryColor} !important; }
          .ring-indigo-500 { --tw-ring-color: ${settings.primaryColor} !important; }
          .hover\\:bg-indigo-50:hover { background-color: ${settings.primaryColor}10 !important; }
          .bg-indigo-50 { background-color: ${settings.primaryColor}10 !important; }
          .text-indigo-700 { color: ${settings.primaryColor} !important; filter: brightness(0.7); }
        `}
      </style>

      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter" style={{ color: settings.brandTextColor || '#111827' }}>
                {settings.brandLogo ? (
                   <img src={settings.brandLogo} alt={settings.brandName} className="h-8 w-auto object-contain" />
                ) : (
                   settings.brandName === 'LuxeMarket' ? (
                     <>Luxe<span className="text-indigo-600">Market</span></>
                   ) : (
                     settings.brandName
                   )
                )}
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={`${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600 font-medium transition`}>{t('nav.home')}</Link>
              <Link to="/shop" className={`${location.pathname === '/shop' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600 font-medium transition`}>{t('nav.shop')}</Link>
              <Link to="/contact" className={`${location.pathname === '/contact' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600 font-medium transition`}>{t('nav.contact')}</Link>
              {state.user?.role === 'admin' && (
                 <Link to="/admin/dashboard" className="text-amber-600 hover:text-amber-700 font-medium transition flex items-center gap-1">
                   <LayoutDashboard size={16} /> {t('nav.admin')}
                 </Link>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <div className="relative group hidden sm:block">
                <input 
                  type="text" 
                  placeholder={t('nav.search')} 
                  value={state.filters.search}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate('/shop');
                    }
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all text-gray-700 bg-gray-50 placeholder-gray-400"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                    className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition p-2"
                >
                    <span className="text-lg">{currentLang?.flag}</span>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50 animate-fade-in-up">
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsLangMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${language === lang.code ? 'text-indigo-600 font-bold' : 'text-gray-700'}`}
                            >
                                <span>{lang.flag}</span> {lang.label}
                            </button>
                        ))}
                    </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => setIsCartOpen(true)} className="p-2 text-gray-600 hover:text-indigo-600 transition relative">
                  <ShoppingBag className="w-6 h-6" />
                  {state.cart.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-indigo-600 rounded-full">
                      {state.cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>

              <div className="relative group">
                <Link to="/profile">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer">
                    <UserIcon className="w-5 h-5" />
                  </div>
                </Link>
              </div>

              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
             <Link to="/" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
             <Link to="/shop" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.shop')}</Link>
             <Link to="/contact" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</Link>
             <Link to="/profile" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.myAccount')}</Link>
             {state.user?.role === 'admin' && (
               <Link to="/admin/dashboard" className="block text-amber-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
             )}
             <div className="pt-2 border-t border-gray-100">
                 <p className="text-xs text-gray-500 mb-2 uppercase">Language</p>
                 <div className="flex gap-4">
                     {languages.map(lang => (
                         <button 
                            key={lang.code} 
                            onClick={() => setLanguage(lang.code)}
                            className={`text-2xl ${language === lang.code ? 'opacity-100 ring-2 ring-indigo-500 rounded-full' : 'opacity-50'}`}
                         >
                             {lang.flag}
                         </button>
                     ))}
                 </div>
             </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">{t('nav.cart')}</h2>
                  <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-8">
                  {state.cart.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">{t('nav.emptyCart')}</p>
                  ) : (
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-200">
                        {state.cart.map((item) => (
                          <li key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                            </div>
                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">${item.price}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                                <div className="mt-1 text-sm text-gray-500 flex gap-2">
                                  {item.selectedColor && <span>{t('product.color')}: {item.selectedColor}</span>}
                                  {item.selectedSize && <span>{t('product.size')}: {item.selectedSize}</span>}
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => dispatch({type: 'DECREASE_QTY', payload: item})} className="text-gray-500 hover:text-gray-700 font-bold px-2">-</button>
                                  <p className="text-gray-500">Qty {item.quantity}</p>
                                  <button onClick={() => dispatch({type: 'ADD_TO_CART', payload: {...item, quantity: 1}})} className="text-gray-500 hover:text-gray-700 font-bold px-2">+</button>
                                </div>
                                <button type="button" onClick={() => dispatch({type: 'REMOVE_FROM_CART', payload: item})} className="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>{t('nav.subtotal')}</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{t('nav.shippingCalc')}</p>
                <div className="mt-6">
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    {t('nav.checkout')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  {settings.brandLogo ? (
                     <img src={settings.brandLogo} alt={settings.brandName} className="h-8 w-auto grayscale brightness-200" />
                  ) : (
                     settings.brandName === 'LuxeMarket' ? (
                        <>Luxe<span className="text-indigo-600">Market</span></>
                     ) : (
                        settings.brandName
                     )
                  )}
              </h3>
              <p className="text-gray-400 max-w-sm">
                {t('nav.footerDesc')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('nav.shopSection')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/shop" className="hover:text-white transition">{t('home.newArrivals')}</Link></li>
                <li><Link to="/shop" className="hover:text-white transition">{t('home.bestSellers')}</Link></li>
                <li><Link to="/shop" className="hover:text-white transition">{t('home.collections')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('nav.supportSection')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/profile" className="hover:text-white transition">{t('nav.myAccount')}</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">{t('nav.contact')}</Link></li>
                <li><a href="#" className="hover:text-white transition">{t('home.freeShipping')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('home.returns')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            &copy; 2024 {settings.brandName}. {t('nav.rights')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
