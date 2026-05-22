import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Edit2, 
  ShoppingBag,
  Globe,
  Clock
} from 'lucide-react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Stack, 
  IconButton, 
  Grid, 
  Avatar, 
  Chip, 
  Card,
  alpha,
  CircularProgress
} from '@mui/material';

const ViewCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, orders } = useData();
  const [customer, setCustomer] = useState(null);

  const customerOrders = useMemo(() => {
    if (!customer || !orders?.length) return [];
    const cid = String(customer.id);
    const email = (customer.email || '').toLowerCase().trim();
    const name = (customer.name || '').toLowerCase().trim();
    return orders
      .filter((o) => {
        const oid = String(o.customerId || '').trim();
        if (oid && oid === cid) return true;
        if (email && String(o.customerEmail || '').toLowerCase().trim() === email) return true;
        if (name && String(o.customerName || '').toLowerCase().trim() === name) return true;
        return false;
      })
      .sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0));
  }, [customer, orders]);

  const handleOrderRowClick = (order) => {
    if (order.paymentStatus === 'SUCCESS') {
      navigate(`/view-invoice/${order.id}`);
      return;
    }
    navigate(`/view-transaction/${order.id}`);
  };

  useEffect(() => {
    const found = customers.find(c => String(c.id) === String(id));
    if (found) {
      setCustomer(found);
    }
  }, [id, customers]);

  if (!customer) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={48} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Loading Customer Data...</Typography>
        </Stack>
      </Box>
    );
  }

  const addressGroups = customer.address ? customer.address.split(' | ').map((addr, idx) => ({
    address: addr,
    state: (customer.state || '').split(' | ')[idx] || '',
    pincode: (customer.pincode || '').split(' | ')[idx] || ''
  })) : [];

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
                p: { xs: 4, md: 6 }, 
                borderRadius: 6, 
                background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #0f172a 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -12px rgba(30, 58, 138, 0.3)'
            }}
        >
            <Box sx={{ position: 'absolute', top: -40, right: -40, width: 256, height: 256, bgcolor: 'white', opacity: 0.1, borderRadius: '50%', filter: 'blur(64px)' }} />
            <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 192, height: 192, bgcolor: 'white', opacity: 0.1, borderRadius: '50%', filter: 'blur(48px)' }} />
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems={{ md: 'center' }} sx={{ justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <IconButton 
                        onClick={() => navigate('/customer')}
                        sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.1)', 
                            backdropFilter: 'blur(10px)', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 4,
                            color: 'white',
                            p: 2,
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', transform: 'translateX(-4px)' }
                        }}
                    >
                        <ArrowLeft size={24} />
                    </IconButton>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Avatar 
                            sx={{ 
                                width: 80, 
                                height: 80, 
                                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                                backdropFilter: 'blur(10px)', 
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 4,
                                fontSize: '2rem',
                                fontWeight: 900,
                                boxShadow: '0 8px 16px -4px rgba(0,0,0,0.2)'
                            }}
                        >
                            {customer.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 900, tracking: 'tight' }}>{customer.name}</Typography>
                            <Typography variant="h6" sx={{ mt: 0.5, color: alpha('#fff', 0.6), fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Globe size={18} /> Customer Profile
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
                <Button 
                    variant="contained" 
                    startIcon={<Edit2 size={18} />}
                    onClick={() => navigate(`/edit-customer/${customer.id}`)}
                    sx={{ 
                        px: 4, 
                        py: 1.5, 
                        borderRadius: 4, 
                        fontWeight: 900, 
                        bgcolor: '#2563eb',
                        '&:hover': { bgcolor: '#1d4ed8' },
                        boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)'
                    }}
                >
                    Edit Profile
                </Button>
            </Stack>
        </Paper>

        <Grid container spacing={4} alignItems="stretch">
            {/* Contact and registered address side by side (same row from sm and up) */}
            <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)', height: '100%' }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', tracking: 2, display: 'block', mb: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
                        Contact Details
                    </Typography>
                    <Stack spacing={4}>
                        <Box>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                <Mail size={16} sx={{ color: 'primary.main' }} />
                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', tracking: 1 }}>Email Address</Typography>
                            </Stack>
                            <Typography variant="body1" sx={{ fontWeight: 800, ml: 4, color: 'text.primary', wordBreak: 'break-all' }}>{customer.email || 'No email provided'}</Typography>
                        </Box>
                        <Box>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                <Phone size={16} sx={{ color: 'indigo.500' }} />
                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', tracking: 1 }}>Phone Number</Typography>
                            </Stack>
                            <Typography variant="body1" sx={{ fontWeight: 800, ml: 4, color: 'text.primary' }}>{customer.phone || 'No phone provided'}</Typography>
                        </Box>
                        <Box>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                <Clock size={16} sx={{ color: 'success.main' }} />
                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', tracking: 1 }}>Created At</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ fontWeight: 700, ml: 4, color: 'text.secondary' }}>
                                {customer.createdAt || customer.created_at
                                  ? new Date(customer.createdAt || customer.created_at).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })
                                  : new Date().toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' }) + ' (Estimated)'}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)', height: '100%' }}>
                    <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', mb: 5, borderBottom: '1px solid', borderColor: 'divider', pb: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: alpha('#f43f5e', 0.1), color: '#f43f5e' }}><MapPin size={24} /></Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 900 }}>Registered Addresses</Typography>
                        </Stack>
                        <Chip 
                            label={`${addressGroups.length} Location${addressGroups.length !== 1 ? 's' : ''}`} 
                            size="small" 
                            sx={{ fontWeight: 900, bgcolor: alpha('#f43f5e', 0.1), color: '#f43f5e', textTransform: 'uppercase', tracking: 1, px: 1 }} 
                        />
                    </Stack>

                    <Stack spacing={3}>
                        {addressGroups.length > 0 ? addressGroups.map((group, idx) => (
                            <Box 
                                key={idx} 
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 5, 
                                    bgcolor: 'action.hover', 
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s',
                                    position: 'relative',
                                    '&:hover': { borderColor: 'primary.light', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                }}
                            >
                                <Box sx={{ position: 'absolute', top: 24, left: 0, width: 4, height: 48, bgcolor: 'primary.main', borderRadius: '0 4px 4px 0' }} />
                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', textTransform: 'uppercase', tracking: 2, display: 'block', mb: 2 }}>
                                    {idx === 0 ? 'Primary Billing Address' : `Additional Address ${idx + 1}`}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.4, color: 'text.primary' }}>
                                    {group.address}
                                </Typography>
                                <Stack direction="row" spacing={2} flexWrap="wrap">
                                    <Chip 
                                        icon={<Globe size={14} />} 
                                        label={group.state || 'N/A'} 
                                        variant="outlined" 
                                        sx={{ borderRadius: 2, fontWeight: 700, bgcolor: 'background.paper' }} 
                                    />
                                    <Chip 
                                        icon={<MapPin size={14} />} 
                                        label={`PIN: ${group.pincode || 'N/A'}`} 
                                        variant="outlined" 
                                        sx={{ borderRadius: 2, fontWeight: 700, bgcolor: 'background.paper' }} 
                                    />
                                </Stack>
                            </Box>
                        )) : (
                            <Box sx={{ py: 10, textAlign: 'center', border: '2px dashed', borderColor: 'divider', borderRadius: 6 }}>
                                <MapPin size={64} sx={{ color: 'text.disabled', mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 800 }}>No address information recorded.</Typography>
                            </Box>
                        )}
                    </Stack>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Card 
                    sx={{ 
                        p: 4, 
                        borderRadius: 6, 
                        background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)', 
                        color: 'white',
                        boxShadow: '0 12px 24px -8px rgba(79, 70, 229, 0.4)'
                    }}
                >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ justifyContent: 'space-between', mb: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <ShoppingBag size={36} style={{ opacity: 0.85 }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>Order History</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: alpha('#fff', 0.85) }}>
                                    Paid orders open Invoice Receipt. Other orders open Transaction details.
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                    <Stack spacing={1.5} sx={{ maxHeight: 320, overflowY: 'auto', pr: 0.5 }}>
                        {customerOrders.length === 0 ? (
                            <Typography variant="body2" sx={{ color: alpha('#fff', 0.85), py: 2 }}>No orders linked to this customer yet.</Typography>
                        ) : (
                            customerOrders.map((o) => (
                                <Paper
                                    key={o.id}
                                    component="button"
                                    type="button"
                                    onClick={() => handleOrderRowClick(o)}
                                    sx={{
                                        width: '100%',
                                        textAlign: 'left',
                                        p: 2,
                                        borderRadius: 3,
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        bgcolor: 'rgba(255,255,255,0.12)',
                                        color: 'inherit',
                                        font: 'inherit',
                                        fontFamily: 'inherit',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' }
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>#ORD-{String(o.id).padStart(4, '0')}</Typography>
                                        <Chip size="small" label={o.paymentStatus || 'PENDING'} sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
                                    </Stack>
                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: alpha('#fff', 0.85) }}>
                                        {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '—'} · ₹{Number(o.totalAmount || 0).toFixed(2)}
                                    </Typography>
                                </Paper>
                            ))
                        )}
                    </Stack>
                </Card>
            </Grid>
        </Grid>
      </Stack>
      </Box>
    </Box>
  );
};

export default ViewCustomerPage;
