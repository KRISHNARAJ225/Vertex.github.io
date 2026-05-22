import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, ShoppingCart, Plus, Trash2, User, Package, Calendar, MapPin, DollarSign, Percent, Mail, Info, Shield } from 'lucide-react';
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
  alpha,
  InputAdornment,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@mui/material';
import PremiumLoader from './PremiumLoader';

const EditTransactionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, customers, products, updateOrder, addNotification } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || '{}'));
  const isAdmin = ['madhu', 'krishh', 'meera'].includes(currentUser?.name?.toLowerCase()) || currentUser?.role?.toLowerCase() === 'admin';

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingDate: '',
    paymentStatus: 'PENDING',
    orderStatus: 'PENDING',
    customerId: '',
    productId: '',
    products: [],
    gst: '0.00',
    tax: '0.00',
    globalDiscountPercentage: 0,
    discount: '0.00'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const order = orders.find(o => String(o.id) === String(id));
    if (order) {
      const orderProds = (order.products || order.orderItems || []).map(item => ({
        productId: item.productId,
        name: item.name || item.productName || (products.find(p => String(p.id) === String(item.productId))?.name || ''),
        quantity: item.quantity || 1,
        price: item.price || (products.find(p => String(p.id) === String(item.productId))?.price || 0),
        discountPercentage: item.discountPercentage || 0,
        uom: item.uom || ''
      }));

      setFormData({
        customerName: order.customerName || '',
        customerEmail: order.customerEmail || '',
        customerPhone: order.customerPhone || '',
        shippingAddress: order.shippingAddress || '',
        shippingDate: order.shippingDate || order.orderDate || '',
        paymentStatus: order.paymentStatus || 'PENDING',
        orderStatus: order.orderStatus || 'PENDING',
        customerId: order.customerId || '',
        productId: orderProds[0]?.productId || '',
        products: orderProds,
        gst: (order.gst || 0).toFixed(2),
        tax: (order.tax || 0).toFixed(2),
        globalDiscountPercentage: order.globalDiscountPercentage || 0,
        discount: (order.discount || 0).toFixed(2)
      });
    }
  }, [id, orders, products]);

  // Recalculate totals
  useEffect(() => {
    const subtotal = formData.products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.price || 0)), 0);
    const calculatedGst = subtotal * 0.18;
    const calculatedTax = subtotal * 0.05;
    const calculatedDiscount = formData.products.reduce((sum, p) => {
        const itemTotal = p.quantity * parseFloat(p.price || 0);
        const itemDiscount = itemTotal * (parseFloat(p.discountPercentage || 0) / 100);
        return sum + itemDiscount;
    }, 0);

    setFormData(prev => {
      const subtotalForGlobal = prev.products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.price || 0)), 0);
      const globalDiscountAmount = subtotalForGlobal * (parseFloat(prev.globalDiscountPercentage || 0) / 100);
      const totalCalculatedDiscount = calculatedDiscount + globalDiscountAmount;

      return {
        ...prev,
        gst: calculatedGst.toFixed(2),
        tax: calculatedTax.toFixed(2),
        discount: totalCalculatedDiscount.toFixed(2)
      };
    });
  }, [formData.products, formData.globalDiscountPercentage]);

  const validate = (data) => {
    const e = {};
    if (!data.customerId) e.customerId = 'Customer selection is required';
    if (!data.shippingAddress?.trim()) e.shippingAddress = 'Shipping address is required';
    if (data.products.length === 0) e.products = 'At least one product is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdateOrder = async () => {
    if (!validate(formData)) return;
    setIsSubmitting(true);
    try {
      const subtotal = formData.products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.price || 0)), 0);
      const totalAmount = subtotal + parseFloat(formData.gst) + parseFloat(formData.tax) - parseFloat(formData.discount);

      const payload = {
        ...formData,
        gst: parseFloat(formData.gst),
        tax: parseFloat(formData.tax),
        discount: parseFloat(formData.discount),
        totalAmount,
        orderItems: formData.products.map(p => ({
          productId: Number(p.productId),
          quantity: Number(p.quantity),
          discount: (p.quantity * p.price) * (p.discountPercentage / 100),
          gstPercentage: 18
        }))
      };
      await updateOrder(id, payload);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        navigate('/orders');
      }, 3000);
    } catch (e) {
      addNotification('Failed to update: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProductField = (index, field, value) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = { ...updatedProducts[index], [field]: value };
      return { ...prev, products: updatedProducts };
    });
  };

  const addProductField = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productId: '', name: '', quantity: 1, price: 0, discountPercentage: 0 }]
    }));
  };

  const removeProductField = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const subtotal = formData.products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.price || 0)), 0);
  const total = subtotal + parseFloat(formData.gst) + parseFloat(formData.tax) - parseFloat(formData.discount);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      position: 'relative',
      backgroundImage: 'url("/Login.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        zIndex: 0
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 2, md: 4 } }}>
      {isSubmitting && <PremiumLoader variant="truck" message="Updating Order..." />}
      {showConfirmation && <PremiumLoader variant="confirmation" message="Order Updated Successfully!" />}
      <Stack spacing={5} sx={{ maxWidth: 1600, mx: 'auto' }}>
        
        {/* Signature Modern Banner */}
        <Paper 
          sx={{ 
            p: { xs: 5, md: 8 }, 
            borderRadius: 8, 
            background: 'linear-gradient(135deg, #4318FF 0%, #3B82F6 50%, #2DD4BF 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 48px -12px rgba(67, 24, 255, 0.35)',
          }}
        >
          {/* Abstract Glassmorphism Shapes */}
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />
          <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <Box sx={{ position: 'absolute', top: '20%', left: '30%', width: 100, height: 100, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', filter: 'blur(40px)' }} />
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={5} alignItems={{ md: 'center' }} sx={{ position: 'relative', zIndex: 1 }}>
            <IconButton 
              onClick={() => navigate('/orders')}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(12px)', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 5,
                color: 'white',
                p: 2.5,
                width: 'fit-content',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', transform: 'scale(1.1) rotate(-5deg)' },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <ArrowLeft size={28} />
            </IconButton>
            <Box>
              <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 900, letterSpacing: 3, display: 'block', mb: 1 }}>
                ORDER MANAGEMENT
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 3, tracking: 'tight', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                <ShoppingCart size={56} sx={{ color: alpha('#fff', 0.9) }} /> Edit Transaction
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: alpha('#fff', 0.8), fontWeight: 500, maxWidth: 650, lineHeight: 1.6, opacity: 0.9 }}>
                Modify order details, update multiple items, adjust shipping addresses, and finalize financial records.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Stack spacing={4}>
          {/* Section 1: Customer & Logistics */}
          <Paper sx={{ p: 5, borderRadius: 8, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -12px rgba(0,0,0,0.05)' }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 2 }}>
              <User size={24} className="text-primary" /> Customer & Logistics
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>SELECTED CUSTOMER</Typography>
                <TextField
                  fullWidth
                  value={`${formData.customerName} (ID: ${formData.customerId})`}
                  slotProps={{ input: { readOnly: true, sx: { borderRadius: 4, bgcolor: 'action.hover', fontWeight: 700 } } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>SHIPPING DATE</Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={formData.shippingDate}
                  onChange={(e) => setFormData({ ...formData, shippingDate: e.target.value })}
                  slotProps={{ input: { sx: { borderRadius: 4 } } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>CONTACT EMAIL</Typography>
                <TextField
                  fullWidth
                  value={formData.customerEmail}
                  slotProps={{ input: { readOnly: true, sx: { borderRadius: 4, bgcolor: 'action.hover', fontWeight: 600 } } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>SHIPPING ADDRESS</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Enter full shipping destination"
                  slotProps={{ input: { sx: { borderRadius: 4 } } }}
                  error={!!errors.shippingAddress}
                  helperText={errors.shippingAddress}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Section 2: Order Items */}
          <Paper sx={{ p: 5, borderRadius: 8, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -12px rgba(0,0,0,0.05)' }}>
            <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Package size={24} className="text-primary" /> Order Items
              </Typography>
              <Button 
                startIcon={<Plus size={18} />}
                onClick={addProductField}
                variant="soft"
                sx={{ borderRadius: 4, fontWeight: 900, px: 3, py: 1.2, bgcolor: alpha('#4318FF', 0.1), color: '#4318FF', '&:hover': { bgcolor: alpha('#4318FF', 0.2) } }}
              >
                Add Item
              </Button>
            </Stack>

            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '2px solid', borderColor: 'divider', fontWeight: 900, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1.5, py: 2 } }}>
                    <TableCell>Product Specification</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Discount %</TableCell>
                    <TableCell align="right">Net Amount</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.products.map((product, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: alpha('#4318FF', 0.02) } }}>
                      <TableCell sx={{ minWidth: 300 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={product.productId || ''}
                            onChange={(e) => {
                              const pid = e.target.value;
                              const p = products.find(prod => String(prod.id) === String(pid));
                              if (p) {
                                updateProductField(index, 'productId', p.id);
                                updateProductField(index, 'name', p.name);
                                updateProductField(index, 'price', p.price);
                                updateProductField(index, 'discountPercentage', p.discountPercentage || 0);
                              }
                            }}
                            sx={{ borderRadius: 3, fontWeight: 700 }}
                          >
                            <MenuItem value=""><em>Select Product...</em></MenuItem>
                            {products.map(p => (
                              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={product.quantity}
                          onChange={(e) => updateProductField(index, 'quantity', parseInt(e.target.value) || 1)}
                          sx={{ width: 90, '& .MuiInputBase-root': { borderRadius: 3, fontWeight: 800, textAlign: 'center' } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProductField(index, 'price', e.target.value)}
                          sx={{ width: 120, '& .MuiInputBase-root': { borderRadius: 3, fontWeight: 800 } }}
                          slotProps={{ input: { startAdornment: <Typography variant="caption" sx={{ mr: 1, fontWeight: 900 }}>₹</Typography> } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={product.discountPercentage || 0}
                          onChange={(e) => updateProductField(index, 'discountPercentage', parseFloat(e.target.value) || 0)}
                          sx={{ width: 90, '& .MuiInputBase-root': { borderRadius: 3, fontWeight: 800 } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>
                          ₹{((product.quantity || 0) * parseFloat(product.price || 0)).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {formData.products.length > 1 && (
                          <IconButton color="error" onClick={() => removeProductField(index)} sx={{ bgcolor: 'error.lighter', '&:hover': { bgcolor: 'error.light' } }}>
                            <Trash2 size={18} />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Section 3: Finalization Grid */}
          <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
            {/* Status & Settings */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 5, borderRadius: 8, height: '100%', border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Shield size={22} className="text-primary" /> Workflow Status
                </Typography>
                <Stack spacing={4} sx={{ flex: 1 }}>
                  <FormControl fullWidth disabled={!isAdmin}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', mb: 1, display: 'block' }}>ORDER PROGRESSION</Typography>
                    <Select
                      value={formData.orderStatus}
                      onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
                      sx={{ 
                        borderRadius: 4, 
                        fontWeight: 800,
                        '& .MuiSelect-select': {
                          color: formData.orderStatus === 'COMPLETED' ? 'success.main' : 
                                 formData.orderStatus === 'CANCELLED' ? 'error.main' : 'warning.main',
                          bgcolor: formData.orderStatus === 'COMPLETED' ? 'success.lighter' : 
                                   formData.orderStatus === 'CANCELLED' ? 'error.lighter' : 'warning.lighter',
                        }
                      }}
                    >
                      <MenuItem value="PENDING" sx={{ color: 'warning.main', fontWeight: 800 }}>PENDING</MenuItem>
                      <MenuItem value="COMPLETED" sx={{ color: 'success.main', fontWeight: 800 }}>COMPLETED</MenuItem>
                      <MenuItem value="CANCELLED" sx={{ color: 'error.main', fontWeight: 800 }}>CANCELLED</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth disabled={!isAdmin}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', mb: 1, display: 'block' }}>SETTLEMENT STATUS</Typography>
                    <Select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      sx={{ 
                        borderRadius: 4, 
                        fontWeight: 800,
                        '& .MuiSelect-select': {
                          color: formData.paymentStatus === 'PAID' ? 'success.main' : 
                                 formData.paymentStatus === 'FAILED' ? 'error.main' : 'warning.main',
                          bgcolor: formData.paymentStatus === 'PAID' ? 'success.lighter' : 
                                   formData.paymentStatus === 'FAILED' ? 'error.lighter' : 'warning.lighter',
                        }
                      }}
                    >
                      <MenuItem value="PENDING" sx={{ color: 'warning.main', fontWeight: 800 }}>PENDING</MenuItem>
                      <MenuItem value="PAID" sx={{ color: 'success.main', fontWeight: 800 }}>PAID</MenuItem>
                      <MenuItem value="FAILED" sx={{ color: 'error.main', fontWeight: 800 }}>FAILED</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 5, borderRadius: 8, height: '100%', border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Info size={22} className="text-primary" /> Financial Summary
                </Typography>
                <Stack spacing={2.5}>
                  {[
                    { label: 'Subtotal', value: subtotal, color: 'text.primary' },
                    { label: 'GST (18%)', value: parseFloat(formData.gst), prefix: '+', color: 'text.secondary' },
                    { label: 'Tax (5%)', value: parseFloat(formData.tax), prefix: '+', color: 'text.secondary' },
                    { label: 'Total Discount', value: parseFloat(formData.discount), prefix: '-', color: 'error.main' },
                  ].map((row, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 13 }}>{row.label}</Typography>
                      <Typography sx={{ fontWeight: 800, color: row.color }}>
                        {row.prefix || ''} ₹{row.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>Grand Total</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: -1 }}>
                      ₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Finalize Order */}
            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: 5, 
                  borderRadius: 8, 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Complete Update</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mb: 4, maxWidth: 240 }}>
                  Review all items and addresses before confirming the changes to this transaction.
                </Typography>
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save size={24} />}
                    onClick={handleUpdateOrder}
                    disabled={isSubmitting}
                    sx={{ 
                      py: 2.5, 
                      borderRadius: 5, 
                      fontWeight: 900, 
                      fontSize: 18,
                      bgcolor: '#4318FF',
                      '&:hover': { bgcolor: '#3B15E6', transform: 'scale(1.02)' },
                      transition: 'all 0.3s'
                    }}
                  >
                    {isSubmitting ? 'SAVING...' : 'UPDATE ORDER'}
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => navigate('/orders')}
                    sx={{ color: 'white', opacity: 0.6, fontWeight: 800, '&:hover': { opacity: 1 } }}
                  >
                    DISCARD CHANGES
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
      </Box>
    </Box>
  );
};

export default EditTransactionPage;
