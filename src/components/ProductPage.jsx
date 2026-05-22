import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Search, 
  X, 
  Save, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  LayoutGrid,
  List as ListIcon,
  Download
} from 'lucide-react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Tooltip,
  Grid,
  Divider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

const ProductPage = () => {
  const { products, productPageData, fetchProductsPage, updateProduct, deleteProduct, categories } = useData();

  const navigate = useNavigate();
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || '{}'));
  const isAdmin = ['madhu', 'krishh', 'meera'].includes(currentUser?.name?.toLowerCase()) || currentUser?.role?.toLowerCase() === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // Default to list
  const [viewingProduct, setViewingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const emptyForm = {
    name: '',
    price: '',
    quantity: '',
    uom: 'kg',
    salableStock: '',
    unsaleableStock: '',
    expiryDate: '',
    divisionName: '',
    batchCode: ''
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const validate = (data, isEditing = false) => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Product name is required';
    else {
      const isDuplicate = products.some(p => 
        p.name.toLowerCase().trim() === data.name.toLowerCase().trim() && 
        (!isEditing || String(p.id) !== String(editingProduct?.id))
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounced search logic
  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(() => {
      fetchProductsPage(currentPage - 1, itemsPerPage, searchTerm, controller.signal);
    }, 500);
    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [currentPage, searchTerm, fetchProductsPage]);

  const displayedProducts = [...(productPageData.content || [])].sort((a, b) => {
    // Sort by expiry date (nearest first)
    if (!a.expiryDate && !b.expiryDate) {
      const batchA = a.batchCode || '';
      const batchB = b.batchCode || '';
      return batchA.localeCompare(batchB);
    }
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });


  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
  };

  const confirmDeleteProduct = () => {
    deleteProduct(productToDelete);
    setProductToDelete(null);
  };

  const handleViewProduct = (product) => {
    navigate(`/view-product/${product.id}`);
  };

  const getTotalValue = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const getStockStatus = (quantity) => {
    if (quantity < 20) return { color: 'error', text: 'Low Stock' };
    if (quantity < 50) return { color: 'warning', text: 'Medium Stock' };
    return { color: 'success', text: 'In Stock' };
  };

  const columns = [
    {
      field: 'imageUrl',
      headerName: 'Img',
      width: 70,
      renderCell: (params) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          {params.value ? (
            <Box 
              component="img" 
              src={params.value} 
              sx={{ width: 40, height: 40, borderRadius: 2, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }} 
            />
          ) : (
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
              <Package size={18} />
            </Box>
          )}
        </Box>
      )
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{params.value}</Typography>
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          ₹{params.value.toFixed(2)}
        </Typography>
      )
    },
    {
      field: 'quantity',
      headerName: 'Stock',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{params.value}</Typography>
      )
    },
    {
      field: 'batchCode',
      headerName: 'Batch Code',
      width: 130,
      valueGetter: (value) => value || 'N/A'
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 130,
      valueGetter: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const status = getStockStatus(params.row.quantity);
        return (
          <Chip 
            label={status.text} 
            size="small" 
            color={status.color}
            sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 10 }}
          />
        );
      }
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
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleViewProduct(params.row)} color="primary">
              <Eye className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => navigate(`/edit-product/${params.row.id}`)} color="info">
                  <Edit2 className="w-4 h-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDeleteProduct(params.row.id)} color="error">
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Stack spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', tracking: 'tight' }}>Products</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.6 }}>Manage your inventory and product catalog</Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<Plus className="w-5 h-5" />}
                onClick={() => navigate('/add-product')}
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
                Add Product
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<Download className="w-5 h-5" />}
                onClick={() => navigate('/import-products')}
                sx={{ 
                  borderRadius: 3, 
                  px: 3, 
                  py: 1.5, 
                  fontWeight: 800, 
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 }
                }}
              >
                Import
              </Button>
            )}
          </Stack>
        </Box>



      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {[
          { label: 'Total Products', value: products.length.toLocaleString(), icon: Package, color: 'primary' },
          { label: 'Inventory Value', value: `₹${getTotalValue().toLocaleString()}`, icon: DollarSign, color: 'success' }
        ].map((stat, idx) => (
          <Card 
            key={idx}
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              border: '1px solid', 
              borderColor: 'divider',
              boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)',
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 4, borderColor: `${stat.color}.light` }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${stat.color}.lighter`, color: `${stat.color}.main` }}>
                <stat.icon className="w-6 h-6" />
              </Box>
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>{stat.label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{stat.value}</Typography>
          </Card>
        ))}
      </Box>

      {/* Main Content Section */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <TextField
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, nextView) => nextView && setViewMode(nextView)}
            size="small"
            sx={{ bgcolor: 'action.hover', p: 0.5, borderRadius: 2 }}
          >
            <ToggleButton value="list" sx={{ borderRadius: 1.5, px: 2, py: 1, border: 'none', '&.Mui-selected': { bgcolor: 'background.paper', boxShadow: 1 } }}>
              <ListIcon className="w-4 h-4" />
            </ToggleButton>
            <ToggleButton value="grid" sx={{ borderRadius: 1.5, px: 2, py: 1, border: 'none', '&.Mui-selected': { bgcolor: 'background.paper', boxShadow: 1 } }}>
              <LayoutGrid className="w-4 h-4" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {viewMode === 'list' ? (
          <Box sx={{ height: 480, width: '100%' }}>
            <DataGrid
              rows={productPageData.content || []}
              columns={columns}
              paginationMode="server"
              rowCount={productPageData.totalElements || 0}
              paginationModel={{ page: currentPage - 1, pageSize: itemsPerPage }}
              onPaginationModelChange={(model) => setCurrentPage(model.page + 1)}
              loading={!productPageData.content}
              disableRowSelectionOnClick
              rowHeight={52}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeader': {
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
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-row': {
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: alpha('#05CD99', 0.04),
                    cursor: 'pointer'
                  }
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 800
                },
                '& ::-webkit-scrollbar': { width: '6px', height: '6px' },
                '& ::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '10px' },
                '& ::-webkit-scrollbar-thumb:hover': { backgroundColor: 'rgba(0, 0, 0, 0.15)' }
              }}
            />
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {displayedProducts.map((product) => {
                const status = getStockStatus(product.quantity);
                return (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <Card 
                      sx={{ 
                        p: 3, 
                        borderRadius: 4, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        transition: 'all 0.3s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4, borderColor: 'primary.light' }
                      }}
                    >
                      <Box 
                        sx={{ 
                          height: 140, 
                          mb: 2, 
                          borderRadius: 3, 
                          overflow: 'hidden',
                          position: 'relative',
                          bgcolor: 'action.hover',
                          backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          p: 1.5
                        }}
                      >
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.9)', color: 'success.main', display: 'flex', backdropFilter: 'blur(4px)' }}>
                          <Package className="w-5 h-5" />
                        </Box>
                        {isAdmin && (
                          <IconButton 
                            size="small" 
                            onClick={() => navigate(`/edit-product/${product.id}`)} 
                            sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: 'primary.main', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'white' } }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </IconButton>
                        )}
                        {!product.imageUrl && (
                          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                            <Package size={60} />
                          </Box>
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>{product.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>{product.divisionName || 'Uncategorized'}</Typography>
                      
                      <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Price</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>₹{product.price.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Stock</Typography>
                          <Chip 
                            label={`${product.quantity} ${product.uom}`} 
                            size="small" 
                            color={status.color}
                            sx={{ fontWeight: 800, fontSize: 10 }}
                          />
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Paper>



      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ p: 3 }}>Delete Product</DialogTitle>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'error.main' }}>
            <AlertTriangle />
            <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setProductToDelete(null)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button 
            onClick={confirmDeleteProduct} 
            variant="contained" 
            color="error" 
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </Stack>
    </Box>
  );
};

export default ProductPage;
