import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
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
import { AlertCircleIcon, ArrowLeftIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
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
} from "@/components/ui/select";
import { VStack } from "@/components/ui/vstack";
import { ClientFormData } from "@/types/client";
import { ArrowRightIcon, ChevronDownIcon, IdCard } from "lucide-react-native";
import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IdentificationAndStatusProps = {
  onNext: () => Promise<void>;
  onPrevious: () => void;
};

const IdentificationAndStatus = ({
  onNext,
  onPrevious,
}: IdentificationAndStatusProps) => {
  const form = useFormContext<ClientFormData>();
  const maritalStatuses = useMemo<
    { label: string; value: ClientFormData["maritalStatus"] }[]
  >(
    () => [
      { label: "Single", value: "SINGLE" },
      { label: "Married", value: "MARRIED" },
      { label: "Divorced", value: "DIVORCED" },
      { label: "Widowed", value: "WIDOWED" },
      { label: "Separated", value: "SEPARATED" },
    ],
    []
  );

  return (
    <VStack space="md" className="flex-1 items-center">
      <Icon
        as={IdCard}
        size="sm"
        className="text-teal-500 rounded-full p-6 bg-teal-100"
      />
      <Heading size="sm" className="text-typography-500">
        Identification and Status
      </Heading>
      <Controller
        control={form.control}
        name="nationalId"
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
              <FormControlLabelText>National ID</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
              <InputField
                placeholder="National ID"
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
      <Controller
        control={form.control}
        name="maritalStatus"
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
              <FormControlLabelText>Marital Status</FormControlLabelText>
            </FormControlLabel>
            <Select
              className="w-full"
              selectedValue={field.value}
              onValueChange={(value) =>
                field.onChange(value as ClientFormData["maritalStatus"])
              }
            >
              <SelectTrigger variant="outline" size="md">
                <SelectInput placeholder="Select option" className="flex-1" />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {maritalStatuses.map((maritalStatus, i) => (
                    <SelectItem
                      label={maritalStatus.label}
                      value={maritalStatus.value}
                      key={maritalStatus.value}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>

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
          isDisabled={form.formState.isSubmitting}
          onPress={async () => {
            const isValid = await form.trigger(["nationalId", "maritalStatus"]);
            if (isValid) {
              await onNext();
            }
          }}
        >
          {form.formState.isSubmitting && (
            <ButtonSpinner color={"white"} size={"small"} />
          )}
          <ButtonText>
            {form.formState.isSubmitting ? "Submitting..." : "Register"}
          </ButtonText>
          <ButtonIcon as={ArrowRightIcon} />
        </Button>
      </HStack>
    </VStack>
  );
};

export default IdentificationAndStatus;
