import { TRPCLink, createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { observable } from '@trpc/server/observable';
import { setRecoil, getRecoil } from 'recoil-nexus';
import type { AppRouter } from '../../../server/src/main';

import { NotificationType } from '../types/notification';
import generateRandomNumber from './generate-random-number';
import { NotificationState } from '../state/notification';
import { UserState } from '../state/user';
import { intl } from './intl';

export const handleErrors: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          const id = err.message as string;
          if (id) {
            const notification: NotificationType = {
              Id: generateRandomNumber(),
              severity: 'warning',
              message: intl.formatMessage({ id }),
            };
            // show the error message here.
            setRecoil(NotificationState, [notification]);
          }
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    handleErrors,
    httpBatchLink({
      url: `${import.meta.env.VITE_APP_SERVER_URL}trpc`,
      async headers() {
        return {
          authorization:
            getRecoil(UserState)?.authorization ||
            localStorage.getItem('authorization') ||
            '',
        };
      },
    }),
  ],
});
