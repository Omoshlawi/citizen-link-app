import { Search } from "@/components/common";
import LandingScreenLayout from "@/components/layout/LandingScreenLayout";
import {
  StationsGridView,
  StationsListView,
  StationsMapView,
  StationsViewTabs,
  StationsViewTabsProps,
} from "@/components/statio ns";
import { VStack } from "@/components/ui/vstack";
import { usePickupStations } from "@/hooks/use-addresses";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function PickupStationsScreen() {
  const [activeView, setActiveView] =
    useState<StationsViewTabsProps["activeView"]>("list");
  const { search } = useLocalSearchParams<{ search: string }>();

  const { totalCount } = usePickupStations(
    {
      search,
    },
    "router",
  );

  return (
    <LandingScreenLayout>
      <VStack space="md" className="flex-1 p-4">
        <StationsViewTabs
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <Search
          count={totalCount}
          defaultsearch={search}
          onSearchChange={(search) => router.setParams({ search })}
        />
        {activeView === "list" && <StationsListView />}
        {activeView === "grid" && <StationsGridView />}
        {activeView === "map" && <StationsMapView />}
      </VStack>
    </LandingScreenLayout>
  );
}
