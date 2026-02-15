import { usePickupStations } from "@/hooks/use-addresses";
import { useLocalSearchParams } from "expo-router";
import { Contact, Info, MapPin, Store } from "lucide-react-native";
import React from "react";
import { FlatList } from "react-native";
import { Pagination } from "../common";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type StationsListViewProps = {};

const StationsListView = ({}: StationsListViewProps) => {
  const params = useLocalSearchParams();
  const { stations, error, isLoading, ...pagination } = usePickupStations(
    params,
    "router",
  );

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <VStack space="md" className="flex-1">
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState message="No facilities found" />}
        ItemSeparatorComponent={() => <Box className="h-2" />}
        renderItem={({ item }) => (
          <Card size="md" variant="elevated">
            <HStack className="items-center" space="sm">
              <Icon
                as={Store}
                className="aspect-1 rounded-sm color-background-200"
                size={60 as any}
              />
              <VStack space="md" className="flex-1">
                <HStack className="items-center justify-between" space="sm">
                  <Heading size="xs">{item.name}</Heading>
                  <Text
                    size="2xs"
                    className="bg-teal-100 px-2 py-1 rounded-full text-teal-500 absolute right-2 top-1"
                  >
                    {"Open"}
                  </Text>
                </HStack>
                <HStack className="items-center" space="sm">
                  <Icon as={MapPin} size="sm" className="text-typography-500" />
                  <Text size="xs" className="overflow-ellipsis">
                    {[
                      item.level1,
                      item.level2,
                      item.level3,
                      item.level4,
                      item.level5,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                </HStack>
                <HStack className="items-center" space="sm">
                  <Icon
                    as={Contact}
                    size="sm"
                    className="text-typography-500"
                  />
                  <Text size="xs">
                    {[item.phoneNumber, item.email].filter(Boolean).join(" | ")}
                  </Text>
                </HStack>
                <HStack className="items-center" space="sm">
                  <Icon as={Info} size="sm" className="text-typography-500" />
                  <Text size="xs">{`CODE: ${item.code} `}</Text>
                </HStack>
              </VStack>
            </HStack>
          </Card>
        )}
      />
      <Pagination {...pagination} />
    </VStack>
  );
};

export default StationsListView;
