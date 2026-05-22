import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  Users, ReceiptText, Briefcase, DollarSign, MoreHorizontal, ChevronDown,
  ArrowUpRight, ArrowDownRight, TrendingUp, Download, CreditCard, ShoppingCart, Package
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Card, 
  Paper, 
  Grid, 
  Stack, 
  Menu, 
  MenuItem,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Chip,
  Divider
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const CY     = new Date().getFullYear();
const PY     = CY - 1;

const PIE_COLORS = { 'E-Wallet': '#1B2559', 'Cash': '#828DF8', 'QRIS': '#E0E5F2', 'Debit Card': '#4318FF' };

const Dashboard = () => {
  const { customers, orders, products, customerPageData, orderPageData } = useData();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const navigate = useNavigate();
  const [revenueView, setRevenueView]   = useState('weekly');
  const [year2, setYear2] = useState(CY);
  const year1 = year2 - 1;
  const [salesYearAnchorEl, setSalesYearAnchorEl] = useState(null);
  const [kpiYear, setKpiYear] = useState(CY);
  const [kpiYearAnchorEl, setKpiYearAnchorEl] = useState(null);

  // Division Comparison State
  const uniqueDivisions = (() => {
    const set = new Set();
    products.forEach(p => { if (p.division) set.add(p.division); });
    return Array.from(set).length > 0 ? Array.from(set).sort() : ['Division A', 'Division B'];
  })();
  const [compareDiv1, setCompareDiv1] = useState(uniqueDivisions[0] || 'Division A');
  const [compareDiv2, setCompareDiv2] = useState(uniqueDivisions[1] || uniqueDivisions[0] || 'Division B');
  const [divAnchorEl, setDivAnchorEl] = useState(null);
  const [activeDivSlot, setActiveDivSlot] = useState(1);

  // ── Stat calculations ─────────────────────────────────────────────────────────────
  const totalCustomers    = customerPageData.totalElements || customers.length;
  const totalTransactions = orderPageData.totalElements || orders.length;
  const totalSales        = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const totalIncome       = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const availableYears = (() => {
    const set = new Set();
    orders.forEach(o => {
      const d = new Date(o.orderDate || o.createdAt);
      if (!isNaN(d)) set.add(d.getFullYear());
    });
    set.add(CY);
    set.add(CY - 1);
    return Array.from(set).sort((a, b) => b - a);
  })();

  // ── Sales Performance data ────────────────────────────────────────────────────────
  const salesMap = {};
  MONTHS.forEach(m => { salesMap[m] = { month: m, [year1]: 0, [year2]: 0 }; });
  orders.forEach(o => {
    const d = new Date(o.orderDate || o.createdAt);
    if (isNaN(d)) return;
    const yr = d.getFullYear();
    const mo = MONTHS[d.getMonth()];
    if (yr === year2 || yr === year1) salesMap[mo][yr] = (salesMap[mo][yr] || 0) + (Number(o.totalAmount) || 0);
  });
  const salesPerformanceData = Object.values(salesMap);

  // ── KPIs Overview data ──────────────────────────────────────────────────────────
  const ordersForKpiYear = orders.filter(o => {
    const d = new Date(o.orderDate || o.createdAt);
    return !isNaN(d) && d.getFullYear() === kpiYear;
  });
  const totalTransactionsForKpiYear = ordersForKpiYear.length;
  const totalPaidForKpiYear = ordersForKpiYear.filter(o => o.paymentStatus === 'Paid' || o.paymentStatus === 'SUCCESS').length;

  const metricsData = [
    { name: 'Total Customer', value: totalCustomers, color: '#4318FF' },
    { name: 'Total Transaction', value: totalTransactionsForKpiYear, color: '#FF2E93' },
    { name: 'Total Paid', value: totalPaidForKpiYear, color: '#05CD99' }
  ];
  const metricsSum = (totalCustomers + totalTransactionsForKpiYear + totalPaidForKpiYear) || 1;
  const pieData = metricsData.map(m => ({
    ...m,
    percent: Math.round((m.value / metricsSum) * 100)
  }));

  // ── Revenue Performance data ─────────────────────────────────────────────────────
  const buildWeekly = () => {
    const map = {};
    DAYS.forEach(d => { map[d] = { name: d, TargetRevenue: 0, ActualRevenue: 0 }; });
    const now = new Date();
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
    orders.forEach(o => {
      const d = new Date(o.orderDate || o.createdAt);
      if (isNaN(d) || d < weekStart) return;
      const day = DAYS[d.getDay()];
      map[day].ActualRevenue += Number(o.totalAmount) || 0;
      map[day].TargetRevenue  = Math.round(map[day].ActualRevenue * 1.2);
    });
    return Object.values(map);
  };

  const buildMonthly = () => {
    const map = {};
    MONTHS.forEach(m => { map[m] = { name: m, TargetRevenue: 0, ActualRevenue: 0 }; });
    orders.forEach(o => {
      const d = new Date(o.orderDate || o.createdAt);
      if (isNaN(d) || d.getFullYear() !== CY) return;
      const mo = MONTHS[d.getMonth()];
      map[mo].ActualRevenue += Number(o.totalAmount) || 0;
      map[mo].TargetRevenue  = Math.round(map[mo].ActualRevenue * 1.2);
    });
    return Object.values(map);
  };

  const currentRevenueData = revenueView === 'weekly' ? buildWeekly() : buildMonthly();

  // ── Top Transactions data ────────────────────────────────────────────────────────
  const topTransactions = [...orders]
    .sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt))
    .slice(0, 6)
    .map(o => ({
      id:       `#ORD-${String(o.id).padStart(4, '0')}`,
      customer: o.customerName || (typeof o.customer === 'object' ? o.customer?.name : o.customer) || '—',
      date:     o.orderDate    || o.createdAt || '—',
      items:    Array.isArray(o.products)
                  ? o.products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0)
                  : (Number(o.itemCount) || 0),
      purchase: `₹${(Number(o.totalAmount) || 0).toFixed(2)}`,
    }));

  const theme = useTheme();
  const contentWrapSx = {
    width: '100%',
    maxWidth: '100%',
    px: { xs: 2, md: 4 },
    mx: 'auto',
  };
  const ref2x2WrapSx = {
    width: '100%',
    maxWidth: '100%',
    mx: 'auto',
  };
  const premiumCardSx = {
    borderRadius: 3,
    bgcolor: theme.palette.background.paper,
    boxShadow: theme.palette.mode === 'dark' ? '0 4px 14px rgba(0,0,0,0.2)' : '0px 4px 20px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  };
  const cardHeaderSx = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 2,
    mb: 2,
  };

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: 'calc(100vh - 80px)',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      pb: 4,
    }}>
      {/* Main Grid Container with controlled padding */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
        {/* Row 1: 4 Metric Cards */}
        <Grid
          container
          spacing={3}
          alignItems="stretch"
        >
        {[
          { label: 'Total Customers', value: totalCustomers, icon: <Users size={24} />, color: '#4318FF', gradient: 'linear-gradient(135deg, #4318FF 0%, #3B82F6 100%)' },
          { label: 'Total Transaction', value: totalTransactions, icon: <ReceiptText size={24} />, color: '#FF2E93', gradient: 'linear-gradient(135deg, #FF2E93 0%, #FF66AA 100%)' },
          { label: 'Total Sales', value: totalSales.toLocaleString(), icon: <Briefcase size={24} />, color: '#FFB547', gradient: 'linear-gradient(135deg, #FFB547 0%, #FFD080 100%)' },
          { label: 'Total Income', value: totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: <Typography sx={{ fontSize: 24, fontWeight: 'bold' }}>₹</Typography>, color: '#05CD99', gradient: 'linear-gradient(135deg, #05CD99 0%, #2DD4BF 100%)' }
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} lg={3} key={idx}>
            <Card sx={{ 
              ...premiumCardSx,
              p: 3,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: `0 12px 30px -10px ${alpha(stat.color, 0.4)}`,
                '& .icon-bg': {
                  transform: 'scale(1.1) rotate(-10deg)',
                  bgcolor: stat.color,
                  color: 'white'
                }
              }
            }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    mt: 0.5,
                    fontSize: 26,
                    color: 'text.primary'
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>

              <Box
                className="icon-bg"
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                  bgcolor: alpha(stat.color, 0.1),
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 16px -4px ${alpha(stat.color, 0.2)}`
                }}
              >
                {stat.icon}
              </Box>
              
              {/* Decorative background element */}
              <Box sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(stat.color, 0.03),
                zIndex: 0
              }} />
            </Card>
          </Grid>
        ))}
      </Grid>


        {/* Row 2 & 3 Combined: Sales, KPIs, Revenue, Top Transactions */}
        <Grid
          container
          spacing={4}
          rowSpacing={4}
          alignItems="stretch"
        >
          {/* Sales Performance */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ 
              ...premiumCardSx,
              p: 3,
              height: { xs: 400, md: 420 },
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Box sx={cardHeaderSx}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>Sales Performance</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 13 }}>See how your sales grow month by month in {year1} and {year2}</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => setSalesYearAnchorEl(e.currentTarget)}
                    endIcon={<ChevronDown size={14} />}
                    sx={{ borderRadius: 8, color: 'text.primary', border: '1px solid', borderColor: 'divider', textTransform: 'none', px: 2, py: 0.5 }}
                  >
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#05CD99', mr: 1 }} />
                    Compare: {year2} vs {year1}
                  </Button>
                  <Menu
                    anchorEl={salesYearAnchorEl}
                    open={Boolean(salesYearAnchorEl)}
                    onClose={() => setSalesYearAnchorEl(null)}
                  >
                    {availableYears.map((y) => (
                      <MenuItem
                        key={y}
                        selected={y === year2}
                        onClick={() => { setYear2(y); setSalesYearAnchorEl(null); }}
                      >
                        {y}
                      </MenuItem>
                    ))}
                  </Menu>
                  <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
                </Stack>
              </Box>
              <Box sx={{ flex: 1, width: '100%', mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCY" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#05CD99" stopOpacity={0.15}/><stop offset="95%" stopColor="#05CD99" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.4)} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey={String(year2)} stroke="#05CD99" strokeWidth={3} fillOpacity={1} fill="url(#colorCY)" dot={{ fill: '#05CD99', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    <Area type="monotone" dataKey={String(year1)} stroke="#4318FF" strokeWidth={2} fillOpacity={0} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>


          {/* Revenue Performance */}
          <Grid item xs={12}>
            <Card sx={{ 
              ...premiumCardSx,
              p: 3,
              height: 400,
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Box sx={cardHeaderSx}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>Revenue Performance</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#E0E5F2' }} />
                      <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', fontSize: 12 }}>Target Revenue</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4318FF' }} />
                      <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', fontSize: 12 }}>Actual Revenue</Typography>
                    </Box>
                  </Stack>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => setRevenueView(v => v === 'weekly' ? 'monthly' : 'weekly')} 
                    endIcon={<ChevronDown size={14} />}
                    sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'capitalize' }}
                  >
                    {revenueView}
                  </Button>
                  <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
                </Stack>
              </Box>
              <Box sx={{ flex: 1, width: '100%', mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentRevenueData} barGap={6}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.4)} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} tickFormatter={v => `₹${v}`} />
                    <RechartsTooltip cursor={{ fill: alpha('#4318FF', 0.05) }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="TargetRevenue" fill="#E0E5F2" radius={[4, 4, 0, 0]} barSize={12} />
                    <Bar dataKey="ActualRevenue" fill="#4318FF" radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {/* KPIs Overview */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ 
              ...premiumCardSx,
              p: 3,
              height: { xs: 400, md: 420 },
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Box sx={{ ...cardHeaderSx, mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>KPIS Overview</Typography>
                <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="85%"
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                        label={false}
                        labelLine={false}
                      >
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1, mb: 0.5, fontSize: 32 }}>{totalTransactionsForKpiYear}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>TOTAL ITEMS</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                    {pieData.map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>
                          {item.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Division Performance Chart */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ 
              ...premiumCardSx,
              p: 3,
              height: 420,
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Box sx={cardHeaderSx}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>Division Performance</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 12 }}>Compare division orders</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={(e) => { setDivAnchorEl(e.currentTarget); setActiveDivSlot(1); }}
                    sx={{ fontSize: 10, borderRadius: 2, textTransform: 'none' }}
                  >
                    {compareDiv1}
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={(e) => { setDivAnchorEl(e.currentTarget); setActiveDivSlot(2); }}
                    sx={{ fontSize: 10, borderRadius: 2, textTransform: 'none' }}
                  >
                    {compareDiv2}
                  </Button>
                </Stack>
                <Menu
                  anchorEl={divAnchorEl}
                  open={Boolean(divAnchorEl)}
                  onClose={() => setDivAnchorEl(null)}
                >
                  {uniqueDivisions.map((d) => (
                    <MenuItem
                      key={d}
                      onClick={() => {
                        if (activeDivSlot === 1) setCompareDiv1(d);
                        else setCompareDiv2(d);
                        setDivAnchorEl(null);
                      }}
                    >
                      {d}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Box sx={{ flex: 1, width: '100%', mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentRevenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDiv1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4318FF" stopOpacity={0.1}/><stop offset="95%" stopColor="#4318FF" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorDiv2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#05CD99" stopOpacity={0.1}/><stop offset="95%" stopColor="#05CD99" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.4)} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="ActualRevenue" stroke="#4318FF" strokeWidth={3} fillOpacity={1} fill="url(#colorDiv1)" dot={{ r: 3 }} />
                    <Area type="monotone" dataKey="TargetRevenue" stroke="#05CD99" strokeWidth={2} fillOpacity={1} fill="url(#colorDiv2)" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {/* Customer History & Insights */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ 
              ...premiumCardSx,
              p: 3,
              height: 420,
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Box sx={cardHeaderSx}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>Customer History</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 12 }}>
                    {currentUser?.name ? `${currentUser.name}'s Insights` : 'Transaction Insights'}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setRevenueView(v => v === 'weekly' ? 'monthly' : 'weekly')}
                    sx={{ fontSize: 10, borderRadius: 2, textTransform: 'capitalize' }}
                  >
                    {revenueView}
                  </Button>
                </Stack>
              </Box>
              
              <Box sx={{ flex: 1, width: '100%', mt: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentRevenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.4)} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 10 }} />
                    <RechartsTooltip />
                    <Bar dataKey="ActualRevenue" name="Amount" fill="#4318FF" radius={[4, 4, 0, 0]} barSize={8} />
                    <Bar dataKey="TargetRevenue" name="Orders" fill="#05CD99" radius={[4, 4, 0, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
              
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>User Orders</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{orders.filter(o => o.customerName === currentUser?.name).length} Orders</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Total Value</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#4318FF' }}>
                    ₹{orders.filter(o => o.customerName === currentUser?.name).reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Top Transaction */}
          <Grid item xs={12}>
            <Card sx={{ 
              ...premiumCardSx,
              height: 480,
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Box sx={{ p: 3, pb: 1, ...cardHeaderSx, mb: 0 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>Top Transactions</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 13 }}>Detailed overview of the highest transaction volume this period</Typography>
                </Box>
                <Button variant="text" size="small" onClick={() => navigate('/orders')} sx={{ fontWeight: 700, textTransform: 'none', color: '#4318FF' }}>See All Activity</Button>
              </Box>
              <TableContainer sx={{ flex: 1, px: 3, pb: 3, overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid', borderColor: 'divider', fontWeight: 800, color: 'text.secondary', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, py: 2, bgcolor: 'background.paper' } }}>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Item Count</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topTransactions.map((trx, idx) => (
                      <TableRow 
                        key={idx} 
                        sx={{ 
                          '& td': { borderBottom: '1px solid', borderColor: alpha(theme.palette.divider, 0.5), py: 2 },
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': { bgcolor: alpha('#4318FF', 0.04) }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{trx.id}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>{trx.customer}</TableCell>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary' }}>{trx.date !== '—' ? new Date(trx.date).toLocaleDateString() : '—'}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>{trx.items}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 900, color: '#4318FF' }}>{trx.purchase}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default Dashboard;
