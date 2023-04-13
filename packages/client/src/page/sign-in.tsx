import { MouseEvent, FC, useCallback, useEffect, useState } from 'react';
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

// schema for sign in form data.
const schema = z.object({
  mobile: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .min(10, { message: 'INVALID-MOBILE' })
    .max(10, { message: 'INVALID-MOBILE' }),
  password: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .min(6, { message: 'TOO-SHORT' })
    .max(20, { message: 'TOO-LONG' }),
});

type SchemaType = z.infer<typeof schema>;

// sign in page component.
export const SignIn: FC = () => {
  const { formatMessage } = useIntl();

  const navigate = useNavigate();

  // get mobile from router state.
  // when user comes from sign in page with mobile entered.
  const mobile = useLocation().state?.mobile;

  // loading state for the component.
  const [loading, setLoading] = useState<boolean>(false);

  const { addNotification } = useNotification();

  // sign in user after sign in.
  const { signIn } = useUser();

  const form = useForm<SchemaType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const { handleSubmit, setFocus, getValues, setValue } = form;

  // handle sign in form submission.
  const onSuccess = useCallback(async (data: SchemaType) => {
    setLoading(true);

    try {
      // firing sign in mutation.
      const response = await client.user.signIn.mutate(data);

      // sign in user.
      signIn(response);

      addNotification({
        severity: 'success',
        message: formatMessage(
          {
            id: 'WELCOME-NAME',
          },
          { name: response.first },
        ),
      });

      setLoading(false);

      navigate('/');
    } catch (e: any) {
      setLoading(false);

      // wait to make sure the input disabled property is removed.
      await wait(0);

      const id = e?.message;
      if (id === 'MOBILE-NOT-REGISTERED') {
        setFocus('mobile');
      } else if (id === 'PASSWORD-INCORRECT') {
        setFocus('password');
      }
    }
  }, []);

  // handle sign in form submission error.
  const onError = useCallback((errors: FieldErrors<SchemaType>) => {
    addNotification({
      severity: 'warning',
      message: 'INVALID-FORM',
    });
  }, []);

  // redirecting user to sign up page.
  const navigateToSignUp = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      // blur validation was blocking the redirection.
      e.currentTarget.click();
      await wait(0);
      navigate('/sign-up', {
        state: {
          mobile: getValues('mobile'),
        },
      });
    },
    [navigate, getValues],
  );

  // setting mobile when available in location state.
  useEffect(() => {
    if (mobile) {
      setValue('mobile', mobile);
      setFocus('password');
    }
  }, [mobile]);

  return (
    <Grid item xl={6} md={6} sm={12}>
      <Typography variant="h3" align="center" sx={{ mb: 3 }}>
        <FormattedMessage id="SIGN-IN" />
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
                  autoFocus
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
        <LoadingButton type="button" variant="text" onClick={navigateToSignUp}>
          <FormattedMessage id="SIGN-UP" />
        </LoadingButton>
      </Grid>
    </Grid>
  );
};
