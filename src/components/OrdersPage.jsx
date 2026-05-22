import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { getOrderByCode } from '../Service.js/OrderService.js';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  IconButton, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Card, 
  Paper,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { 
  ShoppingCart, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Search, 
  X, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Package, 
  User, 
  Mail, 
  Phone, 
  Save, 
  AlertTriangle 
} from 'lucide-react';

const OrdersPage = () => {
  const { orders, orderPageData, fetchOrdersPage, addOrder, updateOrder, deleteOrder, customers, products, updateProduct, updateOrderStatus, updateOrderPaymentStatus, addNotification } = useData();

  const navigate = useNavigate();
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || '{}'));
  const isAdmin = ['madhu', 'krishh', 'meera'].includes(currentUser?.name?.toLowerCase()) || currentUser?.role?.toLowerCase() === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [qrOrderDetails, setQrOrderDetails] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const emptyForm = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'PENDING',
    orderStatus: 'PENDING',
    customerId: '',
    productId: '',
    products: [{ name: '', quantity: 1, price: 0, discountPercentage: 0 }],
    gst: '0.00',
    tax: '0.00',
    globalDiscountPercentage: 0,
    discount: '0.00'
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const e = {};
    if (!data.customerId) e.customerId = 'Customer selection is required';
    if (!data.customerName?.trim()) e.customerName = 'Customer name is required';
    if (!data.shippingAddress?.trim()) e.shippingAddress = 'Shipping address is required';
    
    const validProducts = data.products.filter(p => p.productId && p.name);
    if (validProducts.length === 0) {
      e.products = 'At least one valid product is required';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounced search logic
  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(() => {
      fetchOrdersPage(currentPage - 1, itemsPerPage, searchTerm, controller.signal);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [currentPage, searchTerm, fetchOrdersPage]);

  const paymentStatuses = ['PENDING', 'SUCCESS'];
  const orderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // Automatically recalculate GST, Tax, and Discount when products or quantity change
  useEffect(() => {
    const subtotal = formData.products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.price || 0)), 0);

    // GST Formula (18%)
    const calculatedGst = subtotal * 0.18;
    // Tax Formula (5%)
    const calculatedTax = subtotal * 0.05;
    // Discount based on individual product discount percentages
    const calculatedDiscount = formData.products.reduce((sum, p) => {
        const itemTotal = p.quantity * parseFloat(p.price || 0);
        const itemDiscount = itemTotal * (parseFloat(p.discountPercentage || 0) / 100);
        return sum + itemDiscount;
    }, 0);

    setFormData(prev => {
      const subtotalForGlobal = prev.products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.price || 0)), 0);
      const globalDiscountAmount = subtotalForGlobal * (parseFloat(prev.globalDiscountPercentage || 0) / 100);
      const totalCalculatedDiscount = calculatedDiscount + globalDiscountAmount;

      const currentGst = prev.gst;
      const currentTax = prev.tax;
      const currentDiscount = prev.discount;
      
      const newGst = calculatedGst.toFixed(2);
      const newTax = calculatedTax.toFixed(2);
      // Auto-update if there's any calculated discount (product-level or global %)
      const newDiscount = totalCalculatedDiscount > 0 ? totalCalculatedDiscount.toFixed(2) : currentDiscount;

      if (
        currentGst === newGst &&
        currentTax === newTax &&
        currentDiscount === newDiscount
      ) {
        return prev;
      }
      return {
        ...prev,
        gst: newGst,
        tax: newTax,
        discount: newDiscount
      };
    });
  }, [formData.products, formData.globalDiscountPercentage]);

  const displayedOrders = orderPageData.content;

  const calculateDisplayBreakdown = (order) => {
    const products = order.products || order.orderItems || [];
    const subtotal = products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 1)), 0);
    const gst = parseFloat(order.gst) > 0 ? parseFloat(order.gst) : subtotal * 0.18;
    const tax = parseFloat(order.tax) > 0 ? parseFloat(order.tax) : subtotal * 0.05;
    // Sum discounts from individual products if top-level discount is 0
    const discount = parseFloat(order.discount) > 0 ? parseFloat(order.discount) : products.reduce((sum, p) => sum + (parseFloat(p.discount) || 0), 0);
    const total = subtotal + gst + tax - discount;
    return { subtotal, gst, tax, discount, total };
  };

  const calculateDisplayTotal = (order) => calculateDisplayBreakdown(order).total;

  const calcTotal = (fd) => {
    const subtotal = fd.products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.price || 0)), 0);
    // Total = Subtotal + GST + Tax - Discount
    const total = subtotal + parseFloat(fd.gst || 0) + parseFloat(fd.tax || 0) - parseFloat(fd.discount || 0);
    return total;
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'Order ID', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={`#ORD-${String(params.value).padStart(4, '0')}`}
          size="small"
          sx={{ fontWeight: 800, bgcolor: 'primary.lighter', color: 'primary.main', border: '1px solid', borderColor: 'primary.light' }}
        />
      )
    },
    { field: 'customerName', headerName: 'Customer Name', flex: 1, minWidth: 200 },
    { 
      field: 'orderDate', 
      headerName: 'Date', 
      width: 120,
      valueGetter: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      field: 'payment_status_display',
      headerName: 'Payment',
      width: 120,
      valueGetter: (value, row) => row.paymentStatus || 'PENDING',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          sx={{ 
            fontWeight: 900, 
            fontSize: 9, 
            bgcolor: params.value === 'SUCCESS' ? 'success.lighter' : 'error.lighter',
            color: params.value === 'SUCCESS' ? 'success.main' : 'error.main',
            border: '1px solid',
            borderColor: params.value === 'SUCCESS' ? 'success.light' : 'error.light'
          }} 
        />
      )
    },
    {
      field: 'order_status_display',
      headerName: 'Status',
      width: 120,
      valueGetter: (value, row) => row.orderStatus || 'PENDING',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          sx={{ 
            fontWeight: 900, 
            fontSize: 9, 
            bgcolor: params.value === 'DELIVERED' ? 'success.lighter' : 
                     params.value === 'PENDING' ? 'error.lighter' : 
                     params.value === 'CANCELLED' ? 'action.hover' : 'info.lighter',
            color: params.value === 'DELIVERED' ? 'success.main' : 
                   params.value === 'PENDING' ? 'error.main' : 
                   params.value === 'CANCELLED' ? 'text.secondary' : 'info.main',
            border: '1px solid',
            borderColor: params.value === 'DELIVERED' ? 'success.light' : 
                         params.value === 'PENDING' ? 'error.light' : 
                         params.value === 'CANCELLED' ? 'divider' : 'info.light'
          }} 
        />
      )
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      width: 150,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.value || 'PENDING'}
            disabled={!isAdmin || params.value === 'SUCCESS'}
            onChange={(e) => updateOrderPaymentStatus(params.row.id, e.target.value)}
            sx={{
              borderRadius: 10,
              fontSize: 10,
              fontWeight: 900,
              height: 30,
              '& .MuiSelect-select': {
                py: 0.5,
                px: 2,
                color: params.value === 'SUCCESS' ? 'success.main' : 'error.main',
                bgcolor: params.value === 'SUCCESS' ? 'success.lighter' : 'error.lighter',
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
          >
            <MenuItem value="PENDING" sx={{ color: 'error.main', fontWeight: 800, bgcolor: 'error.lighter' }}>PENDING</MenuItem>
            <MenuItem value="SUCCESS" sx={{ color: 'success.main', fontWeight: 800, bgcolor: 'success.lighter' }}>SUCCESS</MenuItem>
          </Select>
        </FormControl>
      )
    },
    {
      field: 'orderStatus',
      headerName: 'Order Status',
      width: 150,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.value || 'PENDING'}
            disabled={!isAdmin || params.value === 'DELIVERED'}
            onChange={(e) => updateOrderStatus(params.row.id, e.target.value)}
            sx={{
              borderRadius: 10,
              fontSize: 10,
              fontWeight: 900,
              height: 30,
              '& .MuiSelect-select': {
                py: 0.5,
                px: 2,
                color: params.value === 'DELIVERED' ? 'success.main' : 
                       params.value === 'CONFIRMED' ? 'info.main' : 
                       params.value === 'SHIPPED' ? '#4318FF' : 
                       params.value === 'PENDING' ? 'error.main' : 'text.secondary',
                bgcolor: params.value === 'DELIVERED' ? 'success.lighter' : 
                         params.value === 'CONFIRMED' ? 'info.lighter' : 
                         params.value === 'SHIPPED' ? alpha('#4318FF', 0.1) : 
                         params.value === 'PENDING' ? 'error.lighter' : 'action.hover',
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
          >
            <MenuItem value="PENDING" sx={{ color: 'error.main', fontWeight: 800 }}>PENDING</MenuItem>
            <MenuItem value="CONFIRMED" sx={{ color: 'info.main', fontWeight: 800 }}>CONFIRMED</MenuItem>
            <MenuItem value="SHIPPED" sx={{ color: '#4318FF', fontWeight: 800 }}>SHIPPED</MenuItem>
            <MenuItem value="DELIVERED" sx={{ color: 'success.main', fontWeight: 800 }}>DELIVERED</MenuItem>
            <MenuItem value="CANCELLED" sx={{ color: 'text.secondary', fontWeight: 800 }}>CANCELLED</MenuItem>
          </Select>
        </FormControl>
      )
    },
    {
      field: 'totalAmount',
      headerName: 'Amount',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          ₹{calculateDisplayTotal(params.row).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleViewOrder(params.row)} color="primary">
              <Eye className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => navigate(`/edit-transaction/${params.row.id}`)} color="info">
              <Edit2 className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteOrder(params.row.id)} color="error">
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  const buildPayload = (fd) => {
    const cid = fd.customerId;
    const orderItems = fd.products
      .filter(p => p.productId)
      .map(p => {
        const itemTotal = (p.quantity || 1) * parseFloat(p.price || 0);
        const productDisc = itemTotal * (parseFloat(p.discountPercentage || 0) / 100);
        const globalDisc = itemTotal * (parseFloat(fd.globalDiscountPercentage || 0) / 100);
        return {
          productId: Number(p.productId),
          quantity: Number(p.quantity) || 1,
          discount: productDisc + globalDisc,
          gstPercentage: 18
        };
      });

    return {
      customerId: Number(cid) || cid,
      customerName: fd.customerName,
      customerEmail: fd.customerEmail,
      customerPhone: fd.customerPhone,
      shippingAddress: fd.shippingAddress,
      shippingDate: fd.shippingDate,
      paymentStatus: fd.paymentStatus,
      orderStatus: fd.orderStatus,
      gst: parseFloat(fd.gst || 0),
      tax: parseFloat(fd.tax || 0),
      discount: parseFloat(fd.discount || 0),
      totalAmount: calcTotal(fd),
      orderItems: orderItems.length > 0 ? orderItems : []
    };
  };

  const handleDeleteOrder = async (id) => {
    setOrderToDelete(id);
  };

  const confirmDeleteOrder = async () => {
    const id = orderToDelete;
    const order = orders.find(o => String(o.id) === String(id));
    if (order && order.products) {
      for (const item of order.products) {
        const product = products.find(p => String(p.id) === String(item.productId));
        if (product) {
          const newQty = parseInt(product.quantity || 0) + parseInt(item.quantity || 0);
          await updateProduct(product.id, { ...product, quantity: newQty }, { localOnly: true });
        }
      }
    }
    await deleteOrder(id);
    setOrderToDelete(null);
  };

  const handleCustomerSelect = (e) => {
    const custName = e.target.value;
    const customer = customers.find(c => c.name === custName);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: customer.address ? `${customer.address}, ${customer.state || ''} ${customer.pincode || ''}`.trim() : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, customerName: custName }));
    }
  };

  const handleCustomerIdSelect = (e) => {
    const val = e.target.value;
    if (!val) {
      setFormData(prev => ({ ...prev, customerId: '', customerName: '', customerEmail: '', customerPhone: '', shippingAddress: '' }));
      return;
    }
    const customer = customers.find(c => String(c.id) === String(val));
    if (customer) {
      const name = customer.name || '';
      const email = customer.email || '';
      const phone = customer.phone || '';
      const addressParts = [customer.address, customer.state, customer.pincode].filter(p => p && p.trim());
      const fullAddress = addressParts.join(', ');

      setFormData(prev => ({
        ...prev,
        customerId: val,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: fullAddress
      }));
      setErrors(prev => ({ ...prev, customerId: '', customerName: '', shippingAddress: '' }));
    } else {
      setFormData(prev => ({ ...prev, customerId: val }));
    }
  };

  const handleProductIdSelect = (e) => {
    const val = e.target.value;
    const product = products.find(p =>
      String(p.id || '') === String(val) ||
      String(p.productId || '') === String(val) ||
      String(p.product_id || '') === String(val)
    );
    if (product) {
      const productName = product.name || product.productName || '';
      const productPrice = product.price || product.unitPrice || product.sellingPrice || 0;
      const productDiscount = product.discountPercentage || 0;
      setFormData(prev => {
        // Check if this product is already in the list
        const exists = prev.products.some(p => String(p.productId) === String(val));
        if (exists) return prev;

        // If the first row is empty, use it. Otherwise add new row.
        const isFirstEmpty = !prev.products[0]?.name && !prev.products[0]?.productId;
        if (isFirstEmpty) {
          return {
            ...prev,
            productId: val,
            products: [{ name: productName, quantity: 1, price: productPrice, discountPercentage: productDiscount, productId: val }, ...prev.products.slice(1)]
          };
        }
        return {
          ...prev,
          productId: val,
          products: [...prev.products, { name: productName, quantity: 1, price: productPrice, discountPercentage: productDiscount, productId: val }]
        };
      });
      setErrors(prev => ({ ...prev, products: '' }));
    } else {
      setFormData(prev => ({ ...prev, productId: val }));
    }
  };

  const handleViewOrder = (order) => {
    navigate(`/view-transaction/${order.id}`);
  };

  const buildQrPayload = (order, details) => {
    const base = details || order;
    const custArr = Array.isArray(base.customer) ? base.customer[0] : (base.customer || {});
    const prods = base.products || order.products || [];
    return JSON.stringify({
      orderCode: base.orderCode || order.orderCode || '',
      orderId: order.id,
      orderDate: base.orderDate || order.orderDate || '',
      customer: {
        id: custArr?.id || order.customerId || '',
        name: custArr?.name || order.customerName || '',
        email: custArr?.email || order.customerEmail || '',
        address: custArr?.address || order.shippingAddress || '',
        state: custArr?.state || '',
        pincode: custArr?.pincode || '',
      },
      products: prods.map(p => ({
        productId: p.productId,
        name: p.productName || p.name || '',
        qty: p.quantity,
        price: p.price,
        total: p.totalPrice || (p.price * p.quantity),
      })),
      totalAmount: base.finalAmount || base.totalAmount || order.totalAmount || 0,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    });
  };

  const addProductField = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', quantity: 1, price: '' }]
    });
  };

  const updateProductField = (index, field, value) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = { ...updatedProducts[index], [field]: value };
      return { ...prev, products: updatedProducts };
    });
  };

  const removeProductField = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'green';
      case 'PENDING': return 'red';
      default: return 'gray';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'green';
      case 'CONFIRMED': return 'blue';
      case 'PENDING': return 'yellow';
      case 'CANCELLED': return 'red';
      case 'SHIPPED': return 'orange'
      default: return 'gray';
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Stack spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', tracking: 'tight' }}>Transactions</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.6 }}>Manage your order transactions</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus className="w-5 h-5" />}
          onClick={() => navigate('/add-transaction')}
          sx={{ 
            borderRadius: 3, 
            px: 3, 
            py: 1.5, 
            fontWeight: 800, 
            bgcolor: 'primary.main',
            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'primary.dark', boxShadow: '0 12px 20px -4px rgba(0,0,0,0.2)' }
          }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {[
          { label: 'Total Transactions', value: orders.length.toLocaleString(), icon: ShoppingCart, color: 'primary' },
          { label: 'Pending Orders', value: orders.filter(o => (o.orderStatus || '').toUpperCase() === 'PENDING').length.toLocaleString(), icon: Calendar, color: 'warning' },
          { label: 'Paid Orders', value: orders.filter(o => o.paymentStatus === 'SUCCESS').length.toLocaleString(), icon: CreditCard, color: 'success' },
         
          { label: 'Total Revenue', value: `₹${orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: Package, color: 'secondary' }
        ].map((stat, idx) => (
          <Card 
            key={idx}
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider',
              boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)',
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 4, borderColor: `${stat.color}.light` }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${stat.color}.lighter`, color: `${stat.color}.main` }}>
                <stat.icon className="w-6 h-6" />
              </Box>
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>{stat.label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{stat.value}</Typography>
          </Card>
        ))}
      </Box>

      {/* Main Table Section */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <TextField
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="w-4 h-4 text-gray-400" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, width: { xs: '100%', sm: 320 } }
              }
            }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Transaction Status</InputLabel>
            <Select
              value={statusFilter}
              label="Transaction Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                if (e.target.value) navigate(`/transaction-status/${e.target.value}`);
              }}
              sx={{ borderRadius: 3 }}
            >
              <MenuItem value="">All Transactions</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="SUCCESS">Success</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={orderPageData.content || []}
            columns={columns}
            paginationMode="server"
            rowCount={orderPageData.totalElements || 0}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={{ page: currentPage - 1, pageSize: itemsPerPage }}
            onPaginationModelChange={(model) => setCurrentPage(model.page + 1)}
            loading={!orderPageData.content}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'action.hover',
                color: 'text.secondary',
                fontWeight: 800,
                textTransform: 'uppercase',
                fontSize: 11,
                letterSpacing: '0.1em',
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-cell': {
                borderColor: 'divider',
                fontSize: 14,
                fontWeight: 500,
                py: 1
              },
              '& .MuiDataGrid-row': {
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha('#4318FF', 0.08),
                  transform: 'translateY(-1px)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px -4px rgba(67, 24, 255, 0.1)'
                }
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 800
              }
            }}
          />
        </Box>
      </Paper>



      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(orderToDelete)}
        onClose={() => setOrderToDelete(null)}
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ p: 3 }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'error.main' }}>
            <AlertTriangle />
            <Typography>Are you sure you want to delete this transaction? This action cannot be undone.</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOrderToDelete(null)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button 
            onClick={() => {
              confirmDeleteOrder();
              addNotification({ message: 'Transaction deleted successfully', type: 'SUCCESS' });
            }} 
            variant="contained" 
            color="error" 
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </Stack>
    </Box>
  );
};

export default OrdersPage;
