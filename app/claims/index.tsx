import { ScreenLayout } from "@/components/layout";
import { EmptyState, ErrorState, When } from "@/components/state-full-widgets";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useMatches } from "@/hooks/use-matches";
import React from "react";

const ClaimDocumentMatchScreen = () => {
  const { error, isLoading, matches } = useMatches();
  return (
    <ScreenLayout title="Claims">
      <When
        asyncState={{ isLoading, error, data: matches }}
        loading={() => <Spinner />}
        error={(e) => <ErrorState error={e} />}
        success={(data) => {
          if (!data?.length) return <EmptyState message="Match not found" />;
          return <Text>{JSON.stringify(data, null, 2)}</Text>;
        }}
      />
    </ScreenLayout>
  );
};

export default ClaimDocumentMatchScreen;
