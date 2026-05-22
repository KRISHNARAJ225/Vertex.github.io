import React, { useState, useEffect } from 'react';
import { FolderOpen, Plus, Edit2, Trash2, Eye, Search, X, Save, Tag, Package, Box as BoxIcon, Archive, Filter, Download, Upload, Grid3X3, List, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  Box, 
  Button, 
  Typography, 
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
  Grid,
  TextField,
  Avatar,
  Divider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { alpha } from '@mui/material/styles';

const DivisionPage = () => {
  const navigate = useNavigate();
  const { categories: divisions, categoryPageData: divisionPageData, fetchCategoriesPage: fetchDivisionsPage, updateCategory: updateDivision, deleteCategory: deleteDivision, products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDivision, setEditingDivision] = useState(null);
  const [viewingDivision, setViewingDivision] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchDivisionsPage(currentPage - 1, itemsPerPage, searchTerm);
  }, [currentPage, searchTerm, fetchDivisionsPage]);

  const divisionTypes = ['Physical Goods', 'Digital', 'Services'];

  const columns = [
    {
      field: 'name',
      headerName: 'Division Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: alpha(getDivisionColor(params.row.type) === 'blue' ? '#3b82f6' : getDivisionColor(params.row.type) === 'green' ? '#10b981' : getDivisionColor(params.row.type) === 'purple' ? '#a855f7' : '#94a3b8', 0.1), 
              color: getDivisionColor(params.row.type) === 'blue' ? '#3b82f6' : getDivisionColor(params.row.type) === 'green' ? '#10b981' : getDivisionColor(params.row.type) === 'purple' ? '#a855f7' : '#94a3b8',
            }}
          >
            {getDivisionIcon(params.row.type)}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'batchCode',
      headerName: 'Batch Code',
      width: 150,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ fontBold: 700, fontFamily: 'monospace', color: 'text.secondary' }}>
          {params.value || 'N/A'}
        </Typography>
      )
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          sx={{ 
            fontWeight: 800, 
            fontSize: '0.625rem', 
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }} 
        />
      )
    },
    {
      field: 'items',
      headerName: 'Items',
      width: 100,
      valueGetter: (value, row) => getDivisionStats(row.name).items,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{params.value}</Typography>
      )
    },
    {
      field: 'growth',
      headerName: 'Products',
      width: 120,
      valueGetter: (value, row) => getDivisionStats(row.name).growth,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>{params.value}</Typography>
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
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => setViewingDivision(params.row)} color="primary">
              <Eye className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Division">
            <IconButton size="small" onClick={() => navigate(`/edit-division/${params.row.id}`)} color="info">
              <Edit2 className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Division">
            <IconButton size="small" onClick={() => deleteDivision(params.row.id)} color="error">
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  const displayedDivisions = (divisionPageData.content || [])
    .filter(division =>
      (division.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (division.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (division.batchCode || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const codeA = a.batchCode || '';
      const codeB = b.batchCode || '';
      return codeA.localeCompare(codeB);
    });

  const handleEditDivision = (division) => {
    navigate(`/edit-division/${division.id}`);
  };

  const handleUpdateDivision = () => {
    if (!validate(formData)) return;
    updateDivision(editingDivision.id, formData);
    setEditingDivision(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleDeleteDivision = (id) => {
    deleteDivision(id);
  };

  const handleViewDivision = (division) => {
    setViewingDivision(division);
  };

  const getDivisionIcon = (type) => {
    switch(type) {
      case 'Physical Goods': return <Package className="w-5 h-5" />;
      case 'Digital': return <Box className="w-5 h-5" />;
      case 'Services': return <Archive className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  const getDivisionColor = (type) => {
    switch(type) {
      case 'Physical Goods': return 'blue';
      case 'Digital': return 'green';
      case 'Services': return 'purple';
      default: return 'gray';
    }
  };

  const getDivisionStats = (divisionName) => {
    const count = products.filter(p =>
      (p.division || '').toLowerCase() === (divisionName || '').toLowerCase()
    ).length;
    return { items: count, growth: count > 0 ? `+${count}` : '0' };
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Stack spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', tracking: 'tight' }}>Divisions</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.6 }}>Manage your product categories and divisions</Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Plus className="w-5 h-5" />}
              onClick={() => navigate('/add-division')}
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
              Add Division
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
                    <FolderOpen className="w-5 h-5" />
                  </Box>
                  <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 1, opacity: 0.8, fontSize: '0.65rem' }}>Metrics</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{divisions.length.toLocaleString()}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>Total Active Divisions</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Main Section */}
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextField
              placeholder="Search divisions..."
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
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, nextView) => nextView && setViewMode(nextView)}
              size="small"
            >
              <ToggleButton value="grid"><Grid3X3 className="w-4 h-4" /></ToggleButton>
              <ToggleButton value="list"><List className="w-4 h-4" /></ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {viewMode === 'grid' ? (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {displayedDivisions.map((division) => (
                  <Grid item xs={12} sm={6} md={3} key={division.id}>
                    <Card 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        transition: 'all 0.3s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, borderColor: 'primary.main' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Avatar sx={{ bgcolor: alpha(getDivisionColor(division.type) === 'blue' ? '#3b82f6' : getDivisionColor(division.type) === 'green' ? '#10b981' : getDivisionColor(division.type) === 'purple' ? '#a855f7' : '#94a3b8', 0.1), color: getDivisionColor(division.type) === 'blue' ? '#3b82f6' : getDivisionColor(division.type) === 'green' ? '#10b981' : getDivisionColor(division.type) === 'purple' ? '#a855f7' : '#94a3b8' }}>
                          {getDivisionIcon(division.type)}
                        </Avatar>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={() => handleEditDivision(division)}><Edit2 className="w-4 h-4" /></IconButton>
                          <IconButton size="small" onClick={() => handleDeleteDivision(division.id)} color="error"><Trash2 className="w-4 h-4" /></IconButton>
                        </Stack>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>{division.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>{division.type}</Typography>
                        <Chip label={division.batchCode || 'N/A'} size="small" sx={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} />
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>Items</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 900 }}>{getDivisionStats(division.name).items}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>Products</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 900, color: 'success.main' }}>{getDivisionStats(division.name).growth}</Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Stack direction="row" spacing={1}>
                  <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</Button>
                  <Button disabled={currentPage * itemsPerPage >= divisionPageData.totalElements} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={divisionPageData.content || []}
                columns={columns}
                paginationMode="server"
                rowCount={divisionPageData.totalElements || 0}
                onPaginationModelChange={(model) => setCurrentPage(model.page + 1)}
                initialState={{ pagination: { paginationModel: { page: currentPage - 1, pageSize: itemsPerPage } } }}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
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
          )}
        </Paper>



      <Dialog open={Boolean(viewingDivision)} onClose={() => setViewingDivision(null)} PaperProps={{ sx: { borderRadius: 4, p: 1, width: '100%', maxWidth: 400 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: alpha('#10b981', 0.1), color: 'success.main' }}><Eye className="w-5 h-5" /></Avatar>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Details</Typography>
          </Stack>
          <IconButton onClick={() => setViewingDivision(null)}><X className="w-5 h-5" /></IconButton>
        </DialogTitle>
        <DialogContent>
          {viewingDivision && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>{viewingDivision.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>ID: #{viewingDivision.id}</Typography>
              </Box>
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>Type</Typography>
                  <Chip label={viewingDivision.type} size="small" color="primary" sx={{ fontWeight: 800, mt: 0.5 }} />
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>Total Items</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 900 }}>{getDivisionStats(viewingDivision.name).items}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>Products in Division</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 900, color: 'success.main' }}>{getDivisionStats(viewingDivision.name).growth}</Typography>
                </Paper>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button fullWidth variant="contained" color="inherit" onClick={() => setViewingDivision(null)} sx={{ borderRadius: 3, fontWeight: 800, bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'text.secondary' } }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  </Box>
  );
};

export default DivisionPage;
