import React, { useState } from 'react';
import { 
  Eye, 
  Search, 
  CreditCard, 
  X, 
  MapPin, 
  Mail, 
  Calendar, 
  Save, 
  User,
  Receipt,
  Download,
  Table as TableIcon,
  FileText,
  MonitorCheck
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';
import { Document, Packer, Paragraph, TextRun, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, WidthType } from 'docx';
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
  Tooltip,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Menu,
  MenuItem
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

const InvoicePage = () => {
    const { orders } = useData();
    const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || '{}'));
    const isAdmin = ['madhu', 'krishh', 'meera'].includes(currentUser?.name?.toLowerCase()) || currentUser?.role?.toLowerCase() === 'admin';
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [viewingOrder, setViewingOrder] = useState(null);
    const [qrLoading, setQrLoading] = useState(false);
    const [exportAnchor, setExportAnchor] = useState(null);
    const navigate = useNavigate();

    // Debounce search term
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Filter only SUCCESS transactions from the full orders list
    const paidOrders = (orders || []).filter(order => order.paymentStatus === 'SUCCESS');

    // Apply search filter
    const filteredPaidOrders = paidOrders.filter(order => {
        const s = debouncedSearch.toLowerCase();
        return (
            (order.customerName || '').toLowerCase().includes(s) ||
            (order.customerEmail || '').toLowerCase().includes(s) ||
            String(order.id || '').includes(s)
        );
    });

    const handleViewOrder = (order) => {
        navigate(`/view-invoice/${order.id}`);
    };

    const handleExportClick = (event) => {
        setExportAnchor(event.currentTarget);
    };

    const handleExportClose = () => {
        setExportAnchor(null);
    };

    // Download a single order as an elegant Word document receipt
    const handleDownloadOrder = (order) => {
        const items = (order.products || order.orderItems || []);
        
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: "NEXUS INVOICE RECEIPT", bold: true, size: 36, color: "1E3A8A" })
                        ],
                        spacing: { after: 300 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Order ID: ORD-${String(order.id).padStart(4, '0')}`, bold: true, size: 24 }),
                        ],
                        spacing: { after: 120 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Customer Name: ${order.customerName || 'N/A'}`, size: 20 }),
                        ],
                        spacing: { after: 80 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Email: ${order.customerEmail || 'N/A'}`, size: 20 }),
                        ],
                        spacing: { after: 80 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, size: 20 }),
                        ],
                        spacing: { after: 80 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Payment Status: ${order.paymentStatus}`, bold: true, size: 20, color: order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS' ? "10B981" : "EF4444" }),
                        ],
                        spacing: { after: 300 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "ORDER ITEMS", bold: true, size: 24, color: "1E3A8A" })
                        ],
                        spacing: { after: 150 }
                    }),
                    new DocxTable({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new DocxTableRow({
                                children: [
                                    new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Item Name", bold: true })] })] }),
                                    new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Qty", bold: true })] })] }),
                                    new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Price (₹)", bold: true })] })] }),
                                    new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Total (₹)", bold: true })] })] })
                                ]
                            }),
                            ...items.map(p => new DocxTableRow({
                                children: [
                                    new DocxTableCell({ children: [new Paragraph(p.name || p.productName || 'Item')] }),
                                    new DocxTableCell({ children: [new Paragraph(String(p.quantity || 1))] }),
                                    new DocxTableCell({ children: [new Paragraph(parseFloat(p.price || 0).toFixed(2))] }),
                                    new DocxTableCell({ children: [new Paragraph((parseFloat(p.price || 0) * (p.quantity || 1)).toFixed(2))] })
                                ]
                            })),
                            new DocxTableRow({
                                children: [
                                    new DocxTableCell({ columnSpan: 3, children: [new Paragraph({ children: [new TextRun({ text: "TOTAL AMOUNT", bold: true })] })] }),
                                    new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: `₹${parseFloat(order.totalAmount || 0).toFixed(2)}`, bold: true })] })] })
                                ]
                            })
                        ]
                    })
                ]
            }]
        });

        Packer.toBlob(doc).then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice_ORD-${String(order.id).padStart(4, '0')}_${new Date().toISOString().split('T')[0]}.docx`;
            link.click();
            URL.revokeObjectURL(url);
        });
    };

    const handleExport = (type) => {
        handleExportClose();
        const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Qty', 'Total Amount (₹)'];
        const data = filteredPaidOrders.map(order => {
            const qty = (order.products || order.orderItems || []).reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
            return {
                id: `ORD-${String(order.id).padStart(4, '0')}`,
                customer: order.customerName,
                email: order.customerEmail,
                date: new Date(order.orderDate).toLocaleDateString(),
                qty: qty,
                amount: order.totalAmount.toFixed(2)
            };
        });

        if (type === 'csv') {
            const csvContent = "\uFEFF" + [
                headers.join(','),
                ...data.map(r => Object.values(r).join(','))
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Nexus_Invoices_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        } else if (type === 'excel') {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Invoices");
            XLSX.writeFile(wb, `Nexus_Invoices_${new Date().toISOString().split('T')[0]}.xlsx`);
        } else if (type === 'word') {
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [new TextRun({ text: "Nexus Invoice Report", bold: true, size: 32 })],
                        }),
                        new DocxTable({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            rows: [
                                new DocxTableRow({
                                    children: headers.map(h => new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] }))
                                }),
                                ...data.map(r => new DocxTableRow({
                                    children: Object.values(r).map(v => new DocxTableCell({ children: [new Paragraph(String(v))] }))
                                }))
                            ]
                        })
                    ]
                }]
            });
            Packer.toBlob(doc).then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Nexus_Invoices_${new Date().toISOString().split('T')[0]}.docx`;
                link.click();
                URL.revokeObjectURL(url);
            });
        } else if (type === 'ppt') {
            let pptx = new PptxGenJS();
            let slide = pptx.addSlide();
            slide.addText("Nexus Invoice Report", { x: 0.5, y: 0.5, fontSize: 24, bold: true });
            const tableData = [headers, ...data.map(r => Object.values(r))];
            slide.addTable(tableData, { x: 0.5, y: 1.2, w: 9, fontSize: 10 });
            pptx.writeFile({ fileName: `Nexus_Invoices_${new Date().toISOString().split('T')[0]}.pptx` });
        } else if (type === 'pdf') {
            // Simplified PDF via Print
            window.print();
        }
    };

    const transactionColumns = [
        {
            field: 'id',
            headerName: 'Order ID',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
                    #ORD-{String(params.value).padStart(4, '0')}
                </Typography>
            )
        },
        {
            field: 'customerName',
            headerName: 'Customer',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{params.value}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{params.row.customerEmail}</Typography>
                </Box>
            )
        },
        {
            field: 'orderDate',
            headerName: 'Date',
            width: 150,
            valueGetter: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            field: 'qty',
            headerName: 'Qty',
            width: 100,
            valueGetter: (value, row) => {
                const prods = row.products || row.orderItems || [];
                return prods.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
            },
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 800 }}>{params.value}</Typography>
            )
        },
        {
            field: 'totalAmount',
            headerName: 'Amount',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{(params.value || 0).toFixed(2)}</Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    {isAdmin && (
                        <Tooltip title="View Receipt">
                            <IconButton size="small" onClick={() => handleViewOrder(params.row)} color="primary">
                                <Eye className="w-4 h-4" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Download Invoice">
                        <IconButton size="small" onClick={() => handleDownloadOrder(params.row)} color="success">
                            <Download className="w-4 h-4" />
                        </IconButton>
                    </Tooltip>
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
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', tracking: 'tight' }}>Invoices</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.6 }}>Manage and view all paid transaction invoices</Typography>
                </Box>
            </Box>

            {/* Stats Summary */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {[
                    { label: 'Total Invoices', value: paidOrders.length, icon: Receipt, color: 'primary' },
                    { label: 'Total Paid Amount', value: `₹${paidOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: CreditCard, color: 'success' },
                    { label: 'Avg Invoice Value', value: `₹${(paidOrders.length > 0 ? paidOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) / paidOrders.length : 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Search, color: 'info' }
                ].map((stat, idx) => (
                    <Card 
                        key={idx} 
                        sx={{ 
                            p: 3, 
                            borderRadius: 4, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            '&:hover': { 
                                transform: 'translateY(-4px)', 
                                boxShadow: (t) => `0 12px 24px -10px ${alpha(t.palette[stat.color].main, 0.2)}`,
                                borderColor: `${stat.color}.light`,
                                bgcolor: (t) => alpha(t.palette[stat.color].main, 0.02)
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${stat.color}.lighter`, color: `${stat.color}.main` }}>
                                <stat.icon size={20} />
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>{stat.label}</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>{stat.value}</Typography>
                    </Card>
                ))}
            </Box>

            {/* Invoices Table */}
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Paid Transactions</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                            placeholder="Search invoices..."
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
                                    sx: { borderRadius: 3, width: { xs: '100%', sm: 300 } }
                                }
                            }}
                        />
                        {isAdmin && (
                            <>
                                <Button
                                    variant="contained"
                                    startIcon={<Download className="w-4 h-4" />}
                                    onClick={handleExportClick}
                                    sx={{
                                        borderRadius: 3,
                                        px: 3,
                                        py: 1,
                                        fontWeight: 800,
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #4318FF 0%, #2B12B7 100%)',
                                        boxShadow: '0 4px 12px -2px rgba(67, 24, 255, 0.3)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #2B12B7 0%, #4318FF 100%)',
                                            boxShadow: '0 8px 20px -4px rgba(67, 24, 255, 0.4)',
                                            transform: 'translateY(-2px)'
                                        },
                                        '&:active': {
                                            transform: 'translateY(0)'
                                        }
                                    }}
                                >
                                    Export
                                </Button>
                                <Menu
                                    anchorEl={exportAnchor}
                                    open={Boolean(exportAnchor)}
                                    onClose={handleExportClose}
                                    PaperProps={{
                                        sx: {
                                            mt: 1.5,
                                            borderRadius: 4,
                                            minWidth: 200,
                                            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            overflow: 'hidden',
                                            p: 1
                                        }
                                    }}
                                >
                                    <MenuItem onClick={() => handleExport('excel')} sx={{ borderRadius: 2, py: 1.5, gap: 2, '&:hover': { bgcolor: alpha('#1D6F42', 0.1), color: '#1D6F42' } }}>
                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#1D6F42', 0.1), color: '#1D6F42', display: 'flex' }}>
                                            <TableIcon className="w-4 h-4" />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Export to Excel</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleExport('word')} sx={{ borderRadius: 2, py: 1.5, gap: 2, '&:hover': { bgcolor: alpha('#2B579A', 0.1), color: '#2B579A' } }}>
                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#2B579A', 0.1), color: '#2B579A', display: 'flex' }}>
                                            <FileText className="w-4 h-4" />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Export to Word</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleExport('pdf')} sx={{ borderRadius: 2, py: 1.5, gap: 2, '&:hover': { bgcolor: alpha('#F40F02', 0.1), color: '#F40F02' } }}>
                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#F40F02', 0.1), color: '#F40F02', display: 'flex' }}>
                                            <FileText className="w-4 h-4" />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Export to PDF</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleExport('ppt')} sx={{ borderRadius: 2, py: 1.5, gap: 2, '&:hover': { bgcolor: alpha('#D24726', 0.1), color: '#D24726' } }}>
                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#D24726', 0.1), color: '#D24726', display: 'flex' }}>
                                            <MonitorCheck className="w-4 h-4" />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Export to PPT</Typography>
                                    </MenuItem>
                                    <Divider sx={{ my: 1, opacity: 0.5 }} />
                                    <MenuItem onClick={() => handleExport('csv')} sx={{ borderRadius: 2, py: 1.5, gap: 2, '&:hover': { bgcolor: alpha('#4318FF', 0.1), color: '#4318FF' } }}>
                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#4318FF', 0.1), color: '#4318FF', display: 'flex' }}>
                                            <Download className="w-4 h-4" />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Export as CSV</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Box>
                <Box sx={{ height: 480, width: '100%' }}>
                    <DataGrid
                        rows={filteredPaidOrders}
                        columns={transactionColumns}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
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
                                    bgcolor: alpha('#4318FF', 0.04),
                                    cursor: 'pointer'
                                }
                            },
                            '& ::-webkit-scrollbar': { width: '6px', height: '6px' },
                            '& ::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '10px' },
                            '& ::-webkit-scrollbar-thumb:hover': { backgroundColor: 'rgba(0, 0, 0, 0.15)' }
                        }}
                    />
                </Box>
            </Paper>


            </Stack>
        </Box>
    );
};

export default InvoicePage;
