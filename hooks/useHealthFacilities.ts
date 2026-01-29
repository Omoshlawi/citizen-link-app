import { APIFetchResponse, constructUrl } from "@/lib/api";
import { APIListResponse } from "@/lib/api/types";
import { HealthFacility } from "@/types/facilities";
import { useState } from "react";
import useSWR from "swr";
import { useDebouncedValue } from "./useDebouncedValue";
import { useMergePaginationInfo } from "./usePagination";

export const useHealthFacilities = (params: Record<string, string> = {}) => {
  // Build query params - only include non-empty values
  const queryParams: Record<string, string> = {};

  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }

  if (params.typeId && params.typeId !== "all") {
    queryParams.typeId = params.typeId;
  }

  if (params.page) {
    queryParams.page = params.page;
  }

  if (params.limit) {
    queryParams.limit = params.limit;
  }

  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(queryParams);

  const url = constructUrl("/health-facilities", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<HealthFacility>>>(url);
  const { results: healthFacilities = [], ...rest } =
    data?.data ?? ({} as APIListResponse<HealthFacility>);
  return {
    ...rest,
    healthFacilities,
    error,
    isLoading,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};

export const useSearchHealthFacility = (defaultSearch: string = "") => {
  const [search, setSearch] = useState<string>(defaultSearch);
  const [debounced] = useDebouncedValue(search, 500);
  const url = constructUrl("/health-facilities", { search: debounced });
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<{ results: HealthFacility[] }>
  >(debounced ? url : undefined);
  return {
    healthFacilities: data?.data?.results ?? [],
    isLoading,
    error,
    onSearchChange: setSearch,
    searchValue: search,
  };
};

export const useNearbyHealthFacilities = (params: {
  lat: number;
  lng: number;
  targetCount?: number;
  maxDistanceKm?: number;
  initialDistanceKm?: number;
  distanceIncrementKm?: number;
}) => {
  console.log(params);

  const url = constructUrl("/health-facilities/nearest", {
    ...params,
    // targetCount: params.targetCount ?? 10,
    // maxDistanceKm: params.maxDistanceKm ?? 5000,
    // initialDistanceKm: params.initialDistanceKm ?? 1,
    // distanceIncrementKm: params.distanceIncrementKm ?? 1,
  });
  const { data, error, isLoading } =
    useSWR<
      APIFetchResponse<{ results: (HealthFacility & { distanceKm: number })[] }>
    >(url);
  return {
    healthFacilities: data?.data?.results ?? [],
    error,
    isLoading,
  };
};
