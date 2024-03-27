import React, { FC, ReactNode } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';

import { Loading } from '../molecule/loading';

interface PageMessageType {
  title: ReactNode;
  children: ReactNode;
  end?: ReactNode;
  loading?: boolean;
}

// displaying message for the entire page.
export const PageMessage: FC<PageMessageType> = ({
  title,
  children,
  end,
  loading,
}) => {
  return (
    <Container>
      <Grid container spacing={2} justifyContent='center' marginTop={2}>
        <Grid item xl={6} md={6} sm={12}>
          <Typography variant='h3' align='center' sx={{ mb: 3 }}>
            {title}
          </Typography>
          <Loading loading={loading}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
              }}
            >
              {children}
            </Paper>
          </Loading>
          {end}
        </Grid>
      </Grid>
    </Container>
  );
};
