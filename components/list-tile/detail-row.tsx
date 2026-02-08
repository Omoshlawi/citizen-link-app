import { FC } from "react";
import { Box } from "../ui/box";
import { Divider } from "../ui/divider";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export type DisplayTileProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value?: string;
  hideIfNoValue?: boolean;
  fallBackValue?: string;
  withTopOutline?: boolean;
  withBottomOutline?: boolean;
  trailing?: React.ReactNode;
};

const DisplayTile: FC<DisplayTileProps> = ({
  icon: IconComponent,
  label,
  value,
  hideIfNoValue,
  fallBackValue = "-",
  withBottomOutline = false,
  withTopOutline = false,
  trailing,
}) => {
  if ((value === undefined || value == null) && hideIfNoValue) return null;
  return (
    <>
      {withTopOutline && <Divider />}
      <HStack space="sm" className="items-center py-2.5">
        <Box className="w-9 h-9 rounded-lg bg-primary-50 items-center justify-center">
          <Icon as={IconComponent} size="sm" className="text-white" />
        </Box>
        <VStack className="flex-1 min-w-0">
          <Text className="text-xs text-typography-500 uppercase tracking-wide">
            {label}
          </Text>
          <Text className="text-typography-900 font-medium" numberOfLines={2}>
            {value ?? fallBackValue}
          </Text>
        </VStack>
        {trailing}
      </HStack>
      {withBottomOutline && <Divider />}
    </>
  );
};

export default DisplayTile;
