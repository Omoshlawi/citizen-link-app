import DateTimePickerInput from "@/components/date-time-picker";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { ClientFormData } from "@/types/client";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  Calendar,
  UserCircle,
} from "lucide-react-native";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type PersonalInformationProps = {
  onNext: () => void;
};

const PersonalInformation = ({ onNext }: PersonalInformationProps) => {
  const form = useFormContext<ClientFormData>();
  return (
    <VStack space="md" className="flex-1 items-center">
      <Icon
        as={UserCircle}
        size="sm"
        className="text-teal-500 rounded-full p-6 bg-teal-100"
      />
      <Heading size="sm" className="text-typography-500">
        Personal Information
      </Heading>
      <Controller
        control={form.control}
        name="firstName"
        render={({ field, fieldState: { invalid, error } }) => (
          <FormControl
            isInvalid={invalid}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText>First Name</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
              <InputField
                placeholder="First Name"
                {...field}
                onChangeText={field.onChange}
              />
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
          </FormControl>
        )}
      />
      <Controller
        control={form.control}
        name="lastName"
        render={({ field, fieldState: { invalid, error } }) => (
          <FormControl
            isInvalid={invalid}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText>Last Name</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
              <InputField
                placeholder="Last Name"
                {...field}
                onChangeText={field.onChange}
              />
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
          </FormControl>
        )}
      />
      <Controller
        control={form.control}
        name="dateOfBirth"
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
              >
                <FormControlLabel>
                  <FormControlLabelText>Date of Birth</FormControlLabelText>
                </FormControlLabel>
                <Input className="my-1" size="md">
                  <InputField
                    placeholder="Date of Birth"
                    value={formattedDate}
                  />
                  <InputSlot className="absolute inset-0" onPress={onPress} />
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
              </FormControl>
            )}
          />
        )}
      />
      <Button
        action="primary"
        size="sm"
        className="w-full bg-teal-500 justify-between rounded-none"
        onPress={async () => {
          const isValid = await form.trigger([
            "firstName",
            "lastName",
            "dateOfBirth",
          ]);
          if (isValid) {
            onNext();
          }
        }}
      >
        <ButtonText>Next</ButtonText>
        <ButtonIcon as={ArrowRightIcon} />
      </Button>
    </VStack>
  );
};

export default PersonalInformation;
