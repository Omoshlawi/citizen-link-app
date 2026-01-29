import {
  apiFetch,
  APIFetchResponse,
  APIListResponse,
  constructUrl,
} from "@/lib/api";
import { invalidateCache } from "@/lib/helpers";
import {
  CancelFollowUpFormData,
  FollowUp,
  FollowUpFormData,
  OutreachAction,
  OutreachActionFormData,
  UpdateFollowUpFormData,
} from "@/types/follow-up";
import useSWR from "swr";
import { useMergePaginationInfo } from "./usePagination";

export const useFollowUps = (params: Record<string, any> = {}) => {
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(params);
  const url = constructUrl("/follow-up", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<FollowUp>>>(url);
  const { results: followUps = [], ...rest } =
    data?.data ?? ({} as APIListResponse<FollowUp>);
  return {
    ...rest,
    followUps,
    isLoading,
    error,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};

export const usePendingFollowUps = (params: Record<string, any> = {}) => {
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(params);
  const url = constructUrl("/follow-up/pending", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<FollowUp>>>(url);
  const { results: followUps = [], ...rest } =
    data?.data ?? ({} as APIListResponse<FollowUp>);
  return {
    ...rest,
    followUps,
    isLoading,
    error,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};
export const useFollowUp = (id: string) => {
  const url = constructUrl(`/follow-up/${id}`);
  const { data, error, isLoading } = useSWR<APIFetchResponse<FollowUp>>(url);

  return {
    followUp: data?.data,
    isLoading,
    error,
  };
};

const createFollowUp = async (data: FollowUpFormData) => {
  const res = await apiFetch<FollowUp>("/follow-up", {
    method: "POST",
    data: data,
  });
  invalidateCache();
  return res.data;
};

const updateFollowUp = async (id: string, data: UpdateFollowUpFormData) => {
  const res = await apiFetch<FollowUp>(`/follow-up/${id}`, {
    method: "PUT",
    data,
  });
  invalidateCache();
  return res.data;
};

const createFollowUpOutreachAction = async (
  followUpId: string,
  data: OutreachActionFormData
) => {
  const res = await apiFetch<OutreachAction>(
    `follow-up/${followUpId}/outreach-action`,
    {
      method: "POST",
      data: {
        ...data,
        location: data.actionType === "HOME_VISIT" ? data.location : undefined,
        barriers:
          data.outcome === "BARRIER_IDENTIFIED" ? data.barriers : undefined,
      },
    }
  );
  invalidateCache();
  return res.data;
};

const cancelFollowUp = async (id: string, data: CancelFollowUpFormData) => {
  const res = await apiFetch<FollowUp>(`/follow-up/${id}/cancel`, {
    method: "POST",
    data,
  });
  invalidateCache();
  return res.data;
};

export const useFollowUpApi = () => {
  return {
    createFollowUp,
    updateFollowUp,
    createFollowUpOutreachAction,
    cancelFollowUp,
  };
};
