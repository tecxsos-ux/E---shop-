
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { MapPin, Calendar, Clock, Search, Shield, User as UserIcon } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const { state } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = state.users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to parse location and get flag
  const parseLocation = (location?: string) => {
      if (!location) return { city: 'Unknown', country: 'Unknown', flag: '🏳️' };
      const parts = location.split(',').map(s => s.trim());
      const city = parts[0] || 'Unknown';
      const country = parts.length > 1 ? parts[parts.length - 1] : 'Unknown';
      
      let flag = '🏳️';
      const lowerCountry = country.toLowerCase();
      if (lowerCountry.includes('usa') || lowerCountry.includes('united states')) flag = '🇺🇸';
      else if (lowerCountry.includes('uk') || lowerCountry.includes('united kingdom')) flag = '🇬🇧';
      else if (lowerCountry.includes('france')) flag = '🇫🇷';
      else if (lowerCountry.includes('germany')) flag = '🇩🇪';
      else if (lowerCountry.includes('italy')) flag = '🇮🇹';
      else if (lowerCountry.includes('canada')) flag = '🇨🇦';
      else if (lowerCountry.includes('japan')) flag = '🇯🇵';
      else if (lowerCountry.includes('australia')) flag = '🇦🇺';
      else if (lowerCountry.includes('india')) flag = '🇮🇳';
      else if (lowerCountry.includes('china')) flag = '🇨🇳';
      else if (lowerCountry.includes('brazil')) flag = '🇧🇷';

      return { city, country, flag };
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Tracking & Location</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor user registrations, last login activity, and geographical location.</p>
      </div>

      {/* Filters/Search */}
      <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
         <div className="relative flex-1">
             <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Search by name, email, or city..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
             />
         </div>
         <div className="text-sm text-gray-500 font-medium">
             Total Users: {state.users.length}
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const { city, country, flag } = parseLocation(user.location);
                        return (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} /> : user.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-700">
                                    <MapPin size={16} className="text-gray-400 mr-1.5" />
                                    {city}
                                </div>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900 font-medium">
                                    <span className="text-lg mr-2">{flag}</span> {country}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar size={16} className="text-gray-400 mr-1.5" />
                                    {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900">
                                    <Clock size={16} className="text-gray-400 mr-1.5" />
                                    {user.lastLogin ? (
                                        <span>
                                            {new Date(user.lastLogin).toLocaleDateString()} <span className="text-gray-400 text-xs">{new Date(user.lastLogin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </span>
                                    ) : 'Never'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {user.status || 'Active'}
                                </span>
                            </td>
                        </tr>
                    )})
                ) : (
                    <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            No users found matching your search.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
