import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Eye, 
  Search, 
  Package, 
  User, 
  CreditCard, 
  X, 
  MapPin, 
  Plus, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Edit2, 
  Trash2, 
  Mail, 
  Calendar, 
  Save, 
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { getOrderByCode } from '../Service.js/OrderService.js';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

const StocksPage = () => {
    const { orders, products, createStock, updateStock, deleteStock, stockLogs, addNotification } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || '{}'));
    const isAdmin = ['madhu', 'krishh', 'meera'].includes(currentUser?.name?.toLowerCase()) || currentUser?.role?.toLowerCase() === 'admin';
    const [currentPage, setCurrentPage] = useState(1);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [qrOrderDetails, setQrOrderDetails] = useState(null);
    const [qrLoading, setQrLoading] = useState(false);
    const itemsPerPage = 10;

    // ── Stock form state (used for Edit) ────────────────────────────────────────
    const navigate = useNavigate();
    const location = useLocation();
    const [highlightOrderId, setHighlightOrderId] = useState(null);

    // Open Stocks from customer view with a specific paid order in view
    const focusOrderIdFromNav = location.state?.focusOrderId;
    React.useEffect(() => {
        if (focusOrderIdFromNav == null) return;
        if (!(orders || []).length) return;

        const ord = orders.find(o => String(o.id) === String(focusOrderIdFromNav));
        if (ord && ord.paymentStatus === 'SUCCESS') {
            setSearchTerm(String(ord.id));
            setHighlightOrderId(String(ord.id));
            const t = setTimeout(() => setHighlightOrderId(null), 8000);
            navigate('.', { replace: true, state: {} });
            return () => clearTimeout(t);
        }
        navigate('.', { replace: true, state: {} });
    }, [focusOrderIdFromNav, orders, navigate]);

    // Debounce search term
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // ── Edit Stock modal state ─────────────────────────────────────────────



    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'SUCCESS': return 'green';
            case 'PENDING': return 'red';
            default: return 'gray';
        }
    };

    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return 'green';
            case 'CONFIRMED': return 'blue';
            case 'PENDING': return 'red';
            case 'CANCELLED': return 'red';
            case 'SHIPPED': return 'orange';
            default: return 'gray';
        }
    };

    const handleEditStock = (stock) => {
        navigate(`/edit-stock/${stock.id}`);
    };

    const handleDeleteStock = async (id) => {
        if (window.confirm('Are you sure you want to delete this stock entry?')) {
            const res = await deleteStock(id);
            if (res) {
                addNotification('Stock entry deleted successfully', 'success');
            }
        }
    };

    // ── Paid Transactions Column Definitions ───────────────────────────────────────



    const stockMovementColumns = [
        {
            field: 'productName',
            headerName: 'Product',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                const matchedProd = products.find(p => String(p.id) === String(params.row.productId));
                return (
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {matchedProd?.name || params.value || `Product #${params.row.productId}`}
                    </Typography>
                );
            }
        },
        {
            field: 'productId',
            headerName: 'Product Name',
            width: 150,
            renderCell: (params) => {
                const matchedProd = products.find(p => String(p.id) === String(params.value));
                return (
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {matchedProd?.name || params.row.productName || 'Unknown Product'}
                    </Typography>
                );
            }
        },

        {
            field: 'quantity',
            headerName: 'Qty',
            width: 100,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ 
                    fontWeight: 800, 
                    color: params.row.type === 'IN' ? 'success.main' : 'error.main' 
                }}>
                    {params.row.type === 'IN' ? '+' : '-'}{params.value}
                </Typography>
            )
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 100,
            renderCell: (params) => (
                <Chip 
                    icon={params.value === 'IN' ? <ArrowDownCircle className="w-3 h-3" /> : <ArrowUpCircle className="w-3 h-3" />}
                    label={params.value} 
                    size="small" 
                    color={params.value === 'IN' ? 'success' : 'error'}
                    sx={{ fontWeight: 800, fontSize: 10 }}
                />
            )
        },
        {
            field: 'createdAt',
            headerName: 'Date & Time',
            width: 200,
            valueGetter: (value, row) => {
                const raw = value ?? row?.createdAt ?? row?.created_at;
                if (!raw) return '—';
                const d = new Date(raw);
                return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                isAdmin && (
                    <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => handleEditStock(params.row)} color="info">
                            <Edit2 className="w-4 h-4" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteStock(params.row.id)} color="error">
                            <Trash2 className="w-4 h-4" />
                        </IconButton>
                    </Stack>
                )
            )
        }
    ];

    return (
        <Box sx={{ minHeight: 'calc(100vh - 80px)', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
            <Stack spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Page Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', tracking: 'tight' }}>Transactions List</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.6 }}>View successful transactions and stock movements</Typography>
                </Box>
                {isAdmin && (
                    <Button
                        variant="contained"
                        startIcon={<Plus className="w-5 h-5" />}
                        onClick={() => navigate('/add-stock')}
                        sx={{ 
                            borderRadius: 3, 
                            px: 3, 
                            py: 1.5, 
                            fontWeight: 800, 
                            bgcolor: 'success.main',
                            boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.2)',
                            '&:hover': { bgcolor: 'success.dark', boxShadow: '0 12px 20px -4px rgba(16, 185, 129, 0.3)' }
                        }}
                    >
                        Add Stock
                    </Button>
                )}
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {[
                    { 
                        label: 'Total Stock Entries', 
                        value: stockLogs.length.toLocaleString(), 
                        icon: ArrowDownCircle, 
                        color: 'success' 
                    },
                    { 
                        label: 'Low Stock Products', 
                        value: products.filter(p => (p.quantity || 0) < 20).length.toLocaleString(), 
                        icon: AlertTriangle, 
                        color: 'error' 
                    }
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



            {/* Stock Movements Section */}
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ArrowDownCircle className="w-5 h-5 text-success" />
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>Stock Movements</Typography>
                    </Box>
                    <Chip label={`${stockLogs.length} entries`} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                </Box>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={stockLogs}
                        columns={stockMovementColumns}
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
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
            </Paper>

            {/* Receipt Dialog */}
            <Dialog 
                open={Boolean(viewingOrder)} 
                onClose={() => setViewingOrder(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, p: 0, overflow: 'hidden' } }}
            >
                {viewingOrder && (
                    <Box sx={{ position: 'relative' }}>
                        {/* Receipt Header Gradient */}
                        <Box sx={{ 
                            height: 120, 
                            bgcolor: 'primary.main', 
                            backgroundImage: 'linear-gradient(135deg, #059669, #0d9488)',
                            opacity: 0.1,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0
                        }} />
                        
                        <DialogTitle sx={{ p: 4, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1, position: 'relative' }}>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', tracking: 'tight' }}>Nexus Receipt</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <CreditCard className="w-4 h-4" /> TRANSACTION ID: #ORD-{String(viewingOrder.id).padStart(4, '0')}
                                </Typography>
                            </Box>
                            <IconButton onClick={() => setViewingOrder(null)}>
                                <X className="w-6 h-6" />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent sx={{ p: 4 }}>
                            <Grid container spacing={4} sx={{ mb: 4 }}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', tracking: 'widest', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                        <User className="w-4 h-4 text-primary" /> Billed To
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{viewingOrder.customerName || 'Walk-in Customer'}</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Mail className="w-3.5 h-3.5" /> {viewingOrder.customerEmail || 'no-email@nexus.com'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', tracking: 'widest', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, justifyContent: 'flex-end' }}>
                                        <MapPin className="w-4 h-4 text-info" /> Delivery
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{viewingOrder.shippingAddress || 'Digital Product'}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                        <Calendar className="w-3.5 h-3.5" /> {viewingOrder.orderDate ? new Date(viewingOrder.orderDate).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, mb: 4, bgcolor: 'action.hover' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ '& th': { fontWeight: 900, fontSize: 10, textTransform: 'uppercase', color: 'text.secondary' } }}>
                                            <TableCell>Item Description</TableCell>
                                            <TableCell align="center">Qty</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(viewingOrder.products || viewingOrder.orderItems || []).map((product, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{product.name || product.productName || 'Item'}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>₹{parseFloat(product.price || 0).toFixed(2)}</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip label={`${product.quantity || 1} ${product.uom || 'pcs'}`} size="small" sx={{ fontWeight: 800, fontSize: 10 }} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{(parseFloat(product.price || 0) * parseFloat(product.quantity || 1)).toFixed(2)}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, border: '2px dashed', borderColor: 'divider', borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {qrLoading ? (
                                            <Box sx={{ height: 96, display: 'flex', alignItems: 'center' }}><Box className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></Box>
                                        ) : (
                                            <QRCodeCanvas value={`${window.location.origin}/receipt/${viewingOrder.orderCode || viewingOrder.id || ''}`} size={80} level="H" />
                                        )}
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Save className="w-3 h-3" /> DIGITAL QR
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack spacing={1}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Subtotal</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{(viewingOrder.products || viewingOrder.orderItems || []).reduce((sum, p) => sum + (parseFloat(p.price || 0) * parseFloat(p.quantity || 1)), 0).toFixed(2)}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>GST</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{parseFloat(viewingOrder.gst || 0).toFixed(2)}</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Total</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: 'success.main' }}>₹{parseFloat(viewingOrder.totalAmount || viewingOrder.total || 0).toFixed(2)}</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        
                        <DialogActions sx={{ p: 4, pt: 0, justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={1}>
                                <Chip label={`Status: ${viewingOrder.paymentStatus}`} color="success" size="small" sx={{ fontWeight: 800, fontSize: 10 }} />
                                <Chip label={`Order: ${viewingOrder.orderStatus}`} color="info" size="small" sx={{ fontWeight: 800, fontSize: 10 }} />
                            </Stack>
                            <Button variant="contained" color="inherit" onClick={() => setViewingOrder(null)} sx={{ borderRadius: 2, fontWeight: 800, bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'text.secondary' } }}>Close Receipt</Button>
                        </DialogActions>
                    </Box>
                )}
            </Dialog>
            </Stack>
        </Box>
    );
};

export default StocksPage;
