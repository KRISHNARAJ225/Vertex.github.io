import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  X, 
  Eye, 
  Edit2, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Plus,
  ArrowRight,
  AtSign
} from 'lucide-react';
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
  Avatar,
  Grid,
  Divider,
  AvatarGroup
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

const UserPage = () => {
  const { registeredUsers, fetchUsersPage, updateUser, deleteUser, registerUser } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingUser, setViewingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', role: '', username: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users on mount to ensure list is populated
  React.useEffect(() => {
    const controller = new AbortController();
    fetchUsersPage(0, 1000, '', controller.signal);
    return () => controller.abort();
  }, [fetchUsersPage]);

  const filteredUsers = (registeredUsers || []).filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openViewModal = (user) => {
    setViewingUser(user);
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setSuccessMsg('');
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      username: user.username || '',
    });
  };


  const handleStartEdit = () => {
    setIsEditing(true);
    setShowDeleteConfirm(false);
    setSuccessMsg('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (viewingUser) {
      setEditForm({
        name: viewingUser.name || '',
        email: viewingUser.email || '',
        phone: viewingUser.phone || '',
        role: viewingUser.role || 'user',
        username: viewingUser.username || '',
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      alert('Name and Email are required.');
      return;
    }
    if (!viewingUser?.id) {
      alert('Error: User ID is missing. Cannot update.');
      return;
    }
    setEditLoading(true);
    try {
      const success = await updateUser(viewingUser.id, editForm);
      if (success) {
        // Update the viewing user with new data
        setViewingUser(prev => ({ ...prev, ...editForm }));
        setIsEditing(false);
        setSuccessMsg('User updated successfully!');
        setTimeout(() => setSuccessMsg(''), 2500);
      } else {
        alert('Failed to update user. Please try again.');
      }
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('An error occurred while saving changes.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setDeleteLoading(true);
    try {
      await deleteUser(viewingUser.id);
      setViewingUser(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      field: 'userDetails',
      headerName: 'User Details',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'primary.lighter', 
              color: 'primary.main',
              fontWeight: 800,
              fontSize: 14,
              border: '1px solid',
              borderColor: 'primary.light'
            }}
          >
            {(params.row.name || params.row.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>{params.row.name || params.row.username}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>@{params.row.username || 'n/a'}</Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'contact',
      headerName: 'Contact Info',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Mail className="w-3 h-3 opacity-50" />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{params.row.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone className="w-3 h-3 opacity-50" />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{params.row.phone || 'N/A'}</Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value || 'user'} 
          size="small" 
          color="primary"
          variant="soft"
          sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 10, px: 1 }}
        />
      )
    },
    {
      field: 'registeredAt',
      headerName: 'Registered At',
      width: 150,
      valueGetter: (value) => value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'
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
            <IconButton size="small" onClick={() => openViewModal(params.row)} color="primary">
              <Eye className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton 
              size="small" 
              onClick={() => navigate(`/edit-user/${params.row.id}`)} 
              color="info"
            >
              <Edit2 className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              onClick={() => { openViewModal(params.row); setTimeout(() => setShowDeleteConfirm(true), 100); }} 
              color="error"
            >
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  const closeModal = () => {
    setViewingUser(null);
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setSuccessMsg('');
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Stack spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', tracking: 'tight' }}>User Management</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.6 }}>View registered users and their details</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus className="w-5 h-5" />}
          onClick={() => navigate('/add-user')}
          sx={{ 
            borderRadius: 3, 
            px: 3, 
            py: 1.5, 
            fontWeight: 800, 
            bgcolor: 'primary.main',
            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'primary.dark', boxShadow: '0 12px 20px -4px rgba(0,0,0,0.2)' }
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {[
          { label: 'Total Users', value: (registeredUsers || []).length.toLocaleString(), icon: User, color: 'primary' },
          { label: 'Active Sessions', value: '12', icon: Shield, color: 'success' },
          { label: 'New This Week', value: '4', icon: Calendar, color: 'info' }
        ].map((stat, idx) => (
          <Card 
            key={idx}
            sx={{ 
              p: 3, 
              borderRadius: 4, 
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

      {/* Recent Registrations — premium username grid (UI only; same click → view modal) */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 5,
          border: '1px solid',
          borderColor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.22 : 0.12),
          background: (t) =>
            t.palette.mode === 'dark'
              ? `linear-gradient(155deg, ${alpha('#1e1b4b', 0.92)} 0%, ${alpha('#0f172a', 0.98)} 45%, ${alpha('#312e81', 0.35)} 100%)`
              : `linear-gradient(155deg, ${alpha('#faf5ff', 0.95)} 0%, #ffffff 42%, ${alpha('#eff6ff', 0.9)} 100%)`,
          boxShadow: (t) =>
            t.palette.mode === 'dark'
              ? `0 20px 40px -20px rgba(0,0,0,0.55), inset 0 1px 0 ${alpha('#fff', 0.06)}`
              : `0 24px 48px -20px ${alpha('#4318FF', 0.2)}, inset 0 1px 0 ${alpha('#fff', 0.9)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.55), rgba(37,99,235,0.45), rgba(6,182,212,0.4))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #7c3aed 0%, #2563eb 50%, #0891b2 100%)',
            opacity: 0.95,
          }}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ justifyContent: 'space-between', mb: 3, position: 'relative', zIndex: 1, pt: 0.5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.15))',
                border: '1px solid',
                borderColor: (t) => alpha(t.palette.primary.main, 0.25),
                boxShadow: `0 8px 24px -8px ${alpha('#4318FF', 0.35)}`,
              }}
            >
              <Calendar className="w-5 h-5" style={{ color: '#6366f1' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                Recent Registrations
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.02em' }}>
                Latest profiles · tap a card to open details
              </Typography>
            </Box>
          </Stack>
          <Chip
            label="Premium roster"
            size="small"
            sx={{
              alignSelf: { xs: 'flex-start', sm: 'center' },
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              height: 28,
              px: 1,
              borderRadius: 2,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
              color: 'primary.main',
              border: '1px solid',
              borderColor: (t) => alpha(t.palette.primary.main, 0.2),
            }}
          />
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(5, minmax(0, 1fr))',
            },
            gap: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {(registeredUsers || []).slice(-5).reverse().map((user, idx) => (
            <Card
              key={user.id}
              elevation={0}
              onClick={() => openViewModal(user)}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                p: 2.25,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (t) => alpha(t.palette.background.paper, t.palette.mode === 'dark' ? 0.45 : 0.72),
                backdropFilter: 'blur(12px)',
                transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease, border-color 0.2s ease',
                boxShadow: '0 4px 20px -8px rgba(15, 23, 42, 0.12)',
                '&:hover': {
                  transform: 'translateY(-6px) scale(1.02)',
                  borderColor: (t) => alpha(t.palette.primary.main, 0.45),
                  boxShadow: `0 20px 40px -16px ${alpha('#4318FF', 0.35)}, 0 0 0 1px ${alpha('#4318FF', 0.12)}`,
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  fontWeight: 900,
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  color: 'text.disabled',
                }}
              >
                {String(idx + 1).padStart(2, '0')}
              </Typography>

              <Stack direction="row" spacing={1.75} alignItems="center" sx={{ mb: 2 }}>
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #2563eb 55%, #0891b2 100%)',
                    boxShadow: (t) =>
                      `0 10px 28px -10px ${alpha('#2563eb', 0.65)}, 0 0 0 3px ${alpha(t.palette.background.paper, 0.95)}`,
                  }}
                >
                  {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 900,
                      noWrap: true,
                      letterSpacing: '-0.02em',
                      fontSize: '0.95rem',
                      lineHeight: 1.35,
                    }}
                  >
                    {user.name || user.username}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75 }}>
                    <AtSign className="w-3 h-3 shrink-0" style={{ opacity: 0.55 }} />
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        noWrap: true,
                        fontWeight: 700,
                        fontFamily: '"SF Mono", "Roboto Mono", ui-monospace, monospace',
                        fontSize: '0.72rem',
                        letterSpacing: '0.04em',
                        color: 'primary.main',
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                        px: 1,
                        py: 0.35,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: (t) => alpha(t.palette.primary.main, 0.15),
                      }}
                    >
                      {user.username || 'n/a'}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Divider sx={{ my: 0.5, borderStyle: 'dashed', opacity: 0.6 }} />

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5 }}>
                <Chip
                  label={(user.role || 'user').toUpperCase()}
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 900,
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                    color: 'primary.dark',
                    border: 'none',
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  {user.registeredAt ? new Date(user.registeredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'New'}
                </Typography>
              </Stack>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* Main Table Section */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            placeholder="Search users..."
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
        </Box>

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
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
                  bgcolor: alpha('#4318FF', 0.08),
                  transform: 'translateY(-1px)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px -4px rgba(67, 24, 255, 0.1)'
                }
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 800
              }
            }}
          />
        </Box>
      </Paper>

      {/* View/Edit User Dialog */}
      <Dialog 
        open={Boolean(viewingUser)} 
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box sx={{ 
            height: 140, 
            bgcolor: 'primary.main', 
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            px: 3,
            pb: 2,
            backgroundImage: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            overflow: 'hidden'
          }}>
            {/* Decorative circles */}
            <Box sx={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
            
            <IconButton 
              onClick={closeModal} 
              sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            >
              <X className="w-5 h-5" />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
              <Avatar 
                sx={{ 
                  width: 72, 
                  height: 72, 
                  bgcolor: 'background.paper', 
                  color: 'primary.main', 
                  fontWeight: 900, 
                  fontSize: 28,
                  border: '4px solid',
                  borderColor: 'rgba(255,255,255,0.2)',
                  boxShadow: 3
                }}
              >
                {(viewingUser?.name || viewingUser?.username || 'U').charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, lineHeight: 1.2 }}>
                  {isEditing ? 'Editing Profile' : (viewingUser?.name || viewingUser?.username)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  @{viewingUser?.username || 'n/a'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          {viewingUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {successMsg && (
                <Chip 
                  icon={<Check className="w-4 h-4" />} 
                  label={successMsg} 
                  color="success" 
                  sx={{ borderRadius: 2, fontWeight: 700 }} 
                />
              )}

              {showDeleteConfirm && (
                <Paper sx={{ p: 2, bgcolor: 'error.lighter', border: '1px solid', borderColor: 'error.light', borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <AlertTriangle className="text-error" />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'error.main' }}>Delete user account?</Typography>
                      <Typography variant="caption" sx={{ color: 'error.dark' }}>This action is permanent and cannot be reversed.</Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button fullWidth variant="contained" color="error" size="small" onClick={handleDeleteUser} sx={{ borderRadius: 2 }}>Delete</Button>
                    <Button fullWidth variant="outlined" size="small" onClick={() => setShowDeleteConfirm(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
                  </Stack>
                </Paper>
              )}

              {!isEditing ? (
                <Stack spacing={2.5}>
                  {[
                    { icon: Mail, label: 'Email Address', value: viewingUser.email },
                    { icon: Phone, label: 'Phone Number', value: viewingUser.phone || 'Not provided' },
                    { icon: Shield, label: 'Account Role', value: viewingUser.role || 'user', isBadge: true },
                    { icon: Calendar, label: 'Joined On', value: viewingUser.registeredAt ? new Date(viewingUser.registeredAt).toLocaleDateString(undefined, { dateStyle: 'full' }) : 'N/A' }
                  ].map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', color: 'text.secondary' }}>
                        <item.icon className="w-5 h-5" />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>{item.label}</Typography>
                        {item.isBadge ? (
                          <Chip label={item.value} size="small" color="primary" sx={{ fontWeight: 800, mt: 0.5 }} />
                        ) : (
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value}</Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Stack spacing={2.5}>
                  <TextField 
                    label="Full Name" 
                    fullWidth 
                    value={editForm.name} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    size="small"
                  />
                  <TextField 
                    label="Username" 
                    fullWidth 
                    value={editForm.username} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    size="small"
                  />
                  <TextField 
                    label="Email" 
                    fullWidth 
                    value={editForm.email} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    size="small"
                  />
                  <TextField 
                    label="Phone" 
                    fullWidth 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    size="small"
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={editForm.role}
                      label="Role"
                      onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="moderator">Moderator</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          {!isEditing ? (
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              <Button fullWidth variant="contained" startIcon={<Edit2 className="w-4 h-4" />} onClick={handleStartEdit} sx={{ borderRadius: 2 }}>Edit</Button>
              <Button variant="outlined" color="error" onClick={() => setShowDeleteConfirm(true)} sx={{ borderRadius: 2, minWidth: 56 }}><Trash2 className="w-4 h-4" /></Button>
              <Button variant="outlined" onClick={closeModal} sx={{ borderRadius: 2 }}>Close</Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              <Button fullWidth variant="contained" color="success" startIcon={<Check className="w-4 h-4" />} onClick={handleSaveEdit} sx={{ borderRadius: 2 }}>Save</Button>
              <Button fullWidth variant="outlined" onClick={handleCancelEdit} sx={{ borderRadius: 2 }}>Cancel</Button>
            </Stack>
          )}
        </DialogActions>
      </Dialog>
      </Stack>
    </Box>
  );
};

export default UserPage;
