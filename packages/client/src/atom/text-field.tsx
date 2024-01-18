import React, { useEffect, useRef } from 'react';
import { FieldValues, UseFormReturn, PathValue, Path } from 'react-hook-form';
import { useIntl } from 'react-intl';
import MaterialTextField, { TextFieldProps } from '@mui/material/TextField';

type TextFieldType<T extends FieldValues, P extends Path<T>> = {
  form: UseFormReturn<T, unknown>;
  registered: P;
  loading?: boolean;
  focus?: boolean;
} & TextFieldProps;

// higher order component for material text field.
export const TextField = <T extends FieldValues, P extends Path<T>>({
  form,
  registered,
  loading,
  label,
  placeholder,
  focus,
  ...props
}: TextFieldType<T, P>) => {
  const { formatMessage } = useIntl();

  const inputRef = useRef<null | HTMLDivElement>(null);

  const { formState, register, setValue } = form;

  const { errors, dirtyFields } = formState;

  const isFormDirty = formState.submitCount > 0;

  const helperText = errors[registered]?.message?.toString();

  const { ref, ...reg } = register(registered);

  useEffect(() => {
    if (focus) {
      // waiting for route animation to finish.
      setTimeout(() => {
        inputRef.current?.querySelector('input')?.focus();
      }, 550);
    }
  }, [focus]);

  return (
    <MaterialTextField
      {...reg}
      ref={(e) => {
        ref(e);
        inputRef.current = e;
      }}
      disabled={loading}
      onChange={(ev) => {
        setValue(registered, ev.target.value as PathValue<T, P>, {
          shouldValidate: isFormDirty || dirtyFields[registered],
          shouldDirty: true,
        });
      }}
      error={!!errors[registered]}
      helperText={helperText ? formatMessage({ id: helperText }) : helperText}
      sx={{
        mb: 2,
      }}
      fullWidth
      label={typeof label === 'string' ? formatMessage({ id: label }) : label}
      placeholder={
        typeof placeholder === 'string'
          ? formatMessage({ id: placeholder })
          : placeholder
      }
      {...props}
    />
  );
};
