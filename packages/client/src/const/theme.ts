import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import primary from '@mui/material/colors/indigo';
import secondary from '@mui/material/colors/amber';

export const THEME = createTheme({
  shape: {
    borderRadius: 21,
  },
  typography: {
    fontFamily: import.meta.env.VITE_GOOGLE_FONT,
  },
  palette: {
    background: {
      default: grey[200],
    },
    primary: {
      main: primary[600],
    },
    secondary: {
      main: secondary[600],
    },
  },
});
