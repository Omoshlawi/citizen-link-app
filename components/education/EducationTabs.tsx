import React, { FC } from "react";
import { Box } from "../ui/box";
import { Button, ButtonText } from "../ui/button";

export type EducationTabsProps = {
  activeTab?: "chatbot" | "faq" | "content";
  onTabChange?: (tab: "chatbot" | "faq" | "content") => void;
};

const EducationTabs: FC<EducationTabsProps> = ({
  activeTab = "chatbot",
  onTabChange,
}) => {
  return (
    <Box className="w-full flex-row border border-outline-200 rounded-md gap-2 p-2 bg-background-200">
      <Button
        size="xs"
        action="secondary"
        className={`w-[32%] bg-background-200 ${
          activeTab === "chatbot" ? "bg-background-0" : "bg-background-200"
        }`}
        onPress={() => onTabChange?.("chatbot")}
      >
        <ButtonText>ChatBot</ButtonText>
      </Button>
      <Button
        size="xs"
        action="secondary"
        className={`w-[32%] bg-background-200 ${
          activeTab === "faq" ? "bg-background-0" : "bg-background-200"
        }`}
        onPress={() => onTabChange?.("faq")}
      >
        <ButtonText>FAQ</ButtonText>
      </Button>
      <Button
        size="xs"
        action="secondary"
        className={`w-[32%] bg-background-200 ${
          activeTab === "content" ? "bg-background-0" : "bg-background-200"
        }`}
        onPress={() => onTabChange?.("content")}
      >
        <ButtonText>Content</ButtonText>
      </Button>
    </Box>
  );
};

export default EducationTabs;
