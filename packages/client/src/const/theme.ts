import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import primary from '@mui/material/colors/indigo';
import secondary from '@mui/material/colors/amber';

import { ENV } from './env';

// material theme configurations.
export const THEME = createTheme({
  shape: {
    borderRadius: 21,
  },
  typography: {
    fontFamily: ENV.GOOGLE_FONT,
    button: {
      textTransform: 'none',
    },
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
