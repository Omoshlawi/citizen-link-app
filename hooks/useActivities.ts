import { APIFetchResponse, APIListResponse, constructUrl } from "@/lib/api";
import { Activity } from "@/types/users";
import useSWR from "swr";
import { useMergePaginationInfo } from "./usePagination";

export const useActivities = (params: Record<string, string> = {}) => {
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(params);
  const url = constructUrl("/activities", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<Activity>>>(url);
  const { results: activities = [], ...rest } =
    data?.data ?? ({} as APIListResponse<Activity>);
  return {
    ...rest,
    activities,
    error,
    isLoading,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};
