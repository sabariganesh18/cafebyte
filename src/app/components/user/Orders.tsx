import { useState, useEffect } from 'react';
import { Clock, Package, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import { Order } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { jsPDF } from 'jspdf';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const savedOrders = JSON.parse(localStorage.getItem('cafebyte-orders') || '[]');
    const userOrders = savedOrders.filter((o: Order) => o.userId === user.id);
    setOrders(userOrders);
  }, [user, navigate]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'preparing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} />;
      case 'confirmed':
      case 'preparing':
        return <Package size={20} />;
      case 'ready':
      case 'delivered':
        return <CheckCircle size={20} />;
      case 'cancelled':
        return <XCircle size={20} />;
    }
  };

  const getProgress = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'confirmed':
        return 50;
      case 'preparing':
        return 75;
      case 'ready':
        return 90;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };

  const downloadInvoice = (order: Order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('CafeByte Invoice', 20, 20);

    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 20, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 35);
    doc.text(`Customer: ${order.userName}`, 20, 40);

    // Items
    doc.setFontSize(12);
    doc.text('Items:', 20, 55);

    let y = 65;
    order.items.forEach((item) => {
      doc.setFontSize(10);
      doc.text(`${item.name} x${item.quantity}`, 20, y);
      doc.text(`₹${item.price * item.quantity}`, 150, y);
      y += 7;
    });

    // Total
    y += 10;
    doc.line(20, y, 190, y);
    y += 10;
    doc.text(`Subtotal:`, 20, y);
    doc.text(`₹${order.totalAmount}`, 150, y);
    y += 7;

    if (order.discount > 0) {
      doc.text(`Discount:`, 20, y);
      doc.text(`-₹${order.discount}`, 150, y);
      y += 7;
    }

    doc.setFontSize(12);
    doc.text(`Total:`, 20, y);
    doc.text(`₹${order.finalAmount}`, 150, y);

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your order!', 20, y + 20);

    doc.save(`CafeByte-Invoice-${order.id}.pdf`);
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package size={80} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Start ordering to see your order history!</p>
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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Order #{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-500">₹{order.finalAmount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {order.status !== 'cancelled' && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgress(order.status)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <span>Pending</span>
                  <span>Confirmed</span>
                  <span>Preparing</span>
                  <span>Ready</span>
                  <span>Delivered</span>
                </div>
              </div>
            )}

            {/* Items Preview */}
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {order.items.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      +{order.items.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <Eye size={18} />
                View Details
              </button>
              <button
                onClick={() => downloadInvoice(order)}
                className="py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
              >
                <Download size={18} />
                Invoice
              </button>
            </div>

            {/* Order Details */}
            {selectedOrder?.id === order.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount ({order.couponCode})</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{order.finalAmount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
