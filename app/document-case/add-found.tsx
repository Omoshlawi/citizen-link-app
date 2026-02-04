import { ScanDocumentCaseForm } from "@/components/cases";
import { ScreenLayout } from "@/components/layout";
import React from "react";

const AddFoundDocumentCase = () => {
  return (
    <ScreenLayout title="Report Found Document">
      <ScanDocumentCaseForm caseType="FOUND" />
    </ScreenLayout>
  );
};

export default AddFoundDocumentCase;
