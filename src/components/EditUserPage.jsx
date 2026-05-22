import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, Shield, Save, ArrowLeft, CheckCircle, AlertCircle, UserCircle } from 'lucide-react';
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
  Alert,
  CircularProgress
} from '@mui/material';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { registeredUsers, updateUser } = useData();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    username: ''
  });

  useEffect(() => {
    const user = registeredUsers.find(u => String(u.id) === String(id));
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        username: user.username || ''
      });
    }
  }, [id, registeredUsers]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Full name is required';
    if (!formData.username.trim()) e.username = 'Username is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email format';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdateUser = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const success = await updateUser(id, formData);
      if (success) {
        setSuccess(true);
        setTimeout(() => navigate('/user'), 1500);
      } else {
        setErrors({ general: 'Failed to update user. Please try again.' });
      }
    } catch (err) {
      setErrors({ general: 'An error occurred while saving changes.' });
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
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />
          <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={5} alignItems={{ md: 'center' }} sx={{ position: 'relative', zIndex: 1 }}>
            <IconButton 
              onClick={() => navigate('/user')}
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
                ADMINISTRATIVE ACCESS
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 3, tracking: 'tight', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                <UserCircle size={56} sx={{ color: alpha('#fff', 0.9) }} /> Edit User
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: alpha('#fff', 0.8), fontWeight: 500, maxWidth: 650, lineHeight: 1.6, opacity: 0.9 }}>
                Manage system permissions, update personal identifiers, and adjust administrative roles for platform users.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: 8, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.1)' }}>
          <Box sx={{ p: { xs: 5, md: 8 } }}>
            <Stack spacing={5}>
              {success && (
                <Alert severity="success" icon={<CheckCircle size={20} />} sx={{ borderRadius: 4, fontWeight: 700 }}>
                  User profile updated successfully! Redirecting...
                </Alert>
              )}

              {errors.general && (
                <Alert severity="error" icon={<AlertCircle size={20} />} sx={{ borderRadius: 4, fontWeight: 700 }}>
                  {errors.general}
                </Alert>
              )}

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>FULL NAME</Typography>
                  <TextField
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={!!errors.name}
                    helperText={errors.name}
                    placeholder="Enter full name"
                    slotProps={{ input: { sx: { borderRadius: 4 }, startAdornment: <InputAdornment position="start"><User size={18} /></InputAdornment> } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>USERNAME</Typography>
                  <TextField
                    fullWidth
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    error={!!errors.username}
                    helperText={errors.username}
                    placeholder="Enter unique username"
                    slotProps={{ input: { sx: { borderRadius: 4 }, startAdornment: <InputAdornment position="start"><UserCircle size={18} /></InputAdornment> } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>EMAIL ADDRESS</Typography>
                  <TextField
                    fullWidth
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={!!errors.email}
                    helperText={errors.email}
                    placeholder="user@nexus.com"
                    slotProps={{ input: { sx: { borderRadius: 4 }, startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment> } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>PHONE NUMBER</Typography>
                  <TextField
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    slotProps={{ input: { sx: { borderRadius: 4 }, startAdornment: <InputAdornment position="start"><Phone size={18} /></InputAdornment> } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>SYSTEM ROLE</Typography>
                  <FormControl fullWidth>
                    <Select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      sx={{ borderRadius: 4, fontWeight: 700 }}
                      startAdornment={<InputAdornment position="start"><Shield size={18} sx={{ ml: 1 }} /></InputAdornment>}
                    >
                      <MenuItem value="user">Standard User</MenuItem>
                      <MenuItem value="admin">Administrator</MenuItem>
                      <MenuItem value="moderator">Moderator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/user')}
                  sx={{ py: 1.5, px: 4, borderRadius: 4, fontWeight: 800, borderColor: 'divider' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
                  onClick={handleUpdateUser}
                  disabled={loading || success}
                  sx={{ 
                    py: 1.5, 
                    px: 6, 
                    borderRadius: 4, 
                    fontWeight: 900, 
                    bgcolor: '#4318FF',
                    '&:hover': { bgcolor: '#3B15E6', boxShadow: '0 12px 24px -6px rgba(67, 24, 255, 0.4)' },
                    boxShadow: '0 8px 16px -4px rgba(67, 24, 255, 0.3)'
                  }}
                >
                  {loading ? 'SAVING...' : 'UPDATE USER'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default EditUserPage;
