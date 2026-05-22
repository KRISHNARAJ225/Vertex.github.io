import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Save, ArrowLeft, Layers, Hash, Calendar as CalendarIcon, Tag, ShoppingBag } from 'lucide-react';
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
  InputAdornment
} from '@mui/material';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct, products, categories } = useData();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    uom: 'kg',
    salableStock: '',
    unsaleableStock: '',
    expiryDate: '',
    divisionName: '',
    batchCode: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const product = products.find(p => String(p.id) === String(id));
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        quantity: product.quantity || '',
        uom: product.uom || 'kg',
        salableStock: product.saleableStock || '',
        unsaleableStock: product.nonSaleableStock || '',
        expiryDate: product.expiryDate || '',
        divisionName: product.divisionName || '',
        batchCode: product.batchCode || '',
        imageUrl: product.imageUrl || ''
      });
    }
  }, [id, products]);

  const validate = (data) => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Product name is required';
    else {
      const isDuplicate = products.some(p => 
        p.name.toLowerCase().trim() === data.name.toLowerCase().trim() && String(p.id) !== String(id)
      );
      if (isDuplicate) e.name = 'Product with this name already exists';
    }
    if (!data.price) e.price = 'Price is required';
    else if (parseFloat(data.price) <= 0) e.price = 'Price must be greater than 0';
    if (!data.quantity) e.quantity = 'Quantity is required';
    else if (parseInt(data.quantity) <= 0) e.quantity = 'Quantity must be greater than 0';
    if (!data.uom) e.uom = 'UoM is required';
    if (!data.divisionName) e.divisionName = 'Division is required';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdateProduct = async () => {
    if (!validate(formData)) return;
    
    await updateProduct(id, {
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      uom: formData.uom,
      saleableStock: parseInt(formData.salableStock) || 0,
      nonSaleableStock: parseInt(formData.unsaleableStock) || 0,
      expiryDate: formData.expiryDate,
      divisionName: formData.divisionName,
      batchCode: formData.batchCode,
      imageUrl: formData.imageUrl
    });
    navigate('/products');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Stack spacing={5} sx={{ maxWidth: 1000, mx: 'auto' }}>
        
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
              onClick={() => navigate('/products')}
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
                INVENTORY MANAGEMENT
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 3, tracking: 'tight', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                <Package size={56} sx={{ color: alpha('#fff', 0.9) }} /> Edit Product
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: alpha('#fff', 0.8), fontWeight: 500, maxWidth: 650, lineHeight: 1.6, opacity: 0.9 }}>
                Update product specifications, adjust pricing, and manage inventory stock levels with precision.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.1)' }}>
          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Grid container spacing={4}>
              {/* Product Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tag size={16} /> Product Name *
                </Typography>
                <TextField
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  value={formData.name}
                  onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if(errors.name) setErrors({...errors, name: ''}); }}
                  placeholder="Enter product name"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>

              {/* Pricing & Qty */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingBag size={16} /> Price (₹) *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="number"
                  error={!!errors.price}
                  helperText={errors.price}
                  value={formData.price}
                  onChange={(e) => { setFormData({ ...formData, price: e.target.value }); if(errors.price) setErrors({...errors, price: ''}); }}
                  placeholder="0.00"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' }, startAdornment: <InputAdornment position="start">₹</InputAdornment> } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Hash size={16} /> Base Quantity *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="number"
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  value={formData.quantity}
                  onChange={(e) => { setFormData({ ...formData, quantity: e.target.value }); if(errors.quantity) setErrors({...errors, quantity: ''}); }}
                  placeholder="Enter base quantity"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>

              {/* UoM & Division */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Layers size={16} /> Unit of Measure *
                </Typography>
                <FormControl fullWidth error={!!errors.uom}>
                  <Select
                    value={formData.uom}
                    onChange={(e) => { setFormData({ ...formData, uom: e.target.value }); if(errors.uom) setErrors({...errors, uom: ''}); }}
                    sx={{ borderRadius: 3, bgcolor: 'action.hover' }}
                  >
                    <MenuItem value="kg">kg (Kilogram)</MenuItem>
                    <MenuItem value="ml">ml (Milliliter)</MenuItem>
                    <MenuItem value="pcs">pcs (Pieces)</MenuItem>
                  </Select>
                  {errors.uom && <FormHelperText>{errors.uom}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Layers size={16} /> Division / Category *
                </Typography>
                <FormControl fullWidth error={!!errors.divisionName}>
                  <Select
                    value={formData.divisionName}
                    displayEmpty
                    onChange={(e) => { 
                      const selName = e.target.value;
                      const selDiv = categories.find(c => c.name === selName);
                      setFormData({ 
                        ...formData, 
                        divisionName: selName,
                        batchCode: selDiv?.batchCode || formData.batchCode
                      }); 
                      if(errors.divisionName) setErrors({...errors, divisionName: ''}); 
                    }}
                    sx={{ borderRadius: 3, bgcolor: 'action.hover' }}
                  >
                    <MenuItem value="" disabled>Select division...</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.divisionName && <FormHelperText>{errors.divisionName}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Stock Management */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  Salable Stock
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.salableStock}
                  onChange={(e) => setFormData({ ...formData, salableStock: e.target.value })}
                  placeholder="0"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  Unsaleable Stock
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.unsaleableStock}
                  onChange={(e) => setFormData({ ...formData, unsaleableStock: e.target.value })}
                  placeholder="0"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>

              {/* Advanced Info */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon size={16} /> Expiry Date
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Hash size={16} /> Batch Code
                </Typography>
                <TextField
                  fullWidth
                  value={formData.batchCode}
                  onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                  placeholder="Batch Code"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/products')}
                    sx={{ py: 1.5, px: 4, borderRadius: 3, fontWeight: 800, borderColor: 'divider' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save size={18} />}
                    onClick={handleUpdateProduct}
                    sx={{ 
                      py: 1.5, 
                      px: 6, 
                      borderRadius: 3, 
                      fontWeight: 900, 
                      bgcolor: '#059669',
                      '&:hover': { bgcolor: '#047857' },
                      boxShadow: '0 8px 16px -4px rgba(5, 150, 105, 0.4)'
                    }}
                  >
                    Update Product
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default EditProductPage;
