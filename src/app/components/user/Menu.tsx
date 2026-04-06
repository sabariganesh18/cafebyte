import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Search, Filter, X } from 'lucide-react';
import { MenuItemCard } from './MenuItemCard';
import { menuData } from '../../data/mockData';
import { MenuItem } from '../../types';

export function Menu() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuData);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    veg: false,
    nonVeg: false,
    spicy: false,
    cheap: false,
  });

  const categories = [
    { id: 'all', name: 'All', emoji: '🍽️' },
    { id: 'breakfast', name: 'Breakfast', emoji: '🌅' },
    { id: 'lunch', name: 'Lunch', emoji: '🍛' },
    { id: 'dinner', name: 'Dinner', emoji: '🍽️' },
    { id: 'snacks', name: 'Snacks', emoji: '🍟' },
    { id: 'beverages', name: 'Beverages', emoji: '☕' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰' },
  ];

  useEffect(() => {
    // Check if category was passed from navigation
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location]);

  useEffect(() => {
    let items = menuData;

    // Category filter
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.includes(query))
      );
    }

    // Advanced filters
    if (filters.veg) {
      items = items.filter(item => item.isVeg);
    }
    if (filters.nonVeg) {
      items = items.filter(item => !item.isVeg);
    }
    if (filters.spicy) {
      items = items.filter(item => item.isSpicy);
    }
    if (filters.cheap) {
      items = items.filter(item => item.price < 150);
    }

    setFilteredItems(items);
  }, [selectedCategory, searchQuery, filters]);

  const clearFilters = () => {
    setFilters({ veg: false, nonVeg: false, spicy: false, cheap: false });
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for food, category, tags..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              <span>{category.emoji}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
        >
          <Filter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600">
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.veg}
                  onChange={(e) => setFilters({ ...filters, veg: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">Vegetarian</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.nonVeg}
                  onChange={(e) => setFilters({ ...filters, nonVeg: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">Non-Vegetarian</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.spicy}
                  onChange={(e) => setFilters({ ...filters, spicy: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">Spicy</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.cheap}
                  onChange={(e) => setFilters({ ...filters, cheap: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">Under ₹150</span>
              </label>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="ml-auto text-orange-500 hover:text-orange-600 flex items-center gap-1"
                >
                  <X size={16} />
                  Clear All
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">No items found matching your criteria</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
