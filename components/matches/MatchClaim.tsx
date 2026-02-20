import { useClaims } from "@/hooks/use-claims";
import { getClaimStatusDisplay } from "@/lib/helpers";
import { ClaimStatus } from "@/types/claim";
import { Match } from "@/types/matches";
import cn from "classnames";
import dayjs from "dayjs";
import { router } from "expo-router";
import { ChevronRight, Hash, Info } from "lucide-react-native";
import React, { FC } from "react";
import { DisplayTile } from "../list-tile";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type MatchClaimProps = {
  match: Match;
};
const MatchClaims: FC<MatchClaimProps> = ({ match }) => {
  const { isLoading, claims } = useClaims({
    matchId: match.id,
    orderBy: "-createdAt",
    limit: 100,
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      <VStack className=" pt-6" space="md">
        <Text className="text-sm font-semibold text-typography-800">
          Raised Claims
        </Text>
        {claims.map((claim) => (
          <Box
            className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden"
            key={claim.id}
          >
            <VStack className="px-4" space="xs">
              <DisplayTile
                icon={Hash}
                label={"Claim number"}
                value={claim.claimNumber}
                withBottomOutline
                trailing={
                  <Button
                    size="xs"
                    className="rounded-full bg-teal-600"
                    onPress={() =>
                      router.push({
                        pathname: "/claims/[claimId]",
                        params: { claimId: claim.id },
                      })
                    }
                  >
                    <ButtonText className="text-white">View Details</ButtonText>
                    <ButtonIcon as={ChevronRight} className="text-white" />
                  </Button>
                }
              />

              <DisplayTile
                icon={Info}
                label={"Status"}
                value={getClaimStatusDisplay(claim.status)}
                withBottomOutline
                trailing={
                  <Text
                    className={cn(`px-2 py-1 rounded-full text-white`, {
                      "bg-teal-600": claim.status === ClaimStatus.VERIFIED,
                      "bg-red-600":
                        claim.status === ClaimStatus.REJECTED ||
                        claim.status === ClaimStatus.CANCELLED,
                      "bg-blue-600": claim.status === ClaimStatus.PENDING,
                      "bg-yellow-600": claim.status === ClaimStatus.DISPUTED,
                    })}
                    size="xs"
                  >
                    {getClaimStatusDisplay(claim.status)}
                  </Text>
                }
              />
              <DisplayTile
                icon={Info}
                label={"date claimed"}
                value={dayjs(claim.createdAt).format("ddd DD MMM, YYYY")}
              />
            </VStack>
          </Box>
        ))}
      </VStack>
    </>
  );
};

export default MatchClaims;
