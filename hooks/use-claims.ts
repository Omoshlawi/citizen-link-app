import {
  apiFetch,
  APIFetchResponse,
  APIListResponse,
  constructUrl,
} from "@/lib/api";
import { ZOD_IS0_DATE_FORMAT } from "@/lib/constants";
import { invalidateCache } from "@/lib/helpers";
import {
  CancelClaimFormData,
  Claim,
  ClaimFormData,
  DisputeClaimFormData,
} from "@/types/claim";
import dayjs from "dayjs";
import useSWR from "swr";
import { useMergePaginationInfo } from "./usePagination";

const claimMatch = async (data: ClaimFormData & { attachments: string[] }) => {
  const res = await apiFetch<Claim>(`/claim`, {
    method: "POST",
    data: {
      ...data,
      pickupStationId:
        data.preferedCollectionPoint === "station"
          ? data.pickupStationId
          : undefined,
      addressId:
        data.preferedCollectionPoint === "address" ? data.addressId : undefined,
      preferredHandoverDate: dayjs(data.preferredHandoverDate).format(
        ZOD_IS0_DATE_FORMAT,
      ),
    },
  });
  invalidateCache();
  return res.data;
};
const cancelClaim = async (claimId: string, data: CancelClaimFormData) => {
  const res = await apiFetch<Claim>(`/claim/${claimId}/cancel`, {
    method: "POST",
    data,
  });
  invalidateCache();
  return res.data;
};
const disputeClaim = async (claimId: string, data: DisputeClaimFormData) => {
  const res = await apiFetch<Claim>(`/claim/${claimId}/dispute`, {
    method: "POST",
    data,
  });
  invalidateCache();
  return res.data;
};

export const useClaimApi = () => {
  return { claimMatch, cancelClaim, disputeClaim };
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
