import { useClaims } from "@/hooks/use-claims";
import { Match } from "@/types/matches";
import dayjs from "dayjs";
import { Hash, Info } from "lucide-react-native";
import React, { FC } from "react";
import { DisplayTile } from "../list-tile";
import { Box } from "../ui/box";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import ClaimAttachment from "./ClaimAttachment";

type MatchClaimProps = {
  match: Match;
};
const MatchClaim: FC<MatchClaimProps> = ({ match }) => {
  const { isLoading, claims } = useClaims({
    matchId: match.id,
  });
  const claim = claims?.[0];

  if (isLoading) return <Spinner />;

  return (
    <>
      <VStack className=" pt-6" space="md">
        <Text className="text-sm font-semibold text-typography-800">
          Claim details
        </Text>
        <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
          <VStack className="px-4" space="xs">
            <DisplayTile
              icon={Hash}
              label={"Claim number"}
              value={claim.claimNumber}
              withBottomOutline
            />

            <DisplayTile
              icon={Info}
              label={"Status"}
              value={claim.status}
              withBottomOutline
            />
            <DisplayTile
              icon={Info}
              label={"date claimed"}
              value={dayjs(claim.createdAt).format("ddd DD MMM, YYYY")}
              withBottomOutline
            />
            <DisplayTile
              icon={Info}
              label={"Passed Security question?"}
              value={claim.verification.passed ? "Yes" : "No"}
              trailing={
                <Text
                  className={`px-2 py-1 ${claim.verification.passed ? "bg-teal-600" : "bg-red-600"} rounded-full text-white`}
                  size="xs"
                >
                  {claim.verification.passed ? "Passed" : "Failed"}
                </Text>
              }
            />
          </VStack>
        </Box>
      </VStack>
      <VStack className=" pt-6" space="md">
        <Text className="text-sm font-semibold text-typography-800">
          My response
        </Text>
        <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
          <VStack className="px-4" space="xs">
            {claim?.verification?.userResponses?.map((res, i) => (
              <DisplayTile
                withTopOutline={i !== 0}
                icon={Info}
                label={res.question}
                value={res.response}
                key={i}
              />
            ))}
          </VStack>
        </Box>
      </VStack>
      <VStack className=" pt-6" space="md">
        <Text className="text-sm font-semibold text-typography-800">
          Support documents(attachments)
        </Text>
        <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
          <VStack className="px-4" space="xs">
            <ClaimAttachment claim={claim} />
          </VStack>
        </Box>
      </VStack>
    </>
  );
};

export default MatchClaim;
