import React, { FC } from 'react';
import { Grid, Paper } from '@mui/material';

interface DayMealProps {
  meal: string;
  xs: number;
}

export const DayMeal: FC<DayMealProps> = ({ meal, xs }) => {
  return (
    <Grid key={meal} xs={xs} p={0.5} item>
      <Paper style={{ height: '100%' }}>
        <Grid p={1} container>
          {meal}
        </Grid>
      </Paper>
    </Grid>
  );
};
