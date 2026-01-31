import { CasesFilters, CasesGridView, CasesListView } from "@/components/cases";
import {
  LandingScreenLayout,
  LayoutViewTabs,
  LayoutViewTabsProps,
} from "@/components/layout";
import { VStack } from "@/components/ui/vstack";
import { useDocumentCases } from "@/hooks/use-document-cases";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { RiskInterpretation } from "@/types/screening";
import React, { useMemo, useState } from "react";

const DocumentCasesScreen = () => {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<RiskInterpretation | "">("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [activeView, setActiveView] =
    useState<LayoutViewTabsProps["activeView"]>("list");

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (debouncedSearch.trim()) {
      p.search = debouncedSearch.trim();
    }
    if (level) {
      p.risk = level;
    }
    return p;
  }, [debouncedSearch, level]);

  const { totalCount } = useDocumentCases(params);
  return (
    <LandingScreenLayout>
      <VStack space="sm" className="flex-1 p-4">
        <LayoutViewTabs activeView={activeView} onViewChange={setActiveView} />
        <CasesFilters
          search={search}
          level={level}
          onSearchChange={setSearch}
          onLevelChange={setLevel}
          count={totalCount}
        />
        {activeView === "list" && <CasesListView />}
        {activeView === "grid" && <CasesGridView />}
      </VStack>
    </LandingScreenLayout>
  );
};

export default DocumentCasesScreen;
