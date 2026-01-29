import {
  apiFetch,
  APIFetchResponse,
  APIListResponse,
  constructUrl,
} from "@/lib/api";
import { invalidateCache } from "@/lib/helpers";
import { ScreenClientFormData, Screening } from "@/types/screening";
import useSWR from "swr";
import { useMergePaginationInfo } from "./usePagination";

const createScreening = async (data: ScreenClientFormData) => {
  const url = constructUrl("/screenings");
  const response = await apiFetch<Screening>(url, {
    method: "POST",
    data: data,
  });
  invalidateCache();
  return response.data;
};

const updateScreening = async (
  id: string,
  data: Partial<ScreenClientFormData>
) => {
  const url = constructUrl(`/screenings/${id}`);
  const response = await apiFetch<Screening>(url, {
    method: "PUT",
    data: data,
  });
  invalidateCache();
  return response.data;
};

const deleteScreening = async (id: string) => {
  const url = constructUrl(`/screenings/${id}`);
  const response = await apiFetch<Screening>(url, {
    method: "DELETE",
  });
  invalidateCache();
  return response.data;
};

export const useScreenings = (params: Record<string, string> = {}) => {
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(params);
  const url = constructUrl("/screenings", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<Screening>>>(url);

  const { results: screenings = [], ...rest } =
    data?.data ?? ({} as APIListResponse<Screening>);
  return {
    ...rest,
    screenings,
    error,
    isLoading,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};

export const useScreening = (id?: string) => {
  const url = id ? constructUrl(`/screenings/${id}`) : null;
  const { data, error, isLoading } = useSWR<APIFetchResponse<Screening>>(url);
  return { screening: data?.data, error, isLoading };
};

export const useScreeningsApi = () => {
  return {
    createScreening,
    updateScreening,
    deleteScreening,
  };
};
