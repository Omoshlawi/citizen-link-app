import { ChatBotTabPanel } from "@/components/education";
import { LandingScreenLayout } from "@/components/layout";
import { Box } from "@/components/ui/box";
import React from "react";

const ChatBotScreen = () => {
  return (
    <LandingScreenLayout>
      <Box className="flex-1 p-4">
        <ChatBotTabPanel />
      </Box>
    </LandingScreenLayout>
  );
};

export default ChatBotScreen;
