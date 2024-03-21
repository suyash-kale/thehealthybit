import React, { FC } from 'react';
import { Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';

import { MealType } from '../../types/meal-type';

interface DayMealProps {
  meal: MealType;
  xs: number;
}

export const DayMeal: FC<DayMealProps> = ({ meal: { id, label }, xs }) => {
  return (
    <Grid key={id} xs={xs} p={0.5} item>
      <motion.div
        whileHover={{
          transform: 'scale(1.02)',
          zIndex: 1,
        }}
        style={{ height: '100%', transform: 'scale(1)' }}
      >
        <Paper
          sx={{
            ':hover': {
              boxShadow: 4, // theme.shadows[20]
            },
          }}
          style={{ height: '100%' }}
        >
          <Grid p={1} container>
            {label}
          </Grid>
        </Paper>
      </motion.div>
    </Grid>
  );
};
