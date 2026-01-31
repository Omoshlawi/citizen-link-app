import { useDocumentCases } from "@/hooks/use-document-cases";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useRouter } from "expo-router";
import { Search, SlidersVertical } from "lucide-react-native";
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
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import CaseFilterForm from "./CaseFilterForm";

type ClientFilterProps = {};

const CasesFilter: FC<ClientFilterProps> = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  useEffect(() => {
    router.setParams({ search: debouncedSearch });
  }, [debouncedSearch, router]);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const { totalCount } = useDocumentCases();
  const handleClose = () => setShowActionsheet(false);
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
            <InputIcon as={Search} />
          </InputSlot>
          <InputField
            placeholder="Search ..."
            value={search}
            onChangeText={setSearch}
          />
        </Input>
        <Button
          size="lg"
          className="rounded-xl p-3.5 bg-teal-600"
          onPress={() => setShowActionsheet(true)}
        >
          <ButtonIcon as={SlidersVertical} className="text-white " />
        </Button>
        <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <CaseFilterForm />
          </ActionsheetContent>
        </Actionsheet>
      </HStack>
      <Text size="2xs" className="color-typography-link">
        {totalCount} Found Results{totalCount !== 1 ? "s" : ""}
      </Text>
    </VStack>
  );
};

export default CasesFilter;
