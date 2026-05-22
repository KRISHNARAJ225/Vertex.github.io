import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, ArrowLeft, ShoppingCart, Trash2, X, User, Package, Calendar, MapPin, DollarSign, Percent, Shield } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Stack, 
  TextField, 
  IconButton, 
  Grid, 
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  InputAdornment,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PremiumLoader from './PremiumLoader';

const AddTransactionPage = () => {
  const navigate = useNavigate();
  const { addOrder, customers, products, addNotification } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const calcTotal = (fd) => {
    const subtotal = fd.products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.price || 0)), 0);
    const total = subtotal + parseFloat(fd.gst || 0) + parseFloat(fd.tax || 0) - parseFloat(fd.discount || 0);
    return total;
  };

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

  const handleAddOrder = async () => {
    if (!validate(formData)) return;

    setIsSubmitting(true);
    try {
      const validProducts = formData.products.filter(p => p.productId && p.name);
      // Use first valid product's ID for the top-level productId if missing
      const finalFormData = {
        ...formData,
        productId: formData.productId || validProducts[0].productId
      };

      await addOrder({ ...buildPayload(finalFormData), orderDate: new Date().toISOString().split('T')[0] });
      addNotification('Transaction added successfully');
      setFormData(emptyForm);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        navigate('/orders');
      }, 3000);
    } catch (e) {
      addNotification('Failed to add transaction: ' + e.message);
    } finally {
      setIsSubmitting(false);
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

  const subtotal = formData.products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.price || 0)), 0);
  const total = calcTotal(formData);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {isSubmitting && <PremiumLoader variant="truck" message="Processing Order..." />}
      {showConfirmation && <PremiumLoader variant="confirmation" message="Order Placed Successfully!" />}
      <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
        
        {/* Premium Classic Banner */}
        <Paper 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            borderRadius: 8, 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          {/* Subtle Decorative Elements */}
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
          <Box sx={{ position: 'absolute', bottom: -50, left: 100, width: 150, height: 150, bgcolor: 'rgba(45, 212, 191, 0.05)', borderRadius: '50%', filter: 'blur(50px)' }} />
          
          <Stack direction="row" spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <IconButton 
              onClick={() => navigate('/orders')}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                color: 'white',
                p: 1.2,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', transform: 'translateX(-4px)' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <ArrowLeft size={18} />
            </IconButton>
            <Box>
              <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 800, letterSpacing: 3, display: 'block', mb: 0, fontSize: 9 }}>
                CHECKOUT SYSTEM
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, tracking: 'tight', color: '#f8fafc' }}>
                New Order Entry
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Stack spacing={3} sx={{ mt: 3 }}>
              
              {/* Customer Info Card */}
              <Card sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <User size={20} /> Customer Details
                </Typography>
                <Stack spacing={3} alignItems="center" sx={{ mb: 6, mt: 2 }}>
                  <Box sx={{ width: { xs: '100%', md: '65%', lg: '50%' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block', textAlign: 'center', letterSpacing: 1 }}>SELECT CUSTOMER *</Typography>
                    <FormControl fullWidth error={!!errors.customerId}>
                      <Select
                        value={formData.customerId}
                        onChange={handleCustomerIdSelect}
                        displayEmpty
                        sx={{ borderRadius: 4, bgcolor: 'action.hover', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, height: 56, '& .MuiSelect-select': { textAlign: 'center', pl: 4 } }}
                      >
                        <MenuItem value="">Choose a customer...</MenuItem>
                        {customers.map((c) => (
                          <MenuItem key={c.id} value={c.id}>{c.name} (ID: {c.id})</MenuItem>
                        ))}
                      </Select>
                      {errors.customerId && <FormHelperText sx={{ textAlign: 'center' }}>{errors.customerId}</FormHelperText>}
                    </FormControl>
                  </Box>
                  <Box sx={{ width: { xs: '100%', md: '65%', lg: '50%' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block', textAlign: 'center', letterSpacing: 1 }}>SHIPPING DATE</Typography>
                    <TextField
                      fullWidth
                      type="date"
                      value={formData.shippingDate}
                      onChange={(e) => setFormData({ ...formData, shippingDate: e.target.value })}
                      slotProps={{ input: { sx: { borderRadius: 4, bgcolor: 'action.hover', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, height: 56, textAlign: 'center' } } }}
                    />
                  </Box>
                </Stack>
                
                <Grid container spacing={2.5} justifyContent="center">
                  <Grid item xs={12} md={8} lg={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block', textAlign: 'center' }}>CUSTOMER NAME</Typography>
                    <TextField
                      fullWidth
                      value={formData.customerName}
                      placeholder="Auto-filled"
                      slotProps={{ input: { readOnly: true, sx: { borderRadius: 2.5, bgcolor: 'action.hover', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, opacity: 0.7, '& input': { textAlign: 'center' } } } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block', textAlign: 'center' }}>CUSTOMER EMAIL</Typography>
                    <TextField
                      fullWidth
                      value={formData.customerEmail}
                      placeholder="Auto-filled"
                      slotProps={{ input: { readOnly: true, sx: { borderRadius: 2.5, bgcolor: 'action.hover', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, opacity: 0.7, '& input': { textAlign: 'center' } } } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block', textAlign: 'center' }}>SHIPPING ADDRESS *</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                      placeholder="Enter full delivery address"
                      error={!!errors.shippingAddress}
                      helperText={errors.shippingAddress}
                      slotProps={{ input: { sx: { borderRadius: 2.5, bgcolor: 'action.hover', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& textarea': { textAlign: 'center' } } } }}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Order Items Card */}
              <Card sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Package size={20} /> Order Items
                  </Typography>
                  <Button 
                    startIcon={<Plus size={18} />}
                    onClick={addProductField}
                    variant="soft"
                    sx={{ borderRadius: 2, fontWeight: 800, bgcolor: alpha('#4318FF', 0.1), color: '#4318FF', '&:hover': { bgcolor: alpha('#4318FF', 0.2) } }}
                  >
                    Add Product
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ '& th': { borderBottom: '2px solid', borderColor: 'divider', fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: 11 } }}>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Disc %</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.products.map((product, index) => (
                        <TableRow key={index} sx={{ '& td': { borderBottom: '1px solid', borderColor: 'divider', py: 2 } }}>
                          <TableCell sx={{ minWidth: 240 }}>
                            <Select
                              fullWidth
                              size="small"
                              value={product.productId || ''}
                              onChange={(e) => {
                                const pid = e.target.value;
                                const p = products.find(prod => String(prod.id) === String(pid));
                                if (p) {
                                  updateProductField(index, 'name', p.name);
                                  updateProductField(index, 'price', p.price);
                                  updateProductField(index, 'productId', p.id);
                                  updateProductField(index, 'discountPercentage', p.discountPercentage || 0);
                                }
                              }}
                              displayEmpty
                              sx={{ borderRadius: 2, bgcolor: 'action.hover', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                            >
                              <MenuItem value="">Select Product...</MenuItem>
                              {products.map(p => (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              size="small"
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateProductField(index, 'quantity', parseInt(e.target.value) || 1)}
                              sx={{ width: 80, '& .MuiInputBase-root': { borderRadius: 2, bgcolor: 'action.hover', '& fieldset': { border: 'none' } } }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              size="small"
                              type="number"
                              value={product.price}
                              onChange={(e) => updateProductField(index, 'price', e.target.value)}
                              sx={{ width: 100, '& .MuiInputBase-root': { borderRadius: 2, bgcolor: 'action.hover', '& fieldset': { border: 'none' } } }}
                              slotProps={{ input: { startAdornment: <Typography variant="caption" sx={{ mr: 0.5, fontWeight: 700 }}>₹</Typography> } }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              size="small"
                              type="number"
                              value={product.discountPercentage || 0}
                              onChange={(e) => updateProductField(index, 'discountPercentage', parseFloat(e.target.value) || 0)}
                              sx={{ width: 80, '& .MuiInputBase-root': { borderRadius: 2, bgcolor: 'action.hover', '& fieldset': { border: 'none' } } }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
                              ₹{((product.quantity || 0) * parseFloat(product.price || 0)).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              color="error" 
                              onClick={() => removeProductField(index)} 
                              disabled={formData.products.length === 1}
                              sx={{ bgcolor: alpha('#ef4444', 0.05), '&:hover': { bgcolor: alpha('#ef4444', 0.1) } }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
        </Stack>

        {/* Unified Checkout Section */}
        <Card sx={{ mt: 3, p: { xs: 3, md: 4 }, borderRadius: 6, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.05)' }}>
          <Grid container spacing={4}>
            {/* Column 1: Status */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Shield className="w-5 h-5" /> Status & Settings
                </Typography>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>PAYMENT STATUS</Typography>
                    <Select
                      fullWidth
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      sx={{ borderRadius: 2.5, bgcolor: 'action.hover', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="PAID">Paid</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>ORDER STATUS</Typography>
                    <Select
                      fullWidth
                      value={formData.orderStatus}
                      onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
                      sx={{ borderRadius: 2.5, bgcolor: 'action.hover', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="PROCESSING">Processing</MenuItem>
                      <MenuItem value="SHIPPED">Shipped</MenuItem>
                      <MenuItem value="DELIVERED">Delivered</MenuItem>
                    </Select>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>GLOBAL DISCOUNT (%)</Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={formData.globalDiscountPercentage}
                      onChange={(e) => setFormData({ ...formData, globalDiscountPercentage: e.target.value })}
                      slotProps={{ input: { sx: { borderRadius: 2.5, bgcolor: 'action.hover', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }, endAdornment: <Percent size={16} /> } }}
                    />
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Column 2: Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, bgcolor: alpha('#4318FF', 0.03), border: '1px solid', borderColor: alpha('#4318FF', 0.1) }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: 'primary.main' }}>Order Summary</Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Subtotal</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>GST (18%)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#05CD99' }}>+ ₹{formData.gst}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Tax (5%)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#05CD99' }}>+ ₹{formData.tax}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Discount</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#ef4444' }}>- ₹{formData.discount}</Typography>
                  </Box>
                  <Divider sx={{ my: 1, borderStyle: 'dashed', borderColor: alpha('#4318FF', 0.2) }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Grand Total</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>₹{total.toFixed(2)}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Column 3: Final Actions */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, bgcolor: alpha('#4318FF', 0.03), border: '1px solid', borderColor: alpha('#4318FF', 0.1), display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: 'primary.main', textAlign: 'center' }}>Finalize Order</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'center', mb: 3 }}>
                    Review all items and calculations before completing the transaction.
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Save size={20} />}
                    onClick={handleAddOrder}
                    disabled={isSubmitting}
                    sx={{ 
                      py: 2, 
                      borderRadius: 3, 
                      fontWeight: 900, 
                      fontSize: 16,
                      textTransform: 'none',
                      bgcolor: '#4318FF',
                      '&:hover': { bgcolor: '#3311CC' },
                      boxShadow: '0 8px 20px -4px rgba(67, 24, 255, 0.4)'
                    }}
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Order'}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/orders')}
                    sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: 16, textTransform: 'none', bgcolor: 'white', borderColor: 'divider' }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};

export default AddTransactionPage;
