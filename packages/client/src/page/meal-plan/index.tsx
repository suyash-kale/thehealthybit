import React, { FC } from 'react';
import { Divider, Grid } from '@mui/material';

import { MealType } from './meal-type';
import { AddMealType } from './add-meal-type';
import { DateHead } from './date-head';
import { DayMeal } from './meal';

export const MealPlan: FC = () => {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const meals = ['Breakfast', 'Lunch', 'Dinner'];
  return (
    <Grid
      style={{
        height: 'calc(100vh - 181px)',
      }}
      container
    >
      <Grid container>
        <Grid style={{ width: '50px', textAlign: 'center' }} item>
          <div style={{ height: '52px' }}></div>
          <Divider flexItem />
          <Grid direction='column' height='100%' mt={1} container>
            {meals.map((meal) => (
              <MealType key={meal} meal={meal} xs={12 / meals.length} />
            ))}
          </Grid>
          <AddMealType />
        </Grid>
        <Grid style={{ width: 'calc(100% - 50px)' }} item>
          <Grid style={{ height: '100%' }} container>
            {days.map((day) => (
              <Grid key={day} xs={12 / days.length} textAlign='center' item>
                <DateHead day={day} />
                <Grid direction='column' height='100%' mt={1} container>
                  {meals.map((meal) => (
                    <DayMeal key={meal} meal={meal} xs={12 / meals.length} />
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
