import { Pagination, Search } from "@/components/common";
import { ScreenLayout } from "@/components/layout";
import { DisplayTile3 } from "@/components/list-tile";
import { EmptyState, ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useAddresses } from "@/hooks/use-addresses";
import { router } from "expo-router";
import { MapPin, Plus } from "lucide-react-native";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";

const SaveAddressesScreen = () => {
  const { addresses, isLoading, error, mutate, onFilterChange, ...pagination } =
    useAddresses();
  return (
    <ScreenLayout title="Saved Addresses">
      <VStack className="flex flex-1" space="sm">
        <Search
          onSearchChange={(search) => onFilterChange((f) => ({ ...f, search }))}
        />
        <When
          asyncState={{ isLoading, error, data: addresses }}
          loading={() => <Spinner />}
          error={(e) => <ErrorState error={e} />}
          success={(data) => {
            if (!data) return <></>;
            return (
              <VStack space="sm" className="flex-1">
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={
                    <EmptyState message="No no saved address" />
                  }
                  ItemSeparatorComponent={() => <Box className="h-2" />}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item: address }) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/settings/addresses/add-or-update",
                            params: { addressId: address.id },
                          })
                        }
                      >
                        <Box className="">
                          <DisplayTile3
                            icon={MapPin}
                            value1={address.label as string}
                            label="Location"
                            value2={`${address.address1} ${
                              address.address2 ? ", " + address.address2 : ""
                            }`}
                            value3={`${address.landmark}\n${[
                              address.level4,
                              address.level3,
                              address.level2,
                              address.level1,
                            ]
                              .filter(Boolean)
                              .join(", ")} ${
                              address.country ? ` · ${address.country}` : ""
                            }`}
                          />
                        </Box>
                      </TouchableOpacity>
                    );
                  }}
                />
                <Pagination {...pagination} />
              </VStack>
            );
          }}
        />
        <Button
          className="bg-background-btn rounded-full"
          onPress={() => router.push("/settings/addresses/add-or-update")}
        >
          <ButtonIcon as={Plus} className="text-white" />
          <ButtonText className="text-white">Add address</ButtonText>
        </Button>
      </VStack>
    </ScreenLayout>
  );
};

export default SaveAddressesScreen;
