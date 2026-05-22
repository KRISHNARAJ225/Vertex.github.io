import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  ArrowLeft, 
  Package, 
  Layers, 
  Hash, 
  Calendar as CalendarIcon, 
  AlertTriangle,
  Info,
  Edit2
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
  Chip,
  alpha,
  CircularProgress
} from '@mui/material';

const ViewProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useData();
  const [product, setProduct] = useState(null);
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || '{}'));
  const isAdmin = ['madhu', 'krishh', 'meera'].includes(currentUser?.name?.toLowerCase()) || currentUser?.role?.toLowerCase() === 'admin';

  useEffect(() => {
    if (!products?.length) return;
    const found = products.find(p => String(p.id) === String(id));
    if (found) {
      setProduct(found);
    }
  }, [id, products]);

  const getStockStatus = (quantity) => {
    if (quantity < 20) return { color: 'error', text: 'Low Stock' };
    if (quantity < 50) return { color: 'warning', text: 'Medium Stock' };
    return { color: 'success', text: 'In Stock' };
  };

  if (!product) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={48} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Loading Product Details...</Typography>
        </Stack>
      </Box>
    );
  }

  const stockStatus = getStockStatus(product.quantity);

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
        <Stack spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
          
          {/* Premium Header */}
          <Paper 
            sx={{ 
              p: { xs: 3, md: 4 }, 
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
                  onClick={() => navigate('/products')}
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
                    PRODUCT INFORMATION
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, tracking: 'tight', color: '#f8fafc' }}>
                    {product.name}
                  </Typography>
                </Box>
              </Stack>

              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<Edit2 size={16} />}
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    fontWeight: 900,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  Edit Product
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Product Details Container */}
          <Paper sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.1)', bgcolor: 'background.paper', p: { xs: 4, md: 6 } }}>
            <Grid container spacing={5}>
              
              {/* Product Hero Image / Thumbnail */}
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    width: '100%', 
                    pt: '100%', 
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'action.hover',
                    backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {!product.imageUrl && (
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', gap: 1 }}>
                      <Package size={64} className="opacity-40" />
                      <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.6 }}>No product image</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Product Detailed Information */}
              <Grid item xs={12} md={8}>
                <Stack spacing={4}>
                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>{product.name}</Typography>
                      <Chip 
                        label={stockStatus.text} 
                        color={stockStatus.color} 
                        size="small" 
                        sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 10 }} 
                      />
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Product ID: #{product.id}</Typography>
                  </Box>

                  <Divider />

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>PRICE</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>₹{product.price.toFixed(2)}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>CURRENT STOCK</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900 }}>
                        {product.quantity} <Typography component="span" variant="body2" sx={{ fontWeight: 800, color: 'text.secondary' }}>{product.uom}</Typography>
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>DIVISION / CATEGORY</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Layers size={16} className="text-primary" />
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>{product.divisionName || 'N/A'}</Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>BATCH CODE</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Hash size={16} className="text-info" />
                        <Typography variant="body1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{product.batchCode || 'N/A'}</Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ borderStyle: 'dashed' }} />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>SALABLE STOCK</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: 'success.main' }}>
                        {product.salableStock || 0} {product.uom}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>UNSALEABLE STOCK</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: 'error.main' }}>
                        {product.unsaleableStock || 0} {product.uom}
                      </Typography>
                    </Grid>

                    {product.expiryDate && (
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>EXPIRY DATE</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarIcon size={16} className="text-warning" />
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            {new Date(product.expiryDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                          </Typography>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>

                  <Divider />

                  {/* Stock Valuation Summary */}
                  <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid', borderColor: 'divider' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Total Inventory Valuation</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Calculated as price × total quantity</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
                      ₹{(product.price * product.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

            </Grid>

            {/* Back Button */}
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={() => navigate('/products')} 
                sx={{ 
                  borderRadius: 3, 
                  py: 1.5, 
                  px: 6, 
                  fontWeight: 900,
                  bgcolor: 'text.primary',
                  color: 'background.paper',
                  '&:hover': { bgcolor: 'text.secondary' }
                }}
              >
                Return to Products
              </Button>
            </Box>
          </Paper>

        </Stack>
      </Box>
    </Box>
  );
};

export default ViewProductPage;
