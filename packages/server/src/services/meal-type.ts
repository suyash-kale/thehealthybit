import { TRPCError } from '@trpc/server';

import { User } from '../entities/mysql/user';
import { MealType } from '../entities/mysql/meal-type';

interface CreateParams {
  label: string;
  start: number;
  end: number;
  user: User;
}

interface ReadParams {
  user: User;
}

class MealTypeService {
  public async create({
    label,
    start,
    end,
    user,
  }: CreateParams): Promise<MealType> {
    if (await MealType.findOne({ where: { label } })) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'LABEL-ALREADY-EXISTS',
      });
    }
    const mealType = new MealType();
    mealType.label = label;
    mealType.start = start;
    mealType.end = end;
    mealType.user = user;
    return await mealType.save();
  }

  public async read({ user }: ReadParams): Promise<Array<MealType>> {
    return await MealType.find({
      relations: ['user'],
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}

export const mealTypeService = new MealTypeService();
