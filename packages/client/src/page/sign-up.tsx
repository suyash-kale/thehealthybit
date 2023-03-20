import { FC, useCallback } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

import { TextField } from '../atom/text-field';
import { Loading } from '../molecule/loading';
import { Password } from '../molecule/password';
import { useNotification } from '../hooks/use-notification';

const schema = z.object({
  first_name: z
    .string()
    .min(1, { message: 'REQUIRED' })
    .max(20, { message: 'TOO_LONG' }),
  last_name: z.string().max(20, { message: 'TOO_LONG' }),
  mobile: z
    .string()
    .min(10, { message: 'INVALID_MOBILE' })
    .max(10, { message: 'INVALID_MOBILE' }),
  password: z
    .string()
    .min(6, { message: 'TOO_SHORT' })
    .max(20, { message: 'TOO_LONG' }),
});

type SchemaType = z.infer<typeof schema>;

export const SignUp: FC = () => {
  const loading = false;

  const { addNotification } = useNotification();

  const form = useForm<SchemaType>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = form;

  const onSuccess = useCallback((data: SchemaType) => {
    addNotification({
      severity: 'success',
      message: `Welcome ${data.first_name}!`,
    });
  }, []);

  const onError = useCallback((errors: FieldErrors<SchemaType>) => {
    addNotification({
      severity: 'warning',
      message: `Please fill ${Object.keys(errors)[0]} correctly.`,
    });
  }, []);

  return (
    <Grid item xl={4} md={6} sm={12}>
      <Typography variant="h3" align="center" sx={{ mb: 3 }}>
        Sign up
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
                  registered="first_name"
                  loading={loading}
                  sx={{
                    mb: 2,
                  }}
                  label="First name"
                  placeholder="Enter first name"
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item md={6} sm={12} sx={{ pl: 1 }}>
                <TextField
                  form={form}
                  registered="last_name"
                  loading={loading}
                  sx={{
                    mb: 2,
                  }}
                  label="Last name"
                  placeholder="Enter last name"
                  fullWidth
                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  form={form}
                  registered="mobile"
                  loading={loading}
                  sx={{
                    mb: 2,
                  }}
                  label="Mobile"
                  placeholder="Enter mobile number"
                  type="number"
                  fullWidth
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
                  }}
                  label="Password"
                  placeholder="Enter password"
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
                  Submit
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
