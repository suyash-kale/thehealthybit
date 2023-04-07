import z from 'zod';

import { User } from '../entities/mysql/user';
import { router, procedurePubic, procedurePrivate } from '../utility/trpc';
import { SessionType, userService } from '../services/user';

// user router.
export const userRouter = router({
  // signing up new user.
  signUp: procedurePubic
    .input(
      z.object({
        first: z
          .string()
          .min(1, { message: 'REQUIRED' })
          .max(20, { message: 'TOO-LONG' }),
        last: z.string().max(20, { message: 'TOO-LONG' }),
        mobile: z
          .string()
          .min(10, { message: 'INVALID-MOBILE' })
          .max(10, { message: 'INVALID-MOBILE' }),
        email: z
          .string()
          .email({ message: 'INVALID-EMAIL' })
          .optional()
          .or(z.literal('')),
        password: z
          .string()
          .min(6, { message: 'TOO-SHORT' })
          .max(20, { message: 'TOO-LONG' }),
      }),
    )
    .mutation<SessionType>(async ({ input }) => userService.signUp(input)),

  // signing in user.
  signIn: procedurePubic
    .input(
      z.object({
        mobile: z
          .string()
          .min(10, { message: 'INVALID_MOBILE' })
          .max(10, { message: 'INVALID_MOBILE' }),
        password: z
          .string()
          .min(6, { message: 'TOO_SHORT' })
          .max(20, { message: 'TOO_LONG' }),
      }),
    )
    .mutation<SessionType>(async ({ input }) => userService.signIn(input)),

  // getting user profile.
  me: procedurePrivate.query<User>(async ({ ctx: { user } }) => user),
});
