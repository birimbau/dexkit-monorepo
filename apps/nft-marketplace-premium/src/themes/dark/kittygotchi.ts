import { createTheme } from '@mui/material';

export default createTheme({
  typography: {
    fontFamily: "'Sora', sans-serif",
  },
  components: {
    MuiPaper: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h3: {
          fontWeight: 600,
        },
        h2: {
          fontWeight: 600,
        },
        h1: {
          fontWeight: 600,
        },
      },
    },
  },

  palette: {
    mode: 'dark',
    divider: '#DCDCDC',
    text: {
      primary: '#fff',
      secondary: '#737372',
      disabled: '#9B9B9B',
    },
    primary: {
      light: '#8390FA',
      main: '#3B51F7',
      dark: '#081EC4',
    },
    secondary: {
      light: '#FCDB88',
      main: '#FAC748',
      dark: '#C79005',
    },
    error: {
      main: '#FF1053',
      light: '#FFADC5',
      dark: '#B80037',
    },
    info: {
      light: '#B4C1F8',
      main: '#4361EE',
      dark: '#102CA8',
    },
    success: {
      main: '#36AB47',
    },
  },
});
