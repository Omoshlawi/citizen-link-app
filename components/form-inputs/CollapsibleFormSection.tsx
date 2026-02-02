import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, { FC, PropsWithChildren, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type CollapsibleFormSectionProps = PropsWithChildren<{
  title?: string;
  actions?: React.ReactNode;
  defaultCollapsed?: boolean;
}>;
const CollapsibleFormSection: FC<CollapsibleFormSectionProps> = ({
  title,
  children,
  actions,
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <Card variant="elevated" className="dark:bg-background-btn">
      <VStack>
        <HStack className="justify-between mb-4">
          <TouchableOpacity
            onPress={() => setCollapsed((state) => !state)}
            className="flex flex-row gap-2"
          >
            <Icon as={collapsed ? ChevronDown : ChevronUp} />
            <Text>{title}</Text>
          </TouchableOpacity>
          {actions}
        </HStack>
        {!collapsed && children}
      </VStack>
    </Card>
  );
};

export default CollapsibleFormSection;
