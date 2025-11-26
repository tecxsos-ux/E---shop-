import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { Star, Truck, Shield, RotateCcw } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useContext(StoreContext);
  const product = state.products.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [mainImage, setMainImage] = useState<string>(product?.image || '');

  if (!product) {
    return <div className="p-10 text-center">Product not found. <Link to="/shop" className="text-indigo-600">Go Back</Link></div>;
  }

  // Determine variants available
  const sizeVariant = product.variants.find(v => v.type === 'size');
  const colorVariant = product.variants.find(v => v.type === 'color');

  const handleAddToCart = () => {
    if (sizeVariant && !selectedSize) {
      alert("Please select a size");
      return;
    }
    if (colorVariant && !selectedColor) {
      alert("Please select a color");
      return;
    }
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity: 1,
        selectedColor: selectedColor || undefined,
        selectedSize: selectedSize || undefined,
      }
    });
    alert("Added to cart!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            <img src={mainImage || product.image} alt={product.name} className="w-full h-full object-cover object-center" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[product.image, ...product.images].map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 ${mainImage === img ? 'border-indigo-600' : 'border-transparent'}`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="mb-2 flex items-center gap-2">
             <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold uppercase">{product.category}</span>
             {product.isNew && <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full font-bold uppercase">New Arrival</span>}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
             <Star className="w-4 h-4 fill-current" />
             <Star className="w-4 h-4 fill-current" />
             <Star className="w-4 h-4 fill-current" />
             <Star className="w-4 h-4 fill-current" />
             <Star className="w-4 h-4 fill-current" />
             <span className="text-gray-400 text-sm ml-2">(128 Reviews)</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-4">${product.price}</p>
          
          <div className="mt-6 prose prose-sm text-gray-500">
            <p>{product.description}</p>
          </div>

          <div className="mt-8 space-y-6">
            {sizeVariant && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="flex gap-2 mt-2">
                  {sizeVariant.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedSize(opt)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition ${selectedSize === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-900 hover:border-gray-300'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colorVariant && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="flex gap-2 mt-2">
                  {colorVariant.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedColor(opt)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition ${selectedColor === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-900 hover:border-gray-300'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
            >
              Add to Cart
            </button>
            
            <div className="grid grid-cols-3 gap-4 text-center mt-8">
               <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-full text-gray-600"><Truck size={20} /></div>
                  <span className="text-xs text-gray-500">Fast Delivery</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-full text-gray-600"><RotateCcw size={20} /></div>
                  <span className="text-xs text-gray-500">Free Returns</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-full text-gray-600"><Shield size={20} /></div>
                  <span className="text-xs text-gray-500">2 Year Warranty</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;