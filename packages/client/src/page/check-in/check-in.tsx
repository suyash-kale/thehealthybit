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
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { TextField } from '../../atom/text-field';
import { Loading } from '../../molecule/loading';
import { Password } from '../../molecule/password';
import { useNotification } from '../../hooks/use-notification';
import { stringToBase64 } from '../../utility/crypto';
import { client } from '../../utility/trpc';
import { useUser } from '../../hooks/use-user';
import { ButtonAnimation } from '../../atom/animation/button';
import { CountryCode, CountryType } from '../../molecule/country-code';
import { wait } from '../../utility/wait';

const schema = {
  check: z.object({
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
  }),
  signIn: z.object({
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
    password: z
      .string()
      .min(1, { message: 'REQUIRED' })
      .min(6, { message: 'TOO-SHORT' })
      .max(20, { message: 'TOO-LONG' }),
  }),
  signUp: z.object({
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
    password: z
      .string()
      .min(1, { message: 'REQUIRED' })
      .min(6, { message: 'TOO-SHORT' })
      .max(20, { message: 'TOO-LONG' }),
    otp: z
      .string()
      .min(4, { message: 'INVALID-MOBILE' })
      .max(4, { message: 'INVALID-MOBILE' })
      .optional(),
  }),
};

type SchemaType = z.infer<typeof schema.signUp>;

// check in page component.
export const CheckIn: FC = () => {
  const navigate = useNavigate();

  // loading state for the component.
  const [loading, setLoading] = useState<boolean>(false);

  // remember me checkbox state.
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // if the user exists.
  const [exist, setExist] = useState<null | boolean>(null);

  const { addNotification } = useNotification();

  const { signIn } = useUser();

  // picking the resolver based on the exist state.
  let resolver = schema.check;
  if (exist === true) {
    resolver = schema.signIn;
  } else if (exist === false) {
    resolver = schema.signUp;
  }

  const form = useForm<SchemaType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(resolver),
  });

  const { handleSubmit, setFocus, setValue, getValues } = form;

  // handle form submission.
  const onSuccess = useCallback(
    async (data: SchemaType) => {
      setLoading(true);
      if (exist === null) {
        try {
          const response = await client.user.exist.mutate({
            countryCode: stringToBase64(data.countryCode),
            mobile: stringToBase64(data.mobile),
          });
          setExist(response);
        } catch (e: unknown) {
          setLoading(false);
        }
      } else if (exist === false) {
        try {
          await client.user.verify.mutate({
            countryCode: stringToBase64(data.countryCode),
            mobile: stringToBase64(data.mobile),
            password: stringToBase64(data.password),
          });
          navigate('/check-in/otp', {
            state: data,
          });
        } catch (e: unknown) {
          setLoading(false);
        }
      } else if (exist === true) {
        try {
          const response = await client.user.signIn.mutate({
            countryCode: stringToBase64(data.countryCode),
            mobile: stringToBase64(data.mobile),
            password: stringToBase64(data.password),
          });
          signIn(response, rememberMe);
          navigate('/');
        } catch (e: unknown) {
          const id = (e as { message?: string })?.message;
          if (id === 'PASSWORD-INCORRECT') {
            setFocus('password');
          }
          setLoading(false);
        }
      }
      setLoading(false);
    },
    [exist, signIn, rememberMe, navigate, setFocus],
  );

  // handle form submission error.
  const onError = useCallback(() => {
    addNotification({
      severity: 'warning',
      message: 'INVALID-FORM',
    });
  }, []);

  const onSubmit = handleSubmit(onSuccess, onError);

  // handle forgot password.
  const onForgot = useCallback(async () => {
    const mobile = getValues('mobile');
    setLoading(true);
    // navigate to the forgot password page.
    const doNavigate = () =>
      navigate('/check-in/forgot', {
        state: {
          countryCode: getValues('countryCode'),
          mobile,
        },
      });
    const notExist = () =>
      addNotification({
        severity: 'warning',
        message: 'MOBILE-NOT-EXIST',
      });
    if (exist === null) {
      // need to check if the user exist.
      if (mobile) {
        // mobile is available.
        // checking if the mobile exists.
        // and then navigate to the forgot password page.
        try {
          const response = await client.user.exist.mutate({
            countryCode: stringToBase64(getValues('countryCode')),
            mobile: stringToBase64(mobile),
          });
          if (response) {
            doNavigate();
          } else {
            notExist();
          }
        } catch (e: unknown) {
          setLoading(false);
        }
      } else {
        // mobile is not available.
        // submit the form for validation.
        onSubmit();
      }
    } else if (exist === false) {
      // if the user does not exist, show a warning message.
      notExist();
    } else if (exist === true) {
      // if the user exists, navigate to the forgot password page.
      doNavigate();
    }
    setLoading(false);
  }, [onSubmit, exist, getValues, navigate, addNotification]);

  // handling remember me checkbox change event.
  const onChangeRememberMe = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRememberMe(event.target.checked);
    },
    [],
  );

  // handling country code change event.
  const onChangeCountry = useCallback(
    ({ code }: CountryType) => setValue('countryCode', code),
    [setValue],
  );

  useEffect(() => {
    const main = async () => {
      if (exist !== null) {
        await wait(500);
        setFocus('password');
      }
    };
    main();
  }, [exist, setFocus]);

  useEffect(() => {
    setExist(null);
  }, [form.watch('mobile')]);

  return (
    <Grid item xl={6} md={6} sm={12}>
      <Typography variant='h3' align='center' sx={{ mb: 3 }}>
        <FormattedMessage id='CHECK-IN' />
      </Typography>
      <Loading loading={loading}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
          }}
        >
          <form onSubmit={onSubmit} noValidate>
            <Grid container>
              <Grid item md={3} xs={12} pr={{ md: 1 }} mb={{ xs: 2 }}>
                <CountryCode onChange={onChangeCountry} />
              </Grid>
              <Grid item md={9} xs={12} pl={{ md: 1 }}>
                <TextField
                  form={form}
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
              <motion.div
                style={{
                  width: '100%',
                }}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: '-20px',
                    display: 'none',
                  },
                  visible: {
                    opacity: 1,
                    y: '0px',
                    transition: {
                      duration: 0.4,
                    },
                  },
                }}
                animate={exist === null ? 'hidden' : 'visible'}
              >
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
                    label={exist ? 'PASSWORD' : 'CREATE-PASSWORD'}
                    placeholder={exist ? 'PASSWORD' : 'CREATE-PASSWORD'}
                    fullWidth
                  />
                </Grid>
              </motion.div>
              <Grid item xs={12} textAlign='right'>
                <motion.div
                  style={{
                    display: 'inline-block',
                  }}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: '20px',
                      display: 'none',
                    },
                    visible: {
                      opacity: 1,
                      x: '0px',
                      transition: {
                        duration: 0.4,
                      },
                    },
                  }}
                  animate={exist === true ? 'visible' : 'hidden'}
                >
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
                </motion.div>
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
        <Grid container justifyContent='center'>
          <Button variant='text' size='small' type='button' onClick={onForgot}>
            <FormattedMessage id='FORGOT-PASSWORD' />
          </Button>
        </Grid>
      </Loading>
    </Grid>
  );
};
