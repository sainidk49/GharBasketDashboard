import React, { useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import StatCard from '../../components/ui/StatCard';
import { Users, Store, Package, ShoppingCart, IndianRupee, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatOrderStatus, getStatusColor } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setStats(response.data.data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex gap-6 flex-wrap">Loading dashboard...</div>;
  }
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Overview of platform activity today
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Revenue" 
          value={formatCurrency(stats.todayRevenue)} 
          icon={IndianRupee}
          color="success"
          description="Total sales today"
        />
        <StatCard 
          title="Today's Orders" 
          value={stats.todayOrders} 
          icon={ShoppingCart}
          color="primary"
          description={`${stats.pendingOrders} pending processing`}
        />
        <StatCard 
          title="Active Partners" 
          value={stats.activeSellers} 
          icon={Store}
          color="warning"
          description={`Out of ${stats.totalSellers} total`}
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalUsers} 
          icon={Users}
          color="info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="table-header">Order ID</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentOrders?.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium text-primary">#{order.orderNumber}</td>
                    <td className="table-cell">{order.userId?.name || 'Unknown'}</td>
                    <td className="table-cell font-medium">{formatCurrency(order.grandTotal)}</td>
                    <td className="table-cell">
                      <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                        {formatOrderStatus(order.orderStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                  <tr><td colSpan="4" className="text-center py-4 text-gray-500">No recent orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6 text-error">
            <AlertTriangle size={20} />
            <h2 className="section-title text-error">Low Stock Alerts</h2>
          </div>
          <div className="space-y-4">
            {stats.lowStockProducts?.slice(0, 5).map(product => (
              <div key={product._id} className="flex justify-between items-center p-3 rounded-lg border border-red-100 bg-red-50/50">
                <div>
                  <p className="font-medium text-sm text-gray-800 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${product.stockQuantity === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {product.stockQuantity} left
                  </span>
                </div>
              </div>
            ))}
            {(!stats.lowStockProducts || stats.lowStockProducts.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No low stock items</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
