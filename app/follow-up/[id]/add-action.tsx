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
import { outreachActionSchema } from "@/constants/schemas";
import { useFollowUpApi } from "@/hooks/useFollowUp";
import { handleApiErrors } from "@/lib/api";
import {
  getOutreachActionTypeDisplay,
  getOutreachOutcomeDisplay,
} from "@/lib/helpers";
import { OutreachAction, OutreachActionFormData } from "@/types/follow-up";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar } from "lucide-react-native";
import React, { useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView } from "react-native";

const AddAction = () => {
  const toast = useToast();
  const { createFollowUpOutreachAction } = useFollowUpApi();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const form = useForm({
    resolver: zodResolver(outreachActionSchema),
    defaultValues: {
      actionDate: dayjs().toDate(),
      actionType: "HOME_VISIT",
      barriers: "",
    },
  });

  const actionTypes = useMemo<
    { label: string; value: OutreachAction["actionType"] }[]
  >(
    () => [
      {
        label: getOutreachActionTypeDisplay("FACILITY_VERIFICATION"),
        value: "FACILITY_VERIFICATION",
      },
      {
        label: getOutreachActionTypeDisplay("HOME_VISIT"),
        value: "HOME_VISIT",
      },
      {
        label: getOutreachActionTypeDisplay("PHONE_CALL"),
        value: "PHONE_CALL",
      },
      { label: getOutreachActionTypeDisplay("SMS_SENT"), value: "SMS_SENT" },
    ],
    []
  );

  const selectedActionType = form.watch("actionType");
  const selectedOutcome = form.watch("outcome");

  const outcomes = useMemo<
    {
      label: string;
      value: OutreachAction["outcome"];
      types: OutreachAction["actionType"][];
    }[]
  >(
    () => [
      {
        label: getOutreachOutcomeDisplay("BARRIER_IDENTIFIED"),
        value: "BARRIER_IDENTIFIED",
        types: ["HOME_VISIT", "PHONE_CALL", "SMS_SENT"],
      },
      {
        label: getOutreachOutcomeDisplay("LOST_CONTACT"),
        value: "LOST_CONTACT",
        types: ["HOME_VISIT", "PHONE_CALL", "SMS_SENT"],
      },
      {
        label: getOutreachOutcomeDisplay("PATIENT_COMMITTED"),
        value: "PATIENT_COMMITTED",
        types: ["HOME_VISIT", "PHONE_CALL", "SMS_SENT"],
      },
      {
        label: getOutreachOutcomeDisplay("PATIENT_REFUSED"),
        value: "PATIENT_REFUSED",
        types: ["HOME_VISIT", "PHONE_CALL", "SMS_SENT"],
      },
      {
        label: getOutreachOutcomeDisplay("PATIENT_UNAVAILABLE"),
        value: "PATIENT_UNAVAILABLE",
        types: ["HOME_VISIT", "PHONE_CALL", "FACILITY_VERIFICATION"],
      },
      {
        label: getOutreachOutcomeDisplay("PATIENT_VISITED_FACILITY"),
        value: "PATIENT_VISITED_FACILITY",
        types: ["FACILITY_VERIFICATION"],
      },
    ],
    []
  );

  const onSubmit: SubmitHandler<OutreachActionFormData> = async (formData) => {
    try {
      await createFollowUpOutreachAction(id, formData);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Success"
              description="Followup successfully created"
              action="success"
            />
          );
        },
      });
      router.back();
    } catch (error: any) {
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
      console.error(errors);
    }
  };
  return (
    <ScreenLayout title="Add Outreach Action">
      <ScrollView>
        <FormControl className="p-4 w-full bg-background-50">
          <VStack space="lg">
            <Controller
              control={form.control}
              name="actionDate"
              render={({ field, fieldState: { invalid, error } }) => (
                <DateTimePickerInput
                  date={field.value instanceof Date ? field.value : undefined}
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
                        <FormControlLabelText>Action Date</FormControlLabelText>
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
              name="actionType"
              render={({ field, fieldState: { invalid, error } }) => {
                const selectedPriority = actionTypes.find(
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
                      <FormControlLabelText>Action Type</FormControlLabelText>
                    </FormControlLabel>
                    <Select
                      className="w-full"
                      selectedValue={field.value}
                      onValueChange={(value) => {
                        form.resetField("outcome");
                        field.onChange(value as OutreachAction["actionType"]);
                      }}
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
                          {actionTypes.map((maritalStatus, i) => (
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

            {selectedActionType === "HOME_VISIT" && (
              <Controller
                control={form.control}
                name="location"
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
                      <FormControlLabelText>Location</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="my-1" size="md">
                      <InputField
                        placeholder="Client home address"
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
            )}

            <Controller
              control={form.control}
              name="outcome"
              render={({ field, fieldState: { invalid, error } }) => {
                const selectedCategory = outcomes.find(
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
                      <FormControlLabelText>
                        Outrech Outcome
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Select
                      className="w-full"
                      selectedValue={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as OutreachAction["outcome"])
                      }
                    >
                      <SelectTrigger variant="outline" size="md">
                        <SelectInput
                          placeholder="Select option"
                          className="flex-1"
                          value={selectedCategory?.label}
                        />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {outcomes
                            .filter((o) => o.types.includes(selectedActionType))
                            .map((category, i) => (
                              <SelectItem
                                label={category.label}
                                value={category.value}
                                key={category.value}
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

            {selectedOutcome === "BARRIER_IDENTIFIED" && (
              <Controller
                control={form.control}
                name="barriers"
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
                      <FormControlLabelText>Barriers</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea
                      size="md"
                      isReadOnly={false}
                      isInvalid={false}
                      isDisabled={false}
                      className=""
                    >
                      <TextareaInput
                        placeholder="e.g Const, transport, bad weather, e.t.c"
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
            )}

            <Controller
              control={form.control}
              name="duration"
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
                    <FormControlLabelText>Duration</FormControlLabelText>
                  </FormControlLabel>
                  <Input className="my-1" size="md">
                    <InputField
                      keyboardType="numeric"
                      placeholder="Time spent in minutes"
                      {...field}
                      value={field.value as string}
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
              name="nextPlannedDate"
              render={({ field, fieldState: { invalid, error } }) => (
                <DateTimePickerInput
                  date={field.value instanceof Date ? field.value : undefined}
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
                          Next Planned Date
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input className="my-1" size="md">
                        <InputField
                          placeholder="Select Date"
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
              name="notes"
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
                    <FormControlLabelText>Notes</FormControlLabelText>
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
                Submit Action
              </ButtonText>
              <ButtonIcon as={ArrowRightIcon} />
            </Button>
          </VStack>
        </FormControl>
      </ScrollView>
    </ScreenLayout>
  );
};

export default AddAction;
