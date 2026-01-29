import { Box } from "@/components/ui/box";
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
import { ArrowLeftIcon, ArrowRightIcon, Icon } from "@/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { VStack } from "@/components/ui/vstack";
import {
  SCREENING_FORM_BOOLEAN_OPTIONS,
  SCREENING_FORM_STEPS,
} from "@/lib/constants";
import { ScreenClientFormData } from "@/types/screening";
import { AlertCircleIcon, CircleIcon, UserSearch } from "lucide-react-native";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type ScreeningHistoryProps = {
  onNext: () => void;
  onPrevious: () => void;
};

const ScreeningHistory: FC<ScreeningHistoryProps> = ({
  onNext,
  onPrevious,
}) => {
  const form = useFormContext<ScreenClientFormData>();
  return (
    <VStack space="md" className="flex-1 items-center">
      <Box className="bg-teal-100 rounded-full p-6 w-fit ">
        <Icon
          as={UserSearch}
          size="sm"
          className="text-teal-500 rounded-full p-6 bg-teal-100"
        />
      </Box>
      <Heading size="sm">{SCREENING_FORM_STEPS[4]}</Heading>

      <Controller
        control={form.control}
        name="everScreenedForCervicalCancer"
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
              <FormControlLabelText>
                Have you ever been screened for cervical cancer? (Pap Smear,
                VIA, or HPV)
              </FormControlLabelText>
            </FormControlLabel>
            <RadioGroup value={field.value} onChange={field.onChange}>
              <VStack space="sm">
                {SCREENING_FORM_BOOLEAN_OPTIONS.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>{option.label}</RadioLabel>
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>

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
          onPress={async () => {
            const isValid = await form.trigger([
              "everScreenedForCervicalCancer",
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

export default ScreeningHistory;
