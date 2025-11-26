
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Trash2, Layers } from 'lucide-react';
import { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    subCategories: '',
    image: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory: Category = {
      id: Date.now().toString(),
      name: form.name,
      subCategories: form.subCategories.split(',').map(s => s.trim()).filter(s => s !== ''),
      image: form.image || 'https://picsum.photos/600/800'
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    setIsModalOpen(false);
    setForm({ name: '', subCategories: '', image: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
           <p className="text-gray-500 text-sm mt-1">Manage product categories and subcategories.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="h-40 overflow-hidden bg-gray-100 relative">
               <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white shadow-sm">{category.name}</h3>
               </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
               <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Subcategories</h4>
                  <div className="flex flex-wrap gap-2">
                     {category.subCategories.map((sub, idx) => (
                       <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                         {sub}
                       </span>
                     ))}
                  </div>
               </div>
               <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input required name="name" value={form.name} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input required name="image" value={form.image} onChange={handleInputChange} placeholder="https://..." className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subcategories</label>
                <p className="text-xs text-gray-500 mb-1">Comma separated (e.g. Shirts, Pants, Shoes)</p>
                <input required name="subCategories" value={form.subCategories} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
