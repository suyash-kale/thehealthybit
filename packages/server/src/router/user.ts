import z from 'zod';

import { router, procedurePubic, procedurePrivate } from '../utility/trpc';
import { base64ToString } from '../utility/crypto';
import { UserType, userService } from '../services/user';

// user router.
export const userRouter = router({
  // signing up new user.
  signUp: procedurePubic
    .input(
      z.object({
        first: z
          .string()
          .min(1, { message: 'REQUIRED' })
          .min(2, { message: 'TOO-SHORT' })
          .max(20, { message: 'TOO-LONG' }),
        last: z
          .string()
          .min(2, { message: 'TOO-SHORT' })
          .max(20, { message: 'TOO-LONG' })
          .optional()
          .or(z.literal('')),
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
          .min(1, { message: 'REQUIRED' })
          .min(6, { message: 'TOO-SHORT' })
          // the actual password length is 20, but we are using base64 encoding.
          .max(28, { message: 'TOO-LONG' }),
      }),
    )
    .mutation<UserType>(async ({ input }) =>
      userService.signUp({
        ...input,
        password: base64ToString(input.password),
      }),
    ),

  // signing in user.
  signIn: procedurePubic
    .input(
      z.object({
        mobile: z
          .string()
          .min(1, { message: 'REQUIRED' })
          .min(10, { message: 'INVALID-MOBILE' })
          .max(10, { message: 'INVALID-MOBILE' }),
        password: z
          .string()
          .min(1, { message: 'REQUIRED' })
          .min(6, { message: 'TOO-SHORT' })
          // the actual password length is 20, but we are using base64 encoding.
          .max(28, { message: 'TOO-LONG' }),
      }),
    )
    .mutation<UserType>(async ({ input }) =>
      userService.signIn({
        ...input,
        password: base64ToString(input.password),
      }),
    ),

  // getting user profile.
  me: procedurePrivate.query<UserType>(async ({ ctx: { user } }) =>
    userService.me(user),
  ),
});
