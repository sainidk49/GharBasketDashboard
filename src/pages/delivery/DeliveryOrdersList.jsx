import React, { useEffect, useState } from 'react';
import deliveryApi from '../../api/deliveryApi';
import { useTableParams } from '../../hooks/useTableParams';
import { Truck, Check, MapPin, Phone, Clock, CreditCard, Search, Loader2, X, Map } from 'lucide-react';
import { formatCurrency, formatOrderStatus, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const DeliveryOrdersList = () => {
  const { params, setPage, setSearch, setStatus } = useTableParams({ limit: 10 });
  const [data, setData] = useState({ orders: [], totalCount: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [failedModal, setFailedModal] = useState({ isOpen: false, orderId: null, reason: '' });

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await deliveryApi.getOrders(params);
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load deliveries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [params]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await deliveryApi.updateDeliveryStatus(id, { status });
      toast.success(`Order marked as ${formatOrderStatus(status)}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleFailedDelivery = async () => {
    if (!failedModal.reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    try {
      await deliveryApi.updateDeliveryStatus(failedModal.orderId, { 
        status: 'FAILED', 
        failureReason: failedModal.reason 
      });
      toast.success('Delivery marked as failed');
      setFailedModal({ isOpen: false, orderId: null, reason: '' });
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getMapsUrl = (order) => {
    if (order.deliveryCoordinates?.lat && order.deliveryCoordinates?.lng) {
      return `https://www.google.com/maps/search/?api=1&query=${order.deliveryCoordinates.lat},${order.deliveryCoordinates.lng}`;
    }
    
    if (order.deliveryAddress) {
      const addressString = `${order.deliveryAddress.addressLine1} ${order.deliveryAddress.addressLine2 || ''} ${order.deliveryAddress.city} ${order.deliveryAddress.state} ${order.deliveryAddress.pincode}`;
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString.trim())}`;
    }
    
    return '#';
  };

  const tabs = [
    { id: '', label: 'All' },
    { id: 'ASSIGNED', label: 'Assigned' },
    { id: 'ACCEPTED', label: 'Accepted' },
    { id: 'PICKED_UP', label: 'Picked Up' },
    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { id: 'DELIVERED', label: 'Delivered' },
    { id: 'FAILED', label: 'Failed' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="page-title">My Deliveries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your delivery tasks</p>
        </div>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatus(tab.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              (params.status || '') === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-border p-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search by order number..."
            value={params.search || ''}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading deliveries...</p>
        </div>
      ) : data.orders?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.orders.map((order) => (
            <div key={order._id} className="card overflow-hidden flex flex-col">
              <div className="p-5 flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">#{order.orderNumber}</h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {dayjs(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </div>
                  </div>
                  <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                    {formatOrderStatus(order.orderStatus)}
                  </span>
                </div>

                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.deliveryAddress?.fullName || order.userId?.name}</p>
                      <p className="text-sm text-gray-600">{order.deliveryAddress?.phone || order.userId?.mobile || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {order.deliveryAddress?.addressLine1} {order.deliveryAddress?.addressLine2}
                        <br/>
                        {order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}
                      </p>
                      <a 
                        href={getMapsUrl(order)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                      >
                        <Map size={12} /> Open in Maps
                      </a>
                    </div>
                  </div>
                  
                  {order.sellerId && (
                    <div className="flex items-start gap-3">
                      <Truck size={16} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500">Pickup From</p>
                        <p className="text-sm font-medium text-gray-900">{order.sellerId?.storeName || order.sellerId?.businessName || 'Store'}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <CreditCard size={14} />
                      {order.paymentMethod}
                    </div>
                    <div className="font-bold text-primary">
                      {formatCurrency(order.grandTotal)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-border">
                {order.orderStatus === 'ASSIGNED' && (
                  <button onClick={() => handleUpdateStatus(order._id, 'ACCEPTED')} className="btn-primary w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700">
                    <Check size={16} /> Accept Delivery
                  </button>
                )}
                
                {order.orderStatus === 'ACCEPTED' && (
                  <button onClick={() => handleUpdateStatus(order._id, 'PICKED_UP')} className="btn-primary w-full flex justify-center items-center gap-2">
                    <Truck size={16} /> Mark Picked Up
                  </button>
                )}
                
                {order.orderStatus === 'PICKED_UP' && (
                  <button onClick={() => handleUpdateStatus(order._id, 'OUT_FOR_DELIVERY')} className="btn-primary w-full flex justify-center items-center gap-2">
                    <MapPin size={16} /> Out for Delivery
                  </button>
                )}
                
                {order.orderStatus === 'OUT_FOR_DELIVERY' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateStatus(order._id, 'DELIVERED')} className="btn-primary flex-1 flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-sm">
                      <Check size={16} /> Delivered
                    </button>
                    <button onClick={() => setFailedModal({ isOpen: true, orderId: order._id, reason: '' })} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg flex-1 flex justify-center items-center gap-1 text-sm transition-colors">
                      <X size={16} /> Failed
                    </button>
                  </div>
                )}
                
                {['DELIVERED', 'FAILED', 'CANCELLED'].includes(order.orderStatus) && (
                  <div className="text-center text-sm font-medium text-gray-500 py-2">
                    Delivery {formatOrderStatus(order.orderStatus)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-border p-12 text-center text-gray-500">
          <Truck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-900">No deliveries found</p>
          <p>You have no assigned deliveries right now</p>
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-border rounded-xl">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{Math.min((params.page - 1) * params.limit + 1, data.totalCount)}</span> to <span className="font-medium">{Math.min(params.page * params.limit, data.totalCount)}</span> of <span className="font-medium">{data.totalCount}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(params.page - 1)}
              disabled={params.page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(params.page + 1)}
              disabled={params.page === data.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Failed Modal */}
      {failedModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Report Failed Delivery</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for failure</label>
                <textarea
                  className="input-field min-h-[100px] py-2"
                  placeholder="E.g., Customer unavailable, Address not found"
                  value={failedModal.reason}
                  onChange={(e) => setFailedModal({ ...failedModal, reason: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setFailedModal({ isOpen: false, orderId: null, reason: '' })} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleFailedDelivery} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryOrdersList;
