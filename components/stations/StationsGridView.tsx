import { usePickupStations } from "@/hooks/use-addresses";
import { useLocalSearchParams } from "expo-router";
import { Info, Mail, MapPin, Phone, Store } from "lucide-react-native";
import React from "react";
import { Dimensions, FlatList } from "react-native";
import Pagination from "../Pagination";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 16; // Padding from parent container
const GAP = 8; // Gap between cards
const NUM_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - GAP) / NUM_COLUMNS;

type StationsGridViewProps = {};

const StationsGridView = ({}: StationsGridViewProps) => {
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
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: GAP,
        }}
        contentContainerStyle={{ paddingBottom: GAP }}
        ListEmptyComponent={<EmptyState message="No facilities found" />}
        renderItem={({ item }) => (
          <Card size="md" variant="elevated" style={{ width: CARD_WIDTH }}>
            <VStack space="sm" className="flex-1">
              <Box className="w-full h-24 rounded-sm relative">
                <Icon
                  as={Store}
                  className="w-full h-full overflow-hidden color-background-200"
                />

                <Text
                  size="2xs"
                  className="bg-teal-100 px-2 py-1 rounded-full text-teal-500 absolute top-2 right-2"
                >
                  {item.code}
                </Text>
              </Box>
              <VStack space="xs" className="flex-1">
                <Heading size="xs" className="flex-1" numberOfLines={1}>
                  {item.name}
                </Heading>
                <HStack className="items-center" space="xs">
                  <Icon as={MapPin} size="xs" className="text-typography-500" />
                  <Text size="2xs" numberOfLines={1} className="flex-1">
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
                <HStack className="items-center" space="xs">
                  <Icon as={Info} size="xs" className="text-typography-500" />
                  <Text size="2xs" numberOfLines={1} className="flex-1">
                    {`Code: ${item.code}`}
                  </Text>
                </HStack>
                <HStack className="items-center" space="xs">
                  <Icon as={Phone} size="xs" className="text-typography-500" />
                  <Text size="2xs" numberOfLines={1} className="flex-1">
                    {`Phone: ${item.phoneNumber}`}
                  </Text>
                </HStack>
                {item.email && (
                  <HStack className="items-center" space="xs">
                    <Icon as={Mail} size="xs" className="text-typography-500" />
                    <Text size="2xs" numberOfLines={1} className="flex-1">
                      {`Phone: ${item.phoneNumber}`}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Card>
        )}
      />
      <Pagination {...pagination} />
    </VStack>
  );
};

export default StationsGridView;
