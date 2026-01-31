import React from "react";
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
import { Textarea, TextareaInput } from "../ui/textarea";
import { FormTextInputProps } from "./FormTextInput";

type FormTextAreaProps<T extends FieldValues> = Omit<
  FormTextInputProps<T>,
  "leftSection" | "rightSection" | "inputWrapperProps"
> & {
  inputWrapperProps?: Partial<React.ComponentProps<typeof Textarea>>;
};

const FormTextArea = <T extends FieldValues>({
  controll,
  name,
  label,
  formControlProps,
  inputWrapperProps,
  helperText,
  ...inputProps
}: FormTextAreaProps<T>) => {
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
          <Textarea
            size="md"
            isReadOnly={false}
            isInvalid={false}
            isDisabled={false}
            className=""
            {...inputWrapperProps}
          >
            <TextareaInput
              placeholder="Type here..."
              {...inputProps}
              {...field}
              onChangeText={field.onChange}
            />
          </Textarea>

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

export default FormTextArea;
