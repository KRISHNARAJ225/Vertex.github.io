import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, ArrowLeft, FolderOpen } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Paper, 
  TextField, 
  Stack, 
  Grid,
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select,
  FormHelperText,
  Divider,
  alpha
} from '@mui/material';

const AddDivisionPage = () => {
  const navigate = useNavigate();
  const { addCategory: addDivision } = useData();
  
  const emptyForm = {
    name: '',
    type: 'Physical Goods',
    batchCode: ''
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Division name is required';
    if (!data.type) e.type = 'Division type is required';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const divisionTypes = ['Physical Goods', 'Digital', 'Services'];

  const handleAddDivision = async () => {
    if (!validate(formData)) return;
    await addDivision(formData);
    navigate('/division');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Stack spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
        
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
              onClick={() => navigate('/division')}
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
                ORGANIZATION SETUP
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, tracking: 'tight', color: '#f8fafc' }}>
                Create New Division
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)' }}>
          <Stack spacing={4} sx={{ p: { xs: 4, md: 6 } }}>
            <Grid container spacing={4}>
              <Grid xs={12} md={6}>
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

              <Grid xs={12} md={6}>
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
            </Grid>

            <Divider />

            {/* Actions */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', pt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/division')}
                sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700, borderColor: 'divider' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save className="w-5 h-5" />}
                onClick={handleAddDivision}
                sx={{ 
                  borderRadius: 3, 
                  px: 4, 
                  py: 1.5, 
                  fontWeight: 800, 
                  bgcolor: 'success.main',
                  '&:hover': { bgcolor: 'success.dark', boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)' },
                  boxShadow: '0 4px 12px -2px rgba(16, 185, 129, 0.3)'
                }}
              >
                Add Division
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default AddDivisionPage;
