import React from 'react';
import { Outlet, useLocation, useRoutes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { MasterPage } from './template/master-page';
import { RouterAnimation } from './atom/animation/router';
import { RouterAnimationX } from './atom/animation/router-x';
import { CheckIn } from './page/check-in';
import { CheckInOtp } from './page/check-in/otp';
import { PageAuth } from './atom/page-auth';
import { Dashboard } from './page/dashboard';
import { ForgotPassword } from './page/check-in/forgot-password';
import { MealPlan } from './page/meal-plan';
import { AddMeal } from './page/meal-plan/add-meal';

const Empty = () => <Outlet />;

export const Router = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <MasterPage />,
      children: [
        {
          path: 'check-in',
          element: (
            <RouterAnimation>
              <Empty />
            </RouterAnimation>
          ),
          children: [
            {
              path: '',
              element: <CheckIn />,
            },
            {
              path: 'otp',
              element: <CheckInOtp />,
            },
            {
              path: 'forgot',
              element: <ForgotPassword />,
            },
          ],
        },
        {
          path: '/',
          element: (
            <PageAuth redirectIfNotAuth='/check-in'>
              <RouterAnimation>
                <Dashboard />
              </RouterAnimation>
            </PageAuth>
          ),
        },
        {
          path: '/meal-plan',
          element: (
            <PageAuth redirectIfNotAuth='/check-in'>
              <Empty />
            </PageAuth>
          ),
          children: [
            {
              path: '',
              element: (
                <RouterAnimation>
                  <MealPlan />
                </RouterAnimation>
              ),
            },
            {
              path: 'add/:d/:t',
              element: (
                <RouterAnimationX>
                  <AddMeal />
                </RouterAnimationX>
              ),
            },
          ],
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
