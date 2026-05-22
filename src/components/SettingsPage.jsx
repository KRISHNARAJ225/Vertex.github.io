import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Palette, ZoomIn, Bell, Globe, Shield, Monitor,
  Check, RotateCcw, Moon, Sun, Sliders, Save, ArrowLeft
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Stack, 
  Avatar, 
  Grid, 
  Slider, 
  Switch, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Divider,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Chip
} from '@mui/material';

const ACCENT_COLORS = [
  { name: 'Navy',   value: '#1b2559' },
  { name: 'Indigo', value: '#4318FF' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Rose',   value: '#e11d48' },
  { name: 'Teal',   value: '#0d9488' },
  { name: 'Amber',  value: '#d97706' },
];

const SettingsPage = ({ currentUser, onSettingsChange }) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useData();
  const theme = useTheme();
  const [accentColor, setAccentColor]   = useState(() => localStorage.getItem('accentColor')   || '#1b2559');
  const [zoomLevel, setZoomLevel]       = useState(() => parseInt(localStorage.getItem('zoomLevel')    || '100', 10));
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem('notifEnabled') !== 'false');
  const [saved, setSaved]               = useState(false);

  // Propagate to Layout
  useEffect(() => {
    onSettingsChange?.({ accentColor, zoomLevel });
  }, [accentColor, zoomLevel]);

  const saveSettings = () => {
    localStorage.setItem('accentColor',   accentColor);
    localStorage.setItem('zoomLevel',     String(zoomLevel));
    localStorage.setItem('notifEnabled',  String(notifEnabled));
    localStorage.setItem('language',      language);
    onSettingsChange?.({ accentColor, zoomLevel });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetZoom = () => setZoomLevel(100);

  const SectionCard = ({ icon: Icon, title, children }) => (
    <Paper 
      sx={{ 
        borderRadius: 4, 
        overflow: 'hidden', 
        border: '1px solid', 
        borderColor: 'divider',
        boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(accentColor, 0.1), color: accentColor, display: 'flex' }}>
          <Icon size={20} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{title}</Typography>
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Paper>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 6 } }}>
      <Stack spacing={5} sx={{ maxWidth: '100%', mx: 'auto' }}>
        
        {/* Signature Modern Banner */}
        <Paper 
          sx={{ 
            p: { xs: 5, md: 8 }, 
            borderRadius: 8, 
            background: 'linear-gradient(135deg, #4318FF 0%, #3B82F6 50%, #2DD4BF 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 48px -12px rgba(67, 24, 255, 0.35)',
          }}
        >
          {/* Abstract Glassmorphism Shapes */}
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />
          <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <Box sx={{ position: 'absolute', top: '20%', left: '30%', width: 100, height: 100, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', filter: 'blur(40px)' }} />
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={5} alignItems={{ md: 'center' }} sx={{ position: 'relative', zIndex: 1 }}>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(12px)', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 5,
                color: 'white',
                p: 2.5,
                width: 'fit-content',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', transform: 'scale(1.1) rotate(-5deg)' },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <ArrowLeft size={28} />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 900, letterSpacing: 3, display: 'block', mb: 1 }}>
                USER PREFERENCES
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 3, tracking: 'tight', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Settings & UI
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: alpha('#fff', 0.8), fontWeight: 500, maxWidth: 650, lineHeight: 1.6, opacity: 0.9 }}>
                Customize your workspace theme, adjust display density, and manage localization settings for a personalized experience.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={saved ? <Check size={20} /> : <Save size={20} />}
              onClick={saveSettings}
              sx={{ 
                borderRadius: 4, 
                px: 5, 
                py: 2, 
                fontWeight: 900, 
                bgcolor: 'white',
                color: '#4318FF',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', transform: 'translateY(-2px)' },
                boxShadow: '0 12px 24px -6px rgba(0,0,0,0.2)',
                transition: 'all 0.3s'
              }}
            >
              {saved ? 'SETTINGS SAVED' : 'SAVE CHANGES'}
            </Button>
          </Stack>
        </Paper>

      <Stack spacing={4}>
        {/* Profile Section */}
        <SectionCard icon={User} title={t('profile_info')}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64, 
                fontSize: 24, 
                fontWeight: 800,
                background: `linear-gradient(135deg, ${accentColor}, ${alpha(accentColor, 0.6)})`,
                boxShadow: 4
              }}
            >
              {(currentUser?.name || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{currentUser?.name || '—'}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{currentUser?.email || '—'}</Typography>
              <Chip 
                label={currentUser?.role || 'user'} 
                size="small" 
                sx={{ 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  bgcolor: accentColor, 
                  color: 'white',
                  height: 20,
                  fontSize: 10
                }} 
              />
            </Box>
          </Stack>
        </SectionCard>

        {/* Appearance */}
        <SectionCard icon={Palette} title={t('appearance')}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Choose an accent color for the sidebar and interactive elements.</Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
            {ACCENT_COLORS.map(c => (
              <Tooltip key={c.value} title={c.name} arrow>
                <Box
                  onClick={() => setAccentColor(c.value)}
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 3,
                    bgcolor: c.value,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    border: '2px solid',
                    borderColor: accentColor === c.value ? 'white' : 'transparent',
                    boxShadow: accentColor === c.value ? `0 0 0 3px ${alpha(c.value, 0.4)}` : 1,
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  {accentColor === c.value && <Check size={18} color="white" />}
                </Box>
              </Tooltip>
            ))}
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Custom color:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 0.5, pr: 2, bgcolor: 'action.hover', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none' }}
              />
              <Typography variant="caption" sx={{ fontBold: 800, fontFamily: 'monospace', opacity: 0.7 }}>{accentColor}</Typography>
            </Box>
          </Stack>
        </SectionCard>

        {/* Zoom */}
        <SectionCard icon={ZoomIn} title={t('zoom')}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Adjust the page zoom level for better readability.</Typography>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', minWidth: 40 }}>80%</Typography>
              <Slider
                value={zoomLevel}
                min={80}
                max={150}
                step={5}
                onChange={(e, val) => setZoomLevel(val)}
                sx={{ color: accentColor }}
              />
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', minWidth: 40 }}>150%</Typography>
              <Box sx={{ bgcolor: accentColor, color: 'white', px: 2, py: 1, borderRadius: 2, fontWeight: 900, minWidth: 60, textAlign: 'center' }}>
                {zoomLevel}%
              </Box>
              <IconButton onClick={resetZoom} size="small" sx={{ color: 'text.secondary' }}>
                <RotateCcw size={18} />
              </IconButton>
            </Stack>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: alpha(accentColor, 0.05), borderColor: alpha(accentColor, 0.1) }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>Live preview text at {zoomLevel}%</Typography>
              <Typography sx={{ fontSize: `${zoomLevel / 100}rem`, fontWeight: 600 }}>
                This is how content will appear at {zoomLevel}% zoom.
              </Typography>
            </Paper>
          </Stack>
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon={Bell} title={t('notifs')}>
          <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Activity notifications</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Show toast alerts when items are added or updated</Typography>
            </Box>
            <Switch 
              checked={notifEnabled} 
              onChange={(e) => setNotifEnabled(e.target.checked)}
              sx={{ 
                '& .MuiSwitch-switchBase.Mui-checked': { color: accentColor },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: accentColor }
              }}
            />
          </Stack>
        </SectionCard>

        {/* Language */}
        <SectionCard icon={Globe} title={t('lang_region')}>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontWeight: 700 }}>Display Language</InputLabel>
              <Select
                value={language}
                label="Display Language"
                onChange={(e) => setLanguage(e.target.value)}
                sx={{ borderRadius: 3, bgcolor: 'action.hover', fontWeight: 600 }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ta">Tamil</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="te">Telugu</MenuItem>
                <MenuItem value="kn">Kannada</MenuItem>
                <MenuItem value="ml">Malayalam</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </SectionCard>

        {/* System Info */}
        <SectionCard icon={Monitor} title={t('sys_info')}>
          <Grid container spacing={2}>
            {[
              ['App Version', 'StockFlow v1.0.0'],
              ['Browser', navigator.userAgent.includes('Chrome') ? 'Google Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other'],
              ['Screen Resolution', `${window.screen.width} × ${window.screen.height}`],
              ['Current Zoom', `${zoomLevel}%`],
            ].map(([label, value]) => (
              <Grid item xs={6} sm={3} key={label}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center', height: '100%' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </SectionCard>
      </Stack>
    </Stack>
  </Box>
);
};

export default SettingsPage;
