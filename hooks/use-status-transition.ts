import { APIFetchResponse, APIListResponse, constructUrl } from "@/lib/api";
import { StatusTransition } from "@/types/transitions";
import useSWR from "swr";

export const useStatusTransition = (params: Record<string, any>) => {
  const url = constructUrl(`/status-transitions`, params);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<StatusTransition>>>(url);
  return { statusTransitions: data?.data?.results ?? [], error, isLoading };
};
