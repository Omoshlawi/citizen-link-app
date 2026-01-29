import { useHealthFacilityTypes } from "@/hooks/useHealthFacilityTypes";
import {
  ChevronDown,
  ChevronRight,
  FilterIcon,
  Search,
} from "lucide-react-native";
import React, { FC, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import ActionSheetWrapper from "../actions-sheet-wrapper";
import Pagination from "../Pagination";
import { EmptyState } from "../state-full-widgets";
import { Card } from "../ui/card";
import { Divider } from "../ui/divider";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
type FacilityFilterProps = {
  search?: string;
  onSearchChange?: (search: string) => void;
  facilityType?: string;
  onFacilityTypeChange?: (facilityType: string) => void;
  totalCount?: number;
};

const FacilityFilter: FC<FacilityFilterProps> = ({
  search,
  onSearchChange,
  facilityType,
  onFacilityTypeChange,
  totalCount = 0,
}) => {
  const [typeSearch, setTypeSearch] = useState<string>();
  const {
    facilityTypes: backendTypes,
    isLoading,
    ...pagination
  } = useHealthFacilityTypes({
    search: typeSearch as string,
  });

  const facilityTypes = useMemo(() => {
    // Add "All" option at the beginning
    const allOption = { label: "All", id: "all" };

    // Map backend types to the format needed by the select
    const typesFromBackend = backendTypes.map((type) => ({
      label: type.name,
      id: type.id,
    }));

    return [allOption, ...typesFromBackend];
  }, [backendTypes]);

  return (
    <Card size="md" variant="elevated">
      <VStack space="md">
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputSlot className="pl-3">
            <InputIcon as={Search} />
          </InputSlot>
          <InputField
            placeholder="Search facility..."
            value={search}
            onChangeText={onSearchChange}
          />
        </Input>
        <HStack space="sm" className="w-full justify-between items-center">
          <Icon as={FilterIcon} size="md" className="text-typography-500" />

          <ActionSheetWrapper
            loading={isLoading}
            renderTrigger={({ onPress }) => (
              <Input className="my-1 flex-1" size="md">
                <InputField
                  placeholder="Select option"
                  value={
                    facilityTypes.find((f) => f.id === facilityType)?.label
                  }
                  editable={false}
                  pointerEvents="none"
                />
                <InputSlot className="absolute inset-0" onPress={onPress} />
                <InputSlot className="px-3" onPress={onPress}>
                  <InputIcon as={ChevronDown} />
                </InputSlot>
              </Input>
            )}
            data={facilityTypes}
            renderItem={({ item, close }) => (
              <TouchableOpacity
                onPress={() => {
                  onFacilityTypeChange?.(item.id);
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
                      {item.label}
                    </Text>
                    <Icon as={ChevronRight} className="text-typography-500" />
                  </HStack>
                </Card>
              </TouchableOpacity>
            )}
            renderEmptyState={() => {
              return <EmptyState message="No clients found" />;
            }}
            renderPagination={() => <Pagination {...pagination} />}
            searchable
            searchText={typeSearch}
            onSearchTextChange={setTypeSearch}
          />
        </HStack>
        <Divider />
        <Text size="2xs">
          {totalCount} {totalCount === 1 ? "Facility" : "Facilities"} Found
        </Text>
      </VStack>
    </Card>
  );
};

export default FacilityFilter;
