import { usePickupStations } from "@/hooks/use-addresses";
import { ChevronDown, Info, MapPin, Store } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, FieldValues } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import ActionSheetWrapper from "../actions-sheet-wrapper";
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

type FormStationPickerProps<T extends FieldValues> = Omit<
  FormTextInputProps<T>,
  "rightSection"
> & {};

const FormStationPicker = <T extends FieldValues>({
  controll,
  name,
  label,
  formControlProps,
  inputWrapperProps,
  leftSection,
  helperText,
  ...inputProps
}: FormStationPickerProps<T>) => {
  const [search, setSearch] = useState<string>("");
  const {
    stations: nearbyHealthFacilities,
    error: nearbyError,
    isLoading: nearbyIsLoading,
  } = usePickupStations({ search }, "state");
  return (
    <Controller
      control={controll}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <ActionSheetWrapper
          loading={nearbyIsLoading}
          renderTrigger={({ onPress }) => (
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
          )}
          data={nearbyHealthFacilities}
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
                    as={Store}
                    className="aspect-1 rounded-sm color-background-200"
                    size={60 as any}
                  />
                  <VStack space="md" className="flex-1">
                    <HStack className="items-center justify-between" space="sm">
                      <Heading size="xs">{item.name}</Heading>
                      <Text
                        size="2xs"
                        className="bg-teal-100 px-2 py-1 rounded-full text-teal-500 absolute right-2 top-1"
                      >
                        {item.code}
                      </Text>
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
                    <HStack className="items-center" space="sm">
                      <Icon
                        as={Info}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text size="xs">
                        {" "}
                        {[item.phoneNumber, item.email]
                          .filter(Boolean)
                          .join(" | ")}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
            </TouchableOpacity>
          )}
          renderEmptyState={() => {
            if (error || nearbyError) {
              console.log(error, nearbyError);

              return (
                <ErrorState error={(error as any) || (nearbyError as any)} />
              );
            }
            return <EmptyState message="No pickup stations found" />;
          }}
          searchable
          searchText={search}
          onSearchTextChange={setSearch}
        />
      )}
    />
  );
};

export default FormStationPicker;
