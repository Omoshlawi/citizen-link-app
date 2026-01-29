import { Client } from "@/types/client";
import Color from "color";
import dayjs from "dayjs";
import { router } from "expo-router";
import { CalendarPlus, Edit, IdCard, Phone, Pin } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type ClientInfoProps = {
  client: Client;
};
const ClientInfo: FC<ClientInfoProps> = ({ client }) => {
  const personalInformation = useMemo(
    () => [
      {
        icon: Phone,
        label: "Phone Number",
        value: `${client?.phoneNumber}`,
        color: "red",
      },
      {
        icon: Pin,
        label: "Location",
        value: `${client?.ward} ${client.subcounty}, ${client.county}`,
        color: "blue",
      },
      {
        icon: IdCard,
        label: "ID",
        value: `${client?.nationalId}`,
        color: "green",
      },
      {
        icon: CalendarPlus,
        label: "Date of Birth",
        value: `${dayjs(client?.dateOfBirth).format("DD/MM/YYYY")}`,
        color: "purple",
      },
      {
        icon: CalendarPlus,
        label: "Age",
        value: `${dayjs().diff(dayjs(client?.dateOfBirth), "years")}`,
        color: "teal",
      },
    ],
    [client]
  );
  return (
    <Card size="sm" variant="elevated" className="p-2">
      <HStack className="justify-between items-center">
        <Heading size="xs">Client Information</Heading>
        <Button
          action="positive"
          variant="outline"
          size="xs"
          onPress={() =>
            router.push({
              pathname: "/edit-client",
              params: { id: client?.id },
            })
          }
        >
          <ButtonIcon as={Edit} size="xs" />
          <ButtonText size="xs">Edit</ButtonText>
        </Button>
      </HStack>
      <Box className="w-full flex flex-row flex-wrap gap-2">
        {personalInformation.map((item, i) => (
          <HStack
            className="flex-1 min-w-[48%] rounded-none bg-background-0 w-[48%] p-2 gap-3 items-center"
            key={i}
          >
            <Box
              className={`p-2 rounded-full`}
              style={{
                backgroundColor: Color(item.color).alpha(0.1).toString(),
              }}
            >
              <Icon as={item.icon} size="xs" color={item.color} />
            </Box>
            <VStack>
              <Text size="2xs">{item.label}</Text>
              <Text size="2xs">{item.value}</Text>
            </VStack>
          </HStack>
        ))}
      </Box>
    </Card>
  );
};

export default ClientInfo;
