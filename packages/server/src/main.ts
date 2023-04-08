import path from 'path';
import cors from 'cors';
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';

import { ENV } from './utility/env';
import { initialize } from './utility/data-source';
import { router, createContext } from './utility/trpc';
import { userRouter } from './router/user';

// application routers.
const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;

async function main() {
  // initializing the typeorm data source.
  await initialize();

  const app = express();

  // enabling cross-origin request in development environment.
  if (ENV.NODE_ENV === 'development') {
    app.use(cors());
  }

  // enabling the trpc middleware.
  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      createContext,
      router: appRouter,
    }),
  );

  // static files for react client application.
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  // other static files for the application.
  app.use(express.static(path.join(__dirname, '../public')));

  // making sure the react client application routes are served.
  app.get('/*', (_req, res) =>
    res.sendFile(path.join(__dirname, '../../client/dist/index.html')),
  );

  app.listen(ENV.PORT, () => {
    console.log(`Listening on http://localhost:${ENV.PORT}`);
  });
}

main();
