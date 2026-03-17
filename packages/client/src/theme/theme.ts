import { createTheme, type ThemeOptions } from '@mui/material/styles';

export function createAppTheme(mode: 'light' | 'dark') {
  const isLight = mode === 'light';

  const options: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: '#2e7d32',
        light: '#60ad5e',
        dark: '#005005',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#795548',
        light: '#a98274',
        dark: '#4b2c20',
        contrastText: '#ffffff',
      },
      background: {
        default: isLight ? '#f5f7f0' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      success: {
        main: '#43a047',
      },
      warning: {
        main: '#f9a825',
      },
      error: {
        main: '#d32f2f',
      },
      info: {
        main: '#0288d1',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        defaultProps: {
          elevation: 1,
        },
      },
    },
  };

  return createTheme(options);
}
