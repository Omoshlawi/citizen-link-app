import { APIFetchResponse, constructUrl } from "@/lib/api";
import useSWR from "swr";

export interface Address {
    id: string
    country: string
    level: number
    parentId?: string
    code: string
    name: string
    nameLocal?: string
    voided: boolean
  }
  

type SearchProps = {
    level?: 1|2|3
    parentName?:string
}
export const useAddressHierarchy = (params: SearchProps={}) => {
    const url = constructUrl("/address-hierarchy", {limit: 100,...params});
    const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Address[]; totalCount: number }>>(url);
    return {
        addresses: data?.data?.results ?? [],
        error,
        isLoading,
        count: data?.data?.totalCount ?? 0,
      };
}

