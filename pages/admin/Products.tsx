import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Wand2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Product } from '../../types';
import { generateProductDescription, editProductImage } from '../../services/geminiService';

const AdminProducts: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [bgRemovalLoading, setBgRemovalLoading] = useState(false);

  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Clothing',
    subCategory: '',
    brand: '',
    description: '',
    image: '',
    images: [],
    variants: [{type: 'size', options: []}],
    stock: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      
      // Simulate Fetching the image to base64 for the API 
      // In a real scenario, this would handle file inputs directly.
      try {
          // Mocking the result if API key isn't real or image fetch fails
          // If valid key is present, the service tries to call Gemini
          const editedImage = await editProductImage(form.image, "Remove the background and leave the object on a white background");
          
          if (editedImage) {
              setForm(prev => ({ ...prev, image: editedImage }));
          } else {
             // Fallback for demo if API fails
             alert("AI background removal requires a valid API Key and Model access. For demo purposes, imagine the background is gone!");
          }
      } catch (e) {
          console.error(e);
      } finally {
          setBgRemovalLoading(false);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: form.name!,
      price: Number(form.price),
      description: form.description!,
      category: form.category!,
      subCategory: form.subCategory || 'General',
      brand: form.brand!,
      image: form.image || 'https://picsum.photos/200',
      images: [],
      stock: Number(form.stock),
      variants: [{ type: 'size', options: ['S', 'M', 'L'] }], // Simplified for demo
      isNew: true
    };

    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    setIsModalOpen(false);
    setForm({ name: '', price: 0, category: 'Clothing', description: '', image: '', stock: 0 });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
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
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <div className="flex gap-2 mt-1">
                  <input required name="image" value={form.image} onChange={handleInputChange} placeholder="https://..." className="flex-1 border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  <button type="button" onClick={handleRemoveBackground} disabled={bgRemovalLoading} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-200 flex items-center gap-1">
                      {bgRemovalLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />} Remove BG
                  </button>
                </div>
                {form.image && (
                    <div className="mt-2 h-32 w-32 border rounded-md overflow-hidden bg-gray-50">
                        <img src={form.image} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                )}
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