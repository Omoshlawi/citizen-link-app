import { ScreenLayout } from "@/components/layout";
import ClaimForm from "@/components/matches/ClaimForm";
import { EmptyState, ErrorState, When } from "@/components/state-full-widgets";
import { Spinner } from "@/components/ui/spinner";
import { useMatch } from "@/hooks/use-matches";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const ClaimDocumentMatchScreen = () => {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { error, isLoading, match } = useMatch(matchId);
  return (
    <ScreenLayout title="Claim Document">
      <When
        asyncState={{ isLoading, error, data: match }}
        loading={() => <Spinner />}
        error={(e) => <ErrorState error={e} />}
        success={(data) => {
          if (!data) return <EmptyState message="Match not found" />;
          return <ClaimForm match={data} />;
        }}
      />
    </ScreenLayout>
  );
};

export default ClaimDocumentMatchScreen;
