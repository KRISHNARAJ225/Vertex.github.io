import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Eye, Search, X, Save, Mail, Phone, Calendar, MapPin, Filter, Download, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  IconButton, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Card, 
  Paper,
  InputAdornment,
  Stack,
  Tooltip,
  Avatar,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { alpha } from '@mui/material/styles';

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

const CustomerPage = () => {
  const navigate = useNavigate();
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || '{}'));
  const isAdmin = ['madhu', 'krishh', 'meera'].includes(currentUser?.name?.toLowerCase()) || currentUser?.role?.toLowerCase() === 'admin';

  const { customers, customerPageData, fetchCustomersPage, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', email: '', addresses: [''], states: [''], pincode: '', country: 'India'
  });

  const emptyForm = { name: '', email: '', addresses: [''], states: [''], pincode: '', country: 'India' };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounced search logic
  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(() => {
      fetchCustomersPage(currentPage - 1, itemsPerPage, searchTerm, controller.signal);
    }, 500);
    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [currentPage, searchTerm, fetchCustomersPage]);

  const validate = (data, isEditing = false) => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Full name is required';
    else if (data.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    else if (/[^a-zA-Z\s]/.test(data.name.trim())) e.name = 'Name must contain alphabets only';
    else {
      const isDuplicate = customers.some(c => 
        c.name.toLowerCase().trim() === data.name.toLowerCase().trim() && 
        (!isEditing || String(c.id) !== String(editingCustomer?.id))
      );
      if (isDuplicate) e.name = 'Customer with this name already exists';
    }

    if (!data.email?.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Enter a valid email address';
    if (!data.addresses[0]?.trim()) e.address = 'Primary address is required';
    if (!data.states[0]?.trim()) e.state = 'Primary state is required';
    if (!data.country?.trim()) e.country = 'Country is required';
    if (!data.pincode?.trim()) e.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(data.pincode.trim())) e.pincode = 'PIN code must be 6 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addAddressField = () => setFormData(prev => ({ ...prev, addresses: [...prev.addresses, ''] }));
  const removeAddressField = (index) => {
    if (formData.addresses.length > 1) {
      setFormData(prev => ({ ...prev, addresses: prev.addresses.filter((_, i) => i !== index) }));
    }
  };
  const addStateField = () => setFormData(prev => ({ ...prev, states: [...prev.states, ''] }));
  const removeStateField = (index) => {
    if (formData.states.length > 1) {
      setFormData(prev => ({ ...prev, states: prev.states.filter((_, i) => i !== index) }));
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Customer Name',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: alpha('#3b82f6', 0.1), 
              color: '#3b82f6',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            {(params.value || '?').charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'email',
      headerName: 'Email Address',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{params.value}</Typography>
      )
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'India'} 
          size="small" 
          sx={{ 
            fontWeight: 700, 
            fontSize: '0.625rem', 
            bgcolor: alpha('#3b82f6', 0.1), 
            color: '#3b82f6',
            textTransform: 'uppercase'
          }} 
        />
      )
    },
    {
      field: 'state',
      headerName: 'State',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'Tamilnadu'} 
          size="small" 
          sx={{ 
            fontWeight: 700, 
            fontSize: '0.625rem', 
            bgcolor: alpha('#3b82f6', 0.1), 
            color: '#3b82f6',
            textTransform: 'uppercase'
          }} 
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          {isAdmin && (
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => navigate(`/view-customer/${params.row.id}`)} color="primary">
                <Eye className="w-4 h-4" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Edit Customer">
            <IconButton size="small" onClick={() => navigate(`/edit-customer/${params.row.id}`)} color="info">
              <Edit2 className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer">
            <IconButton size="small" onClick={() => setCustomerToDelete(params.row.id)} color="error">
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];


  const handleExportCustomers = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'State', 'Pincode'];
    const rows = customers.map(c => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.address}"`,
      `"${c.state}"`,
      `"${c.pincode}"`
    ]);
    
    const csvContent = "\uFEFF" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Customer_Database_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Stack spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', tracking: 'tight' }}>Customers</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.6 }}>Manage your customer database</Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            {isAdmin && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Download className="w-5 h-5" />}
                onClick={handleExportCustomers}
                sx={{ 
                  borderRadius: 3, 
                  px: 3, 
                  py: 1.5, 
                  fontWeight: 800, 
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' }
                }}
              >
                Download
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<Plus className="w-5 h-5" />}
              onClick={() => navigate('/add-customer')}
              sx={{ 
                borderRadius: 3, 
                px: 3, 
                py: 1.5, 
                fontWeight: 800, 
                bgcolor: 'primary.main',
                boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.2)',
                '&:hover': { bgcolor: 'primary.dark', boxShadow: '0 12px 20px -4px rgba(59, 130, 246, 0.3)' }
              }}
            >
              Add Customer
            </Button>
          </Stack>
        </Box>



        {/* Stats Card */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                p: 3, 
                borderRadius: 4, 
                background: 'linear-gradient(135deg, #4318FF 0%, #3B82F6 100%)',
                color: 'white',
                boxShadow: '0 20px 40px -12px rgba(67, 24, 255, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                maxWidth: { md: '320px' },
                minHeight: '140px'
              }}
            >
              <Box sx={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                    <Users className="w-5 h-5" />
                  </Box>
                  <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 1, opacity: 0.8, fontSize: '0.65rem' }}>Metrics</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{customers.length.toLocaleString()}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>Total Customers</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Customers Table Section */}
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextField
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="w-4 h-4 text-gray-400" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, width: { xs: '100%', sm: 320 } }
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<Filter className="w-4 h-4" />}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Filter
            </Button>
          </Box>
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={customerPageData.content || []}
              columns={columns}
              paginationMode="server"
              rowCount={customerPageData.totalElements || 0}
              onPaginationModelChange={(model) => {
                setCurrentPage(model.page + 1);
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: currentPage - 1, pageSize: itemsPerPage },
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              loading={loading}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                },
                '& .MuiDataGrid-cell': {
                  borderColor: 'divider',
                  fontSize: 14,
                  fontWeight: 500,
                  py: 1
                },
                '& .MuiDataGrid-row': {
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha('#05CD99', 0.08),
                    transform: 'translateY(-1px)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px -4px rgba(5, 205, 153, 0.1)'
                  }
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 800
                }
              }}
            />
          </Box>
        </Paper>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={Boolean(customerToDelete)} 
        onClose={() => setCustomerToDelete(null)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
          <Box sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: alpha('#ef4444', 0.1), 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Trash2 className="w-8 h-8 text-red-600" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Delete Customer</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
            Are you sure you want to delete this customer? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button 
            fullWidth 
            variant="outlined" 
            onClick={() => setCustomerToDelete(null)}
            sx={{ borderRadius: 3, py: 1.5, fontWeight: 800 }}
          >
            Cancel
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            color="error" 
            onClick={() => { deleteCustomer(customerToDelete); setCustomerToDelete(null); }}
            sx={{ 
              borderRadius: 3, 
              py: 1.5, 
              fontWeight: 800,
              boxShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.2)'
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerPage;