import { MenuItem, AIRecommendation } from '../types';
import { menuData } from '../data/mockData';

export class ByteAI {
  // Rule-based AI assistant for food recommendations

  static getRecommendations(query: string, timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'): AIRecommendation {
    const lowerQuery = query.toLowerCase();
    let items: MenuItem[] = [];
    let reason = '';

    // Keyword detection
    if (lowerQuery.includes('cheap') || lowerQuery.includes('budget') || lowerQuery.includes('affordable')) {
      items = menuData.filter(item => item.price < 150 && item.tags.includes('cheap'));
      reason = 'Budget-friendly options under ₹150';
    }
    else if (lowerQuery.includes('spicy') || lowerQuery.includes('hot')) {
      items = menuData.filter(item => item.isSpicy);
      reason = 'Spicy dishes to heat things up';
    }
    else if (lowerQuery.includes('coffee') || lowerQuery.includes('cappuccino') || lowerQuery.includes('latte')) {
      items = menuData.filter(item => item.tags.includes('coffee'));
      reason = 'Fresh coffee beverages';
    }
    else if (lowerQuery.includes('tea') || lowerQuery.includes('chai')) {
      items = menuData.filter(item => item.tags.includes('tea'));
      reason = 'Aromatic tea options';
    }
    else if (lowerQuery.includes('combo') || lowerQuery.includes('meal')) {
      items = menuData.filter(item => item.tags.includes('combo'));
      reason = 'Complete meal combos';
    }
    else if (lowerQuery.includes('healthy') || lowerQuery.includes('salad')) {
      items = menuData.filter(item => item.tags.includes('healthy'));
      reason = 'Healthy and nutritious options';
    }
    else if (lowerQuery.includes('sweet') || lowerQuery.includes('dessert')) {
      items = menuData.filter(item => item.category === 'desserts');
      reason = 'Sweet treats and desserts';
    }
    else if (lowerQuery.includes('breakfast')) {
      items = menuData.filter(item => item.category === 'breakfast');
      reason = 'Breakfast specials';
    }
    else if (lowerQuery.includes('vegetarian') || lowerQuery.includes('veg')) {
      items = menuData.filter(item => item.isVeg);
      reason = 'Vegetarian options';
    }
    else if (lowerQuery.includes('non-veg') || lowerQuery.includes('chicken') || lowerQuery.includes('meat')) {
      items = menuData.filter(item => !item.isVeg);
      reason = 'Non-vegetarian dishes';
    }
    else if (lowerQuery.includes('popular') || lowerQuery.includes('recommended') || lowerQuery.includes('best')) {
      items = menuData.filter(item => item.rating >= 4.5).sort((a, b) => b.rating - a.rating);
      reason = 'Most popular items based on ratings';
    }
    else if (lowerQuery.includes('quick') || lowerQuery.includes('fast')) {
      items = menuData.filter(item => item.preparationTime <= 15);
      reason = 'Quick bites ready in 15 minutes or less';
    }
    else {
      // Time-based recommendations
      items = this.getTimeBasedRecommendations(timeOfDay);
      reason = this.getTimeBasedReason(timeOfDay);
    }

    // If no items found, return popular items
    if (items.length === 0) {
      items = menuData.filter(item => item.rating >= 4.5).slice(0, 5);
      reason = 'Top-rated items you might enjoy';
    }

    return {
      query,
      items: items.slice(0, 6), // Limit to 6 items
      reason,
    };
  }

  static getTimeBasedRecommendations(timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'): MenuItem[] {
    const currentTime = timeOfDay || this.getCurrentTimeOfDay();

    switch (currentTime) {
      case 'morning':
        return menuData.filter(item =>
          item.category === 'breakfast' ||
          (item.category === 'beverages' && (item.tags.includes('coffee') || item.tags.includes('tea')))
        );
      case 'afternoon':
        return menuData.filter(item =>
          item.category === 'lunch' || item.category === 'snacks'
        );
      case 'evening':
        return menuData.filter(item =>
          item.category === 'snacks' || item.category === 'beverages'
        );
      case 'night':
        return menuData.filter(item =>
          item.category === 'dinner'
        );
      default:
        return menuData.filter(item => item.rating >= 4.5);
    }
  }

  static getTimeBasedReason(timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'): string {
    const currentTime = timeOfDay || this.getCurrentTimeOfDay();

    switch (currentTime) {
      case 'morning':
        return 'Perfect breakfast to start your day';
      case 'afternoon':
        return 'Satisfying lunch options';
      case 'evening':
        return 'Light evening snacks and beverages';
      case 'night':
        return 'Hearty dinner selections';
      default:
        return 'Recommended for you';
    }
  }

  static getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  static detectFoodFromImage(imageData: string): MenuItem[] {
    // Mock image detection - in production, this would use a real ML model
    // For now, return random popular items
    const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'desserts'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    return menuData
      .filter(item => item.category === randomCategory)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }
}
