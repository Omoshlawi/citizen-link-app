import {
  FacilityFilter,
  FacilityGridView,
  FacilityListView,
  FacilityMapView,
} from "@/components/facilities";
import FacilitiesViewTabs, {
  FacilitiesViewTabsProps,
} from "@/components/facilities/FacilitiesViewTabs";
import LandingScreenLayout from "@/components/layout/LandingScreenLayout";
import { VStack } from "@/components/ui/vstack";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useHealthFacilities } from "@/hooks/useHealthFacilities";
import { useState } from "react";

export default function PickupStationsScreen() {
  const [activeView, setActiveView] =
    useState<FacilitiesViewTabsProps["activeView"]>("list");
  const [search, setSearch] = useState("");
  const [facilityType, setFacilityType] = useState("all");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  // Fetch facilities to get total count for the filter
  const { totalCount } = useHealthFacilities({
    search: debouncedSearch || "",
    typeId: facilityType || "",
  });

  return (
    <LandingScreenLayout>
      <VStack space="md" className="flex-1 p-4">
        <FacilitiesViewTabs
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <FacilityFilter
          search={search}
          onSearchChange={setSearch}
          facilityType={facilityType}
          onFacilityTypeChange={setFacilityType}
          totalCount={totalCount}
        />
        {activeView === "list" && (
          <FacilityListView search={debouncedSearch} typeId={facilityType} />
        )}
        {activeView === "grid" && (
          <FacilityGridView search={debouncedSearch} typeId={facilityType} />
        )}
        {activeView === "map" && (
          <FacilityMapView search={debouncedSearch} typeId={facilityType} />
        )}
      </VStack>
    </LandingScreenLayout>
  );
}
