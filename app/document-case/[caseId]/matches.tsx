import { ScreenLayout } from "@/components/layout";
import { ListMatches } from "@/components/matches";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Spinner } from "@/components/ui/spinner";
import { useDocumentCase } from "@/hooks/use-document-cases";
import { useLocalSearchParams } from "expo-router";
import React from "react";
const CaseMatchesScreen = () => {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const { isLoading, error, report } = useDocumentCase(caseId);
  return (
    <ScreenLayout title="Case Matches">
      <When
        asyncState={{ isLoading, error, data: report }}
        loading={() => <Spinner />}
        error={(e) => <ErrorState error={e} />}
        success={(c) => <ListMatches documentCase={c} />}
      />
    </ScreenLayout>
  );
};

export default CaseMatchesScreen;
