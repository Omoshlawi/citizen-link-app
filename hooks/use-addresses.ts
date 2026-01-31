import { APIFetchResponse, constructUrl } from "@/lib/api";
import { Address } from "@/types/address";
import useSWR from "swr";

type AddressFilters = Record<string, string | number | boolean | undefined>;

export const useAddresses = (filters: AddressFilters = {}) => {
  const url = constructUrl("/addresses", { ...filters, limit: 100 });
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useSWR<APIFetchResponse<{ results: Address[] }>>(url);
  return {
    addresses: data?.data?.results ?? [],
    isLoading,
    error,
    mutate: swrMutate,
  };
};
