import { useClaims } from "@/hooks/use-claims";
import { useMatches } from "@/hooks/use-matches";
import { useStatusTransition } from "@/hooks/use-status-transition";
import { DocumentCase } from "@/types/cases";
import { Match } from "@/types/matches";
import dayjs from "dayjs";
import { Calendar } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";
import { DisplayTile } from "../list-tile";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Spinner } from "../ui/spinner";
import { VStack } from "../ui/vstack";

type CaseTimelineProps = {
  documentCase: DocumentCase;
};

const CaseTimeline: React.FC<CaseTimelineProps> = ({
  documentCase: docCase,
}) => {
  const { isLoading, statusTransitions, error } = useStatusTransition({
    entityType: docCase.lostDocumentCase
      ? "LostDocumentCase"
      : "FoundDocumentCase",
    entityId: docCase.lostDocumentCase?.id || docCase.foundDocumentCase?.id,
    orderBy: "createdAt",
  });
  const {
    matches,
    error: errorMatches,
    isLoading: isLoadingMatches,
  } = useMatches({
    documentCaseId: docCase?.id,
    limit: 100,
    orderBy: "-createdAt",
  });
  const dateFomart = "DD MMMM YYYY HH:mm:ss";

  if (isLoading || isLoadingMatches) {
    return <Spinner />;
  }

  if (error || errorMatches) {
    return <ErrorState error={error || errorMatches} />;
  }

  if (statusTransitions.length === 0) {
    return <EmptyState message="No status transitions found" />;
  }

  return (
    <>
      <VStack className="pt-6" space="md">
        <Text className="text-sm font-semibold text-typography-800">
          Case {docCase.caseNumber}
        </Text>
        <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
          <VStack className="px-4" space="xs">
            <DisplayTile
              icon={Calendar}
              label={"Date Reported"}
              value={dayjs(docCase.createdAt).format(dateFomart)}
            />
            {statusTransitions.map((transition, index) => (
              <DisplayTile
                key={transition.id}
                icon={Calendar}
                label={`Date ${transition.toStatus}`}
                value={dayjs(transition.createdAt).format(dateFomart)}
              />
            ))}
          </VStack>
        </Box>
      </VStack>
      {matches.map((match) => (
        <MatchTransitions key={match.id} match={match} />
      ))}
    </>
  );
};

export default CaseTimeline;
const MatchTransitions = ({ match }: { match: Match }) => {
  const dateFomart = "DD MMMM YYYY HH:mm:ss";
  const { isLoading, statusTransitions, error } = useStatusTransition({
    entityType: "Match",
    entityId: match.id,
    orderBy: "createdAt",
  });
  const { claims } = useClaims({
    matchId: match.id,
    orderBy: "-createdAt",
    limit: 1,
  });
  const latestClaim = claims?.[0];
  const {
    statusTransitions: claimStatusTransitions,
    isLoading: isLoadingClaimStatusTransitions,
    error: errorClaimStatusTransitions,
  } = useStatusTransition(
    {
      entityType: "Claim",
      entityId: latestClaim?.id,
      orderBy: "createdAt",
    },
    !latestClaim?.id,
  );
  if (isLoading || isLoadingClaimStatusTransitions) return <Spinner />;
  if (error || errorClaimStatusTransitions)
    return <ErrorState error={error || errorClaimStatusTransitions} />;
  return (
    <VStack className="pt-6" space="md">
      <Text className="text-sm font-semibold text-typography-800">
        Match {match.matchNumber}
      </Text>
      <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
        <VStack className="px-4" space="xs">
          <DisplayTile
            key={match.id}
            icon={Calendar}
            label={"Date Matched"}
            value={dayjs(match.createdAt).format(dateFomart)}
          />
          {statusTransitions.map((transition, index) => (
            <DisplayTile
              key={transition.id}
              icon={Calendar}
              label={`Date ${transition.toStatus}`}
              value={dayjs(transition.createdAt).format(dateFomart)}
              withTopOutline={index > 0}
            />
          ))}
          {claimStatusTransitions.map((transition, index) => (
            <DisplayTile
              key={transition.id}
              icon={Calendar}
              label={`Date Claim ${transition.toStatus}`}
              value={dayjs(transition.createdAt).format(dateFomart)}
            />
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};
