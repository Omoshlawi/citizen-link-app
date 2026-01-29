import { ClientFilter } from "@/components/client";
import { LandingScreenLayout } from "@/components/layout";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useClients } from "@/hooks/useClients";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getRiskColor, getRiskInterpretation } from "@/lib/helpers";
import { RiskInterpretation } from "@/types/screening";
import Color from "color";
import dayjs from "dayjs";
import { router } from "expo-router";
import {
  ArrowRight,
  Calendar,
  Dot,
  Phone,
  UserPlus,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FlatList } from "react-native";

const DocumentCasesScreen = () => {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<RiskInterpretation | "">("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (debouncedSearch.trim()) {
      p.search = debouncedSearch.trim();
    }
    if (level) {
      p.risk = level;
    }
    return p;
  }, [debouncedSearch, level]);

  const { clients, error, isLoading, ...pagination } = useClients(params);
  return (
      <LandingScreenLayout>
        <Box className="flex-1 p-4">
          <VStack space="md" className="flex-1">
            <Button
              action="default"
              className="border border-dashed border-teal-500 bg-background-0"
              onPress={() => router.push("/add-client")}
            >
              <Icon as={UserPlus} size="sm" className="text-typography-500" />
              <ButtonText className="text-typography-500">
                Register New Client
              </ButtonText>
            </Button>
            <ClientFilter
              search={search}
              level={level}
              onSearchChange={setSearch}
              onLevelChange={setLevel}
              count={pagination.totalCount}
            />
            <Box className="flex-1 ">
              <When
                asyncState={{ isLoading, error, data: clients }}
                loading={() => <Text>Loading...</Text>}
                error={(e) => <ErrorState error={e} />}
                success={(d) => (
                  <Box className="flex-1">
                    <FlatList
                      data={clients}
                      keyExtractor={(item) => item.id.toString()}
                      ItemSeparatorComponent={() => <Box className="h-2" />}
                      ListEmptyComponent={() => (
                        <EmptyState message="No clients found" />
                      )}
                      renderItem={({ item }) => {
                        const age = dayjs().diff(
                          dayjs(item.dateOfBirth),
                          "years"
                        );
                        return (
                          <Card size="md" variant="elevated">
                            <VStack space="md">
                              <HStack className="justify-between items-center">
                                <Heading size="sm">
                                  {item.firstName} {item.lastName}
                                </Heading>
                                {item.screenings?.[0]?.scoringResult
                                  ?.interpretation && (
                                  <Text
                                    size="xs"
                                    className="px-2 py-1 rounded-full"
                                    style={{
                                      backgroundColor: Color(
                                        getRiskColor(
                                          item.screenings?.[0]?.scoringResult
                                            ?.interpretation
                                        )
                                      )
                                        .alpha(0.1)
                                        .toString(),
                                      color: getRiskColor(
                                        item.screenings?.[0]?.scoringResult
                                          ?.interpretation
                                      ),
                                    }}
                                  >
                                    {getRiskInterpretation(
                                      item.screenings?.[0]?.scoringResult
                                        ?.interpretation
                                    )}
                                  </Text>
                                )}
                              </HStack>
                              <HStack className="items-center" space="lg">
                                <Text size="sm" className="text-typography-500">
                                  Age: {age}
                                </Text>
                                <Icon
                                  as={Dot}
                                  size="sm"
                                  className="text-typography-500"
                                />
                                <Text size="sm" className="text-typography-500">
                                  Id: {item.nationalId}
                                </Text>
                              </HStack>
                              <HStack className="items-center" space="lg">
                                <Icon
                                  as={Phone}
                                  size="xs"
                                  className="text-typography-500"
                                />
                                <Text size="sm" className="text-typography-500">
                                  {item.phoneNumber}
                                </Text>
                              </HStack>
                              <HStack className="justify-between">
                                <HStack className="items-center" space="lg">
                                  <Icon
                                    as={Calendar}
                                    size="xs"
                                    className="text-typography-500"
                                  />
                                  <Text
                                    size="sm"
                                    className="text-typography-500"
                                  >
                                    Next follow-up:{" "}
                                    {dayjs().format("DD/MM/YYYY")}
                                  </Text>
                                </HStack>
                                <Button
                                  action="positive"
                                  size="sm"
                                  className="bg-teal-500"
                                  onPress={() =>
                                    router.push({
                                      pathname: "/client-detail",
                                      params: { id: item.id },
                                    })
                                  }
                                >
                                  <ButtonText>View</ButtonText>
                                  <ButtonIcon as={ArrowRight} size="sm" />
                                </Button>
                              </HStack>
                            </VStack>
                          </Card>
                        );
                      }}
                    />
                    <Pagination {...pagination} isLoading={isLoading} />
                  </Box>
                )}
              />
            </Box>
          </VStack>
        </Box>
      </LandingScreenLayout>
  );
};

export default DocumentCasesScreen;
