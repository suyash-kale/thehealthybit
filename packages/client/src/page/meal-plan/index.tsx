import React, { FC, useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import { MealTypeDisplay } from './meal-type';
import { AddMealType } from './add-meal-type';
import { DateHead } from './date-head';
import { DayMeal } from './meal';
import { client } from '../../utility/trpc';
import { getWeek } from '../../utility/date';
import { MealType } from '../../types/meal-type';

export const MealPlan: FC = () => {
  const [mealType, setMealType] = useState<Array<MealType>>([]);

  const week = getWeek();

  useEffect(() => {
    const main = async () => {
      const response = await client.mealType.read.query();
      setMealType(response);
    };
    main();
  }, []);

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
          <Grid direction='column' height='100%' mt={1} container>
            {mealType.map((meal) => (
              <MealTypeDisplay
                key={meal.id}
                meal={meal}
                xs={12 / mealType.length}
              />
            ))}
          </Grid>
          <AddMealType />
        </Grid>
        <Grid style={{ width: 'calc(100% - 50px)' }} item>
          <Grid style={{ height: '100%' }} container>
            {week.map((date) => (
              <Grid
                key={date.getTime()}
                xs={12 / week.length}
                textAlign='center'
                item
              >
                <DateHead date={date} />
                <Grid direction='column' height='100%' mt={1} container>
                  {mealType.map((meal) => (
                    <DayMeal
                      key={meal.id}
                      meal={meal}
                      xs={12 / mealType.length}
                    />
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
