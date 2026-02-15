import { useDocumentCases } from "@/hooks/use-document-cases";
import { authClient } from "@/lib/auth-client";
import { BASE_URL } from "@/lib/constants";
import { getAddressDisplay } from "@/lib/helpers";
import { router } from "expo-router";
import { Briefcase, FileUser, IdCard, MapPin } from "lucide-react-native";
import React from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Pagination } from "../common";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Image } from "../ui/image";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 16; // Padding from parent container
const GAP = 8; // Gap between cards
const NUM_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - GAP) / NUM_COLUMNS;

const CasesGridView = () => {
  const { cases, error, isLoading, ...pagination } = useDocumentCases();
  const { data: userSession, isPending } = authClient.useSession();

  if (isLoading || isPending) {
    return <Spinner />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  return (
    <VStack space="md" className="flex-1">
      <FlatList
        data={cases}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: GAP,
        }}
        contentContainerStyle={{ paddingBottom: GAP }}
        ListEmptyComponent={<EmptyState message="No facilities found" />}
        renderItem={({ item }) => {
          const url = item.document?.images?.[0]?.url;

          return (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/document-case/[caseId]",
                  params: { caseId: item.id },
                })
              }
            >
              <Card
                size="md"
                variant="elevated"
                style={{ width: CARD_WIDTH }}
                className="dark:bg-background-btn"
              >
                <VStack space="sm" className="flex-1">
                  <Box className="w-full h-24 rounded-sm relative">
                    {url ? (
                      <Image
                        source={{
                          uri: `${BASE_URL}/api/files/stream?fileName=${url}`,
                          headers: {
                            Authorization: `Bearer ${userSession?.session.token}`,
                          },
                        }}
                        alt="Logo"
                        className="w-full h-full overflow-hidden"
                        resizeMode="cover"
                      />
                    ) : (
                      <Icon
                        as={FileUser}
                        className="w-full h-full overflow-hidden color-background-200"
                      />
                    )}
                    <Text
                      size="2xs"
                      className="bg-teal-100 dark:bg-teal-600 px-2 py-1 rounded-full text-teal-500  dark:text-white  absolute top-2 right-2"
                    >
                      {item.document?.type.name}
                    </Text>
                  </Box>
                  <VStack space="xs" className="flex-1">
                    <Heading size="xs" className="flex-1" numberOfLines={1}>
                      {item.document?.ownerName}
                    </Heading>
                    <HStack className="items-center" space="xs">
                      <Icon
                        as={IdCard}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text size="2xs" numberOfLines={1} className="flex-1">
                        {`ID: ${item.document?.documentNumber}`}
                      </Text>
                    </HStack>
                    <HStack className="items-center" space="xs">
                      <Icon
                        as={Briefcase}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text size="2xs" numberOfLines={1} className="flex-1">
                        Type:{" "}
                        {item.lostDocumentCase
                          ? "Lost document"
                          : "Found document"}{" "}
                      </Text>
                    </HStack>
                    <HStack className="items-center" space="xs">
                      <Icon
                        as={MapPin}
                        size="xs"
                        className="text-typography-500"
                      />
                      <Text size="2xs" numberOfLines={1} className="flex-1">
                        {getAddressDisplay(item.address)}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
      <Pagination {...pagination} />
    </VStack>
  );
};

export default CasesGridView;
