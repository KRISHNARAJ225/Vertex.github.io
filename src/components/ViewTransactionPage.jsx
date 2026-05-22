import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  ArrowLeft, 
  ShoppingCart, 
  User, 
  Package, 
  Calendar, 
  MapPin, 
  Printer, 
  Mail, 
  Phone, 
  Percent, 
  Shield 
} from 'lucide-react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Stack, 
  IconButton, 
  Grid, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Chip,
  alpha,
  CircularProgress
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';

const ViewTransactionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useData();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orders?.length) return;
    const found = orders.find(o => String(o.id) === String(id));
    if (found) {
      setOrder(found);
    }
  }, [id, orders]);

  const calculateDisplayBreakdown = (o) => {
    const products = o.products || o.orderItems || [];
    const subtotal = products.reduce((sum, p) => sum + ((parseFloat(p.price || 0)) * (p.quantity || 1)), 0);
    const gst = parseFloat(o.gst) > 0 ? parseFloat(o.gst) : subtotal * 0.18;
    const tax = parseFloat(o.tax) > 0 ? parseFloat(o.tax) : subtotal * 0.05;
    const discount = parseFloat(o.discount) > 0 ? parseFloat(o.discount) : products.reduce((sum, p) => sum + (parseFloat(p.discount) || 0), 0);
    const total = subtotal + gst + tax - discount;
    return { subtotal, gst, tax, discount, total };
  };

  if (!order) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={48} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Loading Transaction...</Typography>
        </Stack>
      </Box>
    );
  }

  const bd = calculateDisplayBreakdown(order);

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
        <Stack spacing={4} sx={{ maxWidth: 1300, mx: 'auto' }}>
          
          {/* Premium Classic Banner */}
          <Paper 
            sx={{ 
              p: { xs: 2, md: 3 }, 
              borderRadius: 6, 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
            <Box sx={{ position: 'absolute', bottom: -50, left: 100, width: 150, height: 150, bgcolor: 'rgba(45, 212, 191, 0.05)', borderRadius: '50%', filter: 'blur(50px)' }} />
            
            <Stack direction="row" spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1, justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={3} alignItems="center">
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
                    TRANSACTION DETAILED VIEW
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, tracking: 'tight', color: '#f8fafc' }}>
                    Order ID: #ORD-{String(order.id).padStart(4, '0')}
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                startIcon={<Printer size={16} />}
                onClick={() => navigate(`/receipt/${order.orderCode || order.id}`)}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 3,
                  fontWeight: 900,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                Print Invoice
              </Button>
            </Stack>
          </Paper>

          <Grid container spacing={3}>
            {/* Left Column - Details */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                
                {/* Customer Details */}
                <Card sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', bgcolor: 'background.paper' }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <User size={20} /> Customer Details
                  </Typography>
                  
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>CUSTOMER NAME</Typography>
                      <Paper sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }} elevation={0}>
                        <User size={16} className="text-primary" />
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{order.customerName || 'N/A'}</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>CUSTOMER EMAIL</Typography>
                      <Paper sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }} elevation={0}>
                        <Mail size={16} className="text-info" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.customerEmail || 'no-email@nexus.com'}</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>CUSTOMER PHONE</Typography>
                      <Paper sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }} elevation={0}>
                        <Phone size={16} className="text-success" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.customerPhone || 'N/A'}</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>SHIPPING DATE</Typography>
                      <Paper sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }} elevation={0}>
                        <Calendar size={16} className="text-warning" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {order.shippingDate ? new Date(order.shippingDate).toLocaleDateString() : new Date(order.orderDate).toLocaleDateString()}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>SHIPPING ADDRESS</Typography>
                      <Paper sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }} elevation={0}>
                        <MapPin size={16} className="text-error" style={{ marginTop: 2 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.shippingAddress || 'N/A'}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Card>

                {/* Products Table */}
                <Card sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', bgcolor: 'background.paper' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Package size={20} /> Order Items
                  </Typography>

                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 900 }}>Product</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 900 }}>Qty</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 900 }}>Price</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 900 }}>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(order.products || []).map((p, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name || p.productName}</Typography>
                              {p.discountPercentage > 0 && (
                                <Chip label={`${p.discountPercentage}% off`} color="error" size="small" sx={{ fontWeight: 800, fontSize: 8, height: 16, mt: 0.5 }} />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={`${p.quantity} pcs`} size="small" sx={{ fontWeight: 800, fontSize: 10 }} />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{parseFloat(p.price || 0).toFixed(2)}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{(p.quantity * parseFloat(p.price || 0)).toFixed(2)}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, border: '2px dashed', borderColor: 'divider', borderRadius: 3, bgcolor: 'action.hover', maxWidth: 160, mx: 'auto' }}>
                    <QRCodeCanvas value={`${window.location.origin}/receipt/${order.orderCode || order.id}`} size={110} level="H" />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mt: 1, textAlign: 'center' }}>DIGITAL RECEIPT QR</Typography>
                  </Box>
                </Card>

              </Stack>
            </Grid>

            {/* Right Column - Status and Totals */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3} sx={{ height: '100%' }}>
                
                {/* Status Options */}
                <Card sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', bgcolor: 'background.paper' }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Shield className="w-5 h-5" /> Settings & Status
                  </Typography>
                  
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>PAYMENT STATUS</Typography>
                      <Chip 
                        label={order.paymentStatus} 
                        color={order.paymentStatus === 'SUCCESS' ? 'success' : 'error'}
                        sx={{ fontWeight: 900, textTransform: 'uppercase', width: '100%', py: 2.5, borderRadius: 2.5 }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>ORDER STATUS</Typography>
                      <Chip 
                        label={order.orderStatus || 'PENDING'} 
                        color={order.orderStatus === 'DELIVERED' ? 'success' : 'info'}
                        sx={{ fontWeight: 900, textTransform: 'uppercase', width: '100%', py: 2.5, borderRadius: 2.5 }}
                      />
                    </Box>



                    {parseFloat(order.globalDiscountPercentage || 0) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Global Discount</Typography>
                        <Chip icon={<Percent size={12} />} label={`${order.globalDiscountPercentage}%`} size="small" color="error" sx={{ fontWeight: 800 }} />
                      </Box>
                    )}
                  </Stack>
                </Card>

                {/* Checkout Summary Details */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: alpha('#4318FF', 0.03), border: '1px solid', borderColor: alpha('#4318FF', 0.1), display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: 'primary.main' }}>Order Summary</Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Subtotal</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{bd.subtotal.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>GST (18%)</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#05CD99' }}>+ ₹{bd.gst.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Tax (5%)</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#05CD99' }}>+ ₹{bd.tax.toFixed(2)}</Typography>
                      </Box>
                      {bd.discount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Discount</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#ef4444' }}>- ₹{bd.discount.toFixed(2)}</Typography>
                        </Box>
                      )}
                      <Divider sx={{ my: 1, borderStyle: 'dashed', borderColor: alpha('#4318FF', 0.2) }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Grand Total</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>₹{bd.total.toFixed(2)}</Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ mt: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="inherit"
                      onClick={() => navigate('/orders')}
                      sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: 16, textTransform: 'none', bgcolor: 'white', borderColor: 'divider' }}
                    >
                      Return to Transactions
                    </Button>
                  </Box>
                </Paper>

              </Stack>
            </Grid>
          </Grid>

        </Stack>
      </Box>
    </Box>
  );
};

export default ViewTransactionPage;
