import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "better-auth";
import { Organization } from "better-auth/plugins/organization";

export type APIFetchInit = Omit<AxiosRequestConfig, "url">;
export type APIFetchResponse<T = any, K = any> = AxiosResponse<T, K>;
export type APIFetchError<T = any, K = any> = AxiosError<T, K>;

export interface PaginationControls {
  next: string | null;
  prev: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export interface APIListResponse<T> extends PaginationControls {
  results: T[];
}

export interface FileUploadPayload {
  [fieldName: string]: File[];
}

export interface FileUploadRequestResponse {
  id: string;
  signedUrl: string;
  expiresAt: string;
  mimeType: string;
  fileName: string;
  originalName: string;
  storageUrl: string;
}

export interface FileBlob {
  id: string;
  hash: string;
  size: string;
  filename: string;
  mimeType: string;
  remoteId: string;
  storagePath: string;
  storageUrl?: string | undefined;
  rereferences?: FileMetadata | undefined;
  /** JSON as string */
  metadata?: string | undefined;
}

export interface FileMetadata {
  id: string;
  /** Reference to physical file */
  blobId: string;
  blob?: FileBlob | undefined;
  /** User-specific information */
  originalName: string;
  /** Context and relationships */
  relatedModelId: string;
  relatedModelName: string;
  purpose: string;
  /** Ownership */
  uploadedById: string;
  organizationId?: string | undefined;
  /** User-specific metadata */
  metadata?: string | undefined;
  tags: string[];
  description?: string | undefined;
  /** Cached user/org data */
  uploadedBy?: User | undefined;
  organization?: Organization | undefined;
  /** Lifecycle */
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string | undefined;
  expiresAt?: string | undefined;
  voided: boolean;
}
