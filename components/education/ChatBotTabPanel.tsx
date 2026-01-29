import { useChatbot } from "@/hooks/useChatbot";
import { Bot, Recycle, Send } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Box } from "../ui/box";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { Textarea, TextareaInput } from "../ui/textarea";
import { VStack } from "../ui/vstack";
import ChatBubble from "./ChatBubble";



const ChatBotTabPanel = () => {
  const { chat, conversations, isLoading, clearConversation } = useChatbot()
  const [message, setMessage] = useState("")
  const defaultMessages = [
    "Screening procedure",
    "Training requirements",
    "Client canceling",
    "Equipment needed",
  ];

  return (
    <VStack space="md" className="flex-1">
      <HStack className="justify-between items-center">
        <Heading>Your AI Assistant</Heading>
        <Button onPress={clearConversation} size="xs" className="rounded-full bg-background-400">
          <ButtonIcon as={Recycle} />
        </Button>
      </HStack>
      <Text className="text-typography-500" size="xs">
        Ask me anything about CHP Training, Screening Procidures, or cervical
        cancer
      </Text>
      <Card>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="md">
            <HStack space="md">
              <Box
                className="p-2 rounded-full bg-teal-500"
                style={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  minHeight: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon as={Bot} size="xl" color="white" />
              </Box>
              <VStack space="sm" className="flex-1">
                <Text
                  className="text-typography-700 bg-background-50 p-2 flex-1"
                  size="sm"
                >
                  Hello, I&apos;m your AI assistant. How can I help you today?
                </Text>
                {conversations.length === 0 && <Box className="flex-row gap-2 flex-wrap w-full">
                  {defaultMessages.map((message, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => chat(message)
                      }
                    >
                      <Text
                        className="bg-teal-50 px-2 py-1 text-nowrap rounded-xs text-teal-500"
                        size="xs"
                      >
                        {message}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Box>}
              </VStack>
            </HStack>
            {conversations.map((c, i) => <ChatBubble message={c.message} user={c.user} key={i} />)}
            {isLoading && <Box className="p-2 bg-background-100 rounded-full w-12" >
              <Spinner size="small" color="grey" />
            </Box>}
            <HStack space="md" className="w-full items-end mb-6">
              <Textarea
                size="sm"
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                className="flex-1"

              >
                <TextareaInput placeholder="Type your question here here..." value={message} onChangeText={setMessage} />
              </Textarea>
              <Button
                size="sm"
                className="bg-teal-500 text-white rounded-full w-12 h-12"
                onPress={() => {
                  chat(message)
                  setMessage("")
                }}
              >
                <ButtonIcon as={Send} color="white" />
              </Button>
            </HStack>
          </VStack>
        </ScrollView>
      </Card>
    </VStack>
  );
};

export default ChatBotTabPanel;
