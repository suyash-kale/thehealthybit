import React, { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { TextField } from '../../atom/text-field';
import { Loading } from '../../molecule/loading';
import { useNotification } from '../../hooks/use-notification';
import { stringToBase64 } from '../../utility/crypto';
import { client } from '../../utility/trpc';
import { ButtonAnimation } from '../../atom/animation/button';
import { Password } from '../../molecule/password';

const schema = z.object({
  countryCode: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .min(2, { message: 'INVALID-COUNTRY' })
    .max(2, { message: 'INVALID-COUNTRY' }),
  mobile: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .min(10, { message: 'INVALID-MOBILE' })
    .max(10, { message: 'INVALID-MOBILE' }),
  code: z
    .string()
    .min(4, { message: 'INVALID-MOBILE' })
    .max(4, { message: 'INVALID-MOBILE' })
    .optional(),
  password: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .min(6, { message: 'TOO-SHORT' })
    .max(20, { message: 'TOO-LONG' }),
});

type SchemaType = z.infer<typeof schema>;

// forgot password page component.
export const ForgotPassword: FC = () => {
  const navigate = useNavigate();

  // data passed on from check in page.
  const state = useLocation().state;

  // loading state for the component.
  const [loading, setLoading] = useState<boolean>(false);

  const { addNotification } = useNotification();

  const form = useForm<SchemaType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const { handleSubmit, setValue } = form;

  // handle form submission.
  const onSuccess = useCallback(
    async (data: SchemaType) => {
      console.log(data);
      setLoading(true);
      // navigate('/');
    },
    [state, navigate],
  );

  // handle form submission error.
  const onError = useCallback(() => {
    addNotification({
      severity: 'warning',
      message: 'INVALID-FORM',
    });
  }, []);

  // setting up values passed on from check in page.
  useEffect(() => {
    if (state) {
      setValue('countryCode', state.countryCode);
      setValue('mobile', state.mobile);
    } else {
      navigate('/');
    }
  }, [state, navigate, setValue]);

  return (
    <Grid item xl={6} md={6} sm={12}>
      <Typography variant='h3' align='center' sx={{ mb: 3 }}>
        <FormattedMessage id='FORGOT-PASSWORD' />
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
                  type='number'
                  fullWidth
                  focus
                />
              </Grid>
              <Grid item xs={12}>
                <Password
                  form={form}
                  registered='password'
                  loading={loading}
                  formControl={{
                    sx: {
                      mb: 2,
                    },
                    required: true,
                  }}
                  label={'CREATE-PASSWORD'}
                  placeholder={'CREATE-PASSWORD'}
                  fullWidth
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
