import { APIFetchResponse, APIListResponse, constructUrl } from "@/lib/api";
import { StatusTransition } from "@/types/transitions";
import useSWR from "swr";

export const useStatusTransition = (
  params: Record<string, any>,
  skip: boolean = false,
) => {
  const url = constructUrl(`/status-transitions`, params);

  const { data, error, isLoading } = useSWR<
    APIFetchResponse<APIListResponse<StatusTransition>>
  >(skip ? null : url);
  return { statusTransitions: data?.data?.results ?? [], error, isLoading };
};
