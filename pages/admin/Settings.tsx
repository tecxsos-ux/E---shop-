
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { Save, Image as ImageIcon, Type, Palette } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [form, setForm] = useState(state.settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_SETTINGS', payload: form });
    alert('Settings updated successfully!');
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your brand identity and website appearance.</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Brand Identity */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Type className="text-gray-400" size={20} /> Brand Identity
             </h3>
             <div className="space-y-4">
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                    <input 
                      type="text" 
                      name="brandName" 
                      value={form.brandName} 
                      onChange={handleChange}
                      placeholder="LuxeMarket"
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Text Color</label>
                    <div className="flex items-center gap-4">
                        <input 
                          type="color" 
                          name="brandTextColor" 
                          value={form.brandTextColor || '#111827'} 
                          onChange={handleChange}
                          className="h-10 w-20 p-1 rounded border border-gray-300 cursor-pointer bg-white"
                        />
                        <input 
                          type="text" 
                          name="brandTextColor"
                          value={form.brandTextColor || '#111827'}
                          onChange={handleChange}
                          className="w-32 border border-gray-300 rounded-lg p-2 text-gray-900 bg-white uppercase"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select the color for the brand name text in the navigation.</p>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Logo URL</label>
                    <div className="flex gap-2">
                        <input 
                        type="text" 
                        name="brandLogo" 
                        value={form.brandLogo} 
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {form.brandLogo && (
                        <div className="mt-2 p-2 border rounded-lg inline-block bg-gray-50">
                            <img src={form.brandLogo} alt="Logo Preview" className="h-8 w-auto object-contain" />
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Leave empty to use the text brand name.</p>
                 </div>
             </div>
          </div>

          {/* Theme */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Palette className="text-gray-400" size={20} /> Theme Settings
             </h3>
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <div className="flex items-center gap-4">
                        <input 
                        type="color" 
                        name="primaryColor" 
                        value={form.primaryColor} 
                        onChange={handleChange}
                        className="h-10 w-20 p-1 rounded border border-gray-300 cursor-pointer bg-white"
                        />
                        <input 
                          type="text" 
                          name="primaryColor"
                          value={form.primaryColor}
                          onChange={handleChange}
                          className="w-32 border border-gray-300 rounded-lg p-2 text-gray-900 bg-white uppercase"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This color will be used for buttons, links, and highlights.</p>
                 </div>
                 
                 {/* Preview Box */}
                 <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-4">
                     <button 
                        type="button" 
                        style={{ backgroundColor: form.primaryColor }}
                        className="px-4 py-2 text-white rounded-lg font-medium shadow-sm"
                     >
                         Primary Button
                     </button>
                     <span style={{ color: form.primaryColor }} className="font-bold">Active Link Color</span>
                 </div>
             </div>
          </div>

          <div className="flex justify-end">
             <button 
               type="submit" 
               className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition flex items-center gap-2"
             >
                <Save size={18} /> Save Settings
             </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
