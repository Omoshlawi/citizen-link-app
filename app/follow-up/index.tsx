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
import { ArrowRightIcon } from "@/components/ui/icon";
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
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { followUpSchema } from "@/constants/schemas";
import { useFollowUpApi } from "@/hooks/useFollowUp";
import { getFollowUpCategoryDisply, getPriorityDisplay } from "@/lib/helpers";
import { FollowUpFormData } from "@/types/follow-up";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircleIcon,
  Calendar,
  ChevronDownIcon,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const FollowUpScreen = () => {
  const toast = useToast();
  const { createFollowUp } = useFollowUpApi();
  const { referralId, appointmentTime, screeningId, startDate } =
    useLocalSearchParams<{
      referralId: string;
      appointmentTime: string;
      screeningId: string;
      startDate: string;
    }>();
  const defaultDueDate = useMemo(() => {
    const time = dayjs(appointmentTime);
    return time.isValid() ? time.toDate() : undefined;
  }, [appointmentTime]);
  const defaultStartDate = useMemo(() => {
    const time = dayjs(startDate);
    return time.isValid() ? time.toDate() : undefined;
  }, [startDate]);

  const form = useForm({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      category: referralId ? "REFERRAL_ADHERENCE" : "RE_SCREENING_RECALL",
      priority: "MEDIUM",
      screeningId: screeningId,
      startDate: defaultStartDate ?? dayjs().toDate(),
      referralId,
      dueDate: defaultDueDate,
    },
  });

  const priorities = useMemo<
    { label: string; value: FollowUpFormData["priority"] }[]
  >(
    () => [
      { label: getPriorityDisplay("HIGH"), value: "HIGH" },
      { label: getPriorityDisplay("MEDIUM"), value: "MEDIUM" },
      { label: getPriorityDisplay("LOW"), value: "LOW" },
    ],
    []
  );

  const categories = useMemo<
    { label: string; value: FollowUpFormData["category"] }[]
  >(
    () => [
      {
        label: getFollowUpCategoryDisply("REFERRAL_ADHERENCE"),
        value: "REFERRAL_ADHERENCE",
      },
      {
        label: getFollowUpCategoryDisply("RE_SCREENING_RECALL"),
        value: "RE_SCREENING_RECALL",
      },
    ],
    []
  );

  const onSubmit: SubmitHandler<FollowUpFormData> = async (formData) => {
    try {
      await createFollowUp(formData);
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
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description={error?.message}
              action="error"
            />
          );
        },
      });
      console.error(error);
    }
  };
  return (
    <ScreenLayout title="Add Followup">
      <FormControl className="p-4 w-full bg-background-50">
        <VStack space="lg">
          <Controller
            control={form.control}
            name="startDate"
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
                      <FormControlLabelText>StartDate</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="my-1" size="md">
                      <InputField
                        placeholder="Start date"
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
            name="dueDate"
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
                      <FormControlLabelText>Due date</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="my-1" size="md">
                      <InputField
                        placeholder="Due date"
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
            name="priority"
            render={({ field, fieldState: { invalid, error } }) => {
              const selectedPriority = priorities.find(
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
                    <FormControlLabelText>Priority</FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    className="w-full"
                    selectedValue={field.value}
                    onValueChange={(value) =>
                      field.onChange(value as FollowUpFormData["priority"])
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
                        {priorities.map((maritalStatus, i) => (
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
            name="category"
            render={({ field, fieldState: { invalid, error } }) => {
              const selectedCategory = categories.find(
                (c) => c.value === field.value
              );
              return (
                <FormControl
                  isInvalid={invalid}
                  size="md"
                  isDisabled={!!referralId}
                  isReadOnly={false}
                  isRequired={false}
                  className="w-full"
                >
                  <FormControlLabel>
                    <FormControlLabelText>
                      FollowUp Category
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    className="w-full"
                    selectedValue={field.value}
                    onValueChange={(value) =>
                      field.onChange(value as FollowUpFormData["priority"])
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
                        {categories.map((category, i) => (
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
          <Button
            onPress={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="w-full bg-teal-500 justify-between rounded-none"
          >
            <ButtonText size="lg" className="text-background-100">
              Submit follow Up
            </ButtonText>
            <ButtonIcon as={ArrowRightIcon} />
          </Button>
        </VStack>
      </FormControl>
    </ScreenLayout>
  );
};

export default FollowUpScreen;
