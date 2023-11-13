import React from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { MasterPage } from './template/master-page';
import { RouterAnimation } from './atom/animation/router';
import { SignUp } from './page/sign-up';
import { SignIn } from './page/sign-in';
import { PageAuth } from './atom/page-auth';
import { Dashboard } from './page/dashboard';

export const Router = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <MasterPage />,
      children: [
        {
          path: 'sign-up',
          element: (
            <RouterAnimation>
              <SignUp />
            </RouterAnimation>
          ),
        },
        {
          path: 'sign-in',
          element: (
            <RouterAnimation>
              <SignIn />
            </RouterAnimation>
          ),
        },
        {
          path: '/',
          element: (
            <PageAuth redirectIfNotAuth='/sign-in'>
              <RouterAnimation>
                <Dashboard />
              </RouterAnimation>
            </PageAuth>
          ),
        },
      ],
    },
  ]);

  const location = useLocation();

  if (!element) return null;

  return (
    <AnimatePresence mode='wait'>
      {React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
};
