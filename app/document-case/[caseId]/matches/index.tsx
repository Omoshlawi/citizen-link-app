import { ScreenLayout } from "@/components/layout";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
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
        success={(c) => <Text>{JSON.stringify(c, null, 2)}</Text>}
      />
    </ScreenLayout>
  );
};

export default CaseMatchesScreen;
