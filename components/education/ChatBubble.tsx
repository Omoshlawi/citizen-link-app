import { Bot, User } from "lucide-react-native";
import React, { FC } from "react";
import RenderHtml from "react-native-render-html";
import { Converter } from "showdown";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";

type ChatBubbleProps = {
  message: string;
  user: "me" | "bot";
};

const ChatBubble: FC<ChatBubbleProps> = ({ message, user }) => {
  const showDown = new Converter();
  return (
    <HStack
      space="md"
      className={user === "bot" ? "flex-row" : "flex-row-reverse"}
    >
      <Box
        className={`p-2 rounded-full ${
          user === "bot" ? "bg-teal-500" : "bg-gray-600"
        }`}
        style={{
          width: 40,
          height: 40,
          minWidth: 40,
          minHeight: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon as={user === "bot" ? Bot : User} size="xl" color="white" />
      </Box>

      <RenderHtml //contentWidth={width}
        source={{ html: showDown.makeHtml(message) }}
        baseStyle={{
          color: user === "bot" ? "#334155" : "#fff",
          backgroundColor: user === "bot" ? "#f3f4f7" : "#14B8A6",
          padding: 8,
          flex: 1,
          borderRadius: 5,
          fontSize: 12,
          lineHeight: 22,
        }}
      />
    </HStack>
  );
};

export default ChatBubble;
