import React, { FC } from 'react';
import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useRecoilValue } from 'recoil';

import { MealTypeState } from '../../state/meal-type';
import { PageMessage } from '../../atom/page-message';
import { getWeek } from '../../utility/date';
import { MealTypeDisplay } from './meal-type';
import { AddMealType } from './add-meal-type';
import { DateHead } from './date-head';
import { DayMeal } from './meal';

export const MealPlan: FC = () => {
  const mealType = useRecoilValue(MealTypeState);

  const week = getWeek();

  if (mealType.length === 0) {
    return (
      <PageMessage title={<FormattedMessage id='RELAX' />} loading>
        <FormattedMessage id='WE-ARE-GETTING-THINGS-READY' />
      </PageMessage>
    );
  }

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
                      date={date}
                      mealType={meal}
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
