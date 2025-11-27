
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { Save, Image as ImageIcon, Type, Palette, DollarSign, Building, Upload } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [form, setForm] = useState(state.settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, brandLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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
        <p className="text-gray-500 text-sm mt-1">Configure your brand identity, company details, and website appearance.</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Brand Identity Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
                 <Type className="text-indigo-600" size={20} /> Brand Identity
             </h3>
             <div className="space-y-6">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name Color</label>
                        <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              name="brandTextColor" 
                              value={form.brandTextColor || '#111827'} 
                              onChange={handleChange}
                              className="h-10 w-14 p-1 rounded border border-gray-300 cursor-pointer bg-white"
                            />
                            <input 
                              type="text" 
                              name="brandTextColor"
                              value={form.brandTextColor || '#111827'}
                              onChange={handleChange}
                              className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-900 bg-white uppercase"
                            />
                        </div>
                     </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Logo</label>
                    <div className="space-y-3">
                        {/* URL Input */}
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

                        {/* File Upload */}
                        <div className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Upload size={16} className="text-gray-500" />
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        {form.brandLogo && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                                <div className="p-4 border rounded-lg inline-block bg-white shadow-sm">
                                    <img src={form.brandLogo} alt="Logo Preview" className="h-12 w-auto object-contain" />
                                </div>
                            </div>
                        )}
                    </div>
                 </div>
             </div>
          </div>

          {/* Theme & Colors Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
                 <Palette className="text-indigo-600" size={20} /> Theme & Colors
             </h3>
             <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Brand Color</label>
                        <div className="flex items-center gap-2">
                            <input 
                            type="color" 
                            name="primaryColor" 
                            value={form.primaryColor} 
                            onChange={handleChange}
                            className="h-10 w-14 p-1 rounded border border-gray-300 cursor-pointer bg-white"
                            />
                            <input 
                              type="text" 
                              name="primaryColor"
                              value={form.primaryColor}
                              onChange={handleChange}
                              className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-900 bg-white uppercase"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Used for buttons, links, and highlights.</p>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                        <div className="flex items-center gap-2">
                            <input 
                            type="color" 
                            name="secondaryColor" 
                            value={form.secondaryColor || '#d97706'} 
                            onChange={handleChange}
                            className="h-10 w-14 p-1 rounded border border-gray-300 cursor-pointer bg-white"
                            />
                            <input 
                              type="text" 
                              name="secondaryColor"
                              value={form.secondaryColor || '#d97706'}
                              onChange={handleChange}
                              className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-900 bg-white uppercase"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Used for accents and badges.</p>
                     </div>
                 </div>

                 {/* Header Colors */}
                 <div className="pt-4 border-t border-gray-100">
                     <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Header Customization</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Header Background</label>
                            <div className="flex items-center gap-2">
                                <input 
                                type="color" 
                                name="headerBackgroundColor" 
                                value={form.headerBackgroundColor || '#ffffff'} 
                                onChange={handleChange}
                                className="h-10 w-14 p-1 rounded border border-gray-300 cursor-pointer bg-white"
                                />
                                <input 
                                  type="text" 
                                  name="headerBackgroundColor"
                                  value={form.headerBackgroundColor || '#ffffff'}
                                  onChange={handleChange}
                                  className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-900 bg-white uppercase"
                                />
                            </div>
                         </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Header Text Color</label>
                            <div className="flex items-center gap-2">
                                <input 
                                type="color" 
                                name="headerTextColor" 
                                value={form.headerTextColor || '#4b5563'} 
                                onChange={handleChange}
                                className="h-10 w-14 p-1 rounded border border-gray-300 cursor-pointer bg-white"
                                />
                                <input 
                                  type="text" 
                                  name="headerTextColor"
                                  value={form.headerTextColor || '#4b5563'}
                                  onChange={handleChange}
                                  className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-900 bg-white uppercase"
                                />
                            </div>
                         </div>
                     </div>
                 </div>

                 {/* Footer Colors */}
                 <div className="pt-4 border-t border-gray-100">
                     <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Footer Customization</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Background</label>
                            <div className="flex items-center gap-2">
                                <input 
                                type="color" 
                                name="footerBackgroundColor" 
                                value={form.footerBackgroundColor || '#111827'} 
                                onChange={handleChange}
                                className="h-10 w-14 p-1 rounded border border-gray-300 cursor-pointer bg-white"
                                />
                                <input 
                                  type="text" 
                                  name="footerBackgroundColor"
                                  value={form.footerBackgroundColor || '#111827'}
                                  onChange={handleChange}
                                  className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-900 bg-white uppercase"
                                />
                            </div>
                         </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text Color</label>
                            <div className="flex items-center gap-2">
                                <input 
                                type="color" 
                                name="footerTextColor" 
                                value={form.footerTextColor || '#ffffff'} 
                                onChange={handleChange}
                                className="h-10 w-14 p-1 rounded border border-gray-300 cursor-pointer bg-white"
                                />
                                <input 
                                  type="text" 
                                  name="footerTextColor"
                                  value={form.footerTextColor || '#ffffff'}
                                  onChange={handleChange}
                                  className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-900 bg-white uppercase"
                                />
                            </div>
                         </div>
                     </div>
                 </div>
                 
                 {/* Live Preview Box */}
                 <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                     <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Theme Preview</p>
                     <div className="flex items-center gap-4 flex-wrap">
                         <div 
                            className="px-4 py-2 rounded-lg font-medium shadow-sm border border-gray-200"
                            style={{ backgroundColor: form.headerBackgroundColor || '#ffffff', color: form.headerTextColor || '#4b5563' }}
                         >
                             Header Example
                         </div>
                         <button 
                            type="button" 
                            style={{ backgroundColor: form.primaryColor }}
                            className="px-4 py-2 text-white rounded-lg font-medium shadow-sm transition-transform hover:scale-105"
                         >
                             Primary Button
                         </button>
                         <button 
                            type="button" 
                            style={{ backgroundColor: form.secondaryColor || '#d97706' }}
                            className="px-4 py-2 text-white rounded-lg font-medium shadow-sm"
                         >
                             Secondary Badge
                         </button>
                         <div 
                            className="px-4 py-2 rounded-lg font-medium shadow-sm border border-gray-200"
                            style={{ backgroundColor: form.footerBackgroundColor || '#111827', color: form.footerTextColor || '#ffffff' }}
                         >
                             Footer Example
                         </div>
                     </div>
                 </div>
             </div>
          </div>

          {/* Company Information */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
                 <Building className="text-indigo-600" size={20} /> Company Information
             </h3>
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input 
                      type="text" 
                      name="companyName" 
                      value={form.companyName || ''} 
                      onChange={handleChange}
                      placeholder="LuxeMarket Inc."
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea 
                      name="companyAddress" 
                      value={form.companyAddress || ''} 
                      onChange={handleChange}
                      rows={3}
                      placeholder="123 Luxury Lane, Beverly Hills, CA 90210"
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Number (VAT/EIN)</label>
                        <input 
                          type="text" 
                          name="companyTaxId" 
                          value={form.companyTaxId || ''} 
                          onChange={handleChange}
                          placeholder="US-123456789"
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          type="text" 
                          name="companyPhone" 
                          value={form.companyPhone || ''} 
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          name="companyEmail" 
                          value={form.companyEmail || ''} 
                          onChange={handleChange}
                          placeholder="support@example.com"
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Open Time / Hours</label>
                        <input 
                          type="text" 
                          name="companyWorkingHours" 
                          value={form.companyWorkingHours || ''} 
                          onChange={handleChange}
                          placeholder="Mon - Fri: 9am - 6pm"
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                     </div>
                 </div>
             </div>
          </div>
          
          {/* Financial Settings */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
                 <DollarSign className="text-indigo-600" size={20} /> Financial Settings
             </h3>
             <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input 
                      type="number" 
                      name="taxRate" 
                      value={form.taxRate} 
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost ($)</label>
                    <input 
                      type="number" 
                      name="shippingCost" 
                      value={form.shippingCost} 
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                 </div>
             </div>
             <p className="text-xs text-gray-500 mt-2">These values will be applied to all new orders at checkout.</p>
          </div>

          <div className="flex justify-end pb-8 sticky bottom-0 bg-gray-50 pt-4 border-t border-gray-200">
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
