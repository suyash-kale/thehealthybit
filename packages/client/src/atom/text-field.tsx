import { FieldValues, UseFormReturn, PathValue, Path } from 'react-hook-form';
import { useIntl } from 'react-intl';
import MaterialTextField, { TextFieldProps } from '@mui/material/TextField';

type TextFieldType<T extends FieldValues, P extends Path<T>> = {
  form: UseFormReturn<T, unknown>;
  registered: P;
  loading?: boolean;
} & TextFieldProps;

// higher order component for material text field.
export const TextField = <T extends FieldValues, P extends Path<T>>({
  form,
  registered,
  loading,
  label,
  placeholder,
  ...props
}: TextFieldType<T, P>) => {
  const { formatMessage } = useIntl();

  const { formState, register, setValue } = form;

  const { errors, dirtyFields } = formState;

  const isFormDirty = formState.submitCount > 0;

  const helperText = errors[registered]?.message?.toString();

  return (
    <MaterialTextField
      {...register(registered)}
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
