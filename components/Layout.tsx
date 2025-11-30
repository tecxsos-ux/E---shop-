
import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, Search, LayoutDashboard, Globe, Moon, Sun, Download, LogIn } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Language } from '../context/translations';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useContext(StoreContext);
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [cartBump, setCartBump] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const cartTotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = state.cart.reduce((a, b) => a + b.quantity, 0);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  const currentLang = languages.find(l => l.code === language);
  const { settings } = state;

  // Determine effective brand text color for dark mode
  const isDefaultBrandColor = !settings.brandTextColor || settings.brandTextColor === '#111827';
  const effectiveBrandColor = (theme === 'dark' && isDefaultBrandColor) ? '#ffffff' : (settings.brandTextColor || '#111827');

  // Header Color Styles
  const headerStyle = {
    backgroundColor: settings.headerBackgroundColor || (theme === 'dark' ? '#1f2937' : '#ffffff'),
    color: settings.headerTextColor || (theme === 'dark' ? '#e5e7eb' : '#4b5563')
  };

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Trigger Cart Bump Animation when items change
  useEffect(() => {
     if (totalItems === 0) return;
     setCartBump(true);
     const timer = setTimeout(() => setCartBump(false), 300);
     return () => clearTimeout(timer);
  }, [totalItems]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const handleSearchSubmit = () => {
    // When submitting search, clear category filters to make it a global search
    dispatch({ type: 'SET_FILTER_CATEGORY', payload: null });
    dispatch({ type: 'SET_FILTER_SUBCATEGORY', payload: null });
    navigate('/shop');
  };

  const clearSearch = () => {
    dispatch({ type: 'SET_SEARCH', payload: '' });
  };

  const handleLogout = () => {
      dispatch({ type: 'SET_USER', payload: null });
      navigate('/login');
      setIsUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-gray-900">
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
          
          /* Dark Mode Overrides for generated styles & general text visibility */
          .dark .bg-indigo-50 { background-color: ${settings.primaryColor}30 !important; }
          .dark .text-indigo-700 { color: ${settings.primaryColor} !important; filter: brightness(1.5); }
          
          /* Backgrounds */
          .dark .bg-white { background-color: #1f2937 !important; color: #f3f4f6; }
          .dark .bg-gray-50 { background-color: #111827 !important; }
          .dark .bg-gray-100 { background-color: #374151 !important; }
          .dark .bg-gray-200 { background-color: #4b5563 !important; }
          
          /* Text Colors Inversion */
          .dark .text-gray-900 { color: #f9fafb !important; }
          .dark .text-gray-800 { color: #f3f4f6 !important; }
          .dark .text-gray-700 { color: #e5e7eb !important; }
          .dark .text-gray-600 { color: #d1d5db !important; }
          .dark .text-gray-500 { color: #9ca3af !important; }
          
          /* Borders */
          .dark .border-gray-100 { border-color: #374151 !important; }
          .dark .border-gray-200 { border-color: #4b5563 !important; }
          .dark .border-gray-300 { border-color: #6b7280 !important; }

          /* Form Elements */
          .dark input, .dark select, .dark textarea { 
             background-color: #374151 !important; 
             border-color: #4b5563 !important; 
             color: white !important; 
          }
          .dark input::placeholder, .dark textarea::placeholder {
             color: #9ca3af !important;
          }
          
          /* Secondary Color Mappings */
          .text-amber-600 { color: ${settings.secondaryColor || '#d97706'} !important; }
          .hover\\:text-amber-700:hover { color: ${settings.secondaryColor || '#d97706'} !important; filter: brightness(0.85); }
          .bg-secondary { background-color: ${settings.secondaryColor || '#d97706'} !important; }
          .text-secondary { color: ${settings.secondaryColor || '#d97706'} !important; }
          .border-secondary { border-color: ${settings.secondaryColor || '#d97706'} !important; }
        `}
      </style>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300" style={headerStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter" style={{ color: effectiveBrandColor }}>
                {settings.brandLogo ? (
                   <img src={settings.brandLogo} alt={settings.brandName} className="h-8 w-auto object-contain" />
                ) : (
                   settings.brandName === 'LuxeMarket' ? (
                     <>Luxe<span className="text-indigo-600">Market</span></>
                   ) : (
                     <span>{settings.brandName}</span>
                   )
                )}
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={`font-medium transition hover:text-indigo-600 ${location.pathname === '/' ? 'text-indigo-600' : ''}`} style={location.pathname !== '/' ? { color: headerStyle.color } : {}}>{t('nav.home')}</Link>
              <Link to="/shop" className={`font-medium transition hover:text-indigo-600 ${location.pathname === '/shop' ? 'text-indigo-600' : ''}`} style={location.pathname !== '/shop' ? { color: headerStyle.color } : {}}>{t('nav.shop')}</Link>
              <Link to="/contact" className={`font-medium transition hover:text-indigo-600 ${location.pathname === '/contact' ? 'text-indigo-600' : ''}`} style={location.pathname !== '/contact' ? { color: headerStyle.color } : {}}>{t('nav.contact')}</Link>
              {state.user?.role === 'admin' && (
                 <Link to="/admin/dashboard" className="text-amber-600 hover:text-amber-700 font-medium transition flex items-center gap-1">
                   <LayoutDashboard size={16} /> {t('nav.admin')}
                 </Link>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <div className="relative group hidden sm:block">
                <input 
                  type="text" 
                  placeholder={t('nav.search')} 
                  value={state.filters.search}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                {state.filters.search && (
                   <button 
                     onClick={clearSearch}
                     className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                   >
                     <X size={14} />
                   </button>
                )}
              </div>

              {/* Install PWA Button */}
              {showInstallBtn && (
                <button 
                  onClick={handleInstallClick}
                  className="hidden md:flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-indigo-100 transition"
                  title="Install App"
                >
                  <Download size={14} /> Install
                </button>
              )}

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600"
                style={{ color: headerStyle.color }}
                title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                    className="flex items-center gap-1 transition p-2 hover:text-indigo-600"
                    style={{ color: headerStyle.color }}
                    title={t('nav.selectLanguage')}
                >
                    <span className="text-lg">{currentLang?.flag}</span>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 border border-gray-100 dark:border-gray-700 z-50 animate-fade-in-up">
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsLangMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 ${language === lang.code ? 'text-indigo-600 font-bold' : 'text-gray-700 dark:text-gray-200'}`}
                            >
                                <span>{lang.flag}</span> {lang.label}
                            </button>
                        ))}
                    </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className={`p-2 transition-transform duration-300 relative hover:text-indigo-600 ${cartBump ? 'scale-125 text-indigo-600' : ''}`} 
                  style={{ color: cartBump ? settings.primaryColor : headerStyle.color }}
                >
                  <ShoppingBag className="w-6 h-6" />
                  {state.cart.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-indigo-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              {/* User Menu */}
              {state.user ? (
                 <div className="relative">
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer overflow-hidden border border-transparent hover:border-indigo-200" 
                    >
                         {state.user.avatar ? (
                             <img src={state.user.avatar} alt={state.user.name} className="w-full h-full object-cover" />
                         ) : (
                             <UserIcon className="w-5 h-5" />
                         )}
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 border border-gray-100 dark:border-gray-700 z-50 animate-fade-in-up">
                            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{state.user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{state.user.email}</p>
                            </div>
                            <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setIsUserMenuOpen(false)}>
                                {t('nav.myAccount')}
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                {t('nav.signOut')}
                            </button>
                        </div>
                    )}
                 </div>
              ) : (
                  <Link to="/login" className="hidden sm:flex items-center gap-1 font-medium transition hover:text-indigo-600" style={{ color: headerStyle.color }}>
                      <LogIn size={20} />
                      <span className="hidden lg:inline">{t('nav.signIn')}</span>
                  </Link>
              )}

              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2" style={{ color: headerStyle.color }}>
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-4 px-4 space-y-3">
             <Link to="/" className="block text-gray-800 dark:text-gray-200 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
             <Link to="/shop" className="block text-gray-800 dark:text-gray-200 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.shop')}</Link>
             <Link to="/contact" className="block text-gray-800 dark:text-gray-200 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</Link>
             
             {state.user ? (
                 <>
                    <Link to="/profile" className="block text-gray-800 dark:text-gray-200 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.myAccount')}</Link>
                    {state.user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="block text-amber-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left text-red-600 font-medium">{t('nav.signOut')}</button>
                 </>
             ) : (
                 <Link to="/login" className="block text-indigo-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.signIn')}</Link>
             )}
             
             {showInstallBtn && (
                <button 
                  onClick={handleInstallClick}
                  className="w-full text-left text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-2 py-2"
                >
                   <Download size={16} /> Install App
                </button>
             )}

             <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
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

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 z-[60] overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md bg-white dark:bg-gray-800 shadow-xl flex flex-col">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('nav.cart')}</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-500">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mt-8">
                    {state.cart.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 mt-10">{t('nav.emptyCart')}</p>
                    ) : (
                      <div className="flow-root">
                        <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                          {state.cart.map((item) => (
                            <li key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="py-6 flex">
                              <div className="flex-shrink-0 w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                              </div>
                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">${item.price}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex gap-2">
                                    {item.selectedColor && <span>{t('product.color')}: {item.selectedColor}</span>}
                                    {item.selectedSize && <span>{t('product.size')}: {item.selectedSize}</span>}
                                  </div>
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => dispatch({type: 'DECREASE_QTY', payload: item})} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold px-2">-</button>
                                    <p className="text-gray-500 dark:text-gray-400">Qty {item.quantity}</p>
                                    <button onClick={() => dispatch({type: 'ADD_TO_CART', payload: {...item, quantity: 1}})} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold px-2">+</button>
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

                <div className="border-t border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                    <p>{t('nav.subtotal')}</p>
                    <p>${cartTotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{t('nav.shippingCalc')}</p>
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
        <main className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {children}
        </main>

        {/* Footer */}
        <footer className="pt-12 pb-8 transition-colors duration-300" style={{ backgroundColor: settings.footerBackgroundColor || '#111827', color: settings.footerTextColor || '#ffffff' }}>
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
                          <span style={{ color: settings.footerTextColor || '#ffffff' }}>{settings.brandName}</span>
                       )
                    )}
                </h3>
                <p className="opacity-70 max-w-sm">
                  {t('nav.footerDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">{t('nav.shopSection')}</h4>
                <ul className="space-y-2 opacity-70">
                  <li><Link to="/shop" className="hover:opacity-100 transition">{t('home.newArrivals')}</Link></li>
                  <li><Link to="/shop" className="hover:opacity-100 transition">{t('home.bestSellers')}</Link></li>
                  <li><Link to="/shop" className="hover:opacity-100 transition">{t('home.collections')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">{t('nav.supportSection')}</h4>
                <ul className="space-y-2 opacity-70">
                  <li><Link to="/profile" className="hover:opacity-100 transition">{t('nav.myAccount')}</Link></li>
                  <li><Link to="/contact" className="hover:opacity-100 transition">{t('nav.contact')}</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center opacity-50 text-sm">
              <p>&copy; {new Date().getFullYear()} {settings.brandName}. {t('nav.rights')}</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Globe size={16} />
                <span>{currentLang?.label}</span>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default Layout;
