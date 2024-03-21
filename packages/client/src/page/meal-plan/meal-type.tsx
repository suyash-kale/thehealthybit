import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { Grid, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

import { MealType } from '../../types/meal-type';

interface MealTypeProps {
  meal: MealType;
  xs: number;
}

export const MealTypeDisplay: FC<MealTypeProps> = ({
  meal: { id, label, start, end },
  xs,
}) => {
  return (
    <Grid
      key={id}
      xs={xs}
      p={0.5}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
      item
    >
      <motion.div
        initial='rest'
        whileHover='hover'
        animate='rest'
        style={{
          position: 'absolute',
          zIndex: 1,
          width: '15vw',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)',
        }}
      >
        <motion.div
          variants={{
            rest: { opacity: 0, y: '100%' },
            hover: { opacity: 1, y: 0 },
          }}
        >
          <IconButton>
            <EditIcon />
          </IconButton>
        </motion.div>
      </motion.div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)',
          width: '15vw',
        }}
      >
        <div>{label}</div>
        <div>
          {start} - {end}
        </div>
      </div>
    </Grid>
  );
};
