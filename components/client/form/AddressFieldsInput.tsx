import ActionSheetWrapper from "@/components/actions-sheet-wrapper";
import { EmptyState, ErrorState } from "@/components/state-full-widgets";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAddressHierarchy } from "@/hooks/useAddressHierarchy";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TouchableOpacity } from "react-native";

type AddressFieldsInputProps<T extends FieldValues> = {
  level: 1 | 2 | 3;
  parentName?: string;
  label: string;
  control: Control<T>;
  name: Path<T>;
  onChange?: (value: string) => void;
};

const AddressFieldsInput = <T extends FieldValues>({
  level,
  parentName,
  label,
  control,
  name,
  onChange,
}: AddressFieldsInputProps<T>) => {
  const { isLoading, addresses } = useAddressHierarchy({ level, parentName });
  const [searchValue, onSearchChange] = useState("");
  const isDisabled = level !== 1 && !parentName;

  return (
    <Controller
      control={control}
      name={name}
      disabled={isDisabled}
      render={({ field, fieldState: { invalid, error } }) => (
        <ActionSheetWrapper
          loading={isLoading}
          renderTrigger={({ onPress }) => (
            <FormControl
              isInvalid={invalid}
              size="md"
              isReadOnly
              className="w-full"
              isDisabled={isDisabled}
            >
              <FormControlLabel>
                <FormControlLabelText>{label}</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1" size="md">
                <InputField
                  placeholder="Select option"
                  value={field.value || ""}
                  editable={false}
                  pointerEvents="none"
                />
                <InputSlot
                  className="absolute inset-0"
                  onPress={isDisabled ? undefined : onPress}
                />
                <InputSlot
                  className="px-3"
                  onPress={isDisabled ? undefined : onPress}
                >
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
            </FormControl>
          )}
          data={addresses.filter((a) => a.name.includes(searchValue))}
          renderItem={({ item, close }) => (
            <TouchableOpacity
              onPress={() => {
                field.onChange(item.name);
                onChange?.(item.name);
                close();
              }}
            >
              <Card
                size="md"
                variant="filled"
                className="rounded-none bg-background-0 p-4"
              >
                <HStack space="lg" className="items-center justify-between">
                  <Text size="md" className="text-start flex-1">
                    {item.name}
                  </Text>
                  <Icon as={ChevronRight} className="text-typography-500" />
                </HStack>
              </Card>
            </TouchableOpacity>
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
  );
};

export default AddressFieldsInput;
