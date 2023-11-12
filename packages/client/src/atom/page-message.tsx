import React, { FC, ReactNode } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';

interface PageMessageType {
  title: ReactNode;
  children: ReactNode;
  end?: ReactNode;
}

// displaying message for the entire page.
export const PageMessage: FC<PageMessageType> = ({ title, children, end }) => {
  return (
    <Container>
      <Grid container spacing={2} justifyContent='center' marginTop={2}>
        <Grid item xl={6} md={6} sm={12}>
          <Typography variant='h3' align='center' sx={{ mb: 3 }}>
            {title}
          </Typography>
          <Paper
            sx={{
              p: 2,
              mb: 2,
            }}
          >
            {children}
          </Paper>
          {end}
        </Grid>
      </Grid>
    </Container>
  );
};
