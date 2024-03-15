import React, { FC } from 'react';
import { Grid } from '@mui/material';

interface MealTypeProps {
  meal: string;
  xs: number;
}

export const MealType: FC<MealTypeProps> = ({ meal, xs }) => {
  return (
    <Grid
      key={meal}
      xs={xs}
      p={0.5}
      style={{
        position: 'relative',
      }}
      item
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)',
          width: '15vw',
        }}
      >
        <div>{meal}</div>
        <div>10 am - 11 am</div>
      </div>
    </Grid>
  );
};
