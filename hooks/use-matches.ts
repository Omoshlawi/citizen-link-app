import {
  apiFetch,
  APIFetchResponse,
  APIListResponse,
  constructUrl,
} from "@/lib/api";
import { invalidateCache } from "@/lib/helpers";
import { Match, RejectMatchFormData } from "@/types/matches";
import { useLocalSearchParams } from "expo-router";
import useSWR from "swr";
import { useMergePaginationInfo } from "./usePagination";

export const useMatches = (params: Record<string, any> = {}) => {
  const p = useLocalSearchParams<Record<string, any>>();
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo({
      minMatchScore: "50",
      ...p,
      ...params,
    });
  const url = constructUrl("/matching", mergedSearchParams);

  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<APIListResponse<Match>>>(url);

  const { results: matches = [], ...rest } =
    data?.data ?? ({} as APIListResponse<Match>);

  return {
    ...rest,
    matches,
    isLoading,
    error,
    mutate,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};

export const useMatch = (matchId?: string) => {
  const url = constructUrl(`/matching/${matchId}`);
  const { data, error, isLoading } = useSWR<APIFetchResponse<Match>>(
    matchId ? url : null,
  );
  return { match: data?.data, isLoading, error };
};

const rejectMatch = async (matchId: string, data: RejectMatchFormData) => {
  const res = await apiFetch<Match>(`/matching/${matchId}/reject`, {
    method: "POST",
    data,
  });
  invalidateCache();
  return res.data;
};

export const useMatchApi = () => {
  return {
    rejectMatch,
  };
};
