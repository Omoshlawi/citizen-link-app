import { ScreenLayout } from "@/components/layout";
import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useDocumentCase } from "@/hooks/use-document-cases";

const DocumentCaseDetailScreen = () => {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const { report, error, isLoading } = useDocumentCase(caseId as string);
  return (
    <ScreenLayout title="Case Details">
      <Text>DocumentCaseDetailScreen</Text>
    </ScreenLayout>
  );
};

export default DocumentCaseDetailScreen;
