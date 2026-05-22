import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct, products, categories } = useData();

  const emptyForm = {
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
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [suggestedImages, setSuggestedImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Simulated image fetcher - in a real app, this would call an image search API
  const fetchSuggestedImages = (name) => {
    if (!name || name.length < 3) return;
    setLoadingImages(true);
    // Mocking high-quality product images based on keywords from LoremFlickr
    setTimeout(() => {
      const query = encodeURIComponent(name);
      const mocks = [
        `https://loremflickr.com/400/400/${query}?lock=1`,
        `https://loremflickr.com/400/400/${query}?lock=2`,
        `https://loremflickr.com/400/400/${query}?lock=3`,
        `https://loremflickr.com/400/400/${query}?lock=4`
      ];
      setSuggestedImages(mocks);
      setLoadingImages(false);
    }, 1200);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.name?.trim().length > 2) {
        fetchSuggestedImages(formData.name);
      } else {
        setSuggestedImages([]);
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [formData.name]);

  const validate = (data) => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Product name is required';
    else {
      const isDuplicate = products.some(p => 
        p.name.toLowerCase().trim() === data.name.toLowerCase().trim()
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

  const handleAddProduct = () => {
    if (!validate(formData)) return;
    
    addProduct({
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Stack spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
        
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
                CATALOGUE MANAGEMENT
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, tracking: 'tight', color: '#f8fafc' }}>
                New Product Creation
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: 8, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.1)', bgcolor: 'background.paper' }}>
          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Grid container spacing={4}>
              {/* Product Info */}
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tag size={16} /> Product Name *
                  </Typography>
                  {formData.name && (
                    <Button 
                      size="small" 
                      onClick={() => fetchSuggestedImages(formData.name)}
                      disabled={loadingImages}
                      sx={{ fontSize: 10, fontWeight: 700, textTransform: 'none' }}
                    >
                      {loadingImages ? 'Searching...' : 'Find Product Images'}
                    </Button>
                  )}
                </Stack>
                <TextField
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  placeholder="e.g. Premium Basmati Rice"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  slotProps={{
                    input: {
                      sx: { borderRadius: 4, bgcolor: 'action.hover', border: 'none' }
                    }
                  }}
                />

              </Grid>

              {/* Pricing & Initial Qty */}
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
                  placeholder="Auto-generated if empty"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>

              {/* Image Selection Section moved to bottom */}
              <Grid item xs={12}>
                {(suggestedImages.length > 0 || loadingImages) && (
                  <Box sx={{ mt: 2, p: 3, bgcolor: 'action.hover', borderRadius: 6, border: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'block', color: 'text.secondary' }}>
                      SELECT PRODUCT IMAGE
                    </Typography>
                    <Grid container spacing={2}>
                      {loadingImages ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <Grid item xs={6} sm={3} key={i}>
                            <Box sx={{ pt: '100%', bgcolor: 'action.disabledBackground', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                          </Grid>
                        ))
                      ) : (
                        suggestedImages.map((img, i) => (
                          <Grid item xs={6} sm={3} key={i}>
                            <Box 
                              onClick={() => setFormData({ ...formData, imageUrl: img })}
                              sx={{ 
                                pt: '100%', 
                                backgroundImage: `url(${img})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 4,
                                cursor: 'pointer',
                                position: 'relative',
                                border: '4px solid',
                                borderColor: formData.imageUrl === img ? '#059669' : 'transparent',
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                              }}
                            >
                              {formData.imageUrl === img && (
                                <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: '#059669', color: 'white', borderRadius: '50%', p: 0.5, display: 'flex', boxShadow: 2 }}>
                                  <Save size={14} />
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </Box>
                )}
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
                    onClick={handleAddProduct}
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
                    Add Product
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

export default AddProductPage;
