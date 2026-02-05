import { useComputedColorScheme } from "@/hooks/use-color-scheme";
import { Theme, useThemeStore } from "@/store/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import ActionSheetWrapper from "../actions-sheet-wrapper";
import { ListTile } from "../list-tile";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Divider } from "../ui/divider";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const AppPreferencesSection = () => {
  const colorScheme = useComputedColorScheme();
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <Card
      size="lg"
      variant="filled"
      className="rounded-3xl p-4 dark:bg-background-btn"
    >
      <VStack space="lg">
        <Box>
          <Heading size="md" className="mb-1">
            App Preferences
          </Heading>
          <Divider className="my-0.5" />
          <ActionSheetWrapper
            renderTrigger={({ onPress }) => (
              <ListTile
                onPress={onPress}
                leading={
                  <Ionicons
                    name="language-outline"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                }
                title="Language"
                description="Select your preferred language."
                trailing={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                }
              />
            )}
            data={[
              { label: "English", value: "en" },
              { label: "Spanish", value: "es" },
              { label: "French", value: "fr" },
              { label: "German", value: "de" },
              { label: "Italian", value: "it" },
            ]}
            renderItem={({ item, close }) => (
              <TouchableOpacity
                onPress={() => {
                  close();
                }}
              >
                <Card
                  size="md"
                  variant="filled"
                  className="rounded-3xl bg-background-0 p-4"
                >
                  <HStack space="lg" className="items-center justify-between">
                    <Text size="md" className="text-start flex-1">
                      {item.label}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  </HStack>
                </Card>
              </TouchableOpacity>
            )}
            valueExtractor={(item) => item.value}
          />
          <ActionSheetWrapper
            renderTrigger={({ onPress }) => (
              <ListTile
                onPress={onPress}
                leading={
                  <MaterialCommunityIcons
                    name="theme-light-dark"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                }
                title="Theme"
                description="Select your preferred theme."
                trailing={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                }
              />
            )}
            data={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
              { label: "System", value: "system" },
            ]}
            renderItem={({ item, close }) => (
              <TouchableOpacity
                onPress={() => {
                  close();
                  setTheme(item.value as Theme);
                }}
              >
                <Card
                  size="md"
                  variant="filled"
                  className="rounded-3xl bg-background-0 p-4"
                >
                  <HStack space="lg" className="items-center justify-between">
                    <MaterialCommunityIcons
                      name={
                        item.value === "light"
                          ? "weather-sunny"
                          : item.value === "dark"
                          ? "weather-night"
                          : "weather-sunny-alert"
                      }
                      size={20}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                    <Text size="md" className="text-start flex-1">
                      {item.label}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  </HStack>
                </Card>
              </TouchableOpacity>
            )}
            valueExtractor={(item) => item.value}
          />
        </Box>
      </VStack>
    </Card>
  );
};

export default AppPreferencesSection;
