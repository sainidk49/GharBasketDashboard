import React, { useEffect, useState } from 'react';
import sellerApi from '../../api/sellerApi';
import { useTableParams } from '../../hooks/useTableParams';
import { Package, Eye, Check, X, Truck, ChevronDown, ChevronUp, Search, Loader2, MapPin, Phone, CreditCard, Clock } from 'lucide-react';
import { formatCurrency, formatOrderStatus, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const OrdersList = () => {
  const { params, setPage, setSearch, setStatus } = useTableParams({ limit: 10 });
  const [data, setData] = useState({ orders: [], totalCount: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null, reason: '' });
  const [assignModal, setAssignModal] = useState({ isOpen: false, orderId: null });
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await sellerApi.getOrders(params);
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [params]);

  const fetchDeliveryPartners = async () => {
    try {
      const res = await sellerApi.getDeliveryPartners();
      setDeliveryPartners(res.data.data);
    } catch (error) {
      toast.error('Failed to load delivery partners');
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await sellerApi.updateOrderStatus(id, { status });
      toast.success(`Order marked as ${formatOrderStatus(status)}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelModal.reason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }
    try {
      await sellerApi.updateOrderStatus(cancelModal.orderId, { 
        status: 'CANCELLED', 
        cancellationReason: cancelModal.reason 
      });
      toast.success('Order cancelled successfully');
      setCancelModal({ isOpen: false, orderId: null, reason: '' });
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleAssignPartner = async () => {
    if (!selectedPartner) {
      toast.error('Please select a delivery partner');
      return;
    }
    try {
      await sellerApi.assignDeliveryPartner(assignModal.orderId, { deliveryPartnerId: selectedPartner });
      toast.success('Delivery partner assigned successfully');
      setAssignModal({ isOpen: false, orderId: null });
      setSelectedPartner('');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign delivery partner');
    }
  };

  const openAssignModal = (orderId) => {
    setAssignModal({ isOpen: true, orderId });
    fetchDeliveryPartners();
  };

  const tabs = [
    { id: '', label: 'All' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'ACCEPTED', label: 'Accepted' },
    { id: 'PREPARING', label: 'Preparing' },
    { id: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { id: 'CANCELLED', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer orders and dispatch</p>
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
          <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
        </div>
      ) : data.orders?.length > 0 ? (
        <div className="space-y-4">
          {data.orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
              <div 
                className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(order._id)}
              >
                <div className="flex flex-col gap-1 w-full md:w-1/4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">#{order.orderNumber}</span>
                    <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                      {formatOrderStatus(order.orderStatus)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} />
                    {dayjs(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full md:w-1/4">
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Eye size={14} className="text-gray-400" />
                    {order.userId?.name || 'Customer'}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone size={14} />
                    {order.userId?.mobile || 'N/A'}
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full md:w-1/6">
                  <div className="text-sm font-medium text-gray-900">
                    {order.items?.length || 0} Items
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <CreditCard size={14} />
                    {order.paymentMethod}
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full md:w-1/6">
                  <div className="font-bold text-lg text-primary">
                    {formatCurrency(order.grandTotal)}
                  </div>
                </div>

                <div className="flex items-center justify-end w-full md:w-auto">
                  {expandedOrders[order._id] ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedOrders[order._id] && (
                <div className="border-t border-border p-4 sm:p-5 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Package size={16} /> Order Items
                      </h4>
                      <div className="bg-white rounded-lg border border-border p-4 space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden">
                                {item.productId?.images?.[0] && (
                                  <img src={item.productId.images[0]} alt={item.productId.name} className="h-full w-full object-cover" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-gray-900">{item.productId?.name || 'Unknown Product'}</p>
                                <p className="text-xs text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
                              </div>
                            </div>
                            <div className="font-medium text-sm">
                              {formatCurrency(item.quantity * item.price)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin size={16} /> Delivery Address
                        </h4>
                        <div className="bg-white rounded-lg border border-border p-4 text-sm text-gray-600">
                          <p className="font-medium text-gray-900">{order.deliveryAddress?.fullName || order.userId?.name}</p>
                          <p>{order.deliveryAddress?.addressLine1}</p>
                          {order.deliveryAddress?.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                          <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Order Summary</h4>
                      <div className="bg-white rounded-lg border border-border p-4 space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Item Total</span>
                          <span>{formatCurrency(order.itemTotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery Fee</span>
                          <span>{formatCurrency(order.deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Platform Fee</span>
                          <span>{formatCurrency(order.platformFee)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(order.discount)}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between font-bold text-gray-900 text-base">
                          <span>Grand Total</span>
                          <span>{formatCurrency(order.grandTotal)}</span>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        {(order.orderStatus === 'PENDING' || order.orderStatus === 'PLACED') && (
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateStatus(order._id, 'ACCEPTED')} className="btn-primary flex-1 flex justify-center items-center gap-2">
                              <Check size={16} /> Accept
                            </button>
                            <button onClick={() => setCancelModal({ isOpen: true, orderId: order._id, reason: '' })} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex-1 flex justify-center items-center gap-2 transition-colors">
                              <X size={16} /> Cancel
                            </button>
                          </div>
                        )}
                        
                        {order.orderStatus === 'ACCEPTED' && (
                          <button onClick={() => handleUpdateStatus(order._id, 'PREPARING')} className="btn-secondary w-full flex justify-center items-center gap-2">
                            <Package size={16} /> Mark Preparing
                          </button>
                        )}
                        
                        {order.orderStatus === 'PREPARING' && (
                          <button onClick={() => handleUpdateStatus(order._id, 'READY_FOR_PICKUP')} className="btn-primary w-full flex justify-center items-center gap-2">
                            <Check size={16} /> Ready for Pickup
                          </button>
                        )}
                        
                        {order.orderStatus === 'READY_FOR_PICKUP' && (
                          <button onClick={() => openAssignModal(order._id)} className="btn-primary w-full flex justify-center items-center gap-2">
                            <Truck size={16} /> Assign Delivery
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
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
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-border p-12 text-center text-gray-500">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-900">No orders found</p>
          <p>Try changing your search or filter</p>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cancel Order</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for cancellation</label>
                <textarea
                  className="input-field min-h-[100px] py-2"
                  placeholder="E.g., Item out of stock"
                  value={cancelModal.reason}
                  onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setCancelModal({ isOpen: false, orderId: null, reason: '' })} className="btn-secondary">
                  Close
                </button>
                <button onClick={handleCancelOrder} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Delivery Modal */}
      {assignModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Assign Delivery Partner</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Partner</label>
                <select
                  className="input-field"
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                >
                  <option value="">-- Choose a partner --</option>
                  {deliveryPartners.map(partner => (
                    <option key={partner._id} value={partner._id}>
                      {partner.userId?.name || 'Unknown'} - {partner.vehicleNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setAssignModal({ isOpen: false, orderId: null })} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleAssignPartner} className="btn-primary">
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
