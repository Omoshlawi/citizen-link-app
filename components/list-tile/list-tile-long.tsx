import React, { FC } from "react";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { DisplayTileProps } from "./detail-row";

type Props = Pick<DisplayTileProps, "icon" | "label"> & {
  value1: string;
  value2?: string;
  value3: string;
};
const DisplayTile3: FC<Props> = ({
  icon: IconComponent,
  label,
  value1,
  value2,
  value3,
}) => {
  return (
    <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
      <HStack
        space="sm"
        className="px-4 py-3 border-b border-outline-100 items-center"
      >
        <Box className="w-9 h-9 rounded-lg bg-primary-50 items-center justify-center">
          <Icon as={IconComponent} size="sm" className="text-white" />
        </Box>
        <VStack className="flex-1 min-w-0">
          <Text className="text-xs text-typography-500 uppercase tracking-wide">
            {label}
          </Text>
          <Text className="text-typography-900 font-medium" numberOfLines={2}>
            {value1}
          </Text>
        </VStack>
      </HStack>
      <VStack space="xs" className="px-4 py-3">
        <Text className="text-typography-900">{value2}</Text>

        <Text className="text-typography-600 text-sm">{value3}</Text>
      </VStack>
    </Box>
  );
};

export default DisplayTile3;
