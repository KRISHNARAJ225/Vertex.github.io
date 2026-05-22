import { createTheme } from '@mui/material/styles';

export const getTheme = (mode, accentColor) => createTheme({
  palette: {
    mode,
    primary: {
      main: accentColor,
    },
    background: {
      default: mode === 'dark' ? '#1e1e2d' : '#f4f7fe',
      paper: mode === 'dark' ? '#151521' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#1e293b',
      secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
        },
      },
    },
  },
});
