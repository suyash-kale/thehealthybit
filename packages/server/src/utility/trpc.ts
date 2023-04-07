import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

import { Locale } from '../types/intl';
import { Intl } from './intl';
import { userService } from '../services/user';

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  // setting the language based on the accept-language header.
  const locale = req.headers['accept-language'] as Locale;
  const intl = new Intl(locale);

  // setting the user context based on the authorization header.
  const authorization = req.headers.authorization;
  let user = null;
  if (authorization && typeof authorization === 'string') {
    user = await userService.me(authorization);
  }

  return {
    req,
    res,
    intl,
    user,
  };
};

type ContextType = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<ContextType>().create();

export const router = t.router;

// public procedure to make sure the intl context is available.
export const procedurePubic = t.procedure.use(
  t.middleware(({ next, ctx }) => {
    return next({
      ctx: {
        intl: ctx.intl,
      },
    });
  }),
);

// protected procedure to make sure the intl & user context is available.
export const procedurePrivate = t.procedure.use(
  t.middleware(({ next, ctx }) => {
    // checking if the user session is valid.
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    return next({
      ctx: {
        intl: ctx.intl,
        user: ctx.user,
      },
    });
  }),
);
