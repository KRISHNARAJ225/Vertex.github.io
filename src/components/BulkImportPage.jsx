import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ChevronLeft,
  FileBox,
  MonitorCheck,
  Package,
  Table as TableIcon,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Stack, 
  IconButton, 
  LinearProgress,
  Chip,
  Fade,
  Divider,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import { useData } from '../contexts/DataContext';

const BulkImportPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const glassBg = isDark ? 'rgba(30, 30, 50, 0.75)' : 'rgba(255, 255, 255, 0.7)';
  const glassBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)';
  const { addProduct, products, addNotification } = useData();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, processing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [importResults, setImportResults] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file) => {
    const allowedExtensions = ['xlsx', 'xls', 'csv', 'doc', 'docx', 'pdf', 'ppt', 'pptx'];
    const knownExts = ['xlsx','xls','csv','doc','docx','pdf','ppt','pptx','exe','php','bat','cmd','sh','js','ts','py','rb','pl','com','vbs','ps1','zip','rar','tar','gz'];

    if (!file) return 'No file selected';
    if (file.size > 5 * 1024 * 1024) return 'File size exceeds 5MB limit';

    const nameParts = file.name.split('.');
    // Block double extension files (e.g. file.xlsx.exe)
    if (nameParts.length > 2) {
      const penultimate = nameParts[nameParts.length - 2].toLowerCase();
      if (knownExts.includes(penultimate)) {
        return 'Double extension files are not allowed (e.g. file.xlsx.exe). Please rename your file.';
      }
    }

    const extension = nameParts[nameParts.length - 1].toLowerCase();
    if (!allowedExtensions.includes(extension)) return 'Unsupported file format. Please use Excel, CSV, Word, PDF, or PPT.';
    return null;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    const error = validateFile(droppedFile);
    
    if (error) {
      setErrorMsg(error);
      setUploadStatus('error');
    } else {
      setFile(droppedFile);
      setUploadStatus('idle');
      setErrorMsg('');
      setImportResults(null);
    }
  }, []);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const error = validateFile(selectedFile);
    
    if (error) {
      setErrorMsg(error);
      setUploadStatus('error');
    } else {
      setFile(selectedFile);
      setUploadStatus('idle');
      setErrorMsg('');
      setImportResults(null);
    }
  };

  const processImport = async () => {
    if (!file) return;

    setUploadStatus('processing');
    setUploadProgress(10);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setUploadProgress(40);

        let successCount = 0;
        let skipCount = 0;
        const errors = [];
        const failedRows = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          const rowLabel = `Row ${i + 1}`;

          // --- Required: Product Name ---
          const rawName = (row.name || row.ProductName || row['Product Name'] || '').toString().trim();
          if (!rawName) {
            const msg = `${rowLabel}: Product Name is required`;
            errors.push(msg);
            failedRows.push({ ...row, ErrorMessage: msg });
            addNotification(msg, 'error');
            skipCount++;
            continue;
          }

          // --- Required: Price (numbers only) ---
          const rawPrice = row.price ?? row.Price;
          const priceVal = parseFloat(rawPrice);
          if (rawPrice === undefined || rawPrice === null || rawPrice === '' || isNaN(priceVal)) {
            const msg = `${rowLabel}: Price is required and must be a valid number`;
            errors.push(msg);
            failedRows.push({ ...row, ErrorMessage: msg });
            addNotification(msg, 'error');
            skipCount++;
            continue;
          }
          if (priceVal <= 0) {
            const msg = `${rowLabel}: Price must be greater than 0`;
            errors.push(msg);
            failedRows.push({ ...row, ErrorMessage: msg });
            addNotification(msg, 'error');
            skipCount++;
            continue;
          }

          // --- Required: Expiry Date (must be a valid date, no plain text/letters) ---
          const rawExpiry = row.expiry || row.Expiry || row.expiryDate || row['Expiry Date'] || '';
          if (!rawExpiry) {
            const msg = `${rowLabel}: Expiry Date is required`;
            errors.push(msg);
            failedRows.push({ ...row, ErrorMessage: msg });
            addNotification(msg, 'error');
            skipCount++;
            continue;
          }
          const parsedExpiry = new Date(rawExpiry);
          if (isNaN(parsedExpiry.getTime())) {
            const msg = `${rowLabel}: Expiry Date must be a valid date (e.g. 2025-12-31), not text or letters`;
            errors.push(msg);
            failedRows.push({ ...row, ErrorMessage: msg });
            addNotification(msg, 'error');
            skipCount++;
            continue;
          }

          const productData = {
            name: rawName,
            price: priceVal,
            quantity: parseInt(row.stock || row.Stock || row.quantity || row.Quantity || 0, 10),
            uom: (row.uom || row.UOM || row.unit || 'pcs').toString().trim(),
            saleableStock: parseInt(row.saleableStock || row.salableStock || row.Stock || 0, 10),
            nonSaleableStock: parseInt(row.nonSaleableStock || row.unsaleableStock || 0, 10),
            expiryDate: parsedExpiry.toISOString().split('T')[0],
            divisionName: (row.division || row.Division || row.category || row.Category || '').toString().trim(),
            batchCode: (row.batchCode || row.batch || '').toString().trim(),
            imageUrl: (row.imageUrl || row.image || '').toString().trim()
          };

          setUploadProgress(40 + Math.floor((i / jsonData.length) * 50));

          try {
            const result = await addProduct(productData);
            if (result) successCount++;
            else skipCount++;
          } catch (err) {
            const msg = `${rowLabel}: ${err.message || 'Server error while saving product'}`;
            errors.push(msg);
            failedRows.push({ ...row, ErrorMessage: msg });
            addNotification(msg, 'error');
            skipCount++;
          }
        }

        setImportResults({
          total: jsonData.length,
          success: successCount,
          skipped: skipCount,
          errors: errors.slice(0, 5),
          failedRows
        });

        setUploadProgress(100);
        setUploadStatus('success');
        if (successCount > 0) addNotification(`Successfully imported ${successCount} product(s)`, 'success');
      } catch (err) {
        console.error('Parsing failed:', err);
        const msg = 'Failed to parse file. Ensure it is a valid Excel or CSV file.';
        setErrorMsg(msg);
        setUploadStatus('error');
        addNotification(msg, 'error');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { name: 'Example Product', price: 99.99, stock: 100, division: 'Electronics', expiry: '2025-12-31', uom: 'pcs' },
      { name: 'Demo Item', price: 45.00, stock: 50, division: 'Groceries', expiry: '', uom: 'kg' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Nexus_Product_Template.xlsx");
  };

  const handleDownloadFailed = () => {
    if (!importResults || !importResults.failedRows || importResults.failedRows.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(importResults.failedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Failed Records");
    XLSX.writeFile(wb, "Failed_Imports.xlsx");
  };

  return (
    <Box 
      sx={{ 
        minHeight: 'calc(100vh - 80px)', 
        p: { xs: 2, md: 4 },
        backgroundImage: 'url("/Login.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Stack spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: glassBg, backdropFilter: 'blur(10px)', p: 3, borderRadius: 4, border: `1px solid ${glassBorder}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
              <ChevronLeft className="w-5 h-5" />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', tracking: 'tight' }}>Bulk Import Manager</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.6 }}>Synchronize your product catalog using high-speed bulk upload</Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={2}>
            {importResults?.failedRows?.length > 0 && (
              <Button 
                variant="contained" 
                color="error"
                onClick={handleDownloadFailed}
                startIcon={<Download className="w-4 h-4" />}
                sx={{ borderRadius: 3, fontWeight: 800 }}
              >
                Download Failed
              </Button>
            )}
            <Button 
              variant="outlined" 
              onClick={() => { setFile(null); setUploadStatus('idle'); setImportResults(null); }}
              startIcon={<RefreshCw className="w-4 h-4" />}
              sx={{ borderRadius: 3, fontWeight: 800 }}
            >
              Reset
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {/* Row 1: Demo (Left) and Upload (Right) */}
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ p: 3, borderRadius: 5, width: '100%', maxWidth: 550, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `1px solid ${glassBorder}`, bgcolor: glassBg, backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FileBox className="w-6 h-6 text-primary" /> Step 1: Demo Template
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 2, lineHeight: 1.5 }}>
                To ensure a successful import, please use our standardized format. Download the template below, fill in your product details, and upload it in the next section.
              </Typography>
              
              <Stack spacing={1.5} sx={{ mb: 2 }}>
                <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', display: 'block', mb: 0.5 }}>REQUIRED FIELDS</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {['Product Name', 'Price', 'Stock', 'Division'].map(f => (
                      <Chip key={f} label={f} size="small" sx={{ fontWeight: 700, fontSize: 10 }} />
                    ))}
                  </Stack>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 0.5 }}>OPTIONAL FIELDS</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {['Expiry Date', 'UOM'].map(f => (
                      <Chip key={f} label={f} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: 10 }} />
                    ))}
                  </Stack>
                </Box>
              </Stack>

              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<Download className="w-5 h-5" />}
                onClick={handleDownloadTemplate}
                sx={{ 
                  borderRadius: 4, 
                  py: 1.5, 
                  fontWeight: 900,
                  bgcolor: 'text.primary',
                  color: 'background.paper',
                  '&:hover': { bgcolor: 'text.secondary' }
                }}
              >
                Download Template
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper 
              onDragEnter={handleDrag}
              sx={{ 
                p: 3, 
                borderRadius: 5, 
                border: '3px dashed', 
                borderColor: dragActive ? 'primary.main' : glassBorder,
                bgcolor: dragActive ? alpha('#4318FF', 0.05) : glassBg,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'center',
                width: '100%',
                maxWidth: 550,
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <input type="file" id="bulk-upload" onChange={handleChange} style={{ display: 'none' }} />
              
              {!file ? (
                <Stack spacing={3} alignItems="center">
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ width: 120, height: 120, borderRadius: '50%', bgcolor: alpha('#4318FF', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload className="w-12 h-12 text-primary" />
                    </Box>
                    <Box sx={{ position: 'absolute', bottom: 0, right: 0, p: 1, bgcolor: 'success.main', color: 'white', borderRadius: '50%', boxShadow: 2 }}>
                      <CheckCircle2 className="w-5 h-5" />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Upload your spreadsheet</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Drop your file here or click the button below to browse
                    </Typography>
                  </Box>
                  <label htmlFor="bulk-upload">
                    <Button variant="contained" component="span" sx={{ borderRadius: 4, px: 6, py: 2, fontWeight: 900, background: 'linear-gradient(135deg, #4318FF 0%, #2B12B7 100%)' }}>
                      Select File
                    </Button>
                  </label>
                </Stack>
              ) : (
                <Stack spacing={4} sx={{ width: '100%', maxWidth: 600 }}>
                  <Card variant="outlined" sx={{ p: 3, borderRadius: 4, border: '2px solid', borderColor: 'primary.lighter', bgcolor: alpha('#4318FF', 0.02) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
                        <TableIcon className="w-8 h-8" />
                      </Box>
                      <Box sx={{ textAlign: 'left', flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{file.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                          {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for processing
                        </Typography>
                      </Box>
                      <IconButton onClick={() => setFile(null)} color="error">
                        <X className="w-6 h-6" />
                      </IconButton>
                    </Box>
                  </Card>

                  {uploadStatus === 'idle' && (
                    <Button 
                      variant="contained" 
                      onClick={processImport}
                      sx={{ borderRadius: 4, py: 2.5, fontWeight: 900, fontSize: '1.1rem', background: 'linear-gradient(135deg, #05CD99 0%, #04b386 100%)' }}
                    >
                      Process & Import Data
                    </Button>
                  )}

                  {uploadStatus === 'processing' && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 900 }}>Parsing & Validating...</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 900 }}>{uploadProgress}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ height: 12, borderRadius: 6, bgcolor: alpha('#4318FF', 0.1) }} 
                      />
                    </Box>
                  )}

                  {uploadStatus === 'success' && (
                    <Box sx={{ p: 3, bgcolor: alpha('#05CD99', 0.05), borderRadius: 4, border: '1px solid', borderColor: 'success.light' }}>
                      <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-2" />
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'success.main' }}>Processing Complete</Typography>
                    </Box>
                  )}
                </Stack>
              )}

              {dragActive && (
                <Box 
                  onDragEnter={handleDrag} 
                  onDragLeave={handleDrag} 
                  onDragOver={handleDrag} 
                  onDrop={handleDrop}
                  sx={{ position: 'absolute', inset: 0, zIndex: 10 }}
                />
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Row 2: Validation Results / Import Summary */}
        <Fade in={Boolean(importResults || uploadStatus === 'error')}>
          <Paper sx={{ p: 4, borderRadius: 5, border: `1px solid ${glassBorder}`, bgcolor: glassBg, backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <MonitorCheck className="w-7 h-7 text-primary" /> Import Validation Results
            </Typography>

            {uploadStatus === 'error' ? (
              <Box sx={{ p: 3, bgcolor: alpha('#FF3D00', 0.05), borderRadius: 4, border: '1px solid', borderColor: 'error.light', display: 'flex', gap: 2 }}>
                <AlertCircle className="text-error w-6 h-6" />
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'error.main' }}>{errorMsg}</Typography>
              </Box>
            ) : importResults && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    <Card sx={{ p: 3, borderRadius: 4, bgcolor: alpha('#4318FF', 0.03) }}>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1 }}>TOTAL RECORDS</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>{importResults.total}</Typography>
                    </Card>
                    <Card sx={{ p: 3, borderRadius: 4, bgcolor: alpha('#05CD99', 0.03) }}>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: 'success.main', display: 'block', mb: 1 }}>SUCCESSFULLY IMPORTED</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'success.main' }}>{importResults.success}</Typography>
                    </Card>
                    <Card sx={{ p: 3, borderRadius: 4, bgcolor: alpha('#FF3D00', 0.03) }}>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: 'error.main', display: 'block', mb: 1 }}>SKIPPED / FAILED</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'error.main' }}>{importResults.skipped}</Typography>
                    </Card>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4 }}>
                    <Table>
                      <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 900 }}>Validation Logs</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 900 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {importResults.errors.length > 0 ? (
                          importResults.errors.map((err, i) => (
                            <TableRow key={i}>
                              <TableCell sx={{ color: 'error.main', fontWeight: 600 }}>{err}</TableCell>
                              <TableCell align="right"><Chip label="FAILED" size="small" color="error" sx={{ fontWeight: 800, fontSize: 10 }} /></TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} sx={{ py: 6, textAlign: 'center' }}>
                              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2 opacity-50" />
                              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>No validation errors found in the imported data.</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => navigate('/products')}
                      sx={{ borderRadius: 3, px: 4, fontWeight: 800 }}
                    >
                      Return to Products
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => navigate('/products')}
                      sx={{ borderRadius: 3, px: 6, fontWeight: 900, background: 'linear-gradient(135deg, #4318FF 0%, #2B12B7 100%)' }}
                    >
                      Finish & Review
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Fade>
      </Stack>
    </Box>
  );
};

export default BulkImportPage;
