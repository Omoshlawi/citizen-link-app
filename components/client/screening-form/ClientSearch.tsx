import ActionSheetWrapper from "@/components/actions-sheet-wrapper";
import ListTile from "@/components/list-tile";
import { EmptyState, ErrorState } from "@/components/state-full-widgets";
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
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSearchClients } from "@/hooks/useClients";
import { SCREENING_FORM_STEPS } from "@/lib/constants";
import { ScreenClientFormData } from "@/types/screening";
import dayjs from "dayjs";
import { router } from "expo-router";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  ChevronRight,
  UserCircle,
  UserPlus,
  UserSearch,
} from "lucide-react-native";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type ClientSearchProps = {
  onNext: () => void;
  searchClientAsync: ReturnType<typeof useSearchClients>;
};

const ClientSearch: FC<ClientSearchProps> = ({ onNext, searchClientAsync }) => {
  const form = useFormContext<ScreenClientFormData>();
  const [isConsentOpen, setIsConsentOpen] = React.useState(false);
  const [hasConsented, setHasConsented] = React.useState(false);
  const { isLoading, onSearchChange, searchValue, clients } = searchClientAsync;

  const handleNextPress = async () => {
    const isValid = await form.trigger(["clientId"]);
    if (!isValid) return;
    if (hasConsented) {
      onNext();
      return;
    }
    setIsConsentOpen(true);
  };

  return (
    <VStack space="md" className="flex-1 items-center">
      <Box className="bg-teal-100 rounded-full p-6 w-fit ">
        <Icon
          as={UserSearch}
          size="sm"
          className="text-teal-500 rounded-full p-6 bg-teal-100"
        />
      </Box>
      <Heading size="sm">{SCREENING_FORM_STEPS[0]}</Heading>

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
                        ? clients.find((client) => client.id === field.value)
                          ?.firstName +
                        " " +
                        clients.find((client) => client.id === field.value)
                          ?.lastName
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
                  "years",
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

      <Button
        action="default"
        className="border border-dashed border-teal-500 bg-background-0 w-full"
        onPress={() => router.push("/add-client")}
      >
        <Icon as={UserPlus} size="sm" className="text-typography-500" />
        <ButtonText className="text-typography-500">
          Register New Client
        </ButtonText>
      </Button>

      <Button
        action="primary"
        size="sm"
        className="w-full bg-teal-500 justify-between rounded-none"
        onPress={handleNextPress}
      >
        <ButtonText>Next</ButtonText>
        <ButtonIcon as={ArrowRightIcon} />
      </Button>

      <Modal
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <VStack space="xs">
              <Heading size="lg">Consent Required</Heading>
              <Text size="sm" className="text-typography-500">
                Please review and confirm before continuing.
              </Text>
            </VStack>
          </ModalHeader>
          <ModalBody>
            <Text size="md">
              By proceeding, you confirm that you have the Clients{"'"}s          informed consent to complete this screening and store the provided
              information
            </Text>

          </ModalBody>
          <ModalFooter>
            <HStack space="md" className="w-full">
              <Button
                variant="outline"
                onPress={() => setIsConsentOpen(false)}
                className="flex-1"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                action="primary"
                onPress={() => {
                  setHasConsented(true);
                  setIsConsentOpen(false);
                  onNext();
                }}
                className="flex-1"
              >
                <ButtonText>I consent</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ClientSearch;
