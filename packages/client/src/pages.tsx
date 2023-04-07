import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { MasterPage } from './template/master-page';
import { PageAuth } from './atom/page-auth';
import { Dashboard } from './page/dashboard';
import { SignUp } from './page/sign-up';
import { PageMessage } from './atom/page-message';
import { useUser } from './hooks/use-user';

export const Pages: FC = () => {
  const { isSignIn, signIn } = useUser();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const main = async () => {
      const authorization = localStorage.getItem('authorization');
      if (authorization && !isSignIn) {
        await signIn(authorization);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    main();
  }, [isSignIn]);

  return (
    <BrowserRouter>
      {loading ? (
        <PageMessage title={<FormattedMessage id="RELAX" />}>
          <FormattedMessage id="WE-ARE-GETTING-THINGS-READY" />
        </PageMessage>
      ) : (
        <MasterPage>
          <Routes>
            <Route
              path="/"
              element={
                <PageAuth redirectIfNotAuth="/sign-up">
                  <Dashboard />
                </PageAuth>
              }
            />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </MasterPage>
      )}
    </BrowserRouter>
  );
};
