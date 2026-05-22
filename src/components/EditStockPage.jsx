import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, ArrowDownCircle, ArrowUpCircle, X, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
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
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress
} from '@mui/material';

const EditStockPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, stockLogs, updateStock } = useData();
    
    const [formData, setFormData] = useState({
        productId: '',
        quantity: 1,
        type: 'IN'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const log = stockLogs.find(l => String(l.id) === String(id));
        if (log) {
            setFormData({
                productId: log.productId,
                quantity: log.quantity,
                type: log.type
            });
        }
    }, [id, stockLogs]);

    const validate = () => {
        const e = {};
        if (!formData.productId) e.productId = 'Product selection is required';
        if (!formData.quantity || Number(formData.quantity) <= 0) e.quantity = 'Quantity must be greater than 0';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        try {
            const res = await updateStock(id, {
                productId: Number(formData.productId),
                quantity: Number(formData.quantity),
                type: formData.type
            });
            if (res !== null) {
                setSuccess(true);
                setTimeout(() => navigate('/stocks'), 1500);
            } else {
                setErrors({ general: 'Failed to update stock entry.' });
            }
        } catch (err) {
            setErrors({ general: 'An error occurred during update.' });
        } finally {
            setLoading(false);
        }
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
              onClick={() => navigate('/stocks')}
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
                INVENTORY LOGS
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 3, tracking: 'tight', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                <TrendingUp size={56} sx={{ color: alpha('#fff', 0.9) }} /> Edit Stock
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: alpha('#fff', 0.8), fontWeight: 500, maxWidth: 650, lineHeight: 1.6, opacity: 0.9 }}>
                Modify historical stock movement entries, adjust quantities, and re-classify inventory flow types.
              </Typography>
            </Box>
          </Stack>
        </Paper>

                <Paper sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.1)' }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 4, md: 6 } }}>
                        <Stack spacing={4}>
                            
                            {success && (
                                <Alert severity="success" icon={<CheckCircle size={20} />} sx={{ borderRadius: 3, fontWeight: 700 }}>
                                    Entry updated successfully! Redirecting...
                                </Alert>
                            )}

                            {errors.general && (
                                <Alert severity="error" icon={<AlertCircle size={20} />} sx={{ borderRadius: 3, fontWeight: 700 }}>
                                    {errors.general}
                                </Alert>
                            )}

                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        Product Selection *
                                    </Typography>
                                    <FormControl fullWidth error={!!errors.productId}>
                                        <InputLabel>Product</InputLabel>
                                        <Select
                                            value={formData.productId}
                                            onChange={(e) => { setFormData(prev => ({ ...prev, productId: e.target.value })); if(errors.productId) setErrors({...errors, productId: ''}); }}
                                            label="Product"
                                            sx={{ borderRadius: 3 }}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {(products || []).map(p => (
                                                <MenuItem key={p.id} value={p.id}>{p.name} (ID: {p.id})</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.productId && <FormHelperText>{errors.productId}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        Quantity *
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => { setFormData(prev => ({ ...prev, quantity: e.target.value })); if(errors.quantity) setErrors({...errors, quantity: ''}); }}
                                        placeholder="Enter quantity"
                                        slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                                        error={!!errors.quantity}
                                        helperText={errors.quantity}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        Movement Type *
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={formData.type}
                                        exclusive
                                        onChange={(e, val) => val && setFormData(prev => ({ ...prev, type: val }))}
                                        fullWidth
                                        sx={{ 
                                            borderRadius: 3,
                                            '& .MuiToggleButton-root': {
                                                borderRadius: 3,
                                                py: 1.5,
                                                fontWeight: 800,
                                                border: '2px solid',
                                                borderColor: 'divider',
                                                '&.Mui-selected': {
                                                    color: 'white',
                                                    '&:hover': { opacity: 0.9 }
                                                }
                                            },
                                            '& .MuiToggleButton-root.Mui-selected[value="IN"]': {
                                                bgcolor: 'success.main',
                                                borderColor: 'success.main',
                                                '&:hover': { bgcolor: 'success.dark' }
                                            },
                                            '& .MuiToggleButton-root.Mui-selected[value="OUT"]': {
                                                bgcolor: 'error.main',
                                                borderColor: 'error.main',
                                                '&:hover': { bgcolor: 'error.dark' }
                                            }
                                        }}
                                    >
                                        <ToggleButton value="IN">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <TrendingUp size={18} />
                                                <Typography variant="button">STOCK IN</Typography>
                                            </Stack>
                                        </ToggleButton>
                                        <ToggleButton value="OUT">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <TrendingDown size={18} />
                                                <Typography variant="button">STOCK OUT</Typography>
                                            </Stack>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                            </Grid>

                            <Divider />

                            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => navigate('/stocks')}
                                    sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 800, borderColor: 'divider' }}
                                >
                                    Discard
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
                                    disabled={loading || success}
                                    sx={{ 
                                        px: 4, 
                                        py: 1.5, 
                                        borderRadius: 3, 
                                        fontWeight: 900, 
                                        bgcolor: '#065f46',
                                        '&:hover': { bgcolor: '#047857' },
                                        boxShadow: '0 8px 16px -4px rgba(6, 95, 70, 0.4)'
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Update Entry'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>
            </Stack>
        </Box>
    );
};

export default EditStockPage;
