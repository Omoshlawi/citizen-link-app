import DateTimePickerInput from "@/components/date-time-picker";
import { ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
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
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { completeReferralSchema } from "@/constants/schemas";
import { useReferralApi } from "@/hooks/useReferrals";
import { handleApiErrors } from "@/lib/api";
import { getReferralResultDisplay } from "@/lib/helpers";
import { CompleteReferralFormData } from "@/types/screening";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar } from "lucide-react-native";
import React, { useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView } from "react-native";

const CompleteFollowUpScreen = () => {
  const { id: followUpId, referralId } = useLocalSearchParams<{
    id: string;
    referralId: string;
  }>();
  const toast = useToast();
  const { completeReferral } = useReferralApi();
  const form = useForm({
    resolver: zodResolver(completeReferralSchema),
    defaultValues: {
      followUpId,
      visitedDate: dayjs().toDate(),
    },
  });

  const results = useMemo<
    { label: string; value: CompleteReferralFormData["testResult"] }[]
  >(
    () => [
      {
        label: getReferralResultDisplay("POSITIVE"),
        value: "POSITIVE",
      },
      {
        label: getReferralResultDisplay("NEGATIVE"),
        value: "NEGATIVE",
      },
    ],
    []
  );

  const onSubmit: SubmitHandler<CompleteReferralFormData> = async (data) => {
    try {
      await completeReferral(referralId, data);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Success"
              description="Referral successfully completed"
              action="success"
            />
          );
        },
      });
      router.back();
    } catch (error) {
      const errors = handleApiErrors(error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description={errors?.detail}
              action="error"
            />
          );
        },
      });
    }
  };

  return (
    <ScreenLayout title="Complete Follow up">
      <ScrollView>
        <FormControl className="p-4 w-full bg-background-50">
          <VStack space="lg">
            <Controller
              control={form.control}
              name="visitedDate"
              render={({ field, fieldState: { invalid, error } }) => (
                <DateTimePickerInput
                  date={field.value as Date | undefined}
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
                        <FormControlLabelText>
                          Client Date of Visited
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input className="my-1" size="md">
                        <InputField
                          placeholder="Select date"
                          value={formattedDate}
                        />
                        <InputSlot
                          className="absolute inset-0"
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
                    </FormControl>
                  )}
                />
              )}
            />
            <Controller
              control={form.control}
              name="testResult"
              render={({ field, fieldState: { invalid, error } }) => {
                const selectedPriority = results.find(
                  (c) => c.value === field.value
                );
                return (
                  <FormControl
                    isInvalid={invalid}
                    size="md"
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                    className="w-full"
                  >
                    <FormControlLabel>
                      <FormControlLabelText>Test results</FormControlLabelText>
                    </FormControlLabel>
                    <Select
                      className="w-full"
                      selectedValue={field.value}
                      onValueChange={(value) =>
                        field.onChange(
                          value as CompleteReferralFormData["testResult"]
                        )
                      }
                    >
                      <SelectTrigger variant="outline" size="md">
                        <SelectInput
                          placeholder="Select option"
                          className="flex-1"
                          value={selectedPriority?.label}
                        />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {results.map((maritalStatus, i) => (
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
                );
              }}
            />
            <Controller
              control={form.control}
              name="finalDiagnosis"
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
                    <FormControlLabelText>Final Diagnosis</FormControlLabelText>
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
                  className="w-full"
                >
                  <FormControlLabel>
                    <FormControlLabelText>Outcome Notes</FormControlLabelText>
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
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="w-full bg-teal-500 justify-between rounded-none"
            >
              <ButtonText size="lg" className="text-background-100">
                Complete
              </ButtonText>
              <ButtonIcon as={ArrowRightIcon} />
            </Button>
          </VStack>
        </FormControl>
      </ScrollView>
    </ScreenLayout>
  );
};

export default CompleteFollowUpScreen;
