import { Bot, User } from 'lucide-react-native'
import React, { FC } from 'react'
import { Box } from '../ui/box'
import { HStack } from '../ui/hstack'
import { Icon } from '../ui/icon'
import { Text } from '../ui/text'

type ChatBubbleProps = {
    message: string,
    user: "me" | "bot"
}

const ChatBubble: FC<ChatBubbleProps> = ({ message, user }) => {
    return (
        <HStack space="md" className={user === "bot" ? "flex-row" : "flex-row-reverse"}>
            <Box
                className={`p-2 rounded-full ${user === "bot" ? "bg-teal-500" : "bg-gray-600"}`}
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
            <Text
                className={`${user === "bot" ? "text-typography-700" : "text-white"} ${user === "bot" ? "bg-background-50" : "bg-teal-500"} p-2 flex-1`}
                size="sm"
            >
                {message}
            </Text>
        </HStack>
    )
}

export default ChatBubble