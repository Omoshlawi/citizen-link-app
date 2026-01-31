import { GridIcon, ListIcon } from "lucide-react-native";
import React, { FC } from "react";
import { Button, ButtonIcon } from "../ui/button";
import { HStack } from "../ui/hstack";

export type LayoutViewTabsProps = {
  activeView?: "list" | "grid";
  onViewChange?: (tab: "list" | "grid") => void;
};

const LayoutViewTabs: FC<LayoutViewTabsProps> = ({
  activeView = "list",
  onViewChange,
}) => {
  return (
    <HStack space="xs">
      <Button
        size="xs"
        action="secondary"
        className={`${activeView === "list" ? "bg-teal-500" : "bg-teal-100"}`}
        onPress={() => onViewChange?.("list")}
        style={{ aspectRatio: 1 }}
      >
        <ButtonIcon
          as={ListIcon}
          size="md"
          className={`${
            activeView === "list" ? "text-white" : "text-teal-500"
          }`}
        />
      </Button>
      <Button
        size="xs"
        action="secondary"
        className={`${
          activeView === "grid" ? "bg-teal-500" : "bg-teal-100 text-teal-500"
        }`}
        onPress={() => onViewChange?.("grid")}
        style={{ aspectRatio: 1 }}
      >
        <ButtonIcon
          as={GridIcon}
          size="md"
          className={`${
            activeView === "grid" ? "text-white" : "text-teal-500"
          }`}
        />
      </Button>
    </HStack>
  );
};

export default LayoutViewTabs;
