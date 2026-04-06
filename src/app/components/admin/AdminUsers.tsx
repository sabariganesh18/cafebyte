import { useState, useEffect } from 'react';
import { User } from '../../types';
import { Search, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get unique users from orders
    const savedOrders = JSON.parse(localStorage.getItem('cafebyte-orders') || '[]');
    const userMap = new Map<string, User>();

    savedOrders.forEach((order: any) => {
      if (!userMap.has(order.userId)) {
        userMap.set(order.userId, {
          id: order.userId,
          name: order.userName,
          email: `${order.userName.toLowerCase().replace(' ', '.')}@example.com`,
          phone: '1234567890',
          role: 'user',
          createdAt: order.createdAt,
        });
      }
    });

    setUsers(Array.from(userMap.values()));
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserOrderCount = (userId: string) => {
    const orders = JSON.parse(localStorage.getItem('cafebyte-orders') || '[]');
    return orders.filter((o: any) => o.userId === userId).length;
  };

  const getUserTotalSpent = (userId: string) => {
    const orders = JSON.parse(localStorage.getItem('cafebyte-orders') || '[]');
    return orders
      .filter((o: any) => o.userId === userId)
      .reduce((sum: number, o: any) => sum + o.finalAmount, 0);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">User Management</h1>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Total Users</p>
          <p className="text-3xl font-bold text-purple-600">{users.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Active This Month</p>
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => Date.now() - u.createdAt < 30 * 24 * 60 * 60 * 1000).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Avg Orders/User</p>
          <p className="text-3xl font-bold text-blue-600">
            {users.length > 0
              ? (JSON.parse(localStorage.getItem('cafebyte-orders') || '[]').length / users.length).toFixed(1)
              : 0}
          </p>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                      <ShieldCheck size={12} />
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail size={16} />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar size={16} />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{getUserOrderCount(user.id)}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Orders</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">₹{getUserTotalSpent(user.id).toFixed(0)}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Spent</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
