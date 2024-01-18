import React, { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { TextField } from '../atom/text-field';
import { Loading } from '../molecule/loading';
import { useNotification } from '../hooks/use-notification';
import { stringToBase64 } from '../utility/crypto';
import { client } from '../utility/trpc';
import { useUser } from '../hooks/use-user';
import { wait } from '../utility/wait';
import { ButtonAnimation } from '../atom/animation/button';

// schema for verify form data.
const schema = z.object({
  first: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .min(2, { message: 'TOO-SHORT' })
    .max(20, { message: 'TOO-LONG' }),
  last: z
    .string()
    .min(2, { message: 'TOO-SHORT' })
    .max(20, { message: 'TOO-LONG' })
    .optional()
    .or(z.literal('')),
  countryCode: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .min(2, { message: 'INVALID-COUNTRY' })
    .max(2, { message: 'INVALID-COUNTRY' }),
  mobile: z
    .string()
    .min(10, { message: 'INVALID-MOBILE' })
    .max(10, { message: 'INVALID-MOBILE' }),
  email: z
    .string()
    .email({ message: 'INVALID-EMAIL' })
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .min(6, { message: 'TOO-SHORT' })
    .max(20, { message: 'TOO-LONG' }),
  code: z
    .string()
    .min(4, { message: 'INVALID-MOBILE' })
    .max(4, { message: 'INVALID-MOBILE' }),
});

type SchemaType = z.infer<typeof schema>;

// mobile verification page component.
export const Verify: FC = () => {
  const { formatMessage } = useIntl();

  const navigate = useNavigate();

  // form data from the sign up page.
  const data: null | SchemaType = useLocation().state;

  // loading state for the component.
  const [loading, setLoading] = useState<boolean>(false);

  const { addNotification } = useNotification();

  // sign in user after verification.
  const { signIn } = useUser();

  const form = useForm<SchemaType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const { handleSubmit, setFocus, setValue } = form;

  // handle verify form submission.
  const onSuccess = useCallback(
    async (data: SchemaType) => {
      setLoading(true);

      try {
        // firing sign up mutation.
        const response = await client.user.signUp.mutate({
          // encrypting data.
          first: stringToBase64(data.first),
          last: stringToBase64(data.last),
          countryCode: stringToBase64(data.countryCode),
          mobile: stringToBase64(data.mobile),
          email: stringToBase64(data.email),
          password: stringToBase64(data.password),
          code: stringToBase64(data.code),
        });

        // sign in user.
        // by default remembering the user.
        signIn(response, true);

        addNotification({
          severity: 'success',
          message: 'WELCOME-NAME',
          variables: { name: response.first },
        });

        navigate('/');
      } catch (e: unknown) {
        setLoading(false);

        // wait to make sure the input disabled property is removed.
        await wait(0);

        const id = (e as { message?: string })?.message;
        if (id === 'INVALID-OTP') {
          setFocus('code');
        }
      }
      setLoading(false);
    },
    [navigate, setFocus, signIn],
  );

  // handle sign up form submission error.
  const onError = useCallback(() => {
    addNotification({
      severity: 'warning',
      message: 'INVALID-FORM',
    });
  }, [addNotification]);

  // setting form data to form from location state.
  useEffect(() => {
    if (data) {
      setValue('first', data.first);
      setValue('last', data.last);
      setValue('countryCode', data.countryCode);
      setValue('mobile', data.mobile);
      setValue('email', data.email);
      setValue('password', data.password);
    }
  }, [data]);

  return (
    <Grid item xl={6} md={6} sm={12}>
      <Typography variant='h3' align='center' sx={{ mb: 3 }}>
        <FormattedMessage id='MOBILE-VERIFICATION' />
      </Typography>
      <Loading loading={loading}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
          }}
        >
          <form onSubmit={handleSubmit(onSuccess, onError)} noValidate>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  form={form}
                  registered='code'
                  loading={loading}
                  required
                  sx={{
                    mb: 2,
                  }}
                  label='CODE'
                  placeholder='CODE'
                  fullWidth
                  focus
                />
              </Grid>
              <Grid item xs={12} textAlign='right'>
                <ButtonAnimation>
                  <LoadingButton
                    type='submit'
                    variant='contained'
                    size='large'
                    endIcon={<ArrowForwardIcon />}
                    loading={loading}
                    loadingPosition='end'
                  >
                    <FormattedMessage id='SUBMIT' />
                  </LoadingButton>
                </ButtonAnimation>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Loading>
    </Grid>
  );
};
