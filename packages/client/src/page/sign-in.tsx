import React, {
  FC,
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
} from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { TextField } from '../atom/text-field';
import { Loading } from '../molecule/loading';
import { Password } from '../molecule/password';
import { useNotification } from '../hooks/use-notification';
import { stringToBase64 } from '../utility/crypto';
import { client } from '../utility/trpc';
import { useUser } from '../hooks/use-user';
import { wait } from '../utility/wait';
import { ButtonAnimation } from '../atom/animation/button';

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
  const navigate = useNavigate();

  // get mobile from router state.
  // when user comes from sign in page with mobile entered.
  const mobile = useLocation().state?.mobile;

  // loading state for the component.
  const [loading, setLoading] = useState<boolean>(false);

  // remember me checkbox state.
  const [rememberMe, setRememberMe] = useState<boolean>(true);

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
  const onSuccess = useCallback(
    async (data: SchemaType) => {
      setLoading(true);

      try {
        // firing sign in mutation.
        const response = await client.user.signIn.mutate({
          // encrypting data.
          mobile: stringToBase64(data.mobile),
          password: stringToBase64(data.password),
        });

        // sign in user.
        signIn(response, rememberMe);

        addNotification({
          severity: 'success',
          message: 'WELCOME-NAME',
          variables: { name: response.first },
        });

        setLoading(false);

        navigate('/');
      } catch (e: unknown) {
        setLoading(false);

        // wait to make sure the input disabled property is removed.
        await wait(0);

        const id = (e as { message?: string })?.message;
        if (id === 'MOBILE-NOT-REGISTERED') {
          setFocus('mobile');
        } else if (id === 'PASSWORD-INCORRECT') {
          setFocus('password');
        }
      }
    },
    [signIn, rememberMe, addNotification, navigate],
  );

  // handle sign in form submission error.
  const onError = useCallback(() => {
    addNotification({
      severity: 'warning',
      message: 'INVALID-FORM',
    });
  }, []);

  // redirecting user to sign up page.
  const navigateToSignUp = useCallback(async () => {
    navigate('/sign-up', {
      state: {
        mobile: getValues('mobile'),
      },
    });
  }, [navigate, getValues]);

  // handling remember me checkbox change event.
  const onChangeRememberMe = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRememberMe(event.target.checked);
    },
    [],
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
      <Typography variant='h3' align='center' sx={{ mb: 3 }}>
        <FormattedMessage id='SIGN-IN' />
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
                  defaultValue={mobile}
                  registered='mobile'
                  loading={loading}
                  required
                  sx={{
                    mb: 2,
                  }}
                  label='MOBILE'
                  placeholder='MOBILE'
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
                  label='PASSWORD'
                  placeholder='PASSWORD'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} textAlign='right'>
                <FormControlLabel
                  disabled={loading}
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={onChangeRememberMe}
                    />
                  }
                  label={<FormattedMessage id='REMEMBER-ME' />}
                />
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
      <Grid container justifyContent='center'>
        <LoadingButton
          disabled={loading}
          type='button'
          variant='text'
          onClick={navigateToSignUp}
        >
          <FormattedMessage id='SIGN-UP' />
        </LoadingButton>
      </Grid>
    </Grid>
  );
};
