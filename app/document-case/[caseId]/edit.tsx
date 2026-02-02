import { EditDocumentCaseForm } from "@/components/cases";
import { ScreenLayout } from "@/components/layout";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Spinner } from "@/components/ui/spinner";
import { useDocumentCase } from "@/hooks/use-document-cases";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const EditCaseScreen = () => {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const { report, error, isLoading } = useDocumentCase(caseId as string);
  return (
    <ScreenLayout title="Edit Case">
      <When
        asyncState={{ isLoading, error, data: report }}
        error={(e) => <ErrorState error={e} />}
        loading={() => <Spinner />}
        success={(docCase) => {
          if (!docCase) return <></>;
          return <EditDocumentCaseForm documentCase={docCase} />;
        }}
      />
    </ScreenLayout>
  );
};

export default EditCaseScreen;
