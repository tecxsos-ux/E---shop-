
import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, MapPin, Globe } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { state } = useContext(StoreContext);

  const totalSales = state.orders.reduce((acc, ord) => acc + ord.total, 0);
  const totalOrders = state.orders.length;
  const totalProducts = state.products.length;
  const totalUsers = state.users.length;

  // Mock data for sales timeline (Revenue Analytics)
  const salesTimelineData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  // Calculate Real Sales by Category
  const categorySalesMap: Record<string, number> = {};
  
  state.orders.forEach(order => {
      // Iterate through items in each order to sum up sales by category
      order.items.forEach(item => {
          const categoryName = item.category || 'Uncategorized';
          const itemTotal = item.price * item.quantity;
          categorySalesMap[categoryName] = (categorySalesMap[categoryName] || 0) + itemTotal;
      });
  });

  // Convert map to array for Recharts
  const salesByCategoryData = Object.keys(categorySalesMap).map(key => ({
      name: key,
      sales: parseFloat(categorySalesMap[key].toFixed(2))
  }));

  // Fallback if no sales yet
  const displayCategoryData = salesByCategoryData.length > 0 ? salesByCategoryData : [
      { name: 'No Sales Yet', sales: 0 }
  ];

  // Calculate User Location Data for Charts
  const locationCounts: Record<string, number> = {};
  state.users.forEach(u => {
      const country = u.location ? u.location.split(', ').pop() || 'Unknown' : 'Unknown';
      locationCounts[country] = (locationCounts[country] || 0) + 1;
  });

  const locationData = Object.keys(locationCounts).map(key => ({
      name: key,
      value: locationCounts[key]
  }));

  const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your store's performance and user activity.</p>
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
              <p className="text-gray-500 text-sm">Registered Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
           </div>
           <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Users size={24} /></div>
        </div>
      </div>

      {/* Charts Row 1: Sales & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80">
           <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={salesTimelineData}>
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
             <BarChart data={displayCategoryData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{fontSize: 10}} interval={0} />
               <YAxis stroke="#9ca3af" fontSize={12} />
               <Tooltip cursor={{fill: '#f9fafb'}} />
               <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: User Geography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe size={18} className="text-indigo-500" /> User Geography (By Country)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                    <YAxis dataKey="name" type="category" width={100} stroke="#4b5563" fontSize={12} />
                    <Tooltip cursor={{fill: '#f9fafb'}} />
                    <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
         </div>

         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-emerald-500" /> User Distribution
            </h3>
            <div className="flex h-full">
                <div className="w-1/2 h-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={locationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {locationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 h-full flex flex-col justify-center space-y-2">
                    {locationData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            <span className="text-gray-600">{entry.name}:</span>
                            <span className="font-bold">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
