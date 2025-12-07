'use client';
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { StoreContext } from '../../context/StoreContext';
import { Star, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

const ProductDetails: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const { state, dispatch } = useContext(StoreContext);
  const { t } = useLanguage();
  const product = state.products.find(p => p.id === id);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return <div className="p-10 text-center">Product Not Found</div>;

  const handleAddToCart = () => {
    setIsAdding(true);
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity, selectedVariants } });
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO title={product.name} description={product.description} image={product.image} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         <img src={product.image} className="w-full rounded-2xl" />
         <div>
             <h1 className="text-3xl font-bold">{product.name}</h1>
             <p className="text-2xl font-bold mt-2">${product.price}</p>
             <p className="mt-4 text-gray-600">{product.description}</p>
             <div className="mt-6 flex items-center gap-4">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 border rounded">-</button>
                 <span>{quantity}</span>
                 <button onClick={() => setQuantity(quantity + 1)} className="p-2 border rounded">+</button>
             </div>
             <button onClick={handleAddToCart} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center items-center gap-2">
                 {isAdding ? <Check /> : <ShoppingCart />} {isAdding ? 'Added' : 'Add to Cart'}
             </button>
         </div>
      </div>
    </div>
  );
};
export default ProductDetails;