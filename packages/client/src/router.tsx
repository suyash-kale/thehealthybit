import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { MasterPage } from './template/master-page';
import { SignUp } from './page/sign-up';
import { SignIn } from './page/sign-in';
import { PageAuth } from './atom/page-auth';
import { Dashboard } from './page/dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MasterPage />,
    children: [
      {
        path: 'sign-up',
        element: <SignUp />,
      },
      {
        path: 'sign-in',
        element: <SignIn />,
      },
      {
        path: '/',
        element: (
          <PageAuth redirectIfNotAuth='/sign-in'>
            <Dashboard />
          </PageAuth>
        ),
      },
    ],
  },
]);
