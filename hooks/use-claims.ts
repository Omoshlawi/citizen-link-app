import {
  apiFetch,
  APIFetchResponse,
  APIListResponse,
  constructUrl,
  mutate,
} from "@/lib/api";
import { Claim, ClaimFormData } from "@/types/claim";
import useSWR from "swr";
import { useMergePaginationInfo } from "./usePagination";

const claimMatch = async (data: ClaimFormData & { attachments: string[] }) => {
  const res = await apiFetch<Claim>(`/claim`, {
    method: "POST",
    data,
  });
  mutate("/matching");
  mutate("/claim");
  return res.data;
};

export const useClaimApi = () => {
  return { claimMatch };
};

export const useClaim = (
  claimId?: string,
  params: Record<string, any> = {},
) => {
  const url = constructUrl(`/claim/${claimId}`, params);
  const { data, error, isLoading } = useSWR<APIFetchResponse<Claim>>(
    claimId ? url : null,
  );
  return {
    isLoading,
    error,
    claim: data?.data,
  };
};

export const useClaims = (params: Record<string, any> = {}) => {
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(params, { context: "state" });
  const url = constructUrl("/claim", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<Claim>>>(url);
  const { results: claims = [], ...rest } =
    data?.data ?? ({} as APIListResponse<Claim>);
  return {
    ...rest,
    claims,
    error,
    isLoading,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};
