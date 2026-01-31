import { Icon } from "@/components/ui/icon";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import Color from "color";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { FileXIcon, ImageUp, Plus } from "lucide-react-native";
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
  const handleReportLostDocument = () => {
    handleClose();
    router.push("/document-case/add-found");
  };

  const handleReportFoundDocument = () => {
    handleClose();
    router.push("/document-case/add-found");
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
              onPress={handleReportLostDocument}
              className="flex-1 items-center p-4 rounded-lg"
              activeOpacity={0.5}
              style={{
                backgroundColor: Color("#ef4444").alpha(0.1).toString(),
              }}
            >
              <VStack space="sm" className="items-center">
                <Icon as={FileXIcon} size="xl" className="text-red-500" />
                <Heading size="md" className="text-red-500">
                  Lost Case
                </Heading>
                <Text size="sm" className="text-typography-500">
                  Report Lost Document
                </Text>
              </VStack>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReportFoundDocument}
              className="flex-1 items-center p-4 rounded-lg"
              activeOpacity={0.5}
              style={{
                backgroundColor: Color("#14b8a6").alpha(0.1).toString(),
              }}
            >
              <VStack space="sm" className="items-center">
                <Icon as={ImageUp} size="xl" className="text-teal-500" />
                <Heading size="md" className="text-teal-500">
                  Found Case
                </Heading>
                <Text size="sm" className="text-typography-500">
                  Report Found Document
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
