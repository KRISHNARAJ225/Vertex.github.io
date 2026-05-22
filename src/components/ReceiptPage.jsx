import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderByCode, getOrder } from '../Service.js/OrderService';
import { User, MapPin, Package, CreditCard, Printer, Download, CheckCircle, Calendar, Hash, Tag, Info } from 'lucide-react';
import PremiumLoader from './PremiumLoader';

const ReceiptPage = () => {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchOrder = async () => {
      try {
        let data;
        try {
          data = await getOrderByCode(orderCode);
        } catch (e) {
          // Fallback to fetching by ID directly if code lookup fails
          data = await getOrder(orderCode);
        }
        if (!cancelled) setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        if (!cancelled) setError('Order not found or invalid QR code.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrder();
    return () => { cancelled = true; };
  }, [orderCode]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <PremiumLoader variant="receipt" />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Receipt Not Found</h2>
          <p className="text-red-500 font-medium text-sm">{error || 'Order not found'}</p>
          <p className="text-gray-400 text-xs mt-3">The order code may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const customerName = Array.isArray(order.customer) ? order.customer[0]?.name : (order.customer?.name || order.customerName);
  const customerEmail = Array.isArray(order.customer) ? order.customer[0]?.email : (order.customer?.email || order.customerEmail);
  const customerPhone = Array.isArray(order.customer) ? order.customer[0]?.phone : (order.customer?.phone || order.customerPhone);
  const shippingAddress = Array.isArray(order.customer) ? order.customer[0]?.address : (order.customer?.address || order.shippingAddress);
  
  const products = order.products || [];

  const calculateDisplayBreakdown = (o) => {
    const prods = o.products || o.orderItems || [];
    const subtotal = prods.reduce((sum, p) => sum + ((parseFloat(p.price) || 0) * (p.quantity || p.qty || 1)), 0);
    const gst = parseFloat(o.gst) > 0 ? parseFloat(o.gst) : subtotal * 0.18;
    const tax = parseFloat(o.tax) > 0 ? parseFloat(o.tax) : subtotal * 0.05;
    const discount = parseFloat(o.discount) > 0 ? parseFloat(o.discount) : prods.reduce((sum, p) => sum + (parseFloat(p.discount) || 0), 0);
    const total = subtotal + gst + tax - discount;
    return { subtotal, gst, tax, discount, total };
  };

  const bd = calculateDisplayBreakdown(order);

  return (
    <div 
      className="min-h-screen py-12 px-4 flex justify-center items-start relative overflow-hidden"
      style={{
        backgroundImage: 'url("/Login.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md z-0" />
      
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-2xl overflow-hidden border border-gray-100/50 relative z-10" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        
        {/* Branding Header */}
        <div className="px-8 pt-8 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-xl">N</span>
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter uppercase">Nexus</span>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-widest border border-green-100">
              Paid ✅
            </span>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Invoice #ORD-{String(order.id).padStart(5, '0')}</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="px-8 pt-6 pb-8 text-center border-b border-gray-50">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4 animate-bounce-subtle">
             <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Thank you!</h1>
          <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
            Hello, <span className="text-blue-600 font-bold">{customerName || 'Customer'}</span>! Your payment has been processed successfully. We're glad you chose <span className="font-bold text-gray-900">Nexus</span>! 📦
          </p>
        </div>

        {/* Main Stats Card */}
        <div className="mx-8 -mt-6 bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-6 shadow-xl shadow-gray-200 text-white flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Total Paid Amount</p>
            <h2 className="text-4xl font-black tracking-tighter">₹{bd.total.toFixed(2)}</h2>
            <p className="text-gray-400 text-xs mt-1 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {order.orderDate}
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all border border-white/10 group active:scale-95 print:hidden"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            Download Receipt
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Detailed Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-3 h-3" />
                Billed To
              </h3>
              <div className="space-y-1">
                <p className="font-bold text-gray-900">{customerName || 'N/A'}</p>
                <p className="text-sm text-gray-500">{customerEmail || 'N/A'}</p>
                <p className="text-sm text-gray-500">{customerPhone || ''}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Shipping Details
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-900 leading-relaxed font-medium">
                  {shippingAddress || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Detail Section */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              Detail Payment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Receipt Number</p>
                <p className="text-xs font-bold text-gray-900">#REC-{String(order.id).padStart(5, '0')}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Invoice Number</p>
                <p className="text-xs font-bold text-gray-900">{order.orderCode || 'N/A'}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-blue-500" />
                  {order.paymentStatus || 'CREDIT CARD'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Package className="w-3 h-3" />
              Order Items
            </h3>
            <div className="divide-y divide-gray-50 border-t border-gray-50">
              {products.map((product, index) => {
                const qty = product.quantity || product.qty || 1;
                const price = parseFloat(product.price) || 0;
                const name = product.name || product.productName || 'Unknown Product';
                return (
                  <div key={index} className="flex justify-between items-center py-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">
                        📦
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{name}</p>
                        <p className="text-xs text-gray-400 font-medium">Qty: {qty} × ₹{price.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900">₹{(price * qty).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="bg-blue-50/50 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-bold text-gray-900">₹{bd.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium text-xs">VAT / GST (18%)</span>
              <span className="font-bold text-gray-900">₹{bd.gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium text-xs">Other Taxes (5%)</span>
              <span className="font-bold text-gray-900">₹{bd.tax.toFixed(2)}</span>
            </div>
            {bd.discount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Discount</span>
                <span className="font-bold text-red-500">-₹{bd.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-blue-100 mt-2">
              <span className="text-lg font-black text-gray-900">Total Amount</span>
              <span className="text-2xl font-black text-blue-600 tracking-tighter">₹{bd.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center space-y-4 pt-4">
            <p className="text-[11px] text-gray-400 font-medium max-w-sm mx-auto leading-relaxed italic">
              "Thank you for choosing Nexus! If you have any questions about this receipt, please contact our support team." 💳
            </p>
            <div className="pt-4 border-t border-gray-50 flex justify-center gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
               <span className="text-xs font-black uppercase tracking-widest">Nexus Premium</span>
               <span className="text-xs font-black uppercase tracking-widest">Quality Service</span>
               <span className="text-xs font-black uppercase tracking-widest">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animation & Print Styles */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .min-h-screen { py-0 !important; }
          .shadow-2xl, .shadow-xl { shadow: none !important; }
          .rounded-[2rem] { border-radius: 0 !important; }
          .bg-[#f8fafc] { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default ReceiptPage;

