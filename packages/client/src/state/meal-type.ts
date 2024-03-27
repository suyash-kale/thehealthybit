import { selector } from 'recoil';

import { MealType } from '../types/meal-type';
import { UserState } from './user';
import { client } from '../utility/trpc';

export const MealTypeState = selector<Array<MealType>>({
  key: 'MealTypeState',
  get: async ({ get }) => {
    get(UserState);
    return await client.mealType.read.query();
  },
});
