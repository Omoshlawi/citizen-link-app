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
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { ClientFormData } from "@/types/client";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Phone,
} from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import AddressFieldsInput from "./AddressFieldsInput";

type ContactInformationProps = {
  onNext: () => void;
  onPrevious: () => void;
};

const ContactInformation = ({
  onNext,
  onPrevious,
}: ContactInformationProps) => {
  const form = useFormContext<ClientFormData>();
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedSubcounty, setSelectedsubCounty] = useState("");

  return (
    <VStack space="md" className="flex-1 items-center">
      <Icon
        as={Phone}
        size="sm"
        className="text-teal-500 rounded-full p-6 bg-teal-100"
      />
      <Heading size="sm" className="text-typography-500">
        Contact Information
      </Heading>
      <Controller
        control={form.control}
        name="phoneNumber"
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
              <FormControlLabelText>Phone Number</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
              <InputField
                placeholder="Phone Number"
                {...field}
                onChangeText={field.onChange}
                keyboardType="numeric"
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
      <AddressFieldsInput
        control={form.control}
        name="county"
        label="County"
        level={1}
        onChange={(val) => {
          setSelectedCounty(val);
          form.setValue("subcounty", "");
          form.setValue("ward", "");
        }}
      />
      <AddressFieldsInput
        control={form.control}
        name="subcounty"
        label="Subcounty"
        level={2}
        parentName={selectedCounty}
        onChange={(val) => {
          setSelectedsubCounty(val);
          form.setValue("ward", "");
        }}
      />
      <AddressFieldsInput
        control={form.control}
        name="ward"
        label="Ward"
        level={3}
        parentName={selectedSubcounty}
      />

      <HStack space="sm" className="w-full">
        <Button
          action="secondary"
          size="sm"
          className="flex-1 justify-between rounded-none"
          onPress={onPrevious}
        >
          <ButtonIcon as={ArrowLeftIcon} />
          <ButtonText>Previous</ButtonText>
        </Button>
        <Button
          action="primary"
          size="sm"
          className="flex-1 bg-teal-500 justify-between rounded-none"
          onPress={async () => {
            const isValid = await form.trigger([
              "phoneNumber",
              "county",
              "subcounty",
              "ward",
            ]);
            if (isValid) {
              onNext();
            }
          }}
        >
          <ButtonText>Next</ButtonText>
          <ButtonIcon as={ArrowRightIcon} />
        </Button>
      </HStack>
    </VStack>
  );
};

export default ContactInformation;
