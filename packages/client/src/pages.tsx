import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MasterPage } from './template/master-page';
import { SignUp } from './page/sign-up';

export const Pages: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MasterPage>
              <SignUp />
            </MasterPage>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
