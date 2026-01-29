import { SearchIcon } from "lucide-react-native";
import React, { useCallback } from "react";
import { DimensionValue, ListRenderItem } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
} from "./ui/actionsheet";
import { Input, InputField, InputIcon, InputSlot } from "./ui/input";
import { Spinner } from "./ui/spinner";

interface RenderTriggerProps<T> {
  onPress: () => void;
}

type ActionSheetWrapperProps<T> = {
  renderTrigger: (props: RenderTriggerProps<T>) => React.ReactNode;
  data: T[];
  renderItem?: (args: { item: T; close: () => void }) => React.ReactNode;
  renderPagination?: () => React.ReactNode;
  valueExtractor?: (item: T) => string;
  searchable?: boolean;
  renderEmptyState?: () => React.ReactNode;
  renderErrorState?: () => React.ReactNode;
  searchText?: string;
  onSearchTextChange?: (text: string) => void;
  loading?: boolean;
  maxHeight?: DimensionValue;
};

const ActionSheetWrapper = <T,>({
  renderTrigger,
  data,
  renderItem,
  valueExtractor,
  searchable = false,
  renderEmptyState,
  searchText,
  onSearchTextChange,
  loading = false,
  maxHeight = "80%",
  renderPagination,
}: ActionSheetWrapperProps<T>) => {
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleOpen = () => setShowActionsheet(true);
  const handleClose = useCallback(
    () => setShowActionsheet(false),
    [setShowActionsheet]
  );

  const fallbackValueExtractor = React.useCallback(
    (item: any, idx: number) => {
      if (valueExtractor) return valueExtractor(item);
      // fallback to item.id or index as string
      if (typeof item === "object" && item !== null && "id" in item) {
        return String((item as any).id);
      }
      return String(idx);
    },
    [valueExtractor]
  );

  const fallbackLabelExtractor = React.useCallback((item: any) => {
    // fallback to item.title or item.label or toString
    if ("title" in item) {
      return String((item as any).title);
    }
    if ("label" in item) {
      return String((item as any).label);
    }
    return String(item);
  }, []);

  const DefaultItem = React.useCallback(
    ({ item }: { item: T }) => (
      <ActionsheetItem onPress={handleClose}>
        <ActionsheetItemText>
          {fallbackLabelExtractor(item)}
        </ActionsheetItemText>
      </ActionsheetItem>
    ),
    [fallbackLabelExtractor, handleClose]
  );

  const _renderItem = React.useCallback(
    ({ item }: { item: T }) =>
      renderItem ? (
        renderItem({ item, close: handleClose })
      ) : (
        <DefaultItem item={item} />
      ),
    [renderItem, handleClose, DefaultItem]
  );

  const _keyExtractor = React.useCallback(
    (item: T, idx: number) => fallbackValueExtractor(item, idx),
    [fallbackValueExtractor]
  );

  return (
    <>
      {renderTrigger({ onPress: handleOpen })}
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ maxHeight }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {searchable && (
            <Input className="my-4">
              <InputSlot className="pl-3">
                <InputIcon as={SearchIcon} />
              </InputSlot>
              <InputField
                placeholder="Search..."
                value={searchText}
                onChangeText={onSearchTextChange}
              />
              {loading && (
                <InputSlot className="pr-3">
                  <Spinner />
                </InputSlot>
              )}
            </Input>
          )}
          <ActionsheetFlatList
            data={data}
            renderItem={_renderItem as ListRenderItem<unknown>}
            keyExtractor={
              _keyExtractor as (item: unknown, index: number) => string
            }
            ListEmptyComponent={renderEmptyState}
          />
          {renderPagination?.()}
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default ActionSheetWrapper;
