
import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, MapPin, Globe, Wifi, WifiOff, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';

type Period = 'day' | 'week' | 'month' | 'year';

// --- Simplified World Map Component ---
const WorldMap: React.FC<{ users: any[] }> = ({ users }) => {
    // Coordinate mapping for major countries (approximate SVG coordinates on a 800x400 map)
    const getCoordinates = (location: string) => {
        const loc = location.toLowerCase();
        if (loc.includes('usa') || loc.includes('united states')) return { cx: 200, cy: 140 };
        if (loc.includes('canada')) return { cx: 200, cy: 80 };
        if (loc.includes('brazil')) return { cx: 280, cy: 260 };
        if (loc.includes('uk') || loc.includes('united kingdom')) return { cx: 395, cy: 115 };
        if (loc.includes('france')) return { cx: 405, cy: 130 };
        if (loc.includes('germany')) return { cx: 420, cy: 125 };
        if (loc.includes('italy')) return { cx: 425, cy: 140 };
        if (loc.includes('spain')) return { cx: 395, cy: 145 };
        if (loc.includes('russia')) return { cx: 550, cy: 80 };
        if (loc.includes('china')) return { cx: 600, cy: 160 };
        if (loc.includes('india')) return { cx: 550, cy: 190 };
        if (loc.includes('japan')) return { cx: 680, cy: 150 };
        if (loc.includes('australia')) return { cx: 650, cy: 300 };
        if (loc.includes('africa') || loc.includes('south africa')) return { cx: 450, cy: 300 }; // General Area
        if (loc.includes('egypt')) return { cx: 460, cy: 170 };
        return null;
    };

    // Group users by coordinates
    const pins: Record<string, number> = {};
    users.forEach(u => {
        const coords = getCoordinates(u.location || '');
        if (coords) {
            const key = `${coords.cx},${coords.cy}`;
            pins[key] = (pins[key] || 0) + 1;
        }
    });

    return (
        <svg viewBox="0 0 800 400" className="w-full h-full bg-blue-50/50 rounded-xl">
            {/* Simplified World Map Outline */}
            <g fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1">
                {/* Americas */}
                <path d="M 150 50 L 250 50 L 280 150 L 300 350 L 250 380 L 200 350 L 180 200 L 100 100 Z" />
                {/* Europe/Africa/Asia/Aus (Very simplified blobs for visual context) */}
                <path d="M 380 100 L 450 80 L 500 80 L 700 80 L 750 150 L 650 200 L 600 250 L 550 200 L 500 220 L 480 350 L 420 350 L 380 150 Z" />
                {/* Australia */}
                <path d="M 620 280 L 700 280 L 700 350 L 620 350 Z" />
                {/* UK/Islands */}
                <circle cx="395" cy="115" r="5" />
                <circle cx="680" cy="150" r="5" /> 
            </g>
            
            {/* Dynamic Pins */}
            {Object.entries(pins).map(([key, count], idx) => {
                const [cx, cy] = key.split(',').map(Number);
                return (
                    <g key={idx}>
                        <circle cx={cx} cy={cy} r={6 + Math.min(count * 2, 10)} fill="rgba(79, 70, 229, 0.3)" className="animate-ping" />
                        <circle cx={cx} cy={cy} r={4 + Math.min(count, 8)} fill="#4f46e5" stroke="white" strokeWidth="2" />
                        <text x={cx} y={cy - 10} fontSize="10" textAnchor="middle" fill="#4b5563" fontWeight="bold">{count}</text>
                    </g>
                );
            })}
        </svg>
    );
};


const AdminDashboard: React.FC = () => {
  const { state, refreshData } = useContext(StoreContext);
  const [retrying, setRetrying] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState<Period>('month');
  const [revenueData, setRevenueData] = useState<{name: string, sales: number}[]>([]);
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  const handleRetry = async () => {
      setRetrying(true);
      await refreshData();
      setRetrying(false);
  };

  const totalSales = state.orders.reduce((acc, ord) => acc + ord.total, 0);
  const totalOrders = state.orders.length;
  const totalProducts = state.products.length;
  const totalUsers = state.users.length;

  // --- Fetch Revenue Data ---
  useEffect(() => {
      const fetchRevenue = async () => {
          setLoadingRevenue(true);
          try {
              if (state.isDbConnected) {
                  // Fetch from Backend
                  const res = await fetch(`http://localhost:5000/api/analytics/revenue?period=${revenuePeriod}`);
                  if (res.ok) {
                      const data = await res.json();
                      setRevenueData(data);
                  }
              } else {
                  // Fallback: Client-side calculation for mock data
                  const groupedData: Record<string, number> = {};
                  
                  state.orders.forEach(order => {
                      const date = new Date(order.date);
                      let key = '';

                      if (revenuePeriod === 'day') {
                          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
                      } else if (revenuePeriod === 'month') {
                          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
                      } else if (revenuePeriod === 'year') {
                          key = `${date.getFullYear()}`;
                      } else if (revenuePeriod === 'week') {
                          // Simple week number estimation
                          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                          const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
                          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                          key = `${date.getFullYear()}-W${weekNum}`;
                      }

                      groupedData[key] = (groupedData[key] || 0) + order.total;
                  });

                  // Convert to array and sort
                  const sortedData = Object.keys(groupedData).sort().map(key => ({
                      name: key,
                      sales: groupedData[key]
                  }));
                  
                  setRevenueData(sortedData.length > 0 ? sortedData : [{name: 'No Data', sales: 0}]);
              }
          } catch (error) {
              console.error("Failed to fetch revenue analytics", error);
          } finally {
              setLoadingRevenue(false);
          }
      };

      fetchRevenue();
  }, [revenuePeriod, state.isDbConnected, state.orders]);


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
      const parts = u.location ? u.location.split(',') : [];
      const country = parts.length > 1 ? parts[parts.length - 1].trim() : 'Unknown';
      locationCounts[country] = (locationCounts[country] || 0) + 1;
  });

  const locationData = Object.keys(locationCounts).map(key => ({
      name: key,
      value: locationCounts[key]
  }));

  const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
           <p className="text-gray-500">Overview of your store's performance and user activity.</p>
        </div>
        
        {/* Connection Status Indicator */}
        <div className="flex items-center gap-2">
            <button 
                onClick={handleRetry} 
                disabled={retrying}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
                title="Retry Database Connection"
            >
                <RefreshCw size={20} className={retrying ? "animate-spin" : ""} />
            </button>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold shadow-sm ${state.isDbConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                {state.isDbConnected ? (
                    <>
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <Wifi size={16} /> Live Database Connected
                    </>
                ) : (
                    <>
                    <WifiOff size={16} /> Using Mock Data (Server Offline)
                    </>
                )}
            </div>
        </div>
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
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-96 flex flex-col">
           <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-semibold flex items-center gap-2">
                   <TrendingUp className="text-indigo-600" size={20} /> Revenue Analytics
               </h3>
               
               {/* Period Selector */}
               <div className="flex bg-gray-100 p-1 rounded-lg">
                   {(['day', 'week', 'month', 'year'] as Period[]).map((p) => (
                       <button
                           key={p}
                           onClick={() => setRevenuePeriod(p)}
                           className={`px-3 py-1 text-xs font-bold rounded-md capitalize transition ${revenuePeriod === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                           {p}
                       </button>
                   ))}
               </div>
           </div>
           
           <div className="flex-1 w-full min-h-0">
             {loadingRevenue ? (
                 <div className="h-full flex items-center justify-center text-gray-400">Loading data...</div>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="name" 
                        stroke="#9ca3af" 
                        fontSize={10} 
                        tickFormatter={(value) => {
                            // Shorten labels based on period
                            if(revenuePeriod === 'day') return value.slice(5); // MM-DD
                            return value;
                        }}
                    />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5'}} activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
             )}
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-96 flex flex-col">
           <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
               <ShoppingBag className="text-purple-600" size={20} /> Sales by Category
           </h3>
           <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} interval={0} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* World Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[400px]">
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe size={18} className="text-blue-500" /> Live User Activity Map
            </h3>
            <div className="w-full h-[320px] rounded-xl overflow-hidden bg-blue-50/30">
                <WorldMap users={state.users} />
            </div>
         </div>
         
         <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-emerald-500" /> User Distribution
            </h3>
            <div className="flex-1">
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
            <div className="mt-4 space-y-2 overflow-y-auto max-h-[120px]">
                {locationData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            <span className="text-gray-700 truncate max-w-[120px]" title={entry.name}>{entry.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">{entry.value}</span>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
