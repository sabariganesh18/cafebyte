import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Minus, Plus, Trash2, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { couponsData } from '../../data/mockData';
import { toast } from 'sonner';

export function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const applyCoupon = () => {
    const coupon = couponsData.find(c => c.code === couponCode.toUpperCase() && c.active);
    if (!coupon) {
      toast.error('Invalid or expired coupon code');
      return;
    }
    if (cartTotal < coupon.minAmount) {
      toast.error(`Minimum order amount ₹${coupon.minAmount} required`);
      return;
    }
    setAppliedCoupon(coupon);
    toast.success(`Coupon applied! ${coupon.discount}% off`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const discount = appliedCoupon
    ? Math.min((cartTotal * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount)
    : 0;
  const finalAmount = cartTotal - discount;

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    // Create order
    const order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      items: cart,
      totalAmount: cartTotal,
      discount,
      finalAmount,
      status: 'pending' as const,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deliveryAddress: '123 Main St',
      paymentMethod: 'razorpay' as const,
      paymentStatus: 'pending' as const,
      couponCode: appliedCoupon?.code,
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('cafebyte-orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('cafebyte-orders', JSON.stringify(orders));

    clearCart();
    toast.success('Order placed successfully!');
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={80} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Add some delicious items to get started!</p>
        <button
          onClick={() => navigate('/menu')}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-orange-500">₹{item.price}</span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Have a coupon?
              </label>
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    <Tag size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200">{appliedCoupon.code}</p>
                    <p className="text-sm text-green-600 dark:text-green-300">{appliedCoupon.discount}% off applied</p>
                  </div>
                  <button onClick={removeCoupon} className="text-red-500 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Available coupons: BYTE50, FIRST20, WEEKEND30
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Delivery Fee</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 font-semibold"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </button>

            <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
              Payment via Razorpay • 100% Secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
