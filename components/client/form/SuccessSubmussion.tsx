import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Client } from "@/types/client";
import { router } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import React from "react";

type SuccessSubmussionProps = {
  client: Client;
};

const SuccessSubmussion = ({ client }: SuccessSubmussionProps) => {
  return (
    <VStack space="md" className="flex-1 items-center">
      <Icon
        as={CheckCircle}
        size="sm"
        className="text-teal-500 rounded-full p-6 bg-teal-100"
      />
      <Heading size="sm" className="text-typography-500">
        Client Successfully Registered
      </Heading>
      <Text size="sm" className="text-typography-500">
        {client.firstName} {client.lastName} has been added to your client list
      </Text>

      <VStack
        space="sm"
        className="w-full bg-background-100 p-4 items-center justify-center "
      >
        <Text size="sm" className="text-typography-500">
          Client ID:
        </Text>
        <Heading size="sm" className="text-typography-500">
          {client.id}
        </Heading>
      </VStack>
      <Button
        action="primary"
        size="sm"
        className="w-full bg-teal-500 rounded-none"
        onPress={() =>
          router.push({
            pathname: "/screen-client",
            params: {
              client: client.id,
              search: client.nationalId,
            },
          })
        }
      >
        <ButtonText>Start Screening Assessment</ButtonText>
      </Button>
      <HStack space="sm" className="w-full">
        <Button
          action="secondary"
          size="sm"
          className="flex-1  rounded-none"
          onPress={() => router.push("/(tabs)/clients")}
        >
          <ButtonText>View All Clients</ButtonText>
        </Button>
        <Button
          action="secondary"
          size="sm"
          className="flex-1 rounded-none"
          onPress={() => router.push("/add-client")}
        >
          <ButtonText>Add Another Client</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default SuccessSubmussion;
