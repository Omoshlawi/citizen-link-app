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
import { cancelFollowUpSchema } from "@/constants/schemas";
import { useFollowUpApi } from "@/hooks/useFollowUp";
import { handleApiErrors } from "@/lib/api";
import { getFollowUpCanceletionReasonDisplay } from "@/lib/helpers";
import { CancelFollowUpFormData } from "@/types/follow-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { FC, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const CancelFollowUpScreen: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const { cancelFollowUp } = useFollowUpApi();
  const form = useForm({
    resolver: zodResolver(cancelFollowUpSchema),
    defaultValues: {
      cancelNotes: "",
      cancelReason: "UNREACHABLE",
    },
  });

  const reasons = useMemo<
    { label: string; value: CancelFollowUpFormData["cancelReason"] }[]
  >(
    () => [
      {
        label: getFollowUpCanceletionReasonDisplay("DECEASED"),
        value: "DECEASED",
      },
      {
        label: getFollowUpCanceletionReasonDisplay("UNREACHABLE"),
        value: "UNREACHABLE",
      },
      {
        label: getFollowUpCanceletionReasonDisplay("RELOCATED"),
        value: "RELOCATED",
      },
      {
        label: getFollowUpCanceletionReasonDisplay("REFUSED_SERVICE"),
        value: "REFUSED_SERVICE",
      },
      {
        label: getFollowUpCanceletionReasonDisplay("INCORRECT_DATA"),
        value: "INCORRECT_DATA",
      },
      {
        label: getFollowUpCanceletionReasonDisplay("HOSPITALIZED_OTHER"),
        value: "HOSPITALIZED_OTHER",
      },
    ],
    []
  );

  const onSubmit: SubmitHandler<CancelFollowUpFormData> = async (data) => {
    try {
      await cancelFollowUp(id, data);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Success"
              description="Followup successfully cancelled"
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
    <ScreenLayout title="Cancel Follow up">
      <FormControl className="p-4 w-full bg-background-50">
        <VStack space="lg">
          <Controller
            control={form.control}
            name="cancelReason"
            render={({ field, fieldState: { invalid, error } }) => {
              const selectedPriority = reasons.find(
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
                      Canceletion Reason
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    className="w-full"
                    selectedValue={field.value}
                    onValueChange={(value) =>
                      field.onChange(
                        value as CancelFollowUpFormData["cancelReason"]
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
                        {reasons.map((maritalStatus, i) => (
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
            name="cancelNotes"
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
                  <FormControlLabelText>Canceletion Notes</FormControlLabelText>
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
            className="w-full bg-red-500 justify-between rounded-none"
          >
            <ButtonText size="lg" className="text-background-100">
              Cancel
            </ButtonText>
            <ButtonIcon as={ArrowRightIcon} />
          </Button>
        </VStack>
      </FormControl>
    </ScreenLayout>
  );
};

export default CancelFollowUpScreen;
