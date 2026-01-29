import { cn } from "@gluestack-ui/utils/nativewind-utils";
import React, { FC } from "react";
import { TouchableOpacity } from "react-native";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

type ListTileProps = {
  leading?: React.ReactNode;
  title?: string;
  description?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  className?: string;
};
const ListTile: FC<ListTileProps> = ({
  leading,
  title,
  description,
  trailing,
  onPress,
  className = "",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-between w-full gap-4 p-2",
        className
      )}
      disabled={typeof onPress !== "function"}
      activeOpacity={0.6}
    >
      {leading && leading}
      <VStack space="xs" className="flex-1">
        {title && <Heading size="xs">{title}</Heading>}
        {description && (
          <Text size="sm" className="text-wrap text-typography-500">
            {description}
          </Text>
        )}
      </VStack>
      {trailing && trailing}
    </TouchableOpacity>
  );
};

export default ListTile;
