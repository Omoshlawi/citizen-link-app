import ActionSheetWrapper from "@/components/actions-sheet-wrapper";
import {
  ReferralFacility,
  ReferralScreening,
} from "@/components/client/referral-form";
import DateTimePickerInput from "@/components/date-time-picker";
import { ScreenLayout } from "@/components/layout";
import ListTile from "@/components/list-tile";
import { EmptyState, ErrorState } from "@/components/state-full-widgets";
import Toaster from "@/components/toaster";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { referralSchema } from "@/constants/schemas";
import { useSearchClients } from "@/hooks/useClients";
import { useSearchHealthFacility } from "@/hooks/useHealthFacilities";
import { useReferralApi } from "@/hooks/useReferrals";
import { handleApiErrors } from "@/lib/api";
import { ReferralFormData } from "@/types/screening";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  Calendar,
  ChevronRight,
  UserCircle,
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

const AddReferralScreen = () => {
  const { client, search, facility, facilitySearch, screening } =
    useLocalSearchParams<{
      client: string;
      search: string;
      facility: string;
      facilitySearch: string;
      screening: string;
    }>();
  const { clients, error, isLoading, onSearchChange, searchValue } =
    useSearchClients(search);
  const healthFacilitySearchAsync = useSearchHealthFacility(facilitySearch);
  const form = useForm({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      clientId: client ?? "",
      appointmentTime: new Date(),
      healthFacilityId: facility ?? "",
      additionalNotes: "",
      screeningId: screening ?? "",
    },
  });
  const clientId = form.watch("clientId");
  const client_ = useMemo(
    () => clients.find((client) => client.id === clientId),
    [clientId, clients]
  );
  const { referClient } = useReferralApi();
  const toast = useToast();

  const onSubmit: SubmitHandler<ReferralFormData> = async (data) => {
    try {
      const referral = await referClient(data);
      if (referral) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toaster
                uniqueToastId={id}
                variant="outline"
                title="Success"
                description="Referral created successfully"
                action="success"
              />
            );
          },
        });
      }
      router.replace({
        pathname: "/client-detail",
        params: { id: clientId },
      });
    } catch (error) {
      const errors = handleApiErrors<ReferralFormData>(error);
      if (errors.detail) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toaster
                uniqueToastId={id}
                variant="outline"
                title="Error"
                description={errors.detail}
                action="error"
              />
            );
          },
        });
      }
      Object.entries(errors ?? {}).forEach(([field, error]) => {
        form.setError(field as keyof ReferralFormData, { message: error });
      });
    }
  };

  return (
    <ScreenLayout title="Refer Client">
      <FormProvider {...form}>
        <Card size="md" variant="elevated" className="flex-1">
          <VStack space="md" className="flex-1 items-center">
            <Controller
              control={form.control}
              name="clientId"
              render={({ field, fieldState: { invalid, error } }) => (
                <ActionSheetWrapper
                  loading={isLoading}
                  renderTrigger={({ onPress }) => (
                    <FormControl
                      isInvalid={invalid}
                      size="md"
                      isReadOnly
                      className="w-full"
                    >
                      <FormControlLabel>
                        <FormControlLabelText>Client</FormControlLabelText>
                      </FormControlLabel>
                      <Input className="my-1" size="md">
                        <InputField
                          placeholder="Client"
                          {...field}
                          value={
                            field.value
                              ? clients.find(
                                  (client) => client.id === field.value
                                )?.firstName +
                                " " +
                                clients.find(
                                  (client) => client.id === field.value
                                )?.lastName
                              : ""
                          }
                          onChangeText={field.onChange}
                          onPress={onPress}
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
                  data={clients}
                  renderItem={({ item, close }) => (
                    <ListTile
                      title={`${item.firstName} ${item.lastName}`}
                      description={`Age: ${dayjs().diff(
                        dayjs(item.dateOfBirth),
                        "years"
                      )} | ID: ${item.nationalId}`}
                      leading={
                        <Icon
                          as={UserCircle}
                          size="lg"
                          className="text-typography-500"
                        />
                      }
                      trailing={
                        <Icon
                          as={ChevronRight}
                          size="lg"
                          className="text-typography-500"
                        />
                      }
                      onPress={() => {
                        form.setValue("clientId", item.id);
                        close();
                      }}
                    />
                  )}
                  renderEmptyState={() => {
                    if (error) {
                      return <ErrorState error={error as any} />;
                    }
                    return <EmptyState message="No clients found" />;
                  }}
                  searchable
                  searchText={searchValue}
                  onSearchTextChange={onSearchChange}
                />
              )}
            />
            {client_ && (
              <ReferralScreening
                client={clients.find((client) => client.id === clientId)!}
              />
            )}
            <ReferralFacility facilitySearchAsync={healthFacilitySearchAsync} />
            <Controller
              control={form.control}
              name="appointmentTime"
              render={({ field, fieldState: { invalid, error } }) => (
                <DateTimePickerInput
                  date={field.value instanceof Date ? field.value : undefined}
                  mode="datetime"
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
                          Appointment Time
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input className="my-1" size="md">
                        <InputField
                          placeholder="Date of Birth"
                          value={formattedDate}
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
              name="additionalNotes"
              render={({ field, fieldState: { invalid, error } }) => (
                <FormControl isInvalid={invalid} size="md" className="w-full">
                  <FormControlLabel>
                    <FormControlLabelText>
                      Additional Notes
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Textarea size="sm" isReadOnly={false}>
                    <TextareaInput
                      placeholder="Additional Notes"
                      {...field}
                      onChangeText={field.onChange}
                      value={field.value}
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
              action="primary"
              size="sm"
              className="w-full bg-teal-500 justify-between rounded-none"
              onPress={form.handleSubmit(onSubmit)}
            >
              <ButtonText>Submit</ButtonText>
              <ButtonIcon as={ArrowRightIcon} />
            </Button>
          </VStack>
        </Card>
      </FormProvider>
    </ScreenLayout>
  );
};

export default AddReferralScreen;
