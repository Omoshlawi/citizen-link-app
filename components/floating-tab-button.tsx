import { Icon } from "@/components/ui/icon";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Plus, Stethoscope, UserPlus } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
} from "./ui/actionsheet";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

export function FloatingTabButton(props: BottomTabBarButtonProps) {
  const [pressed, setPressed] = useState(false);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  const handleStartScreening = () => {
    handleClose();
    router.push("/screen-client");
  };

  const handleAddClient = () => {
    handleClose();
    router.push("/add-client");
  };

  return (
    <>
      <View style={styles.container}>
        <PlatformPressable
          {...props}
          onPress={(e) => {
            // Prevent navigation - don't call the original onPress handler
            e.preventDefault();
            e.stopPropagation();
            if (process.env.EXPO_OS === "ios") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            // Future: Open bottom sheet here
            setShowActionsheet(true);
          }}
          onPressIn={(ev) => {
            setPressed(true);
            if (process.env.EXPO_OS === "ios") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            props.onPressIn?.(ev);
          }}
          onPressOut={(ev) => {
            setPressed(false);
            props.onPressOut?.(ev);
          }}
          style={[styles.button, pressed && styles.buttonPressed]}
        >
          <Icon as={Plus} size="xl" className="text-white" />
        </PlatformPressable>
      </View>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={() => {
          handleClose();
        }}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem>
            <Heading
              size="lg"
              className="text-typography-700 text-center w-full"
            >
              Quick Actions
            </Heading>
          </ActionsheetItem>
          <HStack space="lg" className="w-full items-center">
            <TouchableOpacity
              onPress={handleStartScreening}
              className="flex-1 items-center bg-background-50 p-4 rounded-lg"
              activeOpacity={0.5}
            >
              <VStack space="sm" className="items-center">
                <Icon
                  as={Stethoscope}
                  size="xl"
                  className="text-typography-500"
                />
                <Heading size="md">Lost Case</Heading>
                <Text size="sm" className="text-typography-500">
                  Begin new assessment
                </Text>
              </VStack>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddClient}
              className="flex-1 items-center bg-background-50 p-4 rounded-lg"
              activeOpacity={0.5}
            >
              <VStack space="sm" className="items-center">
                <Icon as={UserPlus} size="xl" className="text-typography-500" />
                <Heading size="md">Found Case</Heading>
                <Text size="sm" className="text-typography-500">
                  Register new client
                </Text>
              </VStack>
            </TouchableOpacity>
          </HStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28, // Makes it perfectly circular
    backgroundColor: "#14b8a6", // teal-500
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20, // Raise it above the baseline
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
