import {
  apiFetch,
  APIFetchResponse,
  APIListResponse,
  constructUrl,
  mutate,
} from "@/lib/api";
import {
  Address,
  AddressFormData,
  AddressLocale,
  PickupStation,
} from "@/types/address";
import { useState } from "react";
import useSWR from "swr";
import { useMergePaginationInfo, UsePaginationOptions } from "./usePagination";

type AddressFilters = Record<string, string | number | boolean | undefined>;

export const useAddresses = (defaultFilters: AddressFilters = {}) => {
  const [filters, setFilters] = useState<AddressFilters>(defaultFilters);

  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(filters as any, { context: "state" });
  const url = constructUrl("/addresses", mergedSearchParams);
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useSWR<APIFetchResponse<APIListResponse<Address>>>(url);

  const { results: addresses = [], ...rest } =
    data?.data ?? ({} as APIListResponse<Address>);
  return {
    ...rest,
    addresses,
    isLoading,
    error,
    mutate: swrMutate,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
    onFilterChange: setFilters,
  };
};

export const useAddress = (id?: string) => {
  const url = constructUrl(`/addresses/${id}`, { v: "custom:include(locale)" });
  const { data, error, isLoading, mutate } = useSWR<APIFetchResponse<Address>>(
    id ? url : null,
  );
  return {
    isLoading,
    error,
    address: data?.data,
    mutate,
  };
};

export const useAddressesApi = () => {
  const createAddress = async (payload: AddressFormData) => {
    const response = await apiFetch<Address>("/addresses", {
      method: "POST",
      data: payload,
    });
    mutate("/addresses");
    return response.data;
  };

  const updateAddress = async (addressId: string, payload: AddressFormData) => {
    const response = await apiFetch<Address>(`/addresses/${addressId}`, {
      method: "PATCH",
      data: payload,
    });
    mutate("/addresses");
    return response.data;
  };

  const deleteAddress = async (addressId: string, purge = false) => {
    const response = await apiFetch<Address>(`/addresses/${addressId}`, {
      method: "DELETE",
      params: { purge },
    });
    mutate("/addresses");
    return response.data;
  };

  const restoreAddress = async (addressId: string) => {
    const response = await apiFetch<Address>(
      `/addresses/${addressId}/restore`,
      {
        method: "POST",
      },
    );
    mutate("/addresses");
    return response.data;
  };

  const mutateAddresses = () => mutate("/addresses");
  const mutateAddress = (addressId: string) =>
    mutate(`/addresses/${addressId}`);

  return {
    createAddress,
    updateAddress,
    deleteAddress,
    restoreAddress,
    mutateAddresses,
    mutateAddress,
  };
};

type AddressLocaleFilters = Record<
  string,
  string | number | boolean | undefined
>;

export const useAddressLocales = (filters: AddressLocaleFilters = {}) => {
  const url = constructUrl("/address-locales", filters);
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useSWR<APIFetchResponse<{ results: AddressLocale[] }>>(url);

  return {
    locales: data?.data?.results ?? [],
    error,
    isLoading,
    mutate: swrMutate,
    pagination: (data?.data as any)?.pagination,
  };
};

export const useAddressLocale = (
  id?: string,
  filters: AddressLocaleFilters = {},
) => {
  const url = id ? constructUrl(`/address-locales/${id}`, filters) : null;
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useSWR<APIFetchResponse<AddressLocale>>(url);

  return {
    locale: data?.data,
    error,
    isLoading,
    mutate: swrMutate,
  };
};

export const usePickupStations = (
  filters: Record<string, any> = {},
  context?: UsePaginationOptions["context"],
) => {
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(filters, { context });
  const url = constructUrl("/pickup-stations", mergedSearchParams);
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useSWR<APIFetchResponse<APIListResponse<PickupStation>>>(url);
  const { results: stations = [], ...rest } =
    data?.data ?? ({} as APIListResponse<PickupStation>);
  return {
    ...rest,
    stations,
    error,
    isLoading,
    mutate: swrMutate,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};
