import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Package, Download, Key, ShieldCheck, Bell } from 'lucide-react';
import { generateInvoice } from '../services/utils';
import { useLanguage } from '../context/LanguageContext';

const Profile: React.FC = () => {
  const { state } = useContext(StoreContext);
  const { t } = useLanguage();
  const userOrders = state.orders.filter(o => o.userId === state.user?.id || o.userId === 'guest'); // Show all for demo

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [notifStatus, setNotifStatus] = useState<string>('default');

  const handleUpdatePassword = (e: React.FormEvent) => {
      e.preventDefault();
      if(passwordForm.new !== passwordForm.confirm) {
          alert("New passwords do not match");
          return;
      }
      alert("Password updated successfully!");
      setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const requestNotifications = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else {
      Notification.requestPermission().then((permission) => {
        setNotifStatus(permission);
        if (permission === "granted") {
          new Notification("Notifications Enabled!", {
            body: "You will now receive updates about your orders.",
            icon: "/icon-192.png" // Fallback usually
          });
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('profile.myAccount')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('profile.welcome')}, {state.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                 <Package className="text-gray-400" /> {t('profile.orderHistory')}
             </h2>
             
             {userOrders.length === 0 ? (
                 <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                     <p className="text-gray-500 dark:text-gray-400">{t('profile.noOrders')}</p>
                 </div>
             ) : (
                 <div className="space-y-4">
                     {userOrders.map(order => (
                         <div key={order.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50/50 dark:bg-gray-700/50">
                             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                 <div>
                                     <p className="font-bold text-gray-900 dark:text-white">{t('profile.order')} #{order.id}</p>
                                     <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                         order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                         order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                         order.status === 'Returned' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                         'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
                                     }`}>
                                         {order.status}
                                     </span>
                                     <button 
                                        onClick={() => generateInvoice(order, state.settings)}
                                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300"
                                     >
                                         <Download size={16} /> {t('profile.invoice')}
                                     </button>
                                 </div>
                             </div>
                             
                             <div className="divide-y divide-gray-100 dark:divide-gray-600 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-600">
                                 {order.items.map((item, idx) => (
                                     <div key={idx} className="p-3 flex items-center gap-4">
                                         <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                                             <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                         </div>
                                         <div className="flex-1">
                                             <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                                             <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                         </div>
                                         <p className="text-sm font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                     </div>
                                 ))}
                             </div>
                             
                             <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                                 <p className="text-sm text-gray-500 dark:text-gray-400">{order.items.length} {t('nav.items')}</p>
                                 <p className="text-lg font-bold text-gray-900 dark:text-white">{t('profile.total')}: ${order.total.toFixed(2)}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="lg:col-span-1 space-y-6">
           {/* Notification Card */}
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                   <Bell className="text-gray-400" /> Notifications
               </h2>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get updates on your order status instantly.</p>
               <button 
                  onClick={requestNotifications}
                  disabled={notifStatus === 'granted'}
                  className={`w-full py-2.5 rounded-lg font-bold transition flex items-center justify-center gap-2 ${notifStatus === 'granted' ? 'bg-green-100 text-green-700 cursor-default' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
               >
                  {notifStatus === 'granted' ? 'Notifications Enabled' : 'Enable Push Notifications'}
               </button>
           </div>

           {/* Security Card */}
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                   <ShieldCheck className="text-gray-400" /> {t('profile.security')}
               </h2>
               
               <form onSubmit={handleUpdatePassword} className="space-y-4">
                   <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.currentPass')}</label>
                       <div className="relative">
                           <input 
                             type="password" 
                             required
                             value={passwordForm.current}
                             onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                             className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                           />
                           <Key className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                       </div>
                   </div>
                   
                   <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.newPass')}</label>
                       <input 
                         type="password" 
                         required
                         value={passwordForm.new}
                         onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                       />
                   </div>

                   <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.confirmPass')}</label>
                       <input 
                         type="password" 
                         required
                         value={passwordForm.confirm}
                         onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                       />
                   </div>

                   <button 
                     type="submit" 
                     className="w-full bg-gray-900 dark:bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-indigo-700 transition shadow-lg mt-2"
                   >
                       {t('profile.updatePass')}
                   </button>
               </form>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;