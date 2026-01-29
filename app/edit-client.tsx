import AddressFieldsInput from "@/components/client/form/AddressFieldsInput";
import DateTimePickerInput from "@/components/date-time-picker";
import { ScreenLayout } from "@/components/layout";
import { ErrorState, When } from "@/components/state-full-widgets";
import Toaster from "@/components/toaster";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
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
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { clientSchema } from "@/constants/schemas";
import { useClient, useClientApi } from "@/hooks/useClients";
import { Client, ClientFormData } from "@/types/client";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircleIcon,
  Calendar,
  ChevronDownIcon,
  Edit,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView } from "react-native";

const EditClient = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, isLoading, error } = useClient(id);
  return (
    <ScreenLayout title="Edit Client">
      <When
        asyncState={{ isLoading, error, data: client }}
        error={(e) => <ErrorState error={e} />}
        loading={() => <Spinner color="primary" />}
        success={(client) => <Form client={client!} />}
      />
    </ScreenLayout>
  );
};

export default EditClient;

const Form = ({ client }: { client: Client }) => {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: client?.firstName,
      lastName: client?.lastName,
      dateOfBirth: client?.dateOfBirth
        ? dayjs(client?.dateOfBirth).toDate()
        : undefined,
      phoneNumber: client?.phoneNumber,
      county: client?.county,
      subcounty: client?.subcounty,
      ward: client?.ward,
      nationalId: client?.nationalId,
      maritalStatus: client?.maritalStatus,
    },
  });
  const selectedCounty = form.watch("county");
  const selectedSubcounty = form.watch("subcounty");
  const toast = useToast();
  const { updateClient } = useClientApi();
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
  const onSubmit: SubmitHandler<ClientFormData> = async (data) => {
    try {
      await updateClient(client.id, data);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Success"
              description="Client successfully updated"
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
    <VStack className="flex-1 items-center" space="md">
      <Box className="w-full items-center">
        <Box className="bg-teal-100 rounded-full p-6 w-fit ">
          <Icon
            as={Edit}
            size="sm"
            className="text-teal-500 rounded-full p-6 "
          />
        </Box>
        <Heading>
          Edit {client?.firstName} {client?.lastName} Details
        </Heading>
        <Text size="xs">Update client details for registration</Text>
      </Box>
      <Box className="flex-1 w-full">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card>
            <VStack space="xs">
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
                          <FormControlLabelText>
                            Date of Birth
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
                render={({ field, fieldState: { invalid, error } }) => {
                  const selectedMaritalStatus = maritalStatuses.find(
                    (m) => m.value === field.value
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
                          Marital Status
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Select
                        className="w-full"
                        selectedValue={field.value}
                        onValueChange={(value) =>
                          field.onChange(
                            value as ClientFormData["maritalStatus"]
                          )
                        }
                      >
                        <SelectTrigger variant="outline" size="md">
                          <SelectInput
                            placeholder="Select option"
                            className="flex-1"
                            value={selectedMaritalStatus?.label}
                          />
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
                  );
                }}
              />
              <AddressFieldsInput
                control={form.control}
                name="county"
                label="County"
                level={1}
                onChange={(val) => {
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

              <Button
                action="primary"
                size="sm"
                className="w-full bg-teal-500 justify-between rounded-none mt-4"
                onPress={form.handleSubmit(onSubmit)}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <ButtonSpinner color={"white"} size={"small"} />
                )}
                <ButtonText>
                  {form.formState.isSubmitting
                    ? "Updating..."
                    : "Update Client"}
                </ButtonText>
                <ButtonIcon as={ArrowRightIcon} />
              </Button>
            </VStack>
          </Card>
        </ScrollView>
      </Box>
    </VStack>
  );
};
