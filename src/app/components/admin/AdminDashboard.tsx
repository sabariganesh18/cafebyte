import { useState, useEffect } from 'react';
import { TrendingUp, Users, Package, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Order } from '../../types';

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('cafebyte-orders') || '[]');
    setOrders(savedOrders);

    const totalRevenue = savedOrders.reduce((sum: number, o: Order) => sum + o.finalAmount, 0);
    const pendingOrders = savedOrders.filter((o: Order) =>
      ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
    ).length;
    const completedOrders = savedOrders.filter((o: Order) => o.status === 'delivered').length;

    // Mock user count
    const totalUsers = new Set(savedOrders.map((o: Order) => o.userId)).size;

    setStats({
      totalRevenue,
      totalOrders: savedOrders.length,
      pendingOrders,
      completedOrders,
      totalUsers,
    });
  }, []);

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} />
            <TrendingUp size={24} className="text-green-200" />
          </div>
          <p className="text-green-100 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Package size={32} />
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock size={32} />
          </div>
          <p className="text-yellow-100 text-sm mb-1">Pending Orders</p>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={32} />
          </div>
          <p className="text-purple-100 text-sm mb-1">Completed Orders</p>
          <p className="text-3xl font-bold">{stats.completedOrders}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>

        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.userName} • {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-500">₹{order.finalAmount}</p>
                    <p className={`text-sm font-semibold ${
                      order.status === 'delivered' ? 'text-green-600' :
                      order.status === 'cancelled' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {order.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">No orders yet</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <Users size={48} className="mx-auto text-purple-500 mb-4" />
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-purple-500">{stats.totalUsers}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <Package size={48} className="mx-auto text-blue-500 mb-4" />
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Active Orders</h3>
          <p className="text-3xl font-bold text-blue-500">{stats.pendingOrders}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <TrendingUp size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Avg Order Value</h3>
          <p className="text-3xl font-bold text-green-500">
            ₹{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0}
          </p>
        </div>
      </div>
    </div>
  );
}
