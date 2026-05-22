import React, { useState, useEffect } from 'react';
import { 
  ReceiptText, 
  Search, 
  ArrowLeft, 
  CreditCard, 
  Package, 
  Eye, 
  Download,
  Filter
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Pagination from './Pagination';

const TransactionStatusPage = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const { orders, orderPageData, fetchOrdersPage, t } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounced search logic
  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(() => {
      fetchOrdersPage(currentPage - 1, itemsPerPage, searchTerm, controller.signal);
    }, 500);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [currentPage, searchTerm, fetchOrdersPage]);

  // Filter and Sort: Only chosen status, sorted by ID descending (latest first)
  const displayedOrders = (orders || [])
    .filter(o => 
      (o.paymentStatus || '').toUpperCase() === status.toUpperCase() || 
      (o.orderStatus || '').toUpperCase() === status.toUpperCase()
    )
    .sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-[#f4f7fe] dark:bg-[#1e1e2d] p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Premium Header */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-[32px] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/orders')}
                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-300 cursor-pointer group"
              >
                <ArrowLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 tracking-tight">
                  <ReceiptText className="w-8 h-8 text-blue-400" /> 
                  {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()} Transactions
                </h1>
                <p className="text-slate-300 mt-2 font-medium text-lg max-w-xl">
                  Viewing prioritized {status.toLowerCase()} transactions and related logs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#151521] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-200 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-600 transition-colors">
                <ReceiptText className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase group-hover:bg-blue-600 group-hover:text-white transition-colors">Total</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1 group-hover:text-blue-500 transition-colors">Items Found</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{orderPageData.totalElements}</h3>
          </div>

          <div className="bg-white dark:bg-[#151521] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20 hover:border-orange-200 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl group-hover:bg-orange-600 transition-colors">
                <CreditCard className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-2 py-1 rounded-md uppercase group-hover:bg-orange-600 group-hover:text-white transition-colors">Status</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1 group-hover:text-orange-500 transition-colors">{status} Count</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-orange-600 transition-colors">
              {orders.filter(o => 
                (o.paymentStatus || '').toUpperCase() === status.toUpperCase() || 
                (o.orderStatus || '').toUpperCase() === status.toUpperCase()
              ).length}
            </h3>
          </div>

          <div className="bg-white dark:bg-[#151521] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-200 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl group-hover:bg-emerald-600 transition-colors">
                <Package className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md uppercase group-hover:bg-emerald-600 group-hover:text-white transition-colors">Revenue</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1 group-hover:text-emerald-500 transition-colors">Filtered Revenue</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors">
              ₹{orders
                .filter(o => 
                  (o.paymentStatus || '').toUpperCase() === status.toUpperCase() || 
                  (o.orderStatus || '').toUpperCase() === status.toUpperCase()
                )
                .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-[#151521] rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search filtered results..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 dark:text-white rounded-xl w-80 focus:outline-none focus:ring-4 focus:ring-blue-500/5 text-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              {/* Export button removed */}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.15em]">
                  <th className="px-6 py-5">Order ID</th>
                  <th className="px-6 py-5">Customer Name</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Payment Status</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {displayedOrders.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No matching records found.</td></tr>
                ) : (
                  displayedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:outline hover:outline-2 hover:outline-blue-400 hover:-translate-y-0.5 transition-all text-sm group cursor-pointer">
                      <td className="px-6 py-4">
                        <span className="font-black text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                          #{order.orderCode || order.id.toString().slice(-4)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{order.customerEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                        {new Date(order.shippingDate || order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          (order.paymentStatus || '').toUpperCase() === 'SUCCESS'
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-slate-800 dark:text-white">
                          ₹{(Number(order.totalAmount) || 0).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-slate-50 dark:border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalItems={orderPageData.totalElements}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatusPage;
