import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {ListTile} from "../list-tile";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Divider } from "../ui/divider";
import { Heading } from "../ui/heading";
import { VStack } from "../ui/vstack";

const SupportSection = () => {
  const colorScheme = useColorScheme();

  return (
    <Card
      size="lg"
      variant="filled"
      className="rounded-3xl bg-background-0 p-4"
    >
      <VStack space="lg">
        <Box>
          <Heading size="md" className="mb-1">
            Support
          </Heading>
          <Divider className="my-0.5" />
          <ListTile
            description="Frequently asked questions (FAQ)"
            onPress={() => router.push("/faq")}
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            }
          />
          <ListTile
            description="Help and Support"
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            }
          />
          <ListTile
            description="Privacy Policy"
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            }
          />
          <ListTile
            description="Terms of Service"
            trailing={
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            }
          />
        </Box>
      </VStack>
    </Card>
  );
};

export default SupportSection;
