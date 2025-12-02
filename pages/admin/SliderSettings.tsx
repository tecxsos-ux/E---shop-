
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit2, Trash2, Eye, Image as ImageIcon, Save, Upload, AlertTriangle } from 'lucide-react';
import { Slide, Banner, PromoBanner } from '../../types';

const AdminSliderSettings: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

  // Banner State
  const [bannerForm, setBannerForm] = useState<Banner[]>(state.banners);
  const [promoBannerForm, setPromoBannerForm] = useState<PromoBanner[]>(state.promoBanners);

  const [form, setForm] = useState<Omit<Slide, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    link: '',
    color: 'from-indigo-900/90'
  });

  const colorOptions = [
    { label: 'Indigo', value: 'from-indigo-900/90' },
    { label: 'Blue', value: 'from-blue-900/90' },
    { label: 'Emerald', value: 'from-emerald-900/90' },
    { label: 'Purple', value: 'from-purple-900/90' },
    { label: 'Dark Gray', value: 'from-gray-900/90' },
    { label: 'Red', value: 'from-red-900/90' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingSlide(null);
    setForm({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      link: '',
      color: 'from-indigo-900/90'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slide: Slide) => {
    setEditingSlide(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: slide.image,
      link: slide.link,
      color: slide.color
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      dispatch({ type: 'DELETE_SLIDE', payload: id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSlide) {
      dispatch({ 
        type: 'UPDATE_SLIDE', 
        payload: { ...form, id: editingSlide.id } 
      });
    } else {
      dispatch({ 
        type: 'ADD_SLIDE', 
        payload: { ...form, id: Date.now().toString() } 
      });
    }
    
    setIsModalOpen(false);
  };

  // Banner Handlers
  const handleBannerChange = (index: number, field: keyof Banner, value: string) => {
    const updatedBanners = [...bannerForm];
    updatedBanners[index] = { ...updatedBanners[index], [field]: value };
    setBannerForm(updatedBanners);
  };

  const saveBanner = (index: number) => {
     dispatch({ type: 'UPDATE_BANNER', payload: bannerForm[index] });
     alert(`Banner ${index + 1} updated!`);
  };

  // Promo Banner Handlers
  const handlePromoBannerChange = (index: number, field: keyof PromoBanner, value: string) => {
    const updated = [...promoBannerForm];
    updated[index] = { ...updated[index], [field]: value };
    setPromoBannerForm(updated);
  };

  const savePromoBanner = (index: number) => {
    dispatch({ type: 'UPDATE_PROMO_BANNER', payload: promoBannerForm[index] });
    alert(`Promo Banner ${index + 1} updated!`);
  };
  
  const isPcloudSharingLink = form.image?.includes('pcloud.link/publink');

  return (
    <AdminLayout>
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-gray-900">Home Page Settings</h1>
         <p className="text-gray-500 text-sm mt-1">Manage the main homepage carousel and side banners.</p>
      </div>

      {/* Slider Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Main Slideshow</h2>
          <button 
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            <Plus size={20} /> Add Slide
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {state.slides.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No slides</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new slide.</p>
            </div>
          ) : (
            state.slides.map(slide => (
              <div key={slide.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-56">
                <div className="w-full md:w-1/3 relative bg-gray-100">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-transparent to-transparent opacity-80`}></div>
                    <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Preview
                    </div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{slide.title}</h3>
                      <p className="text-indigo-600 font-medium text-sm mb-2">{slide.subtitle}</p>
                      <p className="text-gray-500 text-sm line-clamp-2">{slide.description}</p>
                      <div className="mt-4 flex gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Link: {slide.link}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4 md:mt-0">
                      <button 
                          onClick={() => openEditModal(slide)} 
                          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-50 transition"
                      >
                          <Edit2 size={16} /> Edit
                      </button>
                      <button 
                          onClick={() => handleDelete(slide.id)} 
                          className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                      >
                          <Trash2 size={16} /> Delete
                      </button>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      
      {/* Side Banners Section */}
      <section className="mb-12 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Side Banners (Top Right)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {bannerForm.map((banner, idx) => (
                <div key={banner.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                      Banner {idx + 1}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{idx === 0 ? 'Top' : 'Bottom'}</span>
                   </h3>
                   
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Title</label>
                         <input 
                           value={banner.title} 
                           onChange={(e) => handleBannerChange(idx, 'title', e.target.value)}
                           className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                         <input 
                           value={banner.subtitle} 
                           onChange={(e) => handleBannerChange(idx, 'subtitle', e.target.value)}
                           className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Image URL</label>
                         <input 
                           value={banner.image} 
                           onChange={(e) => handleBannerChange(idx, 'image', e.target.value)}
                           className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Link</label>
                         <input 
                           value={banner.link} 
                           onChange={(e) => handleBannerChange(idx, 'link', e.target.value)}
                           className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Button Text</label>
                         <input 
                           value={banner.buttonText} 
                           onChange={(e) => handleBannerChange(idx, 'buttonText', e.target.value)}
                           className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600"
                         />
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden">
                             <img src={banner.image} className="w-full h-full object-cover" alt="Preview"/>
                          </div>
                          <button 
                             onClick={() => saveBanner(idx)}
                             className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition flex items-center gap-2"
                          >
                             <Save size={14} /> Save Changes
                          </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
      </section>

      {/* Promotional Banners Section */}
      <section className="mb-12 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Promotional Banners (Bottom Row)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {promoBannerForm.map((promo, idx) => (
                <div key={promo.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                      Promo {idx + 1}
                   </h3>
                   
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Title (Small)</label>
                         <input 
                           value={promo.title} 
                           onChange={(e) => handlePromoBannerChange(idx, 'title', e.target.value)}
                           className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Description (Large)</label>
                         <input 
                           value={promo.description} 
                           onChange={(e) => handlePromoBannerChange(idx, 'description', e.target.value)}
                           className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Image URL</label>
                         <input 
                           value={promo.image} 
                           onChange={(e) => handlePromoBannerChange(idx, 'image', e.target.value)}
                           className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Link</label>
                         <input 
                           value={promo.link} 
                           onChange={(e) => handlePromoBannerChange(idx, 'link', e.target.value)}
                           className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600"
                         />
                      </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase">Text Color Class</label>
                         <select 
                            value={promo.textColorClass || 'text-yellow-400'} 
                            onChange={(e) => handlePromoBannerChange(idx, 'textColorClass', e.target.value)}
                            className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-indigo-600 bg-transparent"
                         >
                             <option value="text-yellow-400">Yellow</option>
                             <option value="text-cyan-400">Cyan</option>
                             <option value="text-purple-400">Purple</option>
                             <option value="text-red-400">Red</option>
                             <option value="text-green-400">Green</option>
                             <option value="text-white">White</option>
                         </select>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="w-16 h-8 bg-gray-100 rounded overflow-hidden">
                             <img src={promo.image} className="w-full h-full object-cover" alt="Preview"/>
                          </div>
                          <button 
                             onClick={() => savePromoBanner(idx)}
                             className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition flex items-center gap-2"
                          >
                             <Save size={14} /> Save
                          </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input required name="title" value={form.title} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="e.g. Summer Sale" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                  <input required name="subtitle" value={form.subtitle} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="e.g. Up to 50% Off" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required name="description" value={form.description} onChange={handleInputChange} rows={3} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Short description..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image Source</label>
                <div className="flex gap-2 mt-1">
                  <input required name="image" value={form.image} onChange={handleInputChange} className="flex-1 border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Paste pCloud URL or upload ->" />
                   <label className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 flex items-center gap-2 border border-gray-300">
                      <Upload size={18} />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {isPcloudSharingLink && (
                  <div className="flex items-center gap-2 mt-2 text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200 text-xs font-bold">
                     <AlertTriangle size={16} />
                     <span>Warning: This is a pCloud sharing link. Use a direct image link or upload directly.</span>
                  </div>
                )}
                {form.image && (
                   <div className="mt-2 h-32 w-full border rounded-md overflow-hidden bg-gray-50 relative">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-xs font-bold">Image Preview</div>
                   </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Link Path</label>
                  <input required name="link" value={form.link} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="/shop?category=..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Overlay Color</label>
                  <select name="color" value={form.color} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                     {colorOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                     ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-md transition">Save Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSliderSettings;