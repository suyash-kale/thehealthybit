import z from 'zod';

import { router, procedurePubic, procedurePrivate } from '../utility/trpc';
import { base64ToString } from '../utility/crypto';
import { UserType, userService } from '../services/user';

// user router.
export const userRouter = router({
  // verifying signing up requests.
  verify: procedurePubic
    .input(
      // basic schema as the input is going to be encrypted.
      z.object({
        first: z.string().min(1, { message: 'REQUIRED' }),
        last: z.string().optional().or(z.literal('')),
        countryCode: z.string().min(1, { message: 'REQUIRED' }),
        mobile: z.string().min(1, { message: 'REQUIRED' }),
        email: z.string().optional().or(z.literal('')),
        password: z.string().min(1, { message: 'REQUIRED' }),
      }),
    )
    .mutation<void>(async ({ input }) =>
      // will be signing up once the input is validated.
      userService.verify(
        // actual validation schema.
        // decrypting the input and validating it.
        z
          .object({
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
            countryCode: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(2, { message: 'INVALID-COUNTRY' })
              .max(2, { message: 'INVALID-COUNTRY' }),
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
              .max(20, { message: 'TOO-LONG' }),
          })
          .parse({
            first: base64ToString(input.first),
            last: base64ToString(input.last),
            countryCode: base64ToString(input.countryCode),
            mobile: base64ToString(input.mobile),
            email: base64ToString(input.email),
            password: base64ToString(input.password),
          }),
      ),
    ),

  // signing up new user.
  signUp: procedurePubic
    .input(
      // basic schema as the input is going to be encrypted.
      z.object({
        first: z.string().min(1, { message: 'REQUIRED' }),
        last: z.string().optional().or(z.literal('')),
        countryCode: z.string().min(1, { message: 'REQUIRED' }),
        mobile: z.string().min(1, { message: 'REQUIRED' }),
        email: z.string().optional().or(z.literal('')),
        password: z.string().min(1, { message: 'REQUIRED' }),
        code: z.string().min(1, { message: 'REQUIRED' }),
      }),
    )
    .mutation<UserType>(async ({ input }) =>
      // will be signing up once the input is validated.
      userService.signUp(
        // actual validation schema.
        // decrypting the input and validating it.
        z
          .object({
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
            countryCode: z
              .string()
              .min(1, { message: 'REQUIRED' })
              .min(2, { message: 'INVALID-COUNTRY' })
              .max(2, { message: 'INVALID-COUNTRY' }),
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
              .max(20, { message: 'TOO-LONG' }),
            code: z
              .string()
              .min(4, { message: 'INVALID-OTP' })
              .max(4, { message: 'INVALID-OTP' }),
          })
          .parse({
            first: base64ToString(input.first),
            last: base64ToString(input.last),
            countryCode: base64ToString(input.countryCode),
            mobile: base64ToString(input.mobile),
            email: base64ToString(input.email),
            password: base64ToString(input.password),
            code: base64ToString(input.code),
          }),
      ),
    ),

  // signing in user.
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
      // will be signing in once the input is validated.
      userService.signIn(
        // actual validation schema.
        // decrypting the input and validating it.
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
