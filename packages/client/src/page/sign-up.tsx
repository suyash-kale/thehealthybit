import { FC, useCallback, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { TextField } from '../atom/text-field';
import { Loading } from '../molecule/loading';
import { Password } from '../molecule/password';
import { useNotification } from '../hooks/use-notification';
import { client } from '../utility/trpc';
import { useUser } from '../hooks/use-user';

// schema for sign up form data.
const schema = z.object({
  first: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .max(20, { message: 'TOO-LONG' }),
  last: z.string().max(20, { message: 'TOO-LONG' }),
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
    .min(6, { message: 'TOO-SHORT' })
    .max(20, { message: 'TOO-LONG' }),
});

type SchemaType = z.infer<typeof schema>;

// sign up page component.
export const SignUp: FC = () => {
  const { formatMessage } = useIntl();

  const navigate = useNavigate();

  // loading state for the component.
  const [loading, setLoading] = useState<boolean>(false);

  const { addNotification } = useNotification();

  // sign in user after sign up.
  const { signIn } = useUser();

  const form = useForm<SchemaType>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const { handleSubmit, setFocus } = form;

  // handle sign in form submission.
  const onSuccess = useCallback(async (data: SchemaType) => {
    setLoading(true);
    try {
      // sign up user.
      const response = await client.user.signUp.mutate(data);

      // getting user information.
      const user = await signIn(response.authorization);

      addNotification({
        severity: 'success',
        message: formatMessage(
          {
            id: 'WELCOME-NAME',
          },
          { name: user?.first },
        ),
      });

      navigate('/');
    } catch (e: any) {
      const id = e?.message;
      if (id === 'MOBILE-ALREADY-REGISTERED') {
        setFocus('mobile');
      }
    }
    setLoading(false);
  }, []);

  // handle sign in form submission error.
  const onError = useCallback((errors: FieldErrors<SchemaType>) => {
    addNotification({
      severity: 'warning',
      message: 'INVALID-FORM',
    });
  }, []);

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
              <Grid item md={6} sm={12} sx={{ pr: 1 }}>
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
              <Grid item md={6} sm={12} sx={{ pl: 1 }}>
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
              <Grid item sm={12}>
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
              <Grid item sm={12}>
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
              <Grid item sm={12}>
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
              <Grid item sm={12} textAlign="right">
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
        <LoadingButton variant="text">Sign in</LoadingButton>
      </Grid>
    </Grid>
  );
};
