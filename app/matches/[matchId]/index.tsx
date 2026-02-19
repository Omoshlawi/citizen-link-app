import { Button } from "@/components/button";
import { SegmentedControl } from "@/components/common";
import { ScreenLayout } from "@/components/layout";
import { DisplayTile } from "@/components/list-tile";
import { MatchClaims, MatchImagePreview } from "@/components/matches";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useClaims } from "@/hooks/use-claims";
import { useMatch } from "@/hooks/use-matches";
import { authClient } from "@/lib/auth-client";
import {
  getMatchConfidenceDisplay,
  getMatchRecommendationDisplay,
  getMatchStatusDisplay,
} from "@/lib/helpers";
import { ClaimStatus } from "@/types/claim";
import { MatchStatus } from "@/types/matches";
import cn from "classnames";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowRight,
  BrainCircuit,
  Calendar,
  Fingerprint,
  Hash,
  Info,
  Percent,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";

const MatchDetailScreen = () => {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const {
    data: userSession,
    isPending,
    error: authError,
  } = authClient.useSession();
  const { error, isLoading, match } = useMatch(matchId);
  const {
    totalCount,
    isLoading: isLoadingClaims,
    error: claimserror,
    claims,
  } = useClaims({
    matchId: matchId,
    limit: 1,
    orderBy: "-createdAt",
  });

  const isOwner = useMemo(
    () => match?.foundDocumentCase.case?.userId !== userSession?.user.id,
    [match?.foundDocumentCase.case?.userId, userSession?.user.id],
  );
  const canClaim = useMemo(() => {
    if (!isOwner) return false; // None owners cant view claims
    if (totalCount === 0) return true; // Mean no claim is raised yet
    const latestClaimStatus = claims?.[0]?.status;
    return latestClaimStatus === ClaimStatus.CANCELLED;
  }, [claims, isOwner, totalCount]);
  const canRejectMatch = useMemo(() => {
    if (!isOwner) return false; // None owners cant view claims
    if (totalCount === 0) return true; // Mean no claim is raised yet
    const latestClaimStatus = claims?.[0]?.status;
    return latestClaimStatus === ClaimStatus.PENDING;
  }, [claims, isOwner, totalCount]);
  const dateFomart = "ddd MMM DD, YYYY";
  const [active, setActive] = useState("details");
  return (
    <ScreenLayout title="Match Detail">
      <When
        asyncState={{
          isLoading: isLoading || isPending || isLoadingClaims,
          error: error ?? claimserror ?? authError,
          data: match,
        }}
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
                  <VStack className="pt-6" space="md">
                    <SegmentedControl
                      data={[
                        { label: "Details", value: "details", show: true },
                        { label: "AI Analysis", value: "analysis", show: true },
                        {
                          label: "Claims",
                          value: "claim",
                          show: isOwner && totalCount > 0,
                        },
                      ].filter((d) => d.show)}
                      value={active}
                      onChange={setActive}
                    />
                  </VStack>
                  {/* Details section */}
                  {active === "details" && (
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
                          <DisplayTile
                            icon={Fingerprint}
                            label={"Status"}
                            value={getMatchStatusDisplay(data.status)}
                            withTopOutline
                            trailing={
                              <Text
                                className={cn(
                                  `px-2 py-1 rounded-full text-white`,
                                  {
                                    "bg-teal-600":
                                      data.status === MatchStatus.CLAIMED,
                                    "bg-red-600":
                                      data.status === MatchStatus.REJECTED,
                                    "bg-yellow-600":
                                      data.status === MatchStatus.PENDING,
                                  },
                                )}
                                size="xs"
                              >
                                {getMatchStatusDisplay(data.status)}
                              </Text>
                            }
                          />
                        </VStack>
                      </Box>
                    </VStack>
                  )}

                  {/* field analysys */}
                  {active === "analysis" && (
                    <VStack className=" pt-6" space="md">
                      <Text className="text-sm font-semibold text-typography-800">
                        Field Analysis
                      </Text>
                      <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
                        <VStack className="px-4" space="xs">
                          {(data.aiAnalysis?.fieldAnalysis ?? []).map(
                            (f, i) => (
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
                            ),
                          )}
                        </VStack>
                      </Box>
                    </VStack>
                  )}
                  {active === "claim" && <MatchClaims match={data} />}
                  {/* Actions sections */}
                  {canClaim && (
                    <Button
                      text="Claim Document"
                      size="lg"
                      className="rounded-full bg-teal-500 justify-between"
                      onPress={() => {
                        router.push({
                          pathname: "/claims/add",
                          params: { matchId: data.id },
                        });
                      }}
                      suffixIcon={ArrowRight}
                    />
                  )}
                  {canRejectMatch && (
                    <Button
                      text="Reject Match"
                      size="lg"
                      className="rounded-full bg-error-500 justify-between"
                      onPress={() => {
                        router.push({
                          pathname: "/matches/[matchId]/reject",
                          params: { matchId: data.id },
                        });
                      }}
                      suffixIcon={ArrowRight}
                    />
                  )}
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
