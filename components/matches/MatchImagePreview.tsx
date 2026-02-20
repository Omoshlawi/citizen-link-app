import React, { FC, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import {
  getClaimStatusDisplay,
  getMatchRecommendationDisplay,
  getMatchStatusDisplay,
} from "@/lib/helpers";
import { Match, MatchStatus } from "@/types/matches";

import { useClaims } from "@/hooks/use-claims";
import { ClaimStatus } from "@/types/claim";
import cn from "classnames";
import { router } from "expo-router";
import { ProtectedImages } from "../image";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";

type MatchImagePreviewProps = {
  match: Match;
  useCase?: "list" | "detail";
};

const MatchImagePreview: FC<MatchImagePreviewProps> = ({
  match,
  useCase = "list",
}) => {
  const images = useMemo(
    () =>
      (match?.foundDocumentCase?.case?.document?.images ?? [])
        .map((at) => at.blurredUrl)
        .filter(Boolean),
    [match],
  );
  const { claims } = useClaims({
    matchId: match.id,
    orderBy: "-createdAt",
    limit: 1,
  });
  const latestClaim = claims?.[0];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={useCase === "detail"}
      onPress={() =>
        router.push({
          pathname: "/matches/[matchId]",
          params: { matchId: match.id },
        })
      }
      className=""
    >
      <Box className="w-full">
        {/* Main Image Area */}
        <ProtectedImages images={images as string[]} />

        {/* Content Area */}
        {useCase === "list" && (
          <Box className="mt-2">
            <View className="flex-row justify-between items-start mb-2">
              <View>
                <Text className="text-xs text-typography-400 font-bold uppercase">
                  Match #{match.matchNumber}
                </Text>
                <Text className="text-lg font-bold text-typography-900">
                  {match.matchScore}% Match
                </Text>
              </View>
              <HStack space="sm">
                <Text
                  className={cn(
                    "text-[10px] font-bold uppercase text-white px-2 py-1 rounded-full",
                    {
                      "bg-orange-500": match.status === MatchStatus.PENDING,
                      "bg-green-500": match.status === MatchStatus.CLAIMED,
                      "bg-red-500": match.status === MatchStatus.REJECTED,
                    },
                  )}
                >
                  Match {getMatchStatusDisplay(match.status)}
                </Text>
                {latestClaim && (
                  <Text
                    className={cn(
                      "text-[10px] font-bold uppercase text-white px-2 py-1 rounded-full",
                      {
                        "bg-orange-500":
                          latestClaim.status === ClaimStatus.PENDING,
                        "bg-green-500":
                          latestClaim.status === ClaimStatus.VERIFIED,
                        "bg-red-500":
                          latestClaim.status === ClaimStatus.REJECTED ||
                          latestClaim.status === ClaimStatus.CANCELLED,
                        "bg-blue-500":
                          latestClaim.status === ClaimStatus.DISPUTED,
                      },
                    )}
                  >
                    Claim {getClaimStatusDisplay(latestClaim?.status)}
                  </Text>
                )}
              </HStack>
            </View>

            <Text
              className="text-sm text-typography-500 italic"
              numberOfLines={2}
            >
              {getMatchRecommendationDisplay(match.aiAnalysis.recommendation)}
            </Text>
          </Box>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default MatchImagePreview;
