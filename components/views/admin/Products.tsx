'use client';

import React, { useContext, useState, useRef } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { StoreContext } from '../../../context/StoreContext';
import { Plus, Edit, Trash2, X, Upload, Wand2, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { Product, Variant } from '../../../types';
import { editProductImage, generateProductDescription } from '../../../services/geminiService';

const Products = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    subCategory: '',
    image: '',
    images: [],
    stock: 0,
    brand: '',
    isNew: false,
    discount: 0,
    variants: []
  });

  // Variant State helpers
  const [newVariantType, setNewVariantType] = useState('');
  const [newVariantOptions, setNewVariantOptions] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        subCategory: '',
        image: '',
        images: [],
        stock: 0,
        brand: '',
        isNew: false,
        discount: 0,
        variants: []
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' || name === 'discount' ? parseFloat(value) : value }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Variant Logic ---
  const addVariantGroup = () => {
    if (!newVariantType || !newVariantOptions) return;
    const optionsArray = newVariantOptions.split(',').map(s => s.trim()).filter(Boolean);
    const newVariant: Variant = { type: newVariantType, options: optionsArray };
    setFormData(prev => ({
        ...prev,
        variants: [...(prev.variants || []), newVariant]
    }));
    setNewVariantType('');
    setNewVariantOptions('');
  };

  const removeVariantGroup = (index: number) => {
    setFormData(prev => ({
        ...prev,
        variants: prev.variants?.filter((_, i) => i !== index)
    }));
  };

  // --- AI Features ---
  const handleAiDescription = async () => {
    if (!formData.name) return;
    setLoadingAi(true);
    const desc = await generateProductDescription(formData.name, formData.brand || '');
    setFormData(prev => ({ ...prev, description: desc }));
    setLoadingAi(false);
  };

  const handleAiImageEdit = async () => {
    if (!formData.image || !aiPrompt) return;
    setLoadingAi(true);
    // Check if it's a data URL (uploaded file) or external URL
    let imageToEdit = formData.image;
    
    // Note: editing remote URLs usually requires fetching them first. 
    // This simple demo assumes Data URLs or assumes the API can handle it if we passed URLs (but gemini expects base64).
    // If it's not base64, we might fail or need a proxy. For now, works best with uploaded images.
    
    const newImage = await editProductImage(imageToEdit, aiPrompt);
    if (newImage) {
        setFormData(prev => ({ ...prev, image: newImage }));
        setIsAiModalOpen(false);
        setAiPrompt('');
    } else {
        alert("Could not edit image. Ensure it is a valid image file.");
    }
    setLoadingAi(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
        ...formData, 
        id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
        variants: formData.variants || []
    } as Product;

    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Product</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Stock</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {state.products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">${product.price}</td>
                <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openModal(product)} className="text-indigo-600 hover:text-indigo-800 p-1"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Details */}
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                 </div>
                 
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <button type="button" onClick={handleAiDescription} disabled={loadingAi} className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold">
                            {loadingAi ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} Generate with AI
                        </button>
                    </div>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-white">
                            <option value="">Select...</option>
                            {state.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                 </div>

                 <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleInputChange} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm font-medium text-gray-700">New Arrival</span>
                    </label>
                 </div>
              </div>

              {/* Right Column: Media & Variants */}
              <div className="space-y-6">
                 {/* Image Handler */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Product Image</label>
                    <div className="flex gap-2 mb-3">
                        <input name="image" value={formData.image} onChange={handleInputChange} placeholder="Image URL" className="flex-1 p-2 border rounded-lg text-sm" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-100" title="Upload File">
                            <Upload size={20} className="text-gray-600" />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>
                    
                    {formData.image && (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-white border border-gray-200 group">
                            <img src={formData.image} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => setIsAiModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all hover:bg-indigo-700 shadow-lg">
                                    <Wand2 size={16} /> Magic Edit
                                </button>
                            </div>
                        </div>
                    )}
                 </div>

                 {/* Variants */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Variants</label>
                    
                    {formData.variants?.map((variant, idx) => (
                        <div key={idx} className="flex justify-between items-start bg-white p-3 rounded-lg border border-gray-200 mb-2">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">{variant.type}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {variant.options.map(opt => <span key={opt} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{opt}</span>)}
                                </div>
                            </div>
                            <button type="button" onClick={() => removeVariantGroup(idx)} className="text-red-400 hover:text-red-600"><X size={16} /></button>
                        </div>
                    ))}

                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <input placeholder="Type (e.g. Size)" value={newVariantType} onChange={e => setNewVariantType(e.target.value)} className="col-span-1 p-2 text-sm border rounded-lg" />
                        <input placeholder="Options (S, M, L)" value={newVariantOptions} onChange={e => setNewVariantOptions(e.target.value)} className="col-span-2 p-2 text-sm border rounded-lg" />
                    </div>
                    <button type="button" onClick={addVariantGroup} className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-bold text-indigo-600 border border-indigo-200 bg-indigo-50 py-2 rounded-lg hover:bg-indigo-100 transition">
                        <Plus size={16} /> Add Variant Group
                    </button>
                 </div>
              </div>

              <div className="lg:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
                      <Save size={18} /> Save Product
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Image Edit Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                 <div className="flex items-center gap-3 mb-4 text-indigo-600">
                     <Wand2 size={24} />
                     <h3 className="text-lg font-bold">Magic Image Editor</h3>
                 </div>
                 <p className="text-sm text-gray-600 mb-4">
                     Describe how you want to change the image. For example: 
                     <span className="italic"> "Add a snowy mountain background"</span> or 
                     <span className="italic"> "Make it look like a pencil sketch"</span>.
                 </p>
                 
                 <div className="mb-4">
                     <img src={formData.image} className="w-full h-48 object-contain bg-gray-100 rounded-lg border border-gray-200" />
                 </div>

                 <textarea 
                    value={aiPrompt} 
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Enter your prompt here..." 
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4 text-sm"
                 />
                 
                 <div className="flex gap-3 justify-end">
                     <button onClick={() => setIsAiModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Cancel</button>
                     <button 
                        onClick={handleAiImageEdit} 
                        disabled={loadingAi || !aiPrompt}
                        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                     >
                        {loadingAi ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                        {loadingAi ? 'Generating...' : 'Generate'}
                     </button>
                 </div>
             </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Products;