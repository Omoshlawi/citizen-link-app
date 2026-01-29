import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { getBooleanDisplayValue, getSmokingDisplayValue } from "@/lib/helpers";
import { Client } from "@/types/client";

import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { ScreenClientFormData } from "@/types/screening";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ScrollView } from "react-native";
import VariableValue from "../VariableValue";

type ReviewAndSubmitProps = {
  onNext: () => Promise<void>;
  onPrevious: () => void;
  clients?: Client[];
};

const ReviewAndSubmit: FC<ReviewAndSubmitProps> = ({
  onNext,
  onPrevious,
  clients = [],
}) => {
  const form = useFormContext<ScreenClientFormData>();
  const clientId = form.watch("clientId");
  const client = clients.find((client) => client.id === clientId);

  const values = useMemo<{ variable: string; value: string | number }[]>(() => {
    return [
      {
        variable: "Client Name",
        value: client?.firstName + " " + client?.lastName,
      },
      {
        variable: "Age",
        value: client?.dateOfBirth
          ? dayjs().diff(dayjs(client.dateOfBirth), "years")
          : "N/A",
      },
      {
        variable: "Age at first intercourse",
        value: form.watch("firstIntercourseAge"),
      },
      {
        variable: "Lifetime partners",
        value: form.watch("lifeTimePatners"),
      },
      {
        variable: "HIV diagnosis",
        value: getBooleanDisplayValue(form.watch("everDiagnosedWithHIV")),
      },
      {
        variable: "HPV diagnosis",
        value: getBooleanDisplayValue(form.watch("everDiagnosedWithHPV")),
      },
      {
        variable: "STI diagnosis",
        value: getBooleanDisplayValue(form.watch("everDiagnosedWithSTI")),
      },
      {
        variable: "Number of births",
        value: form.watch("totalBirths"),
      },

      {
        variable: "Screened before",
        value: getBooleanDisplayValue(
          form.watch("everScreenedForCervicalCancer")
        ),
      },
      {
        variable: "OCP>5 years",
        value: getBooleanDisplayValue(
          form.watch("usedOralContraceptivesForMoreThan5Years")
        ),
      },
      {
        variable: "Smoking History",
        value: getSmokingDisplayValue(form.watch("smoking")),
      },
      {
        variable: "Family History",
        value: getBooleanDisplayValue(
          form.watch("familyMemberDiagnosedWithCervicalCancer")
        ),
      },
    ];
  }, [client?.dateOfBirth, client?.firstName, client?.lastName, form]);

  const { followUpId } = useLocalSearchParams<{
    followUpId?: string;
  }>();

  return (
    <ScrollView className="w-full">
      <VStack space="md" className="flex-1 items-center">
        <Heading size="xs" className="text-start w-full">
          Risk Factors Identified
        </Heading>

        <VStack space="sm">
          {values.map((value, i) => (
            <VariableValue
              key={i}
              value={value.value}
              variable={value.variable}
            />
          ))}
          {!!followUpId && (
            <>
              <Divider className="my-2" />
              <Controller
                control={form.control}
                name="outcomeNotes"
                render={({ field, fieldState: { invalid, error } }) => (
                  <FormControl
                    isInvalid={invalid}
                    size="md"
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                  >
                    <FormControlLabel>
                      <FormControlLabelText>
                        Followup outcome notes
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Textarea
                      size="md"
                      isReadOnly={false}
                      isInvalid={false}
                      isDisabled={false}
                      className=""
                    >
                      <TextareaInput
                        placeholder="Type notes here..."
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
                  </FormControl>
                )}
              />
            </>
          )}
        </VStack>

        <HStack space="sm" className="w-full">
          <Button
            action="secondary"
            size="sm"
            className="flex-1 justify-between rounded-none"
            onPress={onPrevious}
          >
            <ButtonIcon as={ArrowLeftIcon} />
            <ButtonText>Edit/Go back</ButtonText>
          </Button>
          <Button
            action="primary"
            size="sm"
            className="flex-1 bg-teal-500 justify-between rounded-none"
            isDisabled={form.formState.isSubmitting}
            onPress={async () => {
              const isValid = await form.trigger();
              if (isValid) {
                await onNext();
              }
            }}
          >
            {form.formState.isSubmitting && (
              <ButtonSpinner color={"white"} size={"small"} />
            )}
            <ButtonText>
              {form.formState.isSubmitting
                ? "Submitting..."
                : !!followUpId
                ? "Submit & Complete"
                : "Submit"}
            </ButtonText>
          </Button>
        </HStack>
      </VStack>
    </ScrollView>
  );
};

export default ReviewAndSubmit;
