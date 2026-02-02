import { useColorScheme } from "@/hooks/use-color-scheme";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ListTile } from "../list-tile";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "../ui/avatar";
import { Card } from "../ui/card";
import { Divider } from "../ui/divider";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const UserSection = () => {
  const { data: userSession } = authClient.useSession();
  const colorScheme = useColorScheme();

  return (
    <Card
      size="lg"
      variant="filled"
      className="rounded-3xl p-4 dark:bg-background-btn"
    >
      <VStack space="lg">
        <HStack space="lg">
          <Avatar size="md">
            <AvatarFallbackText>
              {userSession?.user?.name
                ? getInitials(userSession?.user?.name)
                : "N/A"}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: userSession?.user?.image ?? "",
              }}
            />
            <AvatarBadge />
          </Avatar>
          <VStack space="xs">
            <Heading size="md" className="mb-1">
              {userSession?.user?.name}
            </Heading>
            <Text size="sm">{userSession?.user?.email}</Text>
          </VStack>
        </HStack>
        <Divider className="my-0.5" />

        <ListTile
          leading={
            <MaterialCommunityIcons
              name="book-account-outline"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          }
          title="Saved Addresses"
          description="View Saved Addresses"
          trailing={
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          }
        />
      </VStack>
    </Card>
  );
};

export default UserSection;
