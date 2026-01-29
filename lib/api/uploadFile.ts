import { apiFetch } from "./apiFetch";
import { constructUrl } from "./constructUrl";
import handleApiErrors from "./handleApiErrors";
import httpClient from "./httpClient";
import { FileMetadata, FileUploadRequestResponse } from "./types";

export const uploadFile = async (
  {
    file,
    onProgress,
    purpose,
    relatedModelId,
    relatedModelName,
    tags,
  }: {
    file: File;
    onProgress?: (progress: number) => void;
    relatedModelName: string;
    relatedModelId: string;
    purpose: string;
    tags?: string[];
  },
  requestParams: Record<string, any> = {}
) => {
  try {
    const formData = new FormData();
    if (tags) formData.append("tags", tags.join(","));
    if (purpose) formData.append("purpose", purpose);
    if (relatedModelId) formData.append("relatedModelId", relatedModelId);
    if (relatedModelName) formData.append("relatedModelName", relatedModelName);

    // Add single file to formData
    formData.append("file", file);

    const url = constructUrl("/files/upload/single", {
      v: "custom:include(blob)",
      ...requestParams,
    });
    const resp = await apiFetch<FileMetadata>(url, {
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            onProgress(percentCompleted);
          }
        : undefined,
      timeout: 30000, // 30 second timeout
    });

    return resp.data;
  } catch (error: any) {
    console.error("Upload error:", handleApiErrors(error));
    throw error;
  }
};

/**
 * Requests a signed URL for direct S3 upload and uploads the file.
 * This is a two-step process:
 * 1. Request a signed URL from the API
 * 2. Upload the file directly to S3 using the signed URL
 */
export const uploadFileViaSignedUrl = async (
  {
    file,
    onProgress,
    purpose,
    relatedModelId,
    relatedModelName,
    tags,
    expiresIn,
  }: {
    file: File;
    onProgress?: (progress: number) => void;
    relatedModelName: string;
    relatedModelId: string;
    purpose: string;
    tags?: string[];
    expiresIn?: number;
  },
  requestParams: Record<string, any> = {}
) => {
  try {
    // Step 1: Request signed URL from the API
    const requestUrl = constructUrl("/files/upload/request", {
      v: "custom:include(blob)",
      ...requestParams,
    });

    const requestPayload = {
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      purpose,
      relatedModelId,
      relatedModelName,
      tags: tags || [],
      expiresIn,
    };

    const requestResp = await apiFetch<FileUploadRequestResponse>(requestUrl, {
      method: "POST",
      data: requestPayload,
    });

    const { signedUrl } = requestResp.data;

    if (!signedUrl) {
      throw new Error("No signed URL received from the API");
    }

    // Step 2: Upload file directly to S3 using the signed URL
    const uploadResp = await apiFetch(signedUrl, {
      method: "PUT",
      data: file,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        Accept: undefined,
      },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            onProgress(percentCompleted);
          }
        : undefined,
      maxBodyLength: Infinity,
      timeout: 300000, // 5 minute timeout for large files
    });

    // Step 3:Mark file status to completed
    const res = await apiFetch<FileMetadata>("/files/upload/complete", {
      method: "GET",
      params: {
        id: requestResp.data.id,
      },
    });

    // Return the file metadata from the request response
    return res.data;
  } catch (error: any) {
    console.error("Upload via signed URL error:", handleApiErrors(error));
    throw error;
  }
};

export const cleanFiles = async (paths: Array<string>) => {
  try {
    const resp = await apiFetch<{ count: number }>("/media/clean", {
      method: "DELETE",
      data: { paths },
    });
    return resp.data;
  } catch (error) {
    console.error("Clean files error", handleApiErrors(error));
    throw error;
  }
};

/**
 * Constructs a URL for streaming media files from the Hive system.
 *
 * @param path - The relative path to the media file in the Hive system.
 * @returns A complete URL string pointing to the media file stream endpoint.
 */
export const getHiveFileUrl = (path: string) => {
  return `${httpClient.defaults.baseURL}/media/files/stream/${path}`;
};
