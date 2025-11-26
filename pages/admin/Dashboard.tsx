import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { state } = useContext(StoreContext);

  const totalSales = state.orders.reduce((acc, ord) => acc + ord.total, 0);
  const totalOrders = state.orders.length;
  const totalProducts = state.products.length;

  // Mock data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your store's performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</h3>
           </div>
           <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
           </div>
           <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><ShoppingBag size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-gray-500 text-sm">Products</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
           </div>
           <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><TrendingUp size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-gray-500 text-sm">Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">1,240</h3>
           </div>
           <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Users size={24} /></div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80">
           <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={salesData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
               <YAxis stroke="#9ca3af" fontSize={12} />
               <Tooltip />
               <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} />
             </LineChart>
           </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80">
           <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={salesData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
               <YAxis stroke="#9ca3af" fontSize={12} />
               <Tooltip cursor={{fill: '#f9fafb'}} />
               <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;