import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { router } from "expo-router";
import { ChevronRight, Clipboard } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { TablerIcon } from "../common";
import { TablerIconName } from "../common/TablerIcon";
import { ErrorState, When } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Center } from "../ui/center";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

import { useDocumentTypes } from "@/hooks/use-document-types";

dayjs.extend(relativeTime);

/**
 * IDENTITY
ACADEMIC
PROFESSIONAL
VEHICLE
FINANCIAL
MEDICAL
LEGAL
OTHER
 */

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  IDENTITY: { bg: "bg-teal-50", text: "text-teal-700" },
  EDUCATION: { bg: "bg-blue-50", text: "text-blue-700" },
  FINANCIAL: { bg: "bg-amber-50", text: "text-amber-700" },
  MEDICAL: { bg: "bg-rose-50", text: "text-rose-700" },
  LEGAL: { bg: "bg-violet-50", text: "text-violet-700" },
  DEFAULT: { bg: "bg-gray-100", text: "text-gray-600" },
};

export const ICON_ACCENT: string[] = [
  "text-teal-600",
  "text-blue-600",
  "text-amber-600",
  "text-rose-600",
];

export const categoryColors = (category: string) =>
  CATEGORY_COLORS[category] ?? CATEGORY_COLORS.DEFAULT;

const SupportedDocuments = () => {
  const { documentTypes, error, isLoading } = useDocumentTypes({ limit: "4" });

  return (
    <Box className="mt-6">
      {/* Header */}
      <HStack className="justify-between items-center mb-4">
        <VStack space="xs">
          <Heading size="sm" className="text-typography-900 font-semibold">
            Supported Documents
          </Heading>
          <Text size="xs" className="text-typography-400">
            Documents we can help you recover
          </Text>
        </VStack>
        <Button
          variant="link"
          size="sm"
          onPress={() => router.push("/document-types")}
        >
          <ButtonText className="text-teal-600 font-medium">
            View All
          </ButtonText>
          <ButtonIcon
            as={ChevronRight}
            className="text-teal-600 font-medium"
            size="xs"
          />
        </Button>
      </HStack>

      <When
        asyncState={{ isLoading, error, data: documentTypes }}
        loading={() => (
          <Center className="py-8">
            <Spinner color="#0d9488" />
          </Center>
        )}
        error={(e) => <ErrorState error={e} />}
        success={(documentTypes) => {
          if (!documentTypes?.length)
            return (
              <Card className="bg-background-0 rounded-2xl py-10">
                <Center>
                  <Box className="bg-gray-100 rounded-full p-4 mb-3">
                    <Icon as={Clipboard} size="xl" className="text-gray-400" />
                  </Box>
                  <Text className="text-typography-500 font-medium" size="sm">
                    No document types available
                  </Text>
                  <Text className="text-typography-300 mt-1" size="xs">
                    Check back later
                  </Text>
                </Center>
              </Card>
            );

          return (
            <Box className="flex-row flex-wrap gap-3">
              {documentTypes.map((docType, index) => {
                const iconName = (docType.icon[0].toUpperCase() +
                  docType.icon.slice(1)) as TablerIconName;
                const accent = ICON_ACCENT[index % ICON_ACCENT.length];
                const cat = categoryColors(docType.category);

                return (
                  <Pressable
                    key={docType.id}
                    onPress={() => router.push(`/activities`)}
                    className="active:opacity-70"
                    style={{ width: "48%" }}
                    disabled
                  >
                    <Card className="bg-background-0 dark:bg-background-btn rounded-3xl p-4 flex-1 border border-outline-50">
                      <VStack space="sm">
                        {/* Icon pill */}
                        <Box
                          className={`self-start rounded-xl p-2.5 ${cat.bg}`}
                        >
                          <TablerIcon
                            name={iconName}
                            size={22}
                            className={accent}
                            color="#000"
                          />
                        </Box>

                        {/* Name */}
                        <Text
                          size="sm"
                          className="text-typography-800 font-semibold leading-tight"
                          numberOfLines={2}
                        >
                          {docType.name}
                        </Text>

                        {/* Category badge */}
                        <Box
                          className={`self-start rounded-full px-2 py-0.5 ${cat.bg}`}
                        >
                          <Text size="xs" className={`${cat.text} font-medium`}>
                            {docType.category.charAt(0) +
                              docType.category.slice(1).toLowerCase()}
                          </Text>
                        </Box>

                        {/* Divider */}
                        <Box className="h-px bg-outline-50 my-1" />

                        {/* Fee row */}
                        <HStack className="justify-between items-center">
                          <Text size="xs" className="text-typography-400">
                            Service fee
                          </Text>
                          <Text
                            size="xs"
                            className="text-teal-600 font-semibold"
                          >
                            {docType.currency} {docType.serviceFee}
                          </Text>
                        </HStack>

                        {/* Points */}
                        <HStack className="items-center" space="xs">
                          <Box className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <Text size="xs" className="text-typography-400">
                            Earn{" "}
                            <Text
                              size="xs"
                              className="text-amber-600 font-semibold"
                            >
                              {docType.loyaltyPoints} pts
                            </Text>
                          </Text>
                        </HStack>
                      </VStack>
                    </Card>
                  </Pressable>
                );
              })}
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default SupportedDocuments;
