import { router, procedurePrivate } from '../utility/trpc';
import { mealTypeService } from '../services/meal-type';
import { MealType } from '../entities/mysql/meal-type';

export const mealTypeRouter = router({
  read: procedurePrivate.query<Array<MealType>>(async ({ ctx: { user } }) =>
    mealTypeService.read({ user }),
  ),
});
