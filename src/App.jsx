import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import { validateToken, logoutUser } from './Service.js/AuthService';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import CustomerPage from './components/CustomerPage';
import AddCustomerPage from './components/AddCustomerPage';
import DivisionPage from './components/DivisionPage';
import AddDivisionPage from './components/AddDivisionPage';
import ProductPage from './components/ProductPage';
import AddProductPage from './components/AddProductPage';
import OrdersPage from './components/OrdersPage';
import AddTransactionPage from './components/AddTransactionPage';
import StocksPage from './components/StocksPage';
import AddStockPage from './components/AddStockPage';
import UserPage from './components/UserPage';
import CalendarPage from './components/CalendarPage';
import SettingsPage from './components/SettingsPage';
import HelpPage from './components/HelpPage';
import ReceiptPage from './components/ReceiptPage';
import Layout from './components/Layout';
import PremiumLoader from './components/PremiumLoader';
import ResetPasswordPage from './components/ResetPasswordPage';
import EditCustomerPage from './components/EditCustomerPage';
import EditProductPage from './components/EditProductPage';
import EditTransactionPage from './components/EditTransactionPage';
import EditDivisionPage from './components/EditDivisionPage';
import TransactionStatusPage from './components/TransactionStatusPage';
import AddUserPage from './components/AddUserPage';
import EditUserPage from './components/EditUserPage';
import ViewCustomerPage from './components/ViewCustomerPage';
import EditStockPage from './components/EditStockPage';
import InvoicePage from './components/InvoicePage';
import BulkImportPage from './components/BulkImportPage';
import NotFoundPage from './components/NotFoundPage';
import ViewProductPage from './components/ViewProductPage';
import ViewInvoicePage from './components/ViewInvoicePage';
import ViewTransactionPage from './components/ViewTransactionPage';
import './App.css';

const ProtectedRoute = ({ children, currentUser, validating }) => {
  if (validating) return <PremiumLoader variant="fullpage" />;
  if (!currentUser) return <Navigate to="/" replace />;
  return children;
};

import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';

const AppContent = () => {
  const { setAuthToken, clearData, token } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [validating, setValidating] = useState(true);
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accentColor') || '#1b2559');
  const [isLaunching, setIsLaunching] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(() => parseInt(localStorage.getItem('zoomLevel') || '100', 10));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const theme = React.useMemo(() => getTheme(darkMode ? 'dark' : 'light', accentColor), [darkMode, accentColor]);

  const handleSettingsChange = ({ accentColor: c, zoomLevel: z }) => {
    if (c !== undefined) {
      setAccentColor(c);
      localStorage.setItem('accentColor', c);
    }
    if (z !== undefined) {
      setZoomLevel(z);
      localStorage.setItem('zoomLevel', z);
    }
  };

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Validate stored token on mount
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        const isValid = await validateToken(storedToken);
        if (!isValid) {
          // Token expired — force logout
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          setAuthToken(null);
          setCurrentUser(null);
        } else {
          setAuthToken(storedToken);
        }
      }
      setValidating(false);
    };
    checkToken();
  }, []);

  const handleLogin = (apiResponse) => {
    setIsLaunching(true);
    const data = apiResponse?.data;
    const token = data?.token;
    const user = {
      id: data?.id || '',
      name: data?.username || '',
      email: data?.email || '',
      role: data?.role || 'user',
    };
    
    // Simulate premium launch
    setTimeout(() => {
      if (token) setAuthToken(token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setIsLaunching(false);
    }, 4000); // 4s — matches 3.5s animation + smooth buffer
  };

  const handleLogout = async () => {
    await logoutUser(token);
    setAuthToken(null);
    clearData();
    setCurrentUser(null);
    navigate('/dashboard');
  };

  // Get current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname.slice(1); // Remove leading slash
    return path || 'dashboard';
  };

  const isAdmin = ['madhu', 'krishh', 'meera'].includes(currentUser?.name?.toLowerCase()) || currentUser?.role?.toLowerCase() === 'admin';

  if (isLaunching) {
    return <PremiumLoader variant="rocket" />;
  }

  // Show premium loader during token validation (skip for receipt pages and 404)
  const isPublicPage = location.pathname.startsWith('/receipt/') || location.pathname === '/404';
  if (validating && !isPublicPage) {
    return <PremiumLoader variant="fullpage" accentColor={accentColor} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/receipt/:orderCode" element={
          <ReceiptPage />
        } />
        <Route path="/" element={!currentUser ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        
        <Route path="/*" element={
          <ProtectedRoute currentUser={currentUser} validating={validating}>
            <div className="App">
              <Layout
                activePage={getCurrentPage()}
                navigate={navigate}
                onLogout={handleLogout}
                currentUser={currentUser}
                onUserUpdate={(updatedUser) => setCurrentUser(updatedUser)}
                accentColor={accentColor}
                zoomLevel={zoomLevel}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              >
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="customer" element={<CustomerPage />} />
                  <Route path="add-customer" element={<AddCustomerPage />} />
                  <Route path="division" element={isAdmin ? <DivisionPage /> : <Navigate to="/dashboard" replace />} />
                  <Route path="add-division" element={isAdmin ? <AddDivisionPage /> : <Navigate to="/dashboard" replace />} />
                  <Route path="products" element={<ProductPage />} />
                  <Route path="add-product" element={<AddProductPage />} />
                  <Route path="import-products" element={isAdmin ? <BulkImportPage /> : <Navigate to="/dashboard" replace />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="add-transaction" element={<AddTransactionPage />} />
                  <Route path="stocks" element={<StocksPage />} />
                  <Route path="add-stock" element={<AddStockPage />} />
                  <Route path="invoice" element={<InvoicePage />} />
                  <Route path="edit-customer/:id" element={<EditCustomerPage />} />
                  <Route path="edit-product/:id" element={<EditProductPage />} />
                  <Route path="edit-transaction/:id" element={<EditTransactionPage />} />
                  <Route path="transaction-status/:status" element={<TransactionStatusPage />} />
                  <Route path="edit-division/:id" element={<EditDivisionPage />} />
                  <Route path="user" element={isAdmin ? <UserPage /> : <Navigate to="/dashboard" replace />} />
                  <Route path="add-user" element={isAdmin ? <AddUserPage /> : <Navigate to="/dashboard" replace />} />
                  <Route path="edit-user/:id" element={isAdmin ? <EditUserPage /> : <Navigate to="/dashboard" replace />} />
                  <Route path="view-customer/:id" element={<ViewCustomerPage />} />
                  <Route path="view-product/:id" element={<ViewProductPage />} />
                  <Route path="view-invoice/:id" element={<ViewInvoicePage />} />
                  <Route path="view-transaction/:id" element={<ViewTransactionPage />} />
                  <Route path="edit-stock/:id" element={isAdmin ? <EditStockPage /> : <Navigate to="/dashboard" replace />} />
                  <Route path="calendar" element={isAdmin ? <CalendarPage /> : <Navigate to="/dashboard" replace />} />
                  <Route path="help" element={<HelpPage />} />
                  <Route path="settings" element={isAdmin ? <SettingsPage currentUser={currentUser} onSettingsChange={handleSettingsChange} /> : <Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Layout>
            </div>
          </ProtectedRoute>
        } />
    </Routes>
    </ThemeProvider>
  );
};

function App() {
  return (
    <DataProvider>
      <Router>
        <AppContent />
      </Router>
    </DataProvider>
  );
}

export default App;
