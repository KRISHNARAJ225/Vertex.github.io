import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FolderOpen, Save, ArrowLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Paper, 
  TextField, 
  Stack, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select,
  FormHelperText,
  Divider,
  Grid,
  alpha,
  CircularProgress
} from '@mui/material';

const EditDivisionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories: divisions, updateCategory: updateDivision } = useData();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Physical Goods',
    batchCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const divisionTypes = ['Physical Goods', 'Digital', 'Services'];

  useEffect(() => {
    const division = divisions.find(d => String(d.id) === String(id));
    if (division && division.name !== formData.name) {
      setFormData({
        name: division.name || '',
        type: division.type || 'Physical Goods',
        batchCode: division.batchCode || ''
      });
    }
  }, [id, divisions, formData.name]);

  const validate = (data) => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Division name is required';
    if (!data.type) e.type = 'Division type is required';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdateDivision = async () => {
    if (!validate(formData)) return;
    setIsSubmitting(true);
    try {
      await updateDivision(id, formData);
      navigate('/division');
    } catch (err) {
      console.error('Failed to update division', err);
    } finally {
      setIsSubmitting(false);
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
              onClick={() => navigate('/division')}
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
                ORGANIZATIONAL STRUCTURE
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 3, tracking: 'tight', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                <FolderOpen size={56} sx={{ color: alpha('#fff', 0.9) }} /> Edit Division
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: alpha('#fff', 0.8), fontWeight: 500, maxWidth: 650, lineHeight: 1.6, opacity: 0.9 }}>
                Update division classifications, property types, and batch code settings for your organization.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)' }}>
          <Stack spacing={4} sx={{ p: { xs: 4, md: 6 } }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>Division Name *</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if(errors.name) setErrors({...errors, name: ''}); }}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  placeholder="Enter division name"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>Division Type *</Typography>
                <FormControl fullWidth error={Boolean(errors.type)}>
                  <Select
                    value={formData.type}
                    onChange={(e) => { setFormData({ ...formData, type: e.target.value }); if(errors.type) setErrors({...errors, type: ''}); }}
                    sx={{ borderRadius: 3, bgcolor: 'action.hover' }}
                  >
                    {divisionTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                  {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>Batch Code</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.batchCode}
                  onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                  placeholder="Enter batch code (optional)"
                  slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }}
                />
              </Grid>
            </Grid>

            <Divider />

            {/* Actions */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', pt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                disabled={isSubmitting}
                onClick={() => navigate('/division')}
                sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700, borderColor: 'divider' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save className="w-5 h-5" />}
                onClick={handleUpdateDivision}
                sx={{ 
                  borderRadius: 3, 
                  px: 4, 
                  py: 1.5, 
                  fontWeight: 800, 
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark', boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)' },
                  boxShadow: '0 4px 12px -2px rgba(37, 99, 235, 0.3)'
                }}
              >
                {isSubmitting ? 'Updating...' : 'Update Division'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default EditDivisionPage;
