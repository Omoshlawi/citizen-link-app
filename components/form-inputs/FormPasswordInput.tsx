import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, FieldValues } from "react-hook-form";
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
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { FormTextInputProps } from "./FormTextInput";

type FormPasswordInputProps<T extends FieldValues> = Omit<
  FormTextInputProps<T>,
  "rightSection"
> & {};

const FormPasswordInput = <T extends FieldValues>({
  controll,
  name,
  label,
  formControlProps,
  inputWrapperProps,
  leftSection,
  helperText,
  ...inputProps
}: FormPasswordInputProps<T>) => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <Controller
      control={controll}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <FormControl
          isInvalid={invalid}
          size="md"
          isDisabled={false}
          isReadOnly={false}
          isRequired={false}
          className="w-full"
          {...formControlProps}
        >
          <FormControlLabel>
            <FormControlLabelText>{label}</FormControlLabelText>
          </FormControlLabel>
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
              secureTextEntry={hidePassword}
              autoCapitalize="none"
            />
            <InputSlot
              className="px-3"
              onPress={() => setHidePassword((p) => !p)}
            >
              <InputIcon as={hidePassword ? EyeOff : Eye} />
            </InputSlot>
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

export default FormPasswordInput;
