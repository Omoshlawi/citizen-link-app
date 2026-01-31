import { CasesFilters, CasesGridView, CasesListView } from "@/components/cases";
import {
  LandingScreenLayout,
  LayoutViewTabs,
  LayoutViewTabsProps,
} from "@/components/layout";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";

const DocumentCasesScreen = () => {
  const [activeView, setActiveView] =
    useState<LayoutViewTabsProps["activeView"]>("list");

  return (
    <LandingScreenLayout>
      <VStack space="sm" className="flex-1 p-4">
        <LayoutViewTabs activeView={activeView} onViewChange={setActiveView} />
        <CasesFilters />
        {activeView === "list" && <CasesListView />}
        {activeView === "grid" && <CasesGridView />}
      </VStack>
    </LandingScreenLayout>
  );
};

export default DocumentCasesScreen;
