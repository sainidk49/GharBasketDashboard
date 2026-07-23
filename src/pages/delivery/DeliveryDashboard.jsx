import React, { useEffect, useState } from 'react';
import deliveryApi from '../../api/deliveryApi';
import StatCard from '../../components/ui/StatCard';
import { Truck, CheckCircle, Package, MapPin, XCircle, Clock } from 'lucide-react';
import { formatCurrency, formatOrderStatus, getStatusColor } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const DeliveryDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await deliveryApi.getDashboardStats();
        setStats(response.data.data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse">Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Delivery Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Assigned Orders" 
          value={stats.assignedOrders || 0} 
          icon={Clock}
          color="info"
        />
        <StatCard 
          title="Accepted Orders" 
          value={stats.acceptedOrders || 0} 
          icon={CheckCircle}
          color="primary"
        />
        <StatCard 
          title="Picked Up" 
          value={stats.pickedUpOrders || 0} 
          icon={Package}
          color="warning"
        />
        <StatCard 
          title="Out for Delivery" 
          value={stats.outForDeliveryOrders || 0} 
          icon={Truck}
          color="secondary"
        />
        <StatCard 
          title="Delivered" 
          value={stats.deliveredOrders || 0} 
          icon={MapPin}
          color="success"
          description={`Today's deliveries: ${stats.todayDeliveries || 0}`}
        />
        <StatCard 
          title="Failed" 
          value={stats.failedOrders || 0} 
          icon={XCircle}
          color="error"
        />
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title">Recent Assignments</h2>
          <Link to="/delivery/orders" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="table-header">Order ID</th>
                <th className="table-header">Date</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.recentOrders?.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium text-primary">#{order.orderNumber}</td>
                  <td className="table-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="table-cell font-medium">{formatCurrency(order.grandTotal)}</td>
                  <td className="table-cell">
                    <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                      {formatOrderStatus(order.orderStatus)}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                <tr><td colSpan="4" className="text-center py-4 text-gray-500">No recent orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
