import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { getOrderByCode } from '../Service.js/OrderService.js';
import { 
  ArrowLeft, 
  CreditCard, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Save, 
  Download,
  Info
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, WidthType } from 'docx';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Stack, 
  IconButton, 
  Grid, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  CircularProgress
} from '@mui/material';

const ViewInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useData();
  const [order, setOrder] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    if (!orders?.length) return;
    const found = orders.find(o => String(o.id) === String(id));
    if (found) {
      setOrder(found);
      if (found.orderCode) {
        setQrLoading(true);
        getOrderByCode(found.orderCode)
          .catch((e) => console.error('Failed to fetch order details for QR', e))
          .finally(() => setQrLoading(false));
      }
    }
  }, [id, orders]);

  const handleDownloadOrder = (orderToDownload) => {
    if (!orderToDownload) return;
    const items = (orderToDownload.products || orderToDownload.orderItems || []);
    
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
                        new TextRun({ text: `Order ID: ORD-${String(orderToDownload.id).padStart(4, '0')}`, bold: true, size: 24 }),
                    ],
                    spacing: { after: 120 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `Customer Name: ${orderToDownload.customerName || 'N/A'}`, size: 20 }),
                    ],
                    spacing: { after: 80 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `Email: ${orderToDownload.customerEmail || 'N/A'}`, size: 20 }),
                    ],
                    spacing: { after: 80 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `Order Date: ${new Date(orderToDownload.orderDate).toLocaleDateString()}`, size: 20 }),
                    ],
                    spacing: { after: 80 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `Payment Status: ${orderToDownload.paymentStatus}`, bold: true, size: 20, color: orderToDownload.paymentStatus === 'PAID' || orderToDownload.paymentStatus === 'SUCCESS' ? "10B981" : "EF4444" }),
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
                                new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: `₹${parseFloat(orderToDownload.totalAmount || 0).toFixed(2)}`, bold: true })] })] })
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
        link.download = `Invoice_ORD-${String(orderToDownload.id).padStart(4, '0')}_${new Date().toISOString().split('T')[0]}.docx`;
        link.click();
        URL.revokeObjectURL(url);
    });
  };

  if (!order) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={48} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Loading Invoice...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      position: 'relative',
      backgroundImage: 'url("/Login.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        zIndex: 0
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 2, md: 4 } }}>
        <Stack spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
          
          {/* Premium Header */}
          <Paper 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              borderRadius: 6, 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
            <Box sx={{ position: 'absolute', bottom: -50, left: 100, width: 150, height: 150, bgcolor: 'rgba(45, 212, 191, 0.05)', borderRadius: '50%', filter: 'blur(50px)' }} />
            
            <Stack direction="row" spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              <IconButton 
                onClick={() => navigate('/invoice')}
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
                  TRANSACTION RECEIPT
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, tracking: 'tight', color: '#f8fafc' }}>
                  Invoice ORD-{String(order.id).padStart(4, '0')}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Premium Invoice Card */}
          <Paper sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.1)', bgcolor: 'background.paper' }}>
            {/* Top Info Banner */}
            <Box sx={{ height: 80, bgcolor: (theme) => alpha(theme.palette.success.main, 0.1), display: 'flex', alignItems: 'center', px: 4, justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'success.main' }}>Nexus Invoice</Typography>
              <Stack direction="row" spacing={1.5}>
                <Chip label={`Status: ${order.paymentStatus}`} color="success" size="small" sx={{ fontWeight: 800, fontSize: 10 }} />
                {order.orderStatus && (
                  <Chip label={`Order: ${order.orderStatus}`} color="info" size="small" sx={{ fontWeight: 800, fontSize: 10 }} />
                )}
              </Stack>
            </Box>

            <Box sx={{ p: { xs: 4, md: 6 } }}>
              {/* Customer and Order Info */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', tracking: 'widest', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <User className="w-4 h-4 text-primary" /> Billed To
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{order.customerName || 'Walk-in Customer'}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Mail className="w-3.5 h-3.5" /> {order.customerEmail || 'no-email@nexus.com'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', tracking: 'widest', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Info className="w-4 h-4 text-info" /> Details
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Order ID: #ORD-{String(order.id).padStart(4, '0')}</Typography>
                  {order.shippingAddress && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                      <MapPin className="w-3.5 h-3.5" /> {order.shippingAddress}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Calendar className="w-3.5 h-3.5" /> Date: {new Date(order.orderDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              {/* Items Table */}
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900 }}>Description</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 900 }}>Qty</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900 }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(order.products || order.orderItems || []).map((p, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name || p.productName}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>₹{parseFloat(p.price || 0).toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={`${p.quantity || 1} ${p.uom || 'pcs'}`} size="small" sx={{ fontWeight: 800, fontSize: 10 }} />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{(parseFloat(p.price || 0) * parseFloat(p.quantity || 1)).toFixed(2)}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Total and QR Code section */}
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: '2px dashed', borderColor: 'divider', borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: { xs: '100%', sm: 160 }, mx: 'auto' }}>
                    {qrLoading ? (
                      <Box sx={{ height: 80, display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : (
                      <QRCodeCanvas value={`${window.location.origin}/receipt/${order.orderCode || order.id}`} size={80} level="H" />
                    )}
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Save className="w-3 h-3" /> DIGITAL QR
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1} sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Subtotal</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{(order.products || order.orderItems || []).reduce((sum, p) => sum + (parseFloat(p.price || 0) * parseFloat(p.quantity || 1)), 0).toFixed(2)}</Typography>
                    </Box>
                    {parseFloat(order.gst) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>GST</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{parseFloat(order.gst).toFixed(2)}</Typography>
                      </Box>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Total Paid</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'success.main' }}>₹{parseFloat(order.totalAmount || order.total || 0).toFixed(2)}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box sx={{ mt: 6, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Download className="w-4 h-4" />}
                  onClick={() => handleDownloadOrder(order)}
                  sx={{ borderRadius: 3, py: 1.5, px: 4, fontWeight: 800 }}
                >
                  Download Word
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/invoice')} 
                  sx={{ 
                    borderRadius: 3, 
                    py: 1.5, 
                    px: 6, 
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #4318FF 0%, #2B12B7 100%)',
                    boxShadow: '0 4px 12px -2px rgba(67, 24, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2B12B7 0%, #4318FF 100%)'
                    }
                  }}
                >
                  Return to Invoices
                </Button>
              </Box>
            </Box>
          </Paper>

        </Stack>
      </Box>
    </Box>
  );
};

export default ViewInvoicePage;
