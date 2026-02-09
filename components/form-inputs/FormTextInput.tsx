import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { TextInputProps } from "react-native";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { AlertCircleIcon } from "../ui/icon";
import { Input, InputField } from "../ui/input";

export type FormTextInputProps<T extends FieldValues> = TextInputProps & {
  name: FieldPath<T>;
  label?: string;
  controll: Control<T>;
  formControlProps?: Partial<React.ComponentProps<typeof FormControl>>;
  inputWrapperProps?: Partial<React.ComponentProps<typeof Input>>;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  helperText?: string;
};

const FormTextInput = <T extends FieldValues>({
  controll,
  name,
  label,
  formControlProps,
  inputWrapperProps,
  leftSection,
  rightSection,
  helperText,
  ...inputProps
}: FormTextInputProps<T>) => {
  return (
    <Controller
      control={controll}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <FormControl
          isInvalid={invalid}
          size="md"
          isDisabled={field.disabled}
          isReadOnly={false}
          isRequired={false}
          className="w-full"
          {...formControlProps}
        >
          {!!label && (
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>
          )}
          <Input
            variant="outline"
            {...inputWrapperProps}
            isInvalid={!!error?.message}
          >
            {leftSection}
            <InputField
              {...inputProps}
              {...field}
              onChangeText={field.onChange}
              autoCapitalize="none"
            />
            {rightSection}
          </Input>
          {error && (
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-500"
              />
              <FormControlErrorText className="text-red-500">
                {error.message}
              </FormControlErrorText>
            </FormControlError>
          )}
          {helperText && !error && (
            <FormControlHelper>
              <FormControlHelperText>{helperText}</FormControlHelperText>
            </FormControlHelper>
          )}
        </FormControl>
      )}
    />
  );
};

export default FormTextInput;
