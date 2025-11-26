import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Package, Download, Key } from 'lucide-react';
import { generateInvoice } from '../services/utils';

const Profile: React.FC = () => {
  const { state } = useContext(StoreContext);
  const userOrders = state.orders.filter(o => o.userId === state.user?.id || o.userId === 'guest'); // Show all for demo

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  const handleUpdatePassword = (e: React.FormEvent) => {
      e.preventDefault();
      if(passwordForm.new !== passwordForm.confirm) {
          alert("New passwords do not match");
          return;
      }
      alert("Password updated successfully!");
      setPasswordForm({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-500">Welcome back, {state.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Package className="text-indigo-600" /> Order History</h2>
          
          {userOrders.length === 0 ? (
            <p className="text-gray-500 italic">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex flex-wrap justify-between items-start mb-4 border-b border-gray-100 pb-4">
                    <div>
                      <p className="font-bold text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                           order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                           order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                           'bg-gray-100 text-gray-700'
                       }`}>
                           {order.status}
                       </span>
                       <button 
                         onClick={() => generateInvoice(order)}
                         className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                       >
                         <Download size={16} /> Invoice
                       </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.quantity}x {item.name} <span className="text-gray-400">({item.selectedSize || 'Standard'})</span></span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Key className="text-indigo-600" /> Security</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input 
                type="password" 
                value={passwordForm.current}
                onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input 
                 type="password" 
                 value={passwordForm.new}
                 onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                 className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input 
                 type="password" 
                 value={passwordForm.confirm}
                 onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                 className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              />
            </div>
            <button className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;