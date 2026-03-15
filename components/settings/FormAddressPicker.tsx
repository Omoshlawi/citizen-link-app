import { useAddresses } from "@/hooks/use-addresses";
import { router } from "expo-router";
import { ChevronDown, MapPin, PlusIcon } from "lucide-react-native";
import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { Button } from "../button";
import { ActionSheetWrapper } from "../common";
import { FormTextInputProps } from "../form-inputs/FormTextInput";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { Card } from "../ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { AlertCircleIcon, Icon } from "../ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type FormAddressPickerProps<T extends FieldValues> = Omit<
  FormTextInputProps<T>,
  "rightSection"
> & {};

const FormAddressPicker = <T extends FieldValues>({
  controll,
  name,
  label,
  formControlProps,
  inputWrapperProps,
  leftSection,
  helperText,
  ...inputProps
}: FormAddressPickerProps<T>) => {
  const {
    addresses,
    error: addressesError,
    isLoading: isLoadingAddresses,
    filters,
    onFilterChange,
  } = useAddresses();
  return (
    <Controller
      control={controll}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <ActionSheetWrapper
          loading={isLoadingAddresses}
          renderTrigger={({ onPress }) => {
            const address = addresses.find(
              (address) => address.id === field.value,
            );
            return (
              <FormControl
                isInvalid={invalid}
                size="md"
                isDisabled={field.disabled}
                isReadOnly={true}
                isRequired={false}
                className="w-full"
                {...formControlProps}
              >
                {!!label && (
                  <FormControlLabel>
                    <FormControlLabelText>{label}</FormControlLabelText>
                  </FormControlLabel>
                )}
                <Input className="my-1" size="md" {...inputWrapperProps}>
                  {leftSection}
                  <InputField
                    placeholder="Select option"
                    {...inputProps}
                    onPress={onPress}
                    readOnly
                    value={address?.label ?? ""}
                  />
                  <InputSlot className="absolute inset-0" onPress={onPress} />
                  <InputSlot className="px-3" onPress={onPress}>
                    <InputIcon as={ChevronDown} />
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
                {helperText && !error && (
                  <FormControlHelper>
                    <FormControlHelperText>{helperText}</FormControlHelperText>
                  </FormControlHelper>
                )}
              </FormControl>
            );
          }}
          data={addresses}
          renderItem={({ item, close }) => (
            <TouchableOpacity
              onPress={() => {
                field.onChange(item.id);
                close();
              }}
            >
              <Card size="md" variant="elevated">
                <HStack className="items-center" space="sm">
                  <Icon
                    as={MapPin}
                    className="aspect-1 rounded-sm color-background-200"
                    size={60 as any}
                  />
                  <VStack space="md" className="flex-1">
                    <HStack className="items-center justify-between" space="sm">
                      <Heading size="xs">{item.label}</Heading>
                      {item.preferred && (
                        <Text
                          size="2xs"
                          className="bg-teal-100 px-2 py-1 rounded-full text-teal-500 absolute right-2 top-1"
                        >
                          {"Prefered"}
                        </Text>
                      )}
                    </HStack>
                    <HStack className="items-center" space="sm">
                      <Icon
                        as={MapPin}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text size="xs">
                        {[
                          item.level1,
                          item.level2,
                          item.level3,
                          item.level4,
                          item.level5,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
            </TouchableOpacity>
          )}
          renderEmptyState={({ close }) => {
            if (addressesError) {
              return <ErrorState error={addressesError} />;
            }
            return <EmptyState message="No addresses" />;
          }}
          searchable
          searchText={(filters as any).search}
          onSearchTextChange={(search) =>
            onFilterChange((prev) => ({ ...prev, search }))
          }
          renderFooter={({ close }) => (
            <Button
              text="Add Address"
              onPress={() => {
                close();
                router.push("/settings/addresses/add-or-update");
              }}
              prefixIcon={PlusIcon}
            />
          )}
        />
      )}
    />
  );
};

export default FormAddressPicker;
