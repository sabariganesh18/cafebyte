import { Link } from 'react-router';
import { LayoutDashboard, Menu, Package, Users, Tag, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';

export function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">CB</span>
            </div>
            <div>
              <span className="text-xl font-bold">CafeByte Admin</span>
              <p className="text-xs text-purple-200">Management Portal</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2 hover:text-purple-200 transition">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>

            <Link to="/admin/menu" className="flex items-center gap-2 hover:text-purple-200 transition">
              <Menu size={20} />
              <span>Menu</span>
            </Link>

            <Link to="/admin/orders" className="flex items-center gap-2 hover:text-purple-200 transition">
              <Package size={20} />
              <span>Orders</span>
            </Link>

            <Link to="/admin/users" className="flex items-center gap-2 hover:text-purple-200 transition">
              <Users size={20} />
              <span>Users</span>
            </Link>

            <Link to="/admin/coupons" className="flex items-center gap-2 hover:text-purple-200 transition">
              <Tag size={20} />
              <span>Coupons</span>
            </Link>

            <button onClick={handleLogout} className="flex items-center gap-2 hover:text-purple-200 transition">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
