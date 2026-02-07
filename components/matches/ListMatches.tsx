import { DocumentCase } from "@/types/cases";
import { router, useLocalSearchParams } from "expo-router";
import React, { FC, useState } from "react";
import { Search } from "../common";
import { LayoutViewTabs, LayoutViewTabsProps } from "../layout";
import { VStack } from "../ui/vstack";
import MatchesGridView from "./MatchesGridView";
import MatchesListView from "./MatchesListView";

type ListMatchesProps = {
  documentCase?: DocumentCase;
};

const ListMatches: FC<ListMatchesProps> = ({ documentCase }) => {
  const [activeView, setActiveView] =
    useState<LayoutViewTabsProps["activeView"]>("list");
  const params = useLocalSearchParams<Record<string, any>>();
  return (
    <VStack space="sm" className="flex-1  w-full h-full ">
      <LayoutViewTabs activeView={activeView} onViewChange={setActiveView} />
      <Search
        // onSearchChange={(search) => router.setParams({ ...params, search })}
      />
      {activeView === "list" && <MatchesListView documentCase={documentCase} />}
      {activeView === "grid" && <MatchesGridView documentCase={documentCase} />}
    </VStack>
  );
};

export default ListMatches;
