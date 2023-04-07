import { useState } from 'react';
import { FieldValues, PathValue, UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormControlProps,
  InputLabel,
  InputLabelProps,
  OutlinedInput,
  OutlinedInputProps,
  FormHelperText,
  FormHelperTextProps,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';

import generateRandomNumber from '../utility/generate-random-number';

export type PasswordProps<T extends FieldValues, P extends keyof T> = {
  form: UseFormReturn<T, any>;
  registered: T[P];
  loading?: boolean;
  formControl?: FormControlProps;
  inputLabel?: InputLabelProps;
  formHelperText?: FormHelperTextProps;
} & OutlinedInputProps;

// password input field component.
export const Password = <T extends FieldValues, P extends keyof T>({
  form,
  registered,
  loading,
  formControl,
  inputLabel,
  formHelperText,
  ...props
}: PasswordProps<T, P>) => {
  const { formatMessage } = useIntl();

  // generate random id for input field.
  const Id = `id-${generateRandomNumber()}`;

  // state for toggling password visibility.
  const [show, setShow] = useState<boolean>(false);

  const { formState, register, setValue } = form;

  const { errors, dirtyFields } = formState;

  const isFormDirty = formState.submitCount > 0;

  const helperText = errors[registered]?.message?.toString();

  return (
    <FormControl
      disabled={loading}
      error={!!errors[registered]}
      fullWidth
      {...formControl}
    >
      <InputLabel error={!!errors[registered]} {...inputLabel} htmlFor={Id}>
        {typeof props.label === 'string' ? (
          <FormattedMessage id={props.label} />
        ) : (
          props.label
        )}
      </InputLabel>
      <OutlinedInput
        {...props}
        id={Id}
        type={show ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton disabled={loading} onClick={() => setShow((b) => !b)}>
              {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        }
        {...register(registered)}
        onChange={(ev) => {
          setValue(registered, ev.target.value as PathValue<T, T[P]>, {
            shouldValidate: isFormDirty || dirtyFields[registered],
          });
        }}
        onBlur={(ev) => {
          setValue(registered, ev.target.value as PathValue<T, T[P]>, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        placeholder={formatMessage({ id: props.placeholder })}
      />
      <FormHelperText error={!!errors[registered]} {...formHelperText}>
        {helperText && <FormattedMessage id={helperText} />}
      </FormHelperText>
    </FormControl>
  );
};
