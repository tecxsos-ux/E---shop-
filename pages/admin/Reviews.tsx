
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { Star, Trash2, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminReviews: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to get product name
  const getProductName = (productId: string) => {
    const product = state.products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const filteredReviews = state.reviews.filter(review => 
    review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProductName(review.productId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
      if(window.confirm("Are you sure you want to delete this review?")) {
          dispatch({ type: 'DELETE_REVIEW', payload: id });
      }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Product Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Manage user reviews and ratings.</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
         <div className="relative flex-1">
             <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Search by user, comment, or product..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
             />
         </div>
         <div className="text-sm text-gray-500 font-medium">
             Total Reviews: {state.reviews.length}
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {review.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:underline">
                            <Link to={`/product/${review.productId}`} target="_blank" className="flex items-center gap-1">
                                {getProductName(review.productId)} <ExternalLink size={12} />
                            </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                            {review.comment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                                onClick={() => handleDelete(review.id)}
                                className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 transition"
                                title="Delete Review"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No reviews found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
