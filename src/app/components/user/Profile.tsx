import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, LogOut, ShieldCheck } from 'lucide-react';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              {user.role === 'admin' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold mt-1">
                  <ShieldCheck size={14} />
                  Admin
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Mail size={20} className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Phone size={20} className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <User size={20} className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Access */}
        {user.role === 'admin' && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Admin Dashboard</h3>
            <p className="text-purple-100 mb-4">Access admin features and manage the platform</p>
            <button
              onClick={() => navigate('/admin')}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Go to Admin Panel
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {JSON.parse(localStorage.getItem('cafebyte-orders') || '[]').filter((o: any) => o.userId === user.id).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-orange-500">
              ₹{JSON.parse(localStorage.getItem('cafebyte-orders') || '[]')
                .filter((o: any) => o.userId === user.id)
                .reduce((sum: number, o: any) => sum + o.finalAmount, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
