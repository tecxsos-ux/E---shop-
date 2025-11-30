
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AdminLayout from '../../components/AdminLayout';
import { OrderStatus, Order, CartItem } from '../../types';
import { Eye, X, MapPin, User, Calendar, Package } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status: newStatus } });
  };

  const getVariantString = (item: CartItem) => {
    const parts = [];
    if (item.selectedColor) parts.push(`Color: ${item.selectedColor}`);
    if (item.selectedSize) parts.push(`Size: ${item.selectedSize}`);
    if (item.selectedVariants) {
        Object.entries(item.selectedVariants).forEach(([key, value]) => {
            parts.push(`${key}: ${value}`);
        });
    }
    return parts.length > 0 ? parts.join(' | ') : 'Standard';
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer orders and view details.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'Returned' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md hover:bg-indigo-100 transition"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                    <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="border border-gray-300 rounded text-xs p-1.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        {Object.values(OrderStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl sticky top-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Order #{selectedOrder.id}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                selectedOrder.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                                selectedOrder.status === 'Processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                                {selectedOrder.status}
                            </span>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar size={14} /> {new Date(selectedOrder.date).toLocaleString()}
                        </p>
                    </div>
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Customer & Shipping Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <User size={16} className="text-indigo-500" /> Customer Details
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium text-gray-900">User ID:</span> {selectedOrder.userId}</p>
                                {/* In a real app, you might fetch full user details here if not in order object */}
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <MapPin size={16} className="text-indigo-500" /> Shipping Address
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>{selectedOrder.shippingAddress.line1}</p>
                                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                                <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                             <Package size={16} className="text-indigo-500" /> Order Items ({selectedOrder.items.length})
                        </h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                                        <img className="h-full w-full object-cover" src={item.image} alt="" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                        <div className="text-xs text-gray-500">{item.brand}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                                    {getVariantString(item)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="flex justify-end">
                        <div className="w-full md:w-1/3 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>${selectedOrder.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax</span>
                                <span>${selectedOrder.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>${selectedOrder.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-indigo-600">${selectedOrder.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
