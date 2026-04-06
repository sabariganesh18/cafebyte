import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { couponsData } from '../../data/mockData';
import { Coupon } from '../../types';
import { toast } from 'sonner';

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(couponsData);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map(coupon =>
      coupon.id === id ? { ...coupon, active: !coupon.active } : coupon
    ));
    toast.success('Coupon status updated');
  };

  const deleteCoupon = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success('Coupon deleted');
    }
  };

  const getUsagePercentage = (coupon: Coupon) => {
    return (coupon.usedCount / coupon.usageLimit) * 100;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coupon Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Create Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-gradient-to-br ${
              coupon.active
                ? 'from-orange-500 to-red-500'
                : 'from-gray-400 to-gray-500'
            } rounded-xl p-6 text-white shadow-lg relative overflow-hidden`}
          >
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 opacity-20">
              <Tag size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-2xl font-bold">{coupon.code}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  coupon.active
                    ? 'bg-green-500'
                    : 'bg-gray-500'
                }`}>
                  {coupon.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-orange-100 text-sm">Discount</p>
                  <p className="text-3xl font-bold">{coupon.discount}% OFF</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-orange-100 text-xs">Min Order</p>
                    <p className="font-semibold">₹{coupon.minAmount}</p>
                  </div>
                  <div>
                    <p className="text-orange-100 text-xs">Max Discount</p>
                    <p className="font-semibold">₹{coupon.maxDiscount}</p>
                  </div>
                </div>

                <div>
                  <p className="text-orange-100 text-xs mb-1">Usage</p>
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full transition-all"
                      style={{ width: `${getUsagePercentage(coupon)}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">
                    {coupon.usedCount} / {coupon.usageLimit} used
                  </p>
                </div>

                <div>
                  <p className="text-orange-100 text-xs">Valid Until</p>
                  <p className="text-sm">{new Date(coupon.validUntil).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleCouponStatus(coupon.id)}
                  className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 py-2 rounded-lg transition"
                >
                  {coupon.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteCoupon(coupon.id)}
                  className="bg-red-500/80 hover:bg-red-600 p-2 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Total Coupons</p>
          <p className="text-3xl font-bold text-purple-600">{coupons.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Active Coupons</p>
          <p className="text-3xl font-bold text-green-600">
            {coupons.filter(c => c.active).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Total Uses</p>
          <p className="text-3xl font-bold text-blue-600">
            {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Avg Discount</p>
          <p className="text-3xl font-bold text-orange-600">
            {coupons.length > 0
              ? Math.round(coupons.reduce((sum, c) => sum + c.discount, 0) / coupons.length)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
