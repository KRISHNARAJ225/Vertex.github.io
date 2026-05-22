import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { User, Mail, Phone, Shield, Plus, ArrowLeft, X, Check, Lock } from 'lucide-react';
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
  Alert,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  alpha
} from '@mui/material';

const AddUserPage = () => {
  const navigate = useNavigate();
  const { registerUser, fetchUsersPage } = useData();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      setError('Please fill in all required fields (Name, Username, Email, Password)');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await registerUser(formData);
      setSuccess(true);
      setTimeout(() => {
        fetchUsersPage(0, 1000, '');
        navigate('/user');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to register user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Stack spacing={4} sx={{ maxWidth: '800px', mx: 'auto' }}>
        
        {/* Header Section */}
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
              onClick={() => navigate('/user')}
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
                ACCESS CONTROL
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, tracking: 'tight', color: '#f8fafc' }}>
                Identity Management
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Form Section */}
        <Paper sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.1)' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 4, md: 6 } }}>
            <Stack spacing={4}>
              
              {success && (
                <Alert 
                  severity="success" 
                  icon={<Check className="w-5 h-5" />}
                  sx={{ borderRadius: 3, fontWeight: 700 }}
                >
                  User registered successfully! Redirecting...
                </Alert>
              )}

              {error && (
                <Alert 
                  severity="error" 
                  icon={<X className="w-5 h-5" />}
                  sx={{ borderRadius: 3, fontWeight: 700 }}
                >
                  {error}
                </Alert>
              )}

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <User size={16} /> Full Name *
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <User size={16} /> Username *
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="johndoe123"
                    slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail size={16} /> Email Address *
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock size={16} /> Password *
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={16} /> Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 234 567 890"
                    slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Shield size={16} /> Account Role
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <Grid container spacing={2}>
                      {['user', 'admin', 'moderator'].map((role) => (
                        <Grid item xs={12} sm={4} key={role}>
                          <Paper 
                            variant="outlined" 
                            sx={{ 
                              p: 1, 
                              borderRadius: 3, 
                              display: 'flex', 
                              alignItems: 'center', 
                              px: 2,
                              borderColor: formData.role === role ? 'primary.main' : 'divider',
                              bgcolor: formData.role === role ? alpha('#2563eb', 0.05) : 'transparent',
                              '&:hover': { borderColor: 'primary.light' }
                            }}
                          >
                            <FormControlLabel 
                              value={role} 
                              control={<Radio size="small" />} 
                              label={<Typography sx={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 900, tracking: 'wider' }}>{role}</Typography>} 
                              sx={{ width: '100%', m: 0 }}
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                </Grid>
              </Grid>

              <Divider />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading || success}
                  variant="contained"
                  sx={{ 
                    py: 2, 
                    borderRadius: 4, 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    tracking: 'widest',
                    bgcolor: '#0f172a',
                    '&:hover': { bgcolor: '#1e293b' },
                    boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.3)'
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Add User Account'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/user')}
                  sx={{ py: 2, borderRadius: 4, fontWeight: 900, textTransform: 'uppercase', tracking: 'widest', borderColor: 'divider' }}
                >
                  Discard Changes
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default AddUserPage;
