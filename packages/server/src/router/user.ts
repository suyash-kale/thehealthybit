import z from 'zod';

import { router, procedurePubic, procedurePrivate } from '../utility/trpc';
import { base64ToString } from '../utility/crypto';
import { UserType, userService } from '../services/user';

export const userRouter = router({
  // checking if user exist.
  exist: procedurePubic
    .input(
      z.object({
        countryCode: z.string().min(1, { message: 'REQUIRED' }),
        mobile: z.string().min(1, { message: 'REQUIRED' }),
      }),
    )
    .mutation<boolean>(async ({ input }) =>
      userService.exist(
        z
          .object({
            countryCode: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(2, { message: 'INVALID-COUNTRY' })
              .max(2, { message: 'INVALID-COUNTRY' }),
            mobile: z
              .string()
              .min(10, { message: 'INVALID-MOBILE' })
              .max(10, { message: 'INVALID-MOBILE' }),
          })
          .parse({
            countryCode: base64ToString(input.countryCode),
            mobile: base64ToString(input.mobile),
          }),
      ),
    ),

  // verifying signing up requests and sending otp.
  verify: procedurePubic
    .input(
      z.object({
        countryCode: z.string().min(1, { message: 'REQUIRED' }),
        mobile: z.string().min(1, { message: 'REQUIRED' }),
        password: z
          .string()
          .min(1, { message: 'REQUIRED' })
          .min(6, { message: 'TOO-SHORT' })
          .max(20, { message: 'TOO-LONG' }),
      }),
    )
    .mutation<void>(async ({ input }) =>
      userService.verify(
        z
          .object({
            countryCode: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(2, { message: 'INVALID-COUNTRY' })
              .max(2, { message: 'INVALID-COUNTRY' }),
            mobile: z
              .string()
              .min(10, { message: 'INVALID-MOBILE' })
              .max(10, { message: 'INVALID-MOBILE' }),
            password: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(6, { message: 'TOO-SHORT' })
              .max(20, { message: 'TOO-LONG' }),
          })
          .parse({
            countryCode: base64ToString(input.countryCode),
            mobile: base64ToString(input.mobile),
            password: base64ToString(input.password),
          }),
      ),
    ),

  // signing up a new user.
  signUp: procedurePubic
    .input(
      z.object({
        countryCode: z.string().min(1, { message: 'REQUIRED' }),
        mobile: z.string().min(1, { message: 'REQUIRED' }),
        password: z.string().min(1, { message: 'REQUIRED' }),
        code: z.string().min(1, { message: 'REQUIRED' }),
      }),
    )
    .mutation<UserType>(async ({ input }) =>
      userService.signUp(
        z
          .object({
            countryCode: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(2, { message: 'INVALID-COUNTRY' })
              .max(2, { message: 'INVALID-COUNTRY' }),
            mobile: z
              .string()
              .min(10, { message: 'INVALID-MOBILE' })
              .max(10, { message: 'INVALID-MOBILE' }),
            password: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(6, { message: 'TOO-SHORT' })
              .max(20, { message: 'TOO-LONG' }),
            code: z
              .string()
              .min(4, { message: 'INVALID-OTP' })
              .max(4, { message: 'INVALID-OTP' }),
          })
          .parse({
            countryCode: base64ToString(input.countryCode),
            mobile: base64ToString(input.mobile),
            password: base64ToString(input.password),
            code: base64ToString(input.code),
          }),
      ),
    ),

  // signing in a user.
  signIn: procedurePubic
    .input(
      // basic schema as the input is going to be encrypted.
      z.object({
        countryCode: z.string().min(1, { message: 'REQUIRED' }),
        mobile: z.string().min(1, { message: 'REQUIRED' }),
        password: z.string().min(1, { message: 'REQUIRED' }),
      }),
    )
    .mutation<UserType>(async ({ input }) =>
      userService.signIn(
        z
          .object({
            countryCode: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(2, { message: 'INVALID-COUNTRY' })
              .max(2, { message: 'INVALID-COUNTRY' }),
            mobile: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(10, { message: 'INVALID-MOBILE' })
              .max(10, { message: 'INVALID-MOBILE' }),
            password: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(6, { message: 'TOO-SHORT' })
              .max(20, { message: 'TOO-LONG' }),
          })
          .parse({
            countryCode: base64ToString(input.countryCode),
            mobile: base64ToString(input.mobile),
            password: base64ToString(input.password),
          }),
      ),
    ),

  // getting user profile.
  me: procedurePrivate.query<UserType>(async ({ ctx: { user } }) =>
    userService.me(user),
  ),
});
