import { Link, useNavigate } from 'react-router';
import { Home, Menu, ShoppingCart, Package, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export function UserNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CB</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CafeByte</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </Link>

            <Link to="/menu" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
              <Menu size={20} />
              <span className="text-xs mt-1">Menu</span>
            </Link>

            <Link to="/cart" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-xs mt-1">Cart</span>
            </Link>

            <Link to="/orders" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
              <Package size={20} />
              <span className="text-xs mt-1">Orders</span>
            </Link>

            {user ? (
              <Link to="/profile" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
                <User size={20} />
                <span className="text-xs mt-1">Profile</span>
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
              >
                <User size={20} />
                <span className="text-xs mt-1">Login</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-xs mt-1">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
