import { FieldValues, UseFormReturn, PathValue } from 'react-hook-form';
import MaterialTextField, { TextFieldProps } from '@mui/material/TextField';

type TextFieldType<T extends FieldValues, P extends keyof T> = {
  form: UseFormReturn<T, any>;
  registered: T[P];
  loading?: boolean;
} & TextFieldProps;

export const TextField = <T extends FieldValues, P extends keyof T>({
  form,
  registered,
  loading,
  ...props
}: TextFieldType<T, P>) => {
  const { formState, register, setValue } = form;

  const { errors, dirtyFields } = formState;

  const isFormDirty = formState.submitCount > 0;

  return (
    <MaterialTextField
      {...register(registered)}
      disabled={loading}
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
      error={!!errors[registered]}
      helperText={errors[registered]?.message?.toString()}
      sx={{
        mb: 2,
      }}
      fullWidth
      {...props}
    />
  );
};
