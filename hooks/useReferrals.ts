import { apiFetch, APIFetchResponse, constructUrl } from "@/lib/api";
import { invalidateCache } from "@/lib/helpers";
import {
  CompleteReferralFormData,
  Referral,
  ReferralFormData,
} from "@/types/screening";
import useSWR from "swr";

export const useReferrals = (params: Record<string, string> = {}) => {
  const url = constructUrl("/referrals", params);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Referral[] }>>(url);
  return { referrals: data?.data?.results ?? [], error, isLoading };
};

export const useReferral = (id?: string) => {
  const url = id ? constructUrl(`/referrals/${id}`) : null;
  const { data, error, isLoading } = useSWR<APIFetchResponse<Referral>>(url);
  return { referral: data?.data, error, isLoading };
};

const referClient = async (data: ReferralFormData) => {
  const url = constructUrl("/referrals");
  const response = await apiFetch<Referral>(url, {
    method: "POST",
    data: data,
  });
  invalidateCache();
  return response.data;
};

const completeReferral = async (id: string, data: CompleteReferralFormData) => {
  const url = constructUrl(`/referrals/${id}/complete`);
  const response = await apiFetch<Referral>(url, {
    method: "POST",
    data: data,
  });
  invalidateCache();
  return response.data;
};

export const useReferralApi = () => {
  return { referClient, completeReferral };
};
