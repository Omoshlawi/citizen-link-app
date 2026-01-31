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
import { AlertCircleIcon, ChevronDownIcon } from "../ui/icon";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "../ui/select";
import { FormTextInputProps } from "./FormTextInput";

type FormSelectInputProps<T extends FieldValues> = Omit<
  FormTextInputProps<T>,
  "rightSection" | "inputWrapperProps"
> & {
  data: { label: string; value: string }[];
};

const FormSelectInput = <T extends FieldValues>({
  controll,
  name,
  label,
  formControlProps,
  leftSection,
  helperText,
  placeholder = "Select option",
  className,
  data,
  ...inputProps
}: FormSelectInputProps<T>) => {
  return (
    <Controller
      control={controll}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => {
        const selectedData = data.find((m) => m.value === field.value);
        return (
          <FormControl
            isInvalid={invalid}
            size="md"
            isDisabled={field.disabled}
            isReadOnly={false}
            isRequired={false}
            className="w-full"
            {...formControlProps}
          >
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>
            <Select
              className="w-full"
              selectedValue={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger variant="outline" size="md">
                {leftSection}
                <SelectInput
                  className={`flex-1 ${className}`}
                  {...inputProps}
                  placeholder={placeholder}
                  value={selectedData?.label}
                />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {data.map((d, i) => (
                    <SelectItem label={d.label} value={d.value} key={i} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>

            {error && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-error-500"
                />
                <FormControlErrorText className="text-error-500">
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
        );
      }}
    />
  );
};

export default FormSelectInput;
