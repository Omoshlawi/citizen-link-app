import { ScreenLayout } from "@/components/layout";
import { DisplayTile } from "@/components/list-tile";
import { MatchActions, MatchImagePreview } from "@/components/matches";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useMatch } from "@/hooks/use-matches";
import {
  getMatchConfidenceDisplay,
  getMatchRecommendationDisplay,
} from "@/lib/helpers";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import {
  BrainCircuit,
  Calendar,
  Fingerprint,
  Hash,
  Info,
  Percent,
} from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";

const MatchDetailScreen = () => {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { error, isLoading, match } = useMatch(matchId);
  const dateFomart = "ddd MMM DD, YYYY";
  return (
    <ScreenLayout title="Match Detail">
      <When
        asyncState={{ isLoading: isLoading, error, data: match }}
        loading={() => <Spinner />}
        error={(e) => <ErrorState error={e} />}
        success={(data) => {
          if (!data)
            return (
              <ErrorState
                message="Error fetching match"
                detail="Match not found"
              />
            );
          return (
            <ScrollView showsVerticalScrollIndicator={false}>
              <VStack>
                <Box className="border border-outline-200 rounded-2xl">
                  <MatchImagePreview match={data} useCase="detail" />
                </Box>
                <VStack space="md">
                  {/* Details section */}
                  <VStack className="pt-6" space="md">
                    <Text className="text-sm font-semibold text-typography-800">
                      Match Details
                    </Text>
                    <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
                      <VStack className="px-4" space="xs">
                        <DisplayTile
                          icon={Hash}
                          label={"Match No"}
                          value={`${data?.matchNumber}`}
                        />
                        <DisplayTile
                          icon={Calendar}
                          label={"Match Date"}
                          value={dayjs(match?.createdAt).format(dateFomart)}
                          withTopOutline
                        />
                        <DisplayTile
                          icon={Percent}
                          label={"Match Score"}
                          value={`${data?.matchScore}%`}
                          withTopOutline
                        />
                        <DisplayTile
                          icon={BrainCircuit}
                          label={"Certainity"}
                          value={getMatchConfidenceDisplay(
                            data.aiAnalysis.confidence,
                          )}
                          withTopOutline
                        />
                        <DisplayTile
                          icon={Fingerprint}
                          label={"Identity"}
                          value={getMatchRecommendationDisplay(
                            data.aiAnalysis.recommendation,
                          )}
                          withTopOutline
                        />
                      </VStack>
                    </Box>
                  </VStack>

                  {/* field analysys */}
                  <VStack className=" pt-6" space="md">
                    <Text className="text-sm font-semibold text-typography-800">
                      Field Analysis
                    </Text>
                    <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
                      <VStack className="px-4" space="xs">
                        {(data.aiAnalysis?.fieldAnalysis ?? []).map((f, i) => (
                          <DisplayTile
                            withTopOutline={i !== 0}
                            key={i}
                            icon={Info}
                            label={f.fieldName}
                            value={f.note}
                            trailing={
                              <Text
                                className="px-2 py-1 bg-teal-600 rounded-full text-white"
                                size="xs"
                              >
                                {f.confidence}%
                              </Text>
                            }
                          />
                        ))}
                      </VStack>
                    </Box>
                  </VStack>
                  {/* Actions sections */}
                  <MatchActions match={data} />
                </VStack>
              </VStack>
            </ScrollView>
          );
        }}
      />
    </ScreenLayout>
  );
};

export default MatchDetailScreen;
