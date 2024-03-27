import React, { FC, useCallback } from 'react';
import { Button, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { MealType } from '../../types/meal-type';
import { internalFormat } from '../../utility/date';

interface DayMealProps {
  date: Date;
  mealType: MealType;
  xs: number;
}

export const DayMeal: FC<DayMealProps> = ({ date, mealType, xs }) => {
  const navigate = useNavigate();

  const onAdd = useCallback(
    () =>
      navigate(`/meal-plan/add/${internalFormat(date)}/${mealType.label}`, {
        state: { date, mealType },
      }),
    [navigate, date, mealType],
  );
  return (
    <Grid key={`${date.getTime()}-${mealType.id}`} xs={xs} p={0.5} item>
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
              boxShadow: 4,
            },
          }}
          style={{ height: '100%' }}
        >
          <Grid
            p={1}
            style={{
              height: '100%',
            }}
            alignContent='center'
            justifyContent='center'
            container
          >
            <Button size='large' startIcon={<AddIcon />} onClick={onAdd}>
              <FormattedMessage id='ADD' />
            </Button>
          </Grid>
        </Paper>
      </motion.div>
    </Grid>
  );
};
