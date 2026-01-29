import { apiFetch, APIFetchResponse, APIListResponse } from "@/lib/api";
import { constructUrl } from "@/lib/api/constructUrl";
import { invalidateCache } from "@/lib/helpers";
import { Client, ClientFormData } from "@/types/client";
import { useState } from "react";
import useSWR from "swr";
import { useDebouncedValue } from "./useDebouncedValue";
import { useMergePaginationInfo } from "./usePagination";

export const useClients = (params: Record<string, string> = {}) => {
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo(params);
  const url = constructUrl("/clients", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<Client>>>(url);
  const { results: clients = [], ...rest } =
    data?.data ?? ({} as APIListResponse<Client>);
  return {
    ...rest,
    clients,
    error,
    isLoading,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};

const createClient = async (data: ClientFormData) => {
  const url = constructUrl("/clients");
  const response = await apiFetch<Client>(url, {
    method: "POST",
    data: data,
  });

  invalidateCache();
  return response.data;
};

const updateClient = async (id: string, data: Partial<ClientFormData>) => {
  const url = constructUrl(`/clients/${id}`);
  const response = await apiFetch<Client>(url, {
    method: "PUT",
    data: data,
  });
  invalidateCache();
  return response.data;
};

const deleteClient = async (id: string) => {
  const url = constructUrl(`/clients/${id}`);
  const response = await apiFetch<Client>(url, {
    method: "DELETE",
  });
  invalidateCache();
  return response.data;
};

export const useClient = (id?: string) => {
  const url = id ? constructUrl(`/clients/${id}`) : null;
  const { data, error, isLoading } = useSWR<APIFetchResponse<Client>>(url);
  return { client: data?.data, error, isLoading };
};

export const useClientApi = () => {
  return {
    createClient,
    updateClient,
    deleteClient,
  };
};

export const useSearchClients = (defaultSearch: string = "") => {
  const [search, setSearch] = useState<string>(defaultSearch);
  const [debounced] = useDebouncedValue(search, 500);
  const url = constructUrl("/clients", { search: debounced });
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<{ results: Client[] }>
  >(debounced ? url : undefined);
  return {
    clients: data?.data?.results ?? [],
    isLoading,
    error,
    onSearchChange: setSearch,
    searchValue: search,
  };
};
