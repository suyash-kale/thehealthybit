import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

import { userService } from '../services/user';

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  // setting the user context based on the authorization header.
  const authorization = req.headers.authorization;
  let user = null;
  if (authorization && typeof authorization === 'string') {
    user = await userService.decodeAuthorization(authorization);
  }

  return {
    req,
    res,
    user,
  };
};

type ContextType = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<ContextType>().create();

export const router = t.router;

// public procedure.
export const procedurePubic = t.procedure;

// protected procedure to make sure the user context is available.
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
        user: ctx.user,
      },
    });
  }),
);
