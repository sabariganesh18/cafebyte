import { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { ByteAI } from '../../services/byteAI';
import { MenuItem } from '../../types';
import { MenuItemCard } from './MenuItemCard';
import { menuData } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';

export function Home() {
  const [aiQuery, setAiQuery] = useState('');
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [reason, setReason] = useState('');
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load initial time-based recommendations
    const timeBasedRecs = ByteAI.getRecommendations('');
    setRecommendations(timeBasedRecs.items);
    setReason(timeBasedRecs.reason);

    // Load popular items
    setPopularItems(
      menuData.filter(item => item.rating >= 4.5).sort((a, b) => b.rating - a.rating).slice(0, 8)
    );
  }, []);

  const handleAISearch = () => {
    if (!aiQuery.trim()) return;
    const result = ByteAI.getRecommendations(aiQuery);
    setRecommendations(result.items);
    setReason(result.reason);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{greeting()}{user ? `, ${user.name}` : ''}!</h1>
          <p className="text-orange-100 mb-8">Welcome to CafeByte - Your AI-Powered Food Companion</p>

          {/* AI Search */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="text-orange-500" size={24} />
              <input
                type="text"
                placeholder="Ask BYTE: 'cheap spicy food', 'coffee', 'combo meal'..."
                className="flex-1 outline-none text-gray-800"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
              />
              <button
                onClick={handleAISearch}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {!user && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-orange-100">
                🎉 New user? <button onClick={() => navigate('/register')} className="underline font-semibold">Sign up</button> to unlock exclusive offers and track your orders!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-orange-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">BYTE Recommends</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{reason}</p>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4">
                {recommendations.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-72">
                    <MenuItemCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Popular Items */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Categories Quick Access */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Breakfast', emoji: '🌅', color: 'bg-yellow-100 dark:bg-yellow-900' },
              { name: 'Lunch', emoji: '🍛', color: 'bg-green-100 dark:bg-green-900' },
              { name: 'Dinner', emoji: '🍽️', color: 'bg-blue-100 dark:bg-blue-900' },
              { name: 'Snacks', emoji: '🍟', color: 'bg-purple-100 dark:bg-purple-900' },
              { name: 'Beverages', emoji: '☕', color: 'bg-orange-100 dark:bg-orange-900' },
              { name: 'Desserts', emoji: '🍰', color: 'bg-pink-100 dark:bg-pink-900' },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => navigate('/menu', { state: { category: category.name.toLowerCase() } })}
                className={`${category.color} rounded-xl p-6 flex flex-col items-center gap-2 hover:scale-105 transition`}
              >
                <span className="text-4xl">{category.emoji}</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{category.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
