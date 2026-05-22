import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownCircle, ArrowUpCircle, Save, Package, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
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

const AddStockPage = () => {
    const navigate = useNavigate();
    const { products, createStock } = useData();
    const [stockForm, setStockForm] = useState({ productId: '', quantity: 1, type: 'IN' });
    const [stockSaving, setStockSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [stockSuccess, setStockSuccess] = useState('');

    const validate = (data) => {
        const e = {};
        if (!data.productId) e.productId = 'Product selection is required';
        if (!data.quantity || Number(data.quantity) <= 0) e.quantity = 'Quantity must be greater than 0';
        
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleCreateStock = async () => {
        setErrors({});
        setStockSuccess('');
        if (!validate(stockForm)) return;
        setStockSaving(true);
        const res = await createStock({
            productId: Number(stockForm.productId),
            quantity:  Number(stockForm.quantity),
            type:      stockForm.type,
        });
        setStockSaving(false);
        if (res !== null) {
            setStockSuccess(`Stock ${stockForm.type} of ${stockForm.quantity} units recorded successfully!`);
            setStockForm({ productId: '', quantity: 1, type: 'IN' });
            setTimeout(() => { 
                setStockSuccess(''); 
                navigate('/stocks');
            }, 1500);
        } else {
            setErrors({ general: 'Failed to create stock entry. Please try again.' });
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 6 } }}>
            <Stack spacing={5} sx={{ maxWidth: 1000, mx: 'auto' }}>
                
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
                            onClick={() => navigate('/stocks')}
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
                                INVENTORY FLOW
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, tracking: 'tight', color: '#f8fafc' }}>
                                New Stock Entry
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                <Paper sx={{ borderRadius: 8, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.05)', bgcolor: 'background.paper' }}>
                    <Box sx={{ p: { xs: 4, md: 8 } }}>
                        <Stack spacing={5}>
                            
                            {stockSuccess && (
                                <Alert severity="success" icon={<CheckCircle size={24} />} sx={{ borderRadius: 4, fontWeight: 700, py: 2 }}>
                                    {stockSuccess}
                                </Alert>
                            )}

                            {errors.general && (
                                <Alert severity="error" icon={<AlertCircle size={24} />} sx={{ borderRadius: 4, fontWeight: 700, py: 2 }}>
                                    {errors.general}
                                </Alert>
                            )}

                            <Grid container spacing={5}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, ml: 1 }}>
                                        Target Product *
                                    </Typography>
                                    <FormControl fullWidth error={!!errors.productId}>
                                        <Select
                                            value={stockForm.productId}
                                            onChange={(e) => { setStockForm(prev => ({ ...prev, productId: e.target.value })); if(errors.productId) setErrors({...errors, productId: ''}); }}
                                            displayEmpty
                                            sx={{ 
                                                borderRadius: 4, 
                                                bgcolor: 'action.hover',
                                                '& .MuiOutlinedInput-notchedOutline': { border: '2px solid transparent' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#4318FF', 0.1) },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', border: '2px solid' }
                                            }}
                                        >
                                            <MenuItem value=""><em>Select a product from inventory...</em></MenuItem>
                                            {(products || []).map(p => (
                                                <MenuItem key={p.id} value={p.id} sx={{ py: 1.5 }}>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                                        <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>ID: {p.id}</Typography>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.productId && <FormHelperText sx={{ ml: 1, fontWeight: 600 }}>{errors.productId}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, ml: 1 }}>
                                        Quantity Count *
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={stockForm.quantity}
                                        onChange={(e) => { setStockForm(prev => ({ ...prev, quantity: e.target.value })); if(errors.quantity) setErrors({...errors, quantity: ''}); }}
                                        placeholder="Enter amount"
                                        slotProps={{ 
                                            input: { 
                                                sx: { 
                                                    borderRadius: 4, 
                                                    bgcolor: 'action.hover',
                                                    height: 64,
                                                    fontSize: '1.2rem',
                                                    fontWeight: 800,
                                                    '& fieldset': { border: 'none' },
                                                    '&:hover fieldset': { border: 'none' },
                                                    '&.Mui-focused fieldset': { border: '2px solid', borderColor: 'primary.main' }
                                                } 
                                            } 
                                        }}
                                        error={!!errors.quantity}
                                        helperText={errors.quantity}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, ml: 1 }}>
                                        Inventory Flow *
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={stockForm.type}
                                        exclusive
                                        onChange={(e, val) => val && setStockForm(prev => ({ ...prev, type: val }))}
                                        fullWidth
                                        sx={{ 
                                            height: 64,
                                            borderRadius: 4,
                                            bgcolor: 'action.hover',
                                            p: 0.5,
                                            '& .MuiToggleButton-root': {
                                                borderRadius: 3.5,
                                                fontWeight: 900,
                                                border: 'none',
                                                '&.Mui-selected': {
                                                    color: 'white',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                },
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                                            },
                                            '& .MuiToggleButton-root.Mui-selected[value="IN"]': {
                                                bgcolor: '#05CD99',
                                                '&:hover': { bgcolor: '#05b588' }
                                            },
                                            '& .MuiToggleButton-root.Mui-selected[value="OUT"]': {
                                                bgcolor: '#EE5D50',
                                                '&:hover': { bgcolor: '#e04d41' }
                                            }
                                        }}
                                    >
                                        <ToggleButton value="IN">
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <TrendingUp size={24} />
                                                <Typography variant="button" sx={{ fontSize: '1rem' }}>IN</Typography>
                                            </Stack>
                                        </ToggleButton>
                                        <ToggleButton value="OUT">
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <TrendingDown size={24} />
                                                <Typography variant="button" sx={{ fontSize: '1rem' }}>OUT</Typography>
                                            </Stack>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 1 }} />

                            <Stack direction="row" spacing={3} sx={{ justifyContent: 'flex-end' }}>
                                <Button
                                    variant="text"
                                    color="inherit"
                                    onClick={() => navigate('/stocks')}
                                    sx={{ px: 4, py: 2, borderRadius: 4, fontWeight: 800, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    Discard
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={stockSaving ? <CircularProgress size={24} color="inherit" /> : <Save size={24} />}
                                    onClick={handleCreateStock}
                                    disabled={stockSaving}
                                    sx={{ 
                                        px: 6, 
                                        py: 2, 
                                        borderRadius: 4, 
                                        fontWeight: 900, 
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        bgcolor: '#4318FF',
                                        '&:hover': { bgcolor: '#3311CC' },
                                        boxShadow: '0 12px 24px -6px rgba(67, 24, 255, 0.4)'
                                    }}
                                >
                                    {stockSaving ? 'Saving Entry...' : 'Complete Entry'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>
            </Stack>
        </Box>
    );
};

export default AddStockPage;
