import { APIFetchResponse, APIListResponse, constructUrl } from "@/lib/api";
import { TransitionReason } from "@/types/transitions";
import useSWR from "swr";

export const useTransitionReasons = (params: Record<string, any>) => {
  const url = constructUrl("/status-transitions-reasons", {
    includeGlobal: "true",
    orderBy: "createdAt",
    ...params,
  });
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<TransitionReason>>>(url);
  return { reasons: data?.data?.results ?? [], error, isLoading };
};
