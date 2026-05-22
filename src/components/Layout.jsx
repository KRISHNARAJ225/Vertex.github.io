import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Tag, 
  Package, 
  ReceiptText, 
  Users, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon, 
  Maximize, 
  Bell, 
  Lock, 
  Calendar,
  Menu as MenuIcon,
  Search,
  X,
  Edit2,
  AtSign,
  Mail,
  Phone,
  Check,
  FileText
} from 'lucide-react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Button, 
  Avatar, 
  Menu, 
  MenuItem, 
  TextField, 
  InputBase, 
  Badge, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Tab, 
  Tabs,
  Paper,
  Tooltip,
  MenuList
} from '@mui/material';
import { useData } from '../contexts/DataContext';
import { changePassword } from '../Service.js/AuthService';
import { alpha } from '@mui/material/styles';

// ── Isolated Components to prevent Layout re-renders ───────────────────────

const NavBtn = React.memo(({ item, isActive, isCollapsed, darkMode, accentColor, navigate, t }) => {
  const Icon = item.icon;
  return (
    <Button
      fullWidth
      onClick={() => navigate(`/${item.id}`)}
      startIcon={<Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />}
      sx={{
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        px: 2,
        py: 1.5,
        borderRadius: 3,
        mb: 0.5,
        color: isActive ? '#fff' : (darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(30, 41, 59, 0.7)'),
        backgroundColor: isActive ? accentColor : 'transparent',
        boxShadow: isActive ? `0 8px 16px -4px ${alpha(accentColor, 0.4)}` : 'none',
        '& .MuiButton-startIcon': {
          marginRight: isCollapsed ? 0 : 2,
          marginLeft: 0,
          color: isActive ? '#fff' : (darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(30, 41, 59, 0.8)'),
        },
        '&:hover': {
          backgroundColor: isActive ? accentColor : (darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(30, 41, 59, 0.04)'),
          color: isActive ? '#fff' : (darkMode ? '#fff' : '#0f172a'),
          '& .MuiButton-startIcon': {
             color: isActive ? '#fff' : (darkMode ? '#fff' : '#0f172a'),
          }
        },
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {!isCollapsed && (
        <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: '0.01em' }}>
          {item.label}
        </Typography>
      )}
    </Button>
  );
});

const PremiumClock = React.memo(({ darkMode }) => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ display: { xs: 'none', xl: 'flex' }, alignItems: 'center', gap: 2 }}>
      {/* Date Chip */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1,
          borderRadius: 3,
          border: '1px solid',
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          bgcolor: darkMode ? 'rgba(30, 30, 45, 0.4)' : '#fff',
          '&:hover': { borderColor: 'pink.200', boxShadow: '0 4px 20px rgba(255,192,203,0.2)' },
          transition: 'all 0.3s'
        }}
      >
        <Box sx={{ p: 0.5, borderRadius: 1.5, bgcolor: darkMode ? 'rgba(233, 30, 99, 0.1)' : '#fff0f3', color: '#e91e63' }}>
          <Calendar className="w-3.5 h-3.5" />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', tracking: 0.2, opacity: 0.5 }}>Today</Typography>
          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 900 }}>
            {time.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })}
          </Typography>
        </Box>
      </Paper>

      {/* Time Chip */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1,
          borderRadius: 3,
          border: '1px solid',
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          bgcolor: darkMode ? 'rgba(30, 30, 45, 0.4)' : '#fff',
          '&:hover': { borderColor: 'purple.200', boxShadow: '0 4px 20px rgba(128,0,128,0.2)' },
          transition: 'all 0.3s'
        }}
      >
        <Box sx={{ p: 0.5, borderRadius: 1.5, bgcolor: darkMode ? 'rgba(156, 39, 176, 0.1)' : '#f3e5f5', color: '#9c27b0' }}>
          <Box sx={{ position: 'relative' }}>
            <Moon className="w-3.5 h-3.5 animate-pulse" />
            <Box component="span" sx={{ position: 'absolute', top: -4, right: -4, width: 6, height: 6, bgcolor: '#10b981', borderRadius: '50%', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', tracking: 0.2, opacity: 0.5 }}>System Time</Typography>
          <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>
            {time.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })}
            <Box component="span" sx={{ fontSize: 10, opacity: 0.6, ml: 0.5 }}>{time.toLocaleTimeString([], { second: '2-digit' })}</Box>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
});

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes bell-vibrate {
      0%, 100% { transform: rotate(0deg); }
      20% { transform: rotate(20deg); }
      40% { transform: rotate(-20deg); }
      60% { transform: rotate(15deg); }
      80% { transform: rotate(-15deg); }
    }
    .bell-shake {
      animation: bell-vibrate 0.6s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes premium-toast-in {
      0% { transform: translate(-50%, -100%) scale(0.9); opacity: 0; }
      60% { transform: translate(-50%, 10px) scale(1.02); opacity: 1; }
      100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
    }
    .animate-premium-toast {
      animation: premium-toast-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes toast-progress {
      0% { width: 100%; }
      100% { width: 0%; }
    }
  `}} />
);

const Layout = ({ children, activePage, navigate, onLogout, currentUser, onUserUpdate, accentColor = '#1b2559', zoomLevel = 100, darkMode, setDarkMode }) => {
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const showProfileMenu = Boolean(anchorElProfile);
  const showNotifications = Boolean(anchorElNotifications);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [toast, setToast] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const searchTerms = ['Search for Products...', 'Find Customers...', 'Check Transactions...', 'Explore Stocks...', 'Search Settings...'];

  // User Profile Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileTab, setProfileTab] = useState('info'); // 'info' or 'password'
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // Edit Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', email: '', username: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const { products, customers, notifications, token, addNotification, registeredUsers, fetchUsersPage, updateUser, t } = useData();

  useEffect(() => {
    if (notifications?.length > 0) {
      const latest = notifications[0];
      setToast(latest);
      
      // Trigger bell vibration
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);

      const timer = setTimeout(() => setToast(null), 10000); // 10s timeout as requested
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Close notifications after 10s
  useEffect(() => {
    let timer;
    if (showNotifications) {
      timer = setTimeout(() => setAnchorElNotifications(null), 10000);
    }
    return () => clearTimeout(timer);
  }, [showNotifications]);

  // MUI Menu handles its own click-outside logic via onClose

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchDropdown(e.target.value.length > 0);
  };

  const filteredSearchMap = {
    products: products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    customers: customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
  };

  const handleSearchResultClick = (type, item) => {
    setSearchQuery(item.name);
    setShowSearchDropdown(false);
    navigate(type === 'product' ? '/products' : '/customer');
  };

  // Typing animation for search placeholder
  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const currentFullText = searchTerms[placeholderIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setPlaceholderText(currentFullText.substring(0, placeholderText.length + 1));
        if (placeholderText === currentFullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setPlaceholderText(currentFullText.substring(0, placeholderText.length - 1));
        if (placeholderText === '') {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % searchTerms.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, placeholderIndex]);

  // Change password handler
  const handleChangePwd = async (e) => {
    e.preventDefault();
    setPwdError('');
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (pwdForm.next.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    setPwdLoading(true);
    try {
      await changePassword(token, pwdForm.current, pwdForm.next);
      setPwdSuccess(true);
      addNotification('Password changed successfully');
      setTimeout(() => {
        setPwdForm({ current: '', next: '', confirm: '' });
        setPwdSuccess(false);
      }, 1800);
    } catch (err) {
      setPwdError(err.message || 'Failed to change password. Please check your current password.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    // Try to resolve user ID from multiple sources
    let resolvedId = currentUser?.id;
    
    if (!resolvedId) {
      // Robust resolution: check registeredUsers carefully
      const matched = (registeredUsers || []).find(u =>
        (u.email && u.email?.toLowerCase() === currentUser?.email?.toLowerCase()) ||
        (u.username && u.username?.toLowerCase() === currentUser?.username?.toLowerCase()) ||
        (u.name && u.name?.toLowerCase() === currentUser?.name?.toLowerCase())
      );
      resolvedId = matched?.id;
    }

    if (!resolvedId) {
      addNotification('Error: User ID not found. Please refresh or contact admin.');
      setUpdateLoading(false);
      return;
    }

    try {
      await updateUser(resolvedId, profileForm);
      const updatedUser = { ...currentUser, ...profileForm, id: resolvedId };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      if (onUserUpdate) onUserUpdate(updatedUser);
      addNotification('Profile updated successfully');
      setIsEditingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      addNotification('Failed to update profile: ' + (err?.message || 'Please try again.'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const openProfileModal = (tab = 'info') => {
    setAnchorElProfile(null);
    setProfileTab(tab);
    setProfileForm({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      username: currentUser?.username || ''
    });
    setIsEditingProfile(false);
    setProfileSaved(false);
    setShowProfileModal(true);
    // Ensure registeredUsers is populated so we can resolve userId
    fetchUsersPage();
  };

  const isAdmin = ['madhu', 'krishh', 'meera'].includes(currentUser?.name?.toLowerCase()) || currentUser?.role?.toLowerCase() === 'admin';

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    ...(isAdmin ? [
      { id: 'division', label: t('divisions'), icon: Tag },
    ] : []),
    { id: 'products', label: t('products'), icon: Package },
    { id: 'orders', label: t('transactions'), icon: ReceiptText },
    { id: 'stocks', label: t('stocks'), icon: Package },
    { id: 'invoice', label: 'Invoice', icon: FileText },
  ];

  const othersItems = [
    { id: 'customer', label: t('customers'), icon: Users },
    ...(isAdmin ? [{ id: 'user', label: t('users'), icon: User }] : []),
  ];

  const preferenceItems = [
    ...(isAdmin ? [
      { id: 'calendar', label: t('calendar'), icon: Calendar },
      { id: 'settings', label: t('settings'), icon: Settings },
    ] : []),
  ];

  // NavBtn helper removed from here and moved outside

  const pwdInputStyle = `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm font-medium transition-colors ${darkMode ? 'bg-slate-800 border-slate-600 text-white focus:ring-blue-500/30' : 'bg-[#f8fafc] border-transparent text-gray-800 focus:ring-black/5 focus:bg-white'
    }`;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <GlobalStyles />
      
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isSidebarCollapsed ? 80 : 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSidebarCollapsed ? 80 : 260,
            boxSizing: 'border-box',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            borderRight: '1px solid',
            borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ height: 80, display: 'flex', alignItems: 'center', px: isSidebarCollapsed ? 1 : 0, position: 'relative', borderBottom: '1px solid transparent', overflow: 'visible' }}>
          {!isSidebarCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', overflow: 'hidden', cursor: 'pointer' }}>
               <img 
                src="/sidbar.png" 
                alt="Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          )}
          <IconButton
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              pointerEvents: 'auto',
            }}
          >
            <MenuIcon className="w-6 h-6" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', py: 3, px: 2, className: 'custom-scrollbar' }}>
          {/* MENU */}
          <Box sx={{ mb: 4 }}>
            {!isSidebarCollapsed && (
              <Typography variant="overline" sx={{ px: 2, fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
                MENU
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {menuItems.map(item => (
                <NavBtn 
                  key={item.id} 
                  item={item} 
                  isActive={activePage === item.id}
                  isCollapsed={isSidebarCollapsed}
                  darkMode={darkMode}
                  accentColor={accentColor}
                  navigate={navigate}
                  t={t}
                />
              ))}
            </Box>
          </Box>

          {/* OTHERS */}
          <Box sx={{ mb: 4 }}>
            {!isSidebarCollapsed && (
              <Typography variant="overline" sx={{ px: 2, fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
                OTHERS
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {othersItems.map(item => (
                 <NavBtn 
                  key={item.id} 
                  item={item} 
                  isActive={activePage === item.id}
                  isCollapsed={isSidebarCollapsed}
                  darkMode={darkMode}
                  accentColor={accentColor}
                  navigate={navigate}
                  t={t}
                />
              ))}
            </Box>
          </Box>

          {/* PREFERENCES */}
          <Box>
            {!isSidebarCollapsed && (
              <Typography variant="overline" sx={{ px: 2, fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
                PREFERENCES
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {preferenceItems.map(item => (
                 <NavBtn 
                  key={item.id} 
                  item={item} 
                  isActive={activePage === item.id}
                  isCollapsed={isSidebarCollapsed}
                  darkMode={darkMode}
                  accentColor={accentColor}
                  navigate={navigate}
                  t={t}
                />
              ))}
              
              {/* Dark Mode Toggle */}
              <Button
                fullWidth
                onClick={() => setDarkMode(!darkMode)}
                sx={{
                  justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  color: darkMode ? 'slate.400' : 'slate.500',
                  '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', color: darkMode ? '#fff' : '#1e293b' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {darkMode ? <Sun className="w-5 h-5" style={{ color: '#f59e0b' }} /> : <Moon className="w-5 h-5" />}
                  {!isSidebarCollapsed && <Typography variant="body2" sx={{ fontWeight: 600 }}>Dark Mode</Typography>}
                </Box>
                {!isSidebarCollapsed && (
                  <Box 
                    sx={{ 
                      width: 36, 
                      height: 20, 
                      borderRadius: 10, 
                      position: 'relative', 
                      bgcolor: darkMode ? accentColor : 'divider',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        bgcolor: '#fff', 
                        position: 'absolute', 
                        top: 2, 
                        left: darkMode ? 18 : 2,
                        transition: 'left 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </Box>
                )}
              </Button>

              <Button
                fullWidth
                onClick={() => navigate('/help')}
                sx={{
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  color: darkMode ? 'slate.400' : 'slate.500',
                  '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', color: darkMode ? '#fff' : '#1e293b' },
                }}
                startIcon={<HelpCircle className="w-5 h-5" />}
              >
                {!isSidebarCollapsed && <Typography variant="body2" sx={{ fontWeight: 600 }}>{t('help')}</Typography>}
              </Button>

              <Button
                fullWidth
                onClick={onLogout}
                sx={{
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  color: 'error.main',
                  '&:hover': { bgcolor: 'error.lighter' },
                }}
                startIcon={<LogOut className="w-5 h-5" />}
              >
                {!isSidebarCollapsed && <Typography variant="body2" sx={{ fontWeight: 600 }}>{t('logout')}</Typography>}
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin 0.3s' }}>
        {/* Top Header */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            height: 80, 
            bgcolor: darkMode ? 'rgba(30,30,45,0.9)' : 'rgba(244,247,254,0.9)', 
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid',
            borderColor: 'transparent',
            zIndex: 20,
            justifyContent: 'center'
          }}
        >
          <Toolbar
            sx={{
              px: 4,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{t('welcome')},</Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 900, 
                    background: `linear-gradient(to right, ${accentColor}, ${accentColor}99)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'pulse 2s infinite'
                  }}
                >
                  {currentUser?.name || 'Admin User'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <PremiumClock darkMode={darkMode} />

              {/* Search Bar */}
              <Box 
                sx={{ 
                  display: { xs: 'none', lg: 'flex' },
                  alignItems: 'center',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: darkMode ? 'rgba(156, 39, 176, 0.2)' : 'rgba(224, 176, 255, 0.4)',
                  bgcolor: darkMode ? 'rgba(26, 15, 29, 1)' : '#FDF2FF',
                  px: 2,
                  py: 1,
                  width: 384,
                  position: 'relative',
                  transition: 'all 0.5s',
                  '&:focus-within': { width: 440, boxShadow: '0 0 0 4px rgba(156, 39, 176, 0.1)' }
                }}
              >
                <Search className={`w-4 h-4 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                <InputBase
                  placeholder={placeholderText}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{ flex: 1, fontSize: '0.875rem', fontWeight: 700, color: 'text.primary' }}
                />
                
                {showSearchDropdown && (
                  <Paper 
                    sx={{ 
                      position: 'absolute', 
                      top: '110%', 
                      left: 0, 
                      right: 0, 
                      borderRadius: 3, 
                      mt: 1, 
                      boxShadow: 4, 
                      overflow: 'hidden', 
                      zIndex: 50 
                    }}
                  >
                    {filteredSearchMap.products.length > 0 && (
                      <Box sx={{ py: 1 }}>
                        <Typography variant="overline" sx={{ px: 2, fontWeight: 800, color: 'text.secondary', fontSize: 10 }}>Products</Typography>
                        <MenuList>
                          {filteredSearchMap.products.map(p => (
                            <MenuItem key={p.id} onClick={() => handleSearchResultClick('product', p)} sx={{ py: 1, px: 2, '&:hover': { bgcolor: accentColor, color: '#fff' } }}>
                              <Typography variant="body2">{p.name}</Typography>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Box>
                    )}
                    {filteredSearchMap.customers.length > 0 && (
                      <Box sx={{ py: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="overline" sx={{ px: 2, fontWeight: 800, color: 'text.secondary', fontSize: 10 }}>Customers</Typography>
                        <MenuList>
                          {filteredSearchMap.customers.map(c => (
                            <MenuItem key={c.id} onClick={() => handleSearchResultClick('customer', c)} sx={{ py: 1, px: 2, '&:hover': { bgcolor: accentColor, color: '#fff' } }}>
                              <Typography variant="body2">{c.name}</Typography>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                  <IconButton 
                    onClick={() => setDarkMode(!darkMode)} 
                    sx={{ 
                      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      color: darkMode ? '#fff' : 'text.primary',
                      '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }
                    }}
                  >
                    {darkMode ? <Sun className="w-5 h-5" style={{ color: '#f59e0b' }} /> : <Moon className="w-5 h-5" />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Fullscreen">
                  <IconButton 
                    sx={{ 
                      display: { xs: 'none', md: 'inline-flex' },
                      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      color: darkMode ? '#fff' : 'text.primary',
                      '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }
                    }}
                    onClick={() => !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen()}
                  >
                    <Maximize className="w-5 h-5" />
                  </IconButton>
                </Tooltip>

                {/* Notifications */}
                <Box sx={{ position: 'relative' }}>
                  <IconButton 
                    onClick={(e) => setAnchorElNotifications(e.currentTarget)}
                    className={isShaking ? 'bell-shake' : ''}
                    sx={{ 
                      bgcolor: isShaking ? alpha('#f59e0b', 0.1) : (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                      color: isShaking ? '#f59e0b' : (darkMode ? '#fff' : 'text.primary'),
                      '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }
                    }}
                  >
                    <Badge color="error" variant="dot" invisible={!notifications?.length}>
                      <Bell className="w-5 h-5" />
                    </Badge>
                  </IconButton>
                  
                  <Menu
                    anchorEl={anchorElNotifications}
                    open={showNotifications}
                    onClose={() => setAnchorElNotifications(null)}
                    PaperProps={{ sx: { width: 288, mt: 1, borderRadius: 3 } }}
                  >
                    <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Notifications</Typography>
                    </Box>
                    <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                      {notifications?.length > 0 ? notifications.map(n => (
                        <MenuItem key={n.id} sx={{ py: 1.5, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>{n.message}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10 }}>
                            {new Date(n.date).toLocaleDateString()} {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </MenuItem>
                      )) : (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>No new notifications</Typography>
                        </Box>
                      )}
                    </Box>
                  </Menu>
                </Box>

                {/* Profile */}
                <Box 
                  onClick={(e) => setAnchorElProfile(e.currentTarget)}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    pl: 2, 
                    borderLeft: '1px solid', 
                    borderColor: 'divider', 
                    cursor: 'pointer',
                    '&:hover .MuiAvatar-root': { boxShadow: 2 }
                  }}
                >
                  <Avatar 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    sx={{ width: 32, height: 32, border: '2px solid #fff', boxShadow: 1, transition: 'all 0.2s' }}
                  />
                  <Typography variant="subtitle2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 800 }}>
                    {currentUser?.name?.split(' ')[0] || 'Admin'}
                  </Typography>
                </Box>
                
                <Menu
                  anchorEl={anchorElProfile}
                  open={showProfileMenu}
                  onClose={() => setAnchorElProfile(null)}
                  PaperProps={{ sx: { width: 256, mt: 1, borderRadius: 3 } }}
                >
                  <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{currentUser?.name || 'Admin User'}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{currentUser?.email || 'admin@example.com'}</Typography>
                    {currentUser?.phone && <Typography variant="caption" sx={{ color: accentColor, fontWeight: 700, mt: 0.5, display: 'block' }}>{currentUser.phone}</Typography>}
                  </Box>
                  <MenuItem onClick={() => openProfileModal('info')} sx={{ py: 1.5, gap: 1.5, '&:hover': { bgcolor: accentColor, color: '#fff' } }}>
                    <User className="w-4 h-4" />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>My Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => openProfileModal('password')} sx={{ py: 1.5, gap: 1.5, '&:hover': { bgcolor: accentColor, color: '#fff' } }}>
                    <Lock className="w-4 h-4" />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Change Password</Typography>
                  </MenuItem>
                  <Box sx={{ my: 1, borderTop: '1px solid', borderColor: 'divider' }} />
                  <MenuItem onClick={onLogout} sx={{ py: 1.5, gap: 1.5, color: 'error.main' }}>
                    <LogOut className="w-4 h-4" />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Log Out</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ 
          flex: 1, 
          p: (activePage?.includes('add') || activePage?.includes('edit')) ? 0 : { xs: 2, md: 4 }, 
          zoom: `${zoomLevel}%`, 
          overflowX: 'hidden',
          position: 'relative',
          ...( (activePage?.includes('add') || activePage?.includes('edit')) && {
            backgroundImage: 'url("/Login.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)',
              zIndex: 0
            },
            '& > *': { 
              position: 'relative', 
              zIndex: 1,
              '& .MuiBox-root': {
                bgcolor: 'transparent !important',
              },
              '& .MuiCard-root, & .MuiPaper-root': {
                bgcolor: darkMode ? 'rgba(30, 41, 59, 0.6) !important' : 'rgba(255, 255, 255, 0.6) !important',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1) !important',
                borderRadius: '24px !important'
              }
            }
          })
        }}>
          <Box sx={{ maxWidth: activePage === 'dashboard' ? '100%' : 1600, mx: 'auto', width: '100%', height: activePage === 'dashboard' ? '100%' : 'auto' }}>
            {children}
          </Box>
        </Box>
      </Box>

      {/* ─── Premium User Profile Modal ─────────────────────────────────────────── */}
      <Dialog
        open={showProfileModal}
        onClose={() => { setShowProfileModal(false); setPwdError(''); setPwdForm({ current: '', next: '', confirm: '' }); setIsEditingProfile(false); }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 8,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            boxShadow: 24,
          }
        }}
      >
        <Box sx={{ height: 8, w: '100%', background: `linear-gradient(to right, ${accentColor}, #8A2BE2, ${accentColor})` }} />
        
        <DialogTitle sx={{ p: 4, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                sx={{ width: 80, height: 80, borderRadius: 3, border: `4px solid ${accentColor}30`, bgcolor: 'rgba(255,255,255,0.1)' }}
              />
              <Box sx={{ position: 'absolute', inset: -4, borderRadius: 3, bgcolor: accentColor, opacity: 0.1, filter: 'blur(8px)', zIndex: -1 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>{currentUser?.name || 'Account Owner'}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.6 }}>{currentUser?.email || 'admin@example.com'}</Typography>
              <Box sx={{ mt: 1, display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: 10, bgcolor: `${accentColor}10`, border: `1px solid ${accentColor}20`, color: accentColor }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: accentColor }} />
                <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.1em' }}>{currentUser?.role || 'User'}</Typography>
              </Box>
            </Box>
          </Box>
          <IconButton onClick={() => { setShowProfileModal(false); setPwdError(''); setPwdForm({ current: '', next: '', confirm: '' }); setIsEditingProfile(false); }}>
            <X className="w-6 h-6" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* User Details Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em' }}>Account Information</Typography>
                {!isEditingProfile && (
                  <Button 
                    startIcon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={() => setIsEditingProfile(true)}
                    sx={{ color: accentColor, fontWeight: 800, fontSize: '0.75rem' }}
                  >
                    Edit Details
                  </Button>
                )}
              </Box>

              {!isEditingProfile ? (
                <Paper 
                  elevation={0}
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: 2, 
                    p: 3, 
                    borderRadius: 4, 
                    bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {[
                    { label: 'Full Name', value: currentUser?.name || '---', icon: User },
                    { label: 'Username', value: currentUser?.username || '---', icon: AtSign },
                    { label: 'Email', value: currentUser?.email || '---', icon: Mail, full: true },
                    { label: 'Phone', value: currentUser?.phone || '---', icon: Phone },
                  ].map((item, idx) => (
                    <Box key={idx} sx={{ gridColumn: item.full ? 'span 2' : 'span 1' }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, textTransform: 'uppercase', color: 'text.secondary', opacity: 0.5, mb: 0.5 }}>{item.label}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              ) : (
                <Box component="form" onSubmit={handleUpdateProfile} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      required
                      variant="outlined"
                      size="small"
                      slotProps={{ input: { sx: { borderRadius: 3 } } }}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      variant="outlined"
                      size="small"
                      slotProps={{ input: { sx: { borderRadius: 3 } } }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    required
                    variant="outlined"
                    size="small"
                    slotProps={{ input: { sx: { borderRadius: 3 } } }}
                  />
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Button 
                      fullWidth 
                      onClick={() => setIsEditingProfile(false)} 
                      sx={{ borderRadius: 3, fontWeight: 800, bgcolor: 'action.hover', color: 'text.primary' }}
                    >
                      Discard
                    </Button>
                    <Button 
                      fullWidth 
                      type="submit" 
                      variant="contained" 
                      disabled={updateLoading}
                      sx={{ borderRadius: 3, fontWeight: 800, bgcolor: accentColor, '&:hover': { bgcolor: accentColor, opacity: 0.9 } }}
                    >
                      {updateLoading ? 'Saving...' : profileSaved ? '✓ Saved!' : 'Save Changes'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Password Change Section */}
            <Box sx={{ pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', display: 'block', mb: 2 }}>Security Settings</Typography>
              
              {pwdSuccess ? (
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'success.lighter', border: '1px solid', borderColor: 'success.light', color: 'success.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Check className="w-5 h-5" />
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>Password updated successfully!</Typography>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleChangePwd} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    value={pwdForm.current}
                    onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                    required
                    variant="outlined"
                    size="small"
                    slotProps={{ input: { sx: { borderRadius: 3 } } }}
                  />
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={pwdForm.next}
                      onChange={(e) => setPwdForm({ ...pwdForm, next: e.target.value })}
                      required
                      variant="outlined"
                      size="small"
                      slotProps={{ input: { sx: { borderRadius: 3 } } }}
                    />
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm Password"
                      value={pwdForm.confirm}
                      onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                      required
                      variant="outlined"
                      size="small"
                      slotProps={{ input: { sx: { borderRadius: 3 } } }}
                    />
                  </Box>
                  {pwdError && <Typography variant="caption" color="error" sx={{ fontWeight: 700 }}>{pwdError}</Typography>}
                  <Button 
                    fullWidth 
                    type="submit" 
                    variant="contained" 
                    disabled={pwdLoading}
                    sx={{ borderRadius: 3, fontWeight: 800, bgcolor: accentColor, '&:hover': { bgcolor: accentColor, opacity: 0.9 }, mt: 1 }}
                  >
                    {pwdLoading ? 'Updating...' : 'Update Security Password'}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Premium Toast Notification */}
      {toast && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 24, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 100, 
            width: '100%', 
            maxWidth: 448, 
            px: 2,
            animation: 'premium-toast-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <Paper 
            elevation={24}
            sx={{ 
              borderRadius: 6, 
              overflow: 'hidden', 
              backdropFilter: 'blur(12px)', 
              bgcolor: darkMode ? 'rgba(26,26,46,0.9)' : 'rgba(255,255,255,0.9)',
              border: '1px solid',
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              p: 0.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 5, bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Box 
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    bgcolor: accentColor, 
                    color: '#fff',
                    boxShadow: 3,
                    zIndex: 1
                  }}
                  className={isShaking ? 'bell-shake' : ''}
                >
                  <Bell className="w-7 h-7" />
                </Box>
                <Box sx={{ position: 'absolute', inset: -8, bgcolor: accentColor, opacity: 0.3, filter: 'blur(12px)', animation: 'pulse 2s infinite' }} />
              </Box>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Notification</Typography>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.4 }}>Just now</Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, truncate: true, color: 'text.primary' }}>
                  {String(toast.message || '').includes('Successfully') ? 'Success Action' : 'New Message'}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.6, display: 'block', truncate: true }}>
                  {toast.message || toast}
                </Typography>
              </Box>

              <IconButton onClick={() => setToast(null)} sx={{ p: 1, borderRadius: 3 }}>
                <X className="w-4 h-4" />
              </IconButton>
            </Box>
            
            {/* Progress Bar */}
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                height: 4, 
                width: '100%',
                background: `linear-gradient(to right, ${accentColor}, #8A2BE2, ${accentColor})`,
                animation: 'toast-progress 10s linear forwards'
              }} 
            />
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
