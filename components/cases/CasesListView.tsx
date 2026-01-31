import { useDocumentCases } from "@/hooks/use-document-cases";
import { authClient } from "@/lib/auth-client";
import { BASE_URL } from "@/lib/constants";
import { getAddressDisplay } from "@/lib/helpers";
import { Briefcase, FileUser, IdCard, MapPin } from "lucide-react-native";
import React from "react";
import { FlatList } from "react-native";
import Pagination from "../Pagination";
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

const CasesListView = () => {
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
        ListEmptyComponent={<EmptyState message="No facilities found" />}
        ItemSeparatorComponent={() => <Box className="h-2" />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const url = item.document?.images?.[0]?.url;
          console.log(`${BASE_URL}/api/files/stream?fileName=${url}`);

          return (
            <Card
              size="md"
              variant="elevated"
              className="dark:bg-background-btn"
            >
              <HStack className="items-center" space="sm">
                {url ? (
                  <Image
                    source={{
                      uri: `${BASE_URL}/api/files/stream?fileName=${url}`,
                      headers: {
                        Authorization: `Bearer ${userSession?.session.token}`,
                      },
                    }}
                    alt="Logo"
                    size="lg"
                    className="aspect-1 rounded-sm"
                    resizeMode="cover"
                  />
                ) : (
                  <Icon
                    as={FileUser}
                    className={`aspect-1 rounded-sm color-background-200`}
                    size={60 as any}
                  />
                )}
                <VStack space="md" className="flex-1">
                  <HStack className="items-center justify-between" space="sm">
                    <Heading size="xs">{item.document?.ownerName}</Heading>
                    <Text
                      size="2xs"
                      className="bg-teal-100 dark:bg-teal-600 px-2 py-1 rounded-full text-teal-500 dark:text-white absolute right-2 top-1"
                    >
                      {item.document?.type.name}
                    </Text>
                  </HStack>

                  <HStack className="items-center" space="sm">
                    <Icon
                      as={IdCard}
                      size="sm"
                      className="text-typography-500"
                    />
                    <Text size="xs">{`${item.document?.type.name} number: ${
                      item.document?.documentNumber ?? "N/A"
                    }`}</Text>
                  </HStack>
                  <HStack className="items-center" space="sm">
                    <Icon
                      as={Briefcase}
                      size="sm"
                      className="text-typography-500"
                    />
                    <Text size="xs">
                      Type:{" "}
                      {item.lostDocumentCase
                        ? "Lost document"
                        : "Found document"}
                    </Text>
                  </HStack>
                  <HStack className="items-center" space="sm">
                    <Icon
                      as={MapPin}
                      size="sm"
                      className="text-typography-500"
                    />
                    <Text size="xs">{getAddressDisplay(item.address)}</Text>
                  </HStack>
                </VStack>
              </HStack>
            </Card>
          );
        }}
      />
      <Pagination {...pagination} />
    </VStack>
  );
};

export default CasesListView;
