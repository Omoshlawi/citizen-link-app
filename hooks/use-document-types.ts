import { APIFetchResponse, constructUrl, useApi } from "@/lib/api";
import { DocumentType } from "@/types/cases";

// lists all document types
export const useDocumentTypes = () => {
  const url = constructUrl("/documents/types", {
    limit: 100,
    includeVoided: true,
  });
  const { data, error, isLoading, mutate } =
    useApi<APIFetchResponse<{ results: DocumentType[] }>>(url);
  return {
    documentTypes: data?.data?.results ?? [],
    error,
    isLoading,
    mutate,
  };
};

// findes document by document id
export const useDocumentType = (documentTypeId?: string) => {
  const url = constructUrl(`/documents/types/${documentTypeId}`);
  const { data, error, isLoading, mutate } = useApi<
    APIFetchResponse<DocumentType>
  >(documentTypeId ? url : null);
  return {
    documentType: data?.data,
    error,
    isLoading,
    mutate,
  };
};
