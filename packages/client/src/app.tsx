import React, { FC } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { THEME } from './const/theme';
import { Notification } from './molecule/notification';
import { Pages } from './pages';

export const App: FC = () => {
  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline>
        <Pages />
        <Notification />
      </CssBaseline>
    </ThemeProvider>
  );
};
