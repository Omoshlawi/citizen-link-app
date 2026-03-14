import TablerIcon, { TablerIconName } from "@/components/common/TablerIcon";
import { categoryColors, ICON_ACCENT } from "@/components/home";
import { ScreenLayout } from "@/components/layout";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useDocumentTypes } from "@/hooks/use-document-types";
import { router } from "expo-router";
import { Clipboard } from "lucide-react-native";
import React from "react";
import { FlatList, Pressable } from "react-native";

const DocumentTypes = () => {
  const { documentTypes, error, isLoading } = useDocumentTypes({});

  return (
    <ScreenLayout title="Supported Documents">
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
            <FlatList
              data={documentTypes}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: docType, index }) => {
                const iconName = (docType.icon[0].toUpperCase() +
                  docType.icon.slice(1)) as TablerIconName;
                const accent = ICON_ACCENT[index % ICON_ACCENT.length];
                const cat = categoryColors(docType.category);

                return (
                  <Pressable
                    onPress={() => router.push(`/activities`)}
                    className="active:opacity-70"
                    style={{ flex: 1 }}
                    disabled
                  >
                    <Card className="bg-background-0 dark:bg-background-btn rounded-3xl p-4 flex-1 border border-outline-50">
                      <VStack space="sm">
                        {/* Icon pill */}
                        <Box className={`self-start rounded-xl p-2.5 ${cat.bg}`}>
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
                        <Box className={`self-start rounded-full px-2 py-0.5 ${cat.bg}`}>
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
                          <Text size="xs" className="text-teal-600 font-semibold">
                            {docType.currency} {docType.serviceFee}
                          </Text>
                        </HStack>

                        {/* Points */}
                        <HStack className="items-center" space="xs">
                          <Box className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <Text size="xs" className="text-typography-400">
                            Earn{" "}
                            <Text size="xs" className="text-amber-600 font-semibold">
                              {docType.loyaltyPoints} pts
                            </Text>
                          </Text>
                        </HStack>
                      </VStack>
                    </Card>
                  </Pressable>
                );
              }}
            />
          );
        }}
      />
    </ScreenLayout>
  );
};

export default DocumentTypes;