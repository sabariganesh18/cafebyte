import { Star, Clock, Plus, Leaf } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';

interface MenuItemCardProps {
  item: MenuItem;
  showAddButton?: boolean;
}

export function MenuItemCard({ item, showAddButton = true }: MenuItemCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        {item.isVeg && (
          <div className="absolute top-2 left-2 bg-green-500 p-1 rounded">
            <Leaf size={16} className="text-white" />
          </div>
        )}
        {item.isSpicy && (
          <div className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded text-white text-xs font-semibold">
            🌶️ SPICY
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Clock size={14} />
            <span className="text-xs">{item.preparationTime} min</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-500">₹{item.price}</span>
          {showAddButton && (
            <button
              onClick={() => addToCart(item)}
              disabled={!item.available}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Plus size={18} />
              Add
            </button>
          )}
        </div>

        {!item.available && (
          <p className="text-red-500 text-sm mt-2">Currently unavailable</p>
        )}
      </div>
    </div>
  );
}
