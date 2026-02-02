import {
  MannuallyAddLostDocumentForm,
  ScanLostDocumentForm,
} from "@/components/cases";
import { ScreenLayout } from "@/components/layout";
import SegmentedControl from "@/components/SegmentedControl";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";

type Modes = "scan" | "mannual";
const AddLostDocumentCaseScreen = () => {
  const { mode: _mode } = useLocalSearchParams<{
    mode: Modes;
  }>();
  const mode = useMemo<Modes>(() => {
    if (!_mode || !["scan", "mannual"].includes(_mode)) return "mannual";
    return _mode;
  }, [_mode]);

  return (
    <ScreenLayout title={"Report Lost document"}>
      <SegmentedControl
        data={[
          { label: "Mannual Entry", value: "mannual" },
          { value: "scan", label: "Scan Document" },
        ]}
        value={mode}
        onChange={(m) => {
          router.setParams({ mode: m });
        }}
      />
      {mode === "mannual" ? (
        <MannuallyAddLostDocumentForm />
      ) : (
        <ScanLostDocumentForm />
      )}
    </ScreenLayout>
  );
};

export default AddLostDocumentCaseScreen;
