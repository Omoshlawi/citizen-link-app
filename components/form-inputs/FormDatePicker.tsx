import { Calendar } from "lucide-react-native";
import React, { ComponentProps } from "react";
import { Controller, FieldValues } from "react-hook-form";
import DateTimePickerInput from "../date-time-picker";
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

type FormDatePickerProps<T extends FieldValues> = Omit<
  FormTextInputProps<T>,
  "rightSection"
> & {
  datePickerProps?: Pick<
    ComponentProps<typeof DateTimePickerInput>,
    "display" | "formatter" | "mode"
  >;
};

const FormDatePicker = <T extends FieldValues>({
  controll,
  name,
  label,
  formControlProps,
  inputWrapperProps,
  leftSection,
  helperText,
  datePickerProps,
  ...inputProps
}: FormDatePickerProps<T>) => {
  return (
    <Controller
      control={controll}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <DateTimePickerInput
          date={field.value}
          onDateChanged={field.onChange}
          renderTrigger={({ onPress, formattedDate }) => (
            <FormControl
              isInvalid={invalid}
              size="md"
              isDisabled={false}
              isReadOnly={true}
              isRequired={false}
              className="w-full"
              {...formControlProps}
            >
              <FormControlLabel>
                <FormControlLabelText>{label}</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1" size="md" {...inputWrapperProps}>
                <InputField
                  placeholder="Select date"
                  {...inputProps}
                  value={formattedDate}
                  onPress={onPress}
                />
                <InputSlot className="px-3" onPress={onPress}>
                  <InputIcon as={Calendar} />
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
          {...datePickerProps}
        />
      )}
    />
  );
};

export default FormDatePicker;
