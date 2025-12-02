
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Wand2, Image as ImageIcon, Loader2, Trash2, X, Upload, AlertTriangle } from 'lucide-react';
import { Product, Variant } from '../../types';
import { generateProductDescription, editProductImage } from '../../services/geminiService';

const AdminProducts: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [bgRemovalLoading, setBgRemovalLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const initialFormState: Partial<Product> = {
    name: '',
    price: 0,
    category: 'Clothing',
    subCategory: '',
    brand: '',
    description: '',
    image: '',
    images: [],
    variants: [], // Start empty, allow dynamic addition
    stock: 0
  };

  const [form, setForm] = useState<Partial<Product>>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- Dynamic Variant Handling ---
  const handleAddVariantGroup = () => {
    setForm(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { type: '', options: [] }]
    }));
  };

  const handleRemoveVariantGroup = (index: number) => {
    setForm(prev => ({
      ...prev,
      variants: (prev.variants || []).filter((_, i) => i !== index)
    }));
  };

  const handleVariantTypeChange = (index: number, newType: string) => {
    const updatedVariants = [...(form.variants || [])];
    updatedVariants[index] = { ...updatedVariants[index], type: newType };
    setForm({ ...form, variants: updatedVariants });
  };

  const handleVariantOptionsChange = (index: number, val: string) => {
    const updatedVariants = [...(form.variants || [])];
    // Split by comma, trim whitespace, remove empty strings
    const optionsArray = val.split(',').map(s => s.trim()).filter(s => s !== '');
    updatedVariants[index] = { ...updatedVariants[index], options: optionsArray };
    setForm({ ...form, variants: updatedVariants });
  };

  // Helper to display options string in input
  const getOptionsString = (options: string[]) => {
      return options.join(', ');
  };
  // --------------------------------

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiDescription = async () => {
    if (!form.name) return alert("Please enter a product name first.");
    setAiLoading(true);
    const desc = await generateProductDescription(form.name, `${form.category} ${form.brand} ${form.subCategory}`);
    setForm(prev => ({ ...prev, description: desc }));
    setAiLoading(false);
  };
  
  const handleRemoveBackground = async () => {
      if (!form.image) return alert("Please enter an image URL or upload one first.");
      setBgRemovalLoading(true);
      try {
          const editedImage = await editProductImage(form.image, "Remove the background and leave the object on a white background");
          if (editedImage) {
              setForm(prev => ({ ...prev, image: editedImage }));
          } else {
             alert("AI background removal requires a valid API Key. For demo purposes, imagine the background is gone!");
          }
      } catch (e) {
          console.error(e);
      } finally {
          setBgRemovalLoading(false);
      }
  };

  const openAddModal = () => {
      setEditId(null);
      setForm(initialFormState);
      setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
      setEditId(product.id);
      setForm(product);
      setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productPayload: Product = {
      id: editId || Math.random().toString(36).substr(2, 9),
      name: form.name!,
      price: Number(form.price),
      description: form.description!,
      category: form.category!,
      subCategory: form.subCategory || 'General',
      brand: form.brand!,
      image: form.image || 'https://picsum.photos/200',
      images: form.images || [],
      stock: Number(form.stock),
      variants: form.variants || [],
      isNew: form.isNew ?? true,
      discount: form.discount
    };

    if (editId) {
        dispatch({ type: 'UPDATE_PRODUCT', payload: productPayload });
    } else {
        dispatch({ type: 'ADD_PRODUCT', payload: productPayload });
    }

    setIsModalOpen(false);
    setForm(initialFormState);
  };

  const isPcloudSharingLink = form.image?.includes('pcloud.link/publink');

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer" onClick={() => openEditModal(product)}>Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">{editId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input required name="name" value={form.name} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <input name="brand" value={form.brand} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input required type="number" name="price" value={form.price} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input required type="number" name="stock" value={form.stock} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" value={form.category} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        {state.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Sub Category</label>
                    <input name="subCategory" value={form.subCategory} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image Source</label>
                <div className="flex gap-2 mt-1">
                  <input required name="image" value={form.image} onChange={handleInputChange} placeholder="Paste URL (pCloud, AWS) or upload ->" className="flex-1 border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  
                  {/* Local Upload Button */}
                  <label className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 flex items-center gap-2 border border-gray-300">
                      <Upload size={18} />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  <button type="button" onClick={handleRemoveBackground} disabled={bgRemovalLoading} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-200 flex items-center gap-1">
                      {bgRemovalLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />} BG
                  </button>
                </div>
                {isPcloudSharingLink && (
                  <div className="flex items-center gap-2 mt-2 text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200 text-xs font-bold">
                     <AlertTriangle size={16} />
                     <span>This looks like a pCloud sharing link (webpage). Please use a DIRECT image link (ending in .jpg/.png) or upload the file directly here.</span>
                  </div>
                )}
                {!isPcloudSharingLink && (
                    <p className="text-xs text-gray-500 mt-1">Tip: If using pCloud, ensure you use a <strong>direct link</strong> (ending in .jpg/.png).</p>
                )}
                {form.image && (
                    <div className="mt-2 h-32 w-32 border rounded-md overflow-hidden bg-gray-50">
                        <img src={form.image} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                )}
              </div>

              {/* Dynamic Variants Section */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-gray-900">Product Variants</label>
                    <button type="button" onClick={handleAddVariantGroup} className="text-xs flex items-center gap-1 text-indigo-600 font-bold hover:underline">
                        <Plus size={14} /> Add Variant Group
                    </button>
                </div>
                
                {(!form.variants || form.variants.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No variants added (e.g. Size, Color, Material).</p>
                )}

                <div className="space-y-3">
                    {form.variants?.map((variant, index) => (
                        <div key={index} className="flex gap-2 items-start p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                            <div className="w-1/3">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Type (e.g. Size)</label>
                                <input 
                                    type="text" 
                                    value={variant.type} 
                                    onChange={(e) => handleVariantTypeChange(index, e.target.value)}
                                    placeholder="Color"
                                    className="w-full border border-gray-300 rounded p-1.5 text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Options (comma separated)</label>
                                <input 
                                    type="text" 
                                    value={getOptionsString(variant.options)}
                                    onChange={(e) => handleVariantOptionsChange(index, e.target.value)}
                                    placeholder="Red, Blue, Green"
                                    className="w-full border border-gray-300 rounded p-1.5 text-sm"
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => handleRemoveVariantGroup(index)}
                                className="mt-5 text-red-500 hover:text-red-700 p-1"
                                title="Remove Variant Group"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <button type="button" onClick={handleAiDescription} disabled={aiLoading} className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
                    {aiLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <Wand2 className="w-3 h-3" />} Generate with AI
                  </button>
                </div>
                <textarea required name="description" value={form.description} onChange={handleInputChange} rows={4} className="w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
