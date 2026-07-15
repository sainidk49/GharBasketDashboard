import React, { useEffect, useState } from 'react';
import sellerApi from '../../api/sellerApi';
import StatCard from '../../components/ui/StatCard';
import { Package, ShoppingCart, IndianRupee, AlertCircle } from 'lucide-react';
import { formatCurrency, formatOrderStatus, getStatusColor } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await sellerApi.getDashboardStats();
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
        <h1 className="page-title">Store Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Revenue" 
          value={formatCurrency(stats.todayRevenue)} 
          icon={IndianRupee}
          color="success"
        />
        <StatCard 
          title="Today's Orders" 
          value={stats.todayOrders} 
          icon={ShoppingCart}
          color="primary"
          description={`${stats.pendingOrders} pending`}
        />
        <StatCard 
          title="Active Products" 
          value={stats.activeProducts} 
          icon={Package}
          color="info"
          description={`Out of ${stats.totalProducts} total`}
        />
        <StatCard 
          title="Out of Stock" 
          value={stats.outOfStockProducts} 
          icon={AlertCircle}
          color="error"
          description={`${stats.lowStockProducts} running low`}
        />
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title">Recent Orders</h2>
          <Link to="/seller/orders" className="text-sm text-primary hover:underline">View all</Link>
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

export default SellerDashboard;
