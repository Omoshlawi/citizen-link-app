import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "../ui/checkbox";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
} from "../ui/form-control";
import { AlertCircleIcon, CheckIcon } from "../ui/icon";
import { FormInputProps } from "./comon-types";

type FormChechBoxProps<T extends FieldValues> = FormInputProps<T> & {};

const FormCheckBox = <T extends FieldValues>({
  controll,
  name,
  label,
  formControlProps,
  helperText,
}: FormChechBoxProps<T>) => {
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
          <Checkbox
            ref={field.ref}
            isDisabled={field.disabled}
            isInvalid={!!error?.message}
            size="md"
            value={""}
            isChecked={field.value}
            onChange={field.onChange}
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>{label}</CheckboxLabel>
          </Checkbox>
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

export default FormCheckBox;
