import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, Search, LayoutDashboard } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useContext(StoreContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const cartTotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-tighter text-gray-900">
                Luxe<span className="text-indigo-600">Market</span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={`${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600 font-medium transition`}>Home</Link>
              <Link to="/shop" className={`${location.pathname === '/shop' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600 font-medium transition`}>Shop</Link>
              <Link to="/contact" className={`${location.pathname === '/contact' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600 font-medium transition`}>Contact</Link>
              {state.user?.role === 'admin' && (
                 <Link to="/admin/dashboard" className="text-amber-600 hover:text-amber-700 font-medium transition flex items-center gap-1">
                   <LayoutDashboard size={16} /> Admin
                 </Link>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <div className="relative group hidden sm:block">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all text-gray-700 bg-gray-50 placeholder-gray-400"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
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
             <Link to="/" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
             <Link to="/shop" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
             <Link to="/contact" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
             <Link to="/profile" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
             {state.user?.role === 'admin' && (
               <Link to="/admin/dashboard" className="block text-amber-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
             )}
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
                  <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                  <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-8">
                  {state.cart.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
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
                                  {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
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
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    Checkout
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
              <h3 className="text-2xl font-bold mb-4">Luxe<span className="text-indigo-500">Market</span></h3>
              <p className="text-gray-400 max-w-sm">
                Elevating your shopping experience with curated luxury items and seamless technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/shop" className="hover:text-white transition">New Arrivals</Link></li>
                <li><Link to="/shop" className="hover:text-white transition">Best Sellers</Link></li>
                <li><Link to="/shop" className="hover:text-white transition">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/profile" className="hover:text-white transition">My Account</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            &copy; 2024 LuxeMarket AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;