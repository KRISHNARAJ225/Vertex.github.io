import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Users, Globe, Plus, X, Mail, MapPin, Hash } from 'lucide-react';
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
  Tooltip
} from '@mui/material';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia','Austria','Azerbaijan',
  'Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina',
  'Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Chad',
  'Chile','China','Colombia','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark',
  'Djibouti','Dominican Republic','Ecuador','Egypt','El Salvador','Estonia','Ethiopia','Fiji','Finland','France',
  'Gabon','Georgia','Germany','Ghana','Greece','Guatemala','Guinea','Haiti','Honduras','Hungary',
  'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan',
  'Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Libya','Lithuania',
  'Luxembourg','Madagascar','Malaysia','Maldives','Mali','Malta','Mexico','Moldova','Monaco','Mongolia',
  'Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger',
  'Nigeria','North Korea','Norway','Oman','Pakistan','Palestine','Panama','Paraguay','Peru','Philippines',
  'Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia','Singapore',
  'Slovakia','Slovenia','Somalia','South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland',
  'Syria','Taiwan','Tajikistan','Tanzania','Thailand','Tunisia','Turkey','Turkmenistan','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
];

const EditCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, updateCustomer } = useData();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    country: 'India',
    addressGroups: [{ address: '', state: '', pincode: '' }]
  });

  useEffect(() => {
    const customer = customers.find(c => String(c.id) === String(id));
    if (customer) {
      const addrs = (customer.address || '').split(' | ');
      const sts = (customer.state || '').split(' | ');
      const pins = (customer.pincode || '').split(' | ');
      
      const groups = addrs.map((addr, i) => ({
        address: addr || '',
        state: sts[i] || '',
        pincode: pins[i] || ''
      }));

      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        country: customer.country || 'India',
        addressGroups: groups.length > 0 ? groups : [{ address: '', state: '', pincode: '' }]
      });
    }
  }, [id, customers]);

  const validate = (data) => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Full name is required';
    else if (data.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    else if (/[^a-zA-Z\s]/.test(data.name.trim())) e.name = 'Name must contain alphabets only';
    else {
      const isDuplicate = customers.some(c => 
        c.name.toLowerCase().trim() === data.name.toLowerCase().trim() && String(c.id) !== String(id)
      );
      if (isDuplicate) e.name = 'Customer with this name already exists';
    }

    if (!data.email?.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Enter a valid email address';
    
    if (!data.country?.trim()) e.country = 'Country is required';

    // Validate address groups
    const groupErrors = [];
    data.addressGroups.forEach((group, idx) => {
      const groupErr = {};
      if (!group.address?.trim()) groupErr.address = 'Address is required';
      if (!group.state?.trim()) groupErr.state = 'State is required';
      if (!group.pincode?.trim()) groupErr.pincode = 'PIN is required';
      else if (!/^\d{6}$/.test(group.pincode.trim())) groupErr.pincode = 'Must be 6 digits';
      
      if (Object.keys(groupErr).length > 0) {
        groupErrors[idx] = groupErr;
      }
    });

    if (groupErrors.length > 0) e.addressGroups = groupErrors;
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addAddressGroup = () => {
    setFormData(prev => ({
      ...prev,
      addressGroups: [...prev.addressGroups, { address: '', state: '', pincode: '' }]
    }));
  };

  const removeAddressGroup = (index) => {
    if (formData.addressGroups.length > 1) {
      setFormData(prev => ({
        ...prev,
        addressGroups: prev.addressGroups.filter((_, i) => i !== index)
      }));
    }
  };

  const handleGroupChange = (index, field, value) => {
    const newGroups = [...formData.addressGroups];
    newGroups[index][field] = value;
    setFormData({ ...formData, addressGroups: newGroups });
    
    // Clear error for this field if it exists
    if (errors.addressGroups?.[index]?.[field]) {
      const newErrors = { ...errors };
      const updatedAddressGroups = [...(newErrors.addressGroups || [])];
      if (updatedAddressGroups[index]) {
        delete updatedAddressGroups[index][field];
        if (Object.keys(updatedAddressGroups[index]).length === 0) {
          delete updatedAddressGroups[index];
        }
      }
      if (updatedAddressGroups.every(item => !item)) {
        delete newErrors.addressGroups;
      } else {
        newErrors.addressGroups = updatedAddressGroups;
      }
      setErrors(newErrors);
    }
  };

  const handleUpdateCustomer = async () => {
    if (!validate(formData)) return;
    const payload = {
      ...formData,
      address: formData.addressGroups.map(g => g.address.trim()).join(' | '),
      state: formData.addressGroups.map(g => g.state.trim()).join(' | '),
      pincode: formData.addressGroups.map(g => g.pincode.trim()).join(' | ')
    };
    delete payload.addressGroups;
    await updateCustomer(id, payload);
    navigate('/customer');
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
              onClick={() => navigate('/customer')}
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
                CRM MANAGEMENT
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 3, tracking: 'tight', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                <Users size={56} sx={{ color: alpha('#fff', 0.9) }} /> Edit Customer
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: alpha('#fff', 0.8), fontWeight: 500, maxWidth: 650, lineHeight: 1.6, opacity: 0.9 }}>
                Modify customer profile details, update multiple addresses, and refine contact preferences.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.1)' }}>
          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Grid container spacing={4}>
              {/* Core Info */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  Full Name *
                </Typography>
                <TextField
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setFormData({ ...formData, name: val });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="Enter full name"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  Email Address *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="customer@example.com"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' }, startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment> } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  Country *
                </Typography>
                <FormControl fullWidth error={!!errors.country}>
                  <Select
                    value={formData.country}
                    onChange={(e) => {
                      setFormData({ ...formData, country: e.target.value });
                      if (errors.country) setErrors({ ...errors, country: '' });
                    }}
                    sx={{ borderRadius: 3, bgcolor: 'action.hover' }}
                    startAdornment={<InputAdornment position="start"><Globe size={18} sx={{ ml: 1 }} /></InputAdornment>}
                  >
                    <MenuItem value="">Select Country</MenuItem>
                    {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                  {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Address Management Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 4 }} />
                <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Address Information</Typography>
                    <Typography variant="caption" color="text.secondary">Update customer's office/delivery addresses</Typography>
                  </Box>
                  <Button 
                    startIcon={<Plus size={18} />}
                    onClick={addAddressGroup}
                    variant="soft"
                    color="primary"
                    sx={{ borderRadius: 3, fontWeight: 800, bgcolor: alpha('#059669', 0.1), color: '#059669', '&:hover': { bgcolor: alpha('#059669', 0.2) } }}
                  >
                    Add Address
                  </Button>
                </Stack>

                <Stack spacing={3}>
                  {formData.addressGroups.map((group, idx) => (
                    <Paper 
                      key={idx} 
                      elevation={0}
                      sx={{ 
                        p: 4, 
                        borderRadius: 4, 
                        bgcolor: 'action.hover',
                        position: 'relative',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {idx > 0 && (
                        <Tooltip title="Remove Address">
                          <IconButton 
                            onClick={() => removeAddressGroup(idx)}
                            sx={{ 
                              position: 'absolute', 
                              top: -12, 
                              right: -12, 
                              bgcolor: 'background.paper',
                              boxShadow: 2,
                              color: 'error.main',
                              '&:hover': { bgcolor: 'error.lighter', color: 'error.dark' }
                            }}
                            size="small"
                          >
                            <X size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            STREET ADDRESS
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={group.address}
                            onChange={(e) => handleGroupChange(idx, 'address', e.target.value)}
                            error={!!errors.addressGroups?.[idx]?.address}
                            helperText={errors.addressGroups?.[idx]?.address}
                            placeholder="e.g. 123 Business Avenue"
                            slotProps={{ input: { sx: { borderRadius: 2, bgcolor: 'background.paper' } } }}
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            STATE
                          </Typography>
                          <FormControl fullWidth size="small" error={!!errors.addressGroups?.[idx]?.state}>
                            <Select
                              value={group.state}
                              onChange={(e) => handleGroupChange(idx, 'state', e.target.value)}
                              sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                            >
                              <MenuItem value="">Select State</MenuItem>
                              <MenuItem value="Tamilnadu">Tamilnadu</MenuItem>
                              <MenuItem value="Kerala">Kerala</MenuItem>
                              <MenuItem value="Andhra Pradesh">Andhra Pradesh</MenuItem>
                              <MenuItem value="Karnataka">Karnataka</MenuItem>
                              <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                              <MenuItem value="Madhya Pradesh">Madhya Pradesh</MenuItem>
                              <MenuItem value="Puducherry">Puducherry</MenuItem>
                              <MenuItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</MenuItem>
                              <MenuItem value="Telangana">Telangana</MenuItem>
                              <MenuItem value="Delhi">Delhi</MenuItem>
                              <MenuItem value="Lakshadweep">Lakshadweep</MenuItem>
                              <MenuItem value="Bihar">Bihar</MenuItem>
                            </Select>
                            {errors.addressGroups?.[idx]?.state && <FormHelperText>{errors.addressGroups[idx].state}</FormHelperText>}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            PIN CODE
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={group.pincode}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                              handleGroupChange(idx, 'pincode', val);
                            }}
                            error={!!errors.addressGroups?.[idx]?.pincode}
                            helperText={errors.addressGroups?.[idx]?.pincode}
                            placeholder="600001"
                            slotProps={{ input: { sx: { borderRadius: 2, bgcolor: 'background.paper' }, inputProps: { maxLength: 6 } } }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/customer')}
                    sx={{ py: 1.5, px: 4, borderRadius: 3, fontWeight: 800, borderColor: 'divider' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save size={18} />}
                    onClick={handleUpdateCustomer}
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
                    Update Customer
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

export default EditCustomerPage;
