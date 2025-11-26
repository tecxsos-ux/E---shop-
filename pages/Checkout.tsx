import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { OrderStatus } from '../types';
import { CreditCard, CheckCircle, Loader } from 'lucide-react';

const Checkout: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const total = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [form, setForm] = useState({
    line1: '',
    city: '',
    postalCode: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Stripe Processing
    setTimeout(() => {
       setLoading(false);
       setSuccess(true);
       
       const newOrder = {
         id: `ORD-${Math.floor(Math.random() * 10000)}`,
         userId: state.user?.id || 'guest',
         items: [...state.cart],
         total: total,
         status: OrderStatus.Processing,
         date: new Date().toISOString(),
         shippingAddress: {
           line1: form.line1,
           city: form.city,
           postalCode: form.postalCode,
           country: form.country
         }
       };

       dispatch({ type: 'ADD_ORDER', payload: newOrder });
       dispatch({ type: 'CLEAR_CART' });

       setTimeout(() => {
          navigate('/profile');
       }, 2000);
    }, 2000);
  };

  if (state.cart.length === 0 && !success) {
      return (
          <div className="max-w-7xl mx-auto px-4 py-24 text-center">
              <h2 className="text-2xl font-bold">Your cart is empty</h2>
              <button onClick={() => navigate('/shop')} className="mt-4 text-indigo-600 hover:underline">Go Shopping</button>
          </div>
      )
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
        <div className="bg-green-50 p-6 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Payment Successful!</h2>
        <p className="text-gray-500 mt-2">Redirecting to your order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Checkout Form */}
        <form onSubmit={handlePayment} className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                 <input 
                   required 
                   name="line1" 
                   placeholder="Address Line 1" 
                   onChange={handleInputChange} 
                   className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400" 
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                      required 
                      name="city" 
                      placeholder="City" 
                      onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400" 
                    />
                    <input 
                      required 
                      name="postalCode" 
                      placeholder="Postal Code" 
                      onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400" 
                    />
                 </div>
                 <select 
                   name="country" 
                   onChange={handleInputChange} 
                   className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                 >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                 </select>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Payment Details (Stripe Mock)
              </h2>
              <div className="space-y-4">
                 <input 
                   required 
                   name="cardName" 
                   placeholder="Name on Card" 
                   onChange={handleInputChange} 
                   className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400" 
                 />
                 <input 
                   required 
                   name="cardNumber" 
                   placeholder="Card Number" 
                   maxLength={16} 
                   onChange={handleInputChange} 
                   className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400" 
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                      required 
                      name="expiry" 
                      placeholder="MM/YY" 
                      maxLength={5} 
                      onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400" 
                    />
                    <input 
                      required 
                      name="cvc" 
                      placeholder="CVC" 
                      maxLength={3} 
                      onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400" 
                    />
                 </div>
              </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition flex justify-center items-center gap-2 disabled:opacity-70"
           >
             {loading ? <><Loader className="animate-spin" /> Processing...</> : `Pay $${total.toFixed(2)}`}
           </button>
        </form>

        {/* Order Summary */}
        <div className="bg-gray-50 p-8 rounded-xl h-fit">
           <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
           <ul className="space-y-4 mb-6">
             {state.cart.map(item => (
                <li key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-white rounded-md overflow-hidden border">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                       </div>
                   </div>
                   <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
             ))}
           </ul>
           <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                 <p className="text-gray-600">Subtotal</p>
                 <p>${total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                 <p className="text-gray-600">Shipping</p>
                 <p>Free</p>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                 <p>Total</p>
                 <p>${total.toFixed(2)}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;