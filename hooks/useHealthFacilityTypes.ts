import { APIFetchResponse, constructUrl } from "@/lib/api";
import { APIListResponse } from "@/lib/api/types";
import { HealthFacilityType } from "@/types/facilities";
import useSWR from "swr";
import { useMergePaginationInfo } from "./usePagination";

export const useHealthFacilityTypes = (params: Record<string, string> = {}) => {
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(params, { context: "state" });
  const url = constructUrl("/health-facility-types", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<HealthFacilityType>>>(url);
  const { results: facilityTypes = [], ...rest } =
    data?.data ?? ({} as APIListResponse<HealthFacilityType>);
  return {
    ...rest,
    facilityTypes,
    error,
    isLoading,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};
