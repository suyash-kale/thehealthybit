import React, { FC, ReactNode, useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

import { useUser } from '../hooks/use-user';
import { PageMessage } from './page-message';

interface PageAuthType {
  children: ReactNode;
  redirectIfNotAuth?: string;
}

// authentication for the entire page.
export const PageAuth: FC<PageAuthType> = ({ children, redirectIfNotAuth }) => {
  const navigate = useNavigate();

  const { isAuth } = useUser();

  // handling click event for sign in button.
  const onSignIn = useCallback(() => navigate('/sign-in'), [navigate]);

  // redirect to the specified page if not authenticated.
  useEffect(() => {
    if (redirectIfNotAuth && !isAuth()) {
      navigate(redirectIfNotAuth);
    }
  }, [redirectIfNotAuth, isAuth, navigate]);

  if (!isAuth()) {
    return (
      <PageMessage
        title={<FormattedMessage id='NOT-AUTHORIZED' />}
        end={
          <Grid container justifyContent='center'>
            <LoadingButton variant='text' onClick={onSignIn}>
              Sign in
            </LoadingButton>
          </Grid>
        }
      >
        <FormattedMessage id='NOT-AUTHORIZED-MESSAGE' />
      </PageMessage>
    );
  }

  return <> {children} </>;
};
