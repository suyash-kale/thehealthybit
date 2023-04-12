import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { TextField } from '../atom/text-field';
import { Loading } from '../molecule/loading';
import { Password } from '../molecule/password';
import { useNotification } from '../hooks/use-notification';
import { client } from '../utility/trpc';
import { useUser } from '../hooks/use-user';
import { wait } from '../utility/wait';

// schema for sign up form data.
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
});

type SchemaType = z.infer<typeof schema>;

// sign up page component.
export const SignUp: FC = () => {
  const { formatMessage } = useIntl();

  const navigate = useNavigate();

  // get mobile from router state.
  // when user comes from sign in page with mobile entered.
  const mobile = useLocation().state?.mobile;

  // loading state for the component.
  const [loading, setLoading] = useState<boolean>(false);

  const { addNotification } = useNotification();

  // sign in user after sign up.
  const { signIn } = useUser();

  const form = useForm<SchemaType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const { handleSubmit, setFocus, setValue, getValues } = form;

  // handle sign up form submission.
  const onSuccess = useCallback(async (data: SchemaType) => {
    setLoading(true);

    try {
      // firing sign up mutation.
      const response = await client.user.signUp.mutate(data);

      // sign in user.
      // by default remembering the user.
      signIn(response, true);

      addNotification({
        severity: 'success',
        message: formatMessage(
          {
            id: 'WELCOME-NAME',
          },
          { name: response.first },
        ),
      });

      navigate('/');
    } catch (e: any) {
      setLoading(false);

      // wait to make sure the input disabled property is removed.
      await wait(0);

      const id = e?.message;
      if (id === 'MOBILE-ALREADY-REGISTERED') {
        setFocus('mobile');
      }
    }
    setLoading(false);
  }, []);

  // handle sign up form submission error.
  const onError = useCallback((errors: FieldErrors<SchemaType>) => {
    addNotification({
      severity: 'warning',
      message: 'INVALID-FORM',
    });
  }, []);

  // redirecting user to sign in page.
  const navigateToSignIn = useCallback(async () => {
    navigate('/sign-in', {
      state: {
        mobile: getValues('mobile'),
      },
    });
  }, [navigate]);

  // setting mobile when available in location state.
  useEffect(() => {
    if (mobile) {
      setValue('mobile', mobile);
    }
  }, [mobile]);

  return (
    <Grid item xl={6} md={6} sm={12}>
      <Typography variant="h3" align="center" sx={{ mb: 3 }}>
        <FormattedMessage id="SIGN-UP" />
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
              <Grid item md={6} xs={12} pr={{ md: 1 }}>
                <TextField
                  form={form}
                  registered="first"
                  loading={loading}
                  required
                  sx={{
                    mb: 2,
                  }}
                  label="FIRST-NAME"
                  placeholder="FIRST-NAME"
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item md={6} xs={12} pl={{ md: 1 }}>
                <TextField
                  form={form}
                  registered="last"
                  loading={loading}
                  sx={{
                    mb: 2,
                  }}
                  label="LAST-NAME"
                  placeholder="LAST-NAME"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  form={form}
                  registered="mobile"
                  loading={loading}
                  required
                  sx={{
                    mb: 2,
                  }}
                  label="MOBILE"
                  placeholder="MOBILE"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  form={form}
                  registered="email"
                  loading={loading}
                  sx={{
                    mb: 2,
                  }}
                  label="EMAIL"
                  placeholder="EMAIL"
                  fullWidth
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <Password
                  form={form}
                  registered="password"
                  loading={loading}
                  formControl={{
                    sx: {
                      mb: 2,
                    },
                    required: true,
                  }}
                  label="PASSWORD"
                  placeholder="PASSWORD"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} textAlign="right">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  loading={loading}
                  loadingPosition="end"
                >
                  <FormattedMessage id="SUBMIT" />
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Loading>
      <Grid container justifyContent="center">
        <LoadingButton type="button" variant="text" onClick={navigateToSignIn}>
          <FormattedMessage id="SIGN-IN" />
        </LoadingButton>
      </Grid>
    </Grid>
  );
};
