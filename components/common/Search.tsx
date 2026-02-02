import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { SlidersVertical } from "lucide-react-native";
import React, { FC, useEffect, useState } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Button, ButtonIcon } from "../ui/button";
import { HStack } from "../ui/hstack";
import { SearchIcon } from "../ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type SearchProps = {
  count?: number;
  renderFiltersForm?: () => React.ReactNode;
  defaultsearch?: string;
  onSearchChange?: (search?: string) => void;
};

const Search: FC<SearchProps> = ({
  count = 0,
  renderFiltersForm,
  onSearchChange,
  defaultsearch,
}) => {
  const [search, setSearch] = useState(defaultsearch);
  const [debounced] = useDebouncedValue(search, 500);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);

  useEffect(() => {
    onSearchChange?.(debounced);
  }, [onSearchChange, debounced]);

  return (
    <VStack space="sm" className="">
      <HStack space="sm" className="w-full justify-between items-center">
        <Input
          variant="outline"
          size="lg"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
          className="flex-1 bg-white dark:bg-slate-800"
        >
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            placeholder="Search ..."
            value={search}
            onChangeText={setSearch}
          />
        </Input>
        {typeof renderFiltersForm === "function" && (
          <>
            <Button
              size="lg"
              className="rounded-xl p-3.5 bg-teal-600"
              onPress={() => setShowActionsheet(true)}
              accessibilityLabel="Open filters"
            >
              <ButtonIcon as={SlidersVertical} className="text-white " />
            </Button>
            <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
              <ActionsheetBackdrop />
              <ActionsheetContent>
                <ActionsheetDragIndicatorWrapper>
                  <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {renderFiltersForm()}
              </ActionsheetContent>
            </Actionsheet>
          </>
        )}
      </HStack>
      <Text size="2xs" className="color-typography-link">
        {count} Found Result{count !== 1 ? "s" : ""}
      </Text>
    </VStack>
  );
};

export default Search;
