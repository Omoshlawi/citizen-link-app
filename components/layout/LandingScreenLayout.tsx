import { router } from "expo-router";
import { Bell, UserCircle } from "lucide-react-native";
import React, { FC } from "react";
import { Box } from "../ui/box";
import { Button } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import SafeAreaScreen from "./SafeAreaScreen";

type LandingScreenLayoutProps = {
  children: React.ReactNode;
};
const LandingScreenLayout: FC<LandingScreenLayoutProps> = ({ children }) => {
  return (
    <SafeAreaScreen mode="padded">
      <VStack className="flex-1 h-full w-full ">
        {/* APP bar */}
        <HStack className="justify-between items-center p-4 b">
          <Text className="text-2xl font-bold ">LOGO</Text>
          <HStack space="xl" className="items-center">
            <Button
              action="default"
              onPress={() => router.push("/notifications")}
              className="p-0 m-0"
            >
              <Icon as={Bell} size={"xl"} />
            </Button>

            <Button
              action="default"
              onPress={() => router.push("/settings")}
              className="p-0 m-0"
            >
              <Icon as={UserCircle} size={"xl"} />
            </Button>
          </HStack>
        </HStack>
        <Box className="flex-1">{children}</Box>
      </VStack>
    </SafeAreaScreen>
  );
};

export default LandingScreenLayout;
