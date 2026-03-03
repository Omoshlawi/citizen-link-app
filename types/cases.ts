import {
  caseDocumentSchema,
  caseFilterSchema,
  documentCaseExtractionSchema,
  foundDocumentCaseSchema,
  lostDocumentCaseSchema,
} from "@/lib/schemas";
import { z } from "zod";
import { Address } from "./address";

export interface DocumentCase {
  id: string;
  caseNumber: string;
  userId: string;
  addressId: string;
  address?: Address;
  eventDate: string;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  lostDocumentCase?: LostDocumentCase;
  foundDocumentCase?: FoundDocumentCase;
  document?: Document;
}

export enum LostDocumentCaseStatus {
  DRAFT = "DRAFT", // When the document is in draft status
  SUBMITTED = "SUBMITTED", // When user submit lost document info
  COMPLETED = "COMPLETED", // When the document is reunited with the owner
}

export enum FoundDocumentCaseStatus {
  DRAFT = "DRAFT", // When the document is in draft status
  SUBMITTED = "SUBMITTED", // When the document is submitted by the user to pickup station/point
  VERIFIED = "VERIFIED", // When the document is verified by the admin
  REJECTED = "REJECTED", // When the document is rejected by the admin
  COMPLETED = "COMPLETED", // When the document is reunited with the owner
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}

export interface LostDocumentCase {
  id: string;
  caseId: string;
  case?: DocumentCase;
  status: LostDocumentCaseStatus;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}
export interface FoundDocumentCase {
  id: string;
  caseId: string;
  case?: DocumentCase;
  status: FoundDocumentCaseStatus;
  createdAt: string;
  updatedAt: string;
  pointAwarded: number;
  voided: boolean;
}

export interface DocumentField {
  id: string;
  documentId: string;
  document?: Document;
  fieldName: string;
  fieldValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddressComponent {
  type: string;
  value: string;
}

export interface VisionExtractionOutput {

}

export interface TextExtractionOutput {

}

export interface Document {
  id: string;
  caseId: string;
  case?: DocumentCase;
  serialNumber?: string;
  documentNumber?: string;
  batchNumber?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  gender?: "Male" | "Female" | "Unknown";
  nationality?: string;
  bloodGroup?: string;
  placeOfIssue?: string;
  note?: string;
  issuer: string;
  fullName: string;
  surname: string;
  givenNames: string[];
  typeId: string;
  reportId: string;
  issuanceDate: string;
  expiryDate: string;
  createdAt: string;
  voided: boolean;
  type: Type;
  images: DocumentImage[];
  additionalFields?: DocumentField[];
  addressRaw?: string;
  addressCountry?: string;
  addressComponents?: AddressComponent[];
  photoPresent?: boolean;
  fingerprintPresent?: boolean;
  signaturePresent?: boolean;
  isExpired?: boolean;
}

export interface DocumentImage {
  id: string;
  url: string;
  blurredUrl?: string;
  documentId: string;
}

export interface Type {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  replacementInstructions: string;
  averageReplacementCost: number;
  requiredVerification: string;
  voided: boolean;
}

export interface AiInteraction {
  id: string;
  userId: string;
  interactionType: string;
  aiModel: string;
  modelVersion: string;
  entityType: string;
  entityId?: string;
  prompt: string;
  response: string;
  tokenUsage: TokenUsage;
  processingTime?: string;
  estimatedCost?: string;
  success: boolean;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
}

export interface TokenUsage {
  totalTokenCount: number;
  promptTokenCount: number;
  candidatesTokenCount: number;
}

export interface AsyncError {
  message: string;
  error?: any;
}

export interface AsyncState<
  TData = any,
  TError extends AsyncError = AsyncError,
> {
  isLoading: boolean;
  error?: TError;
  data?: TData;
}
export interface ExtractionAiProgressEvent {
  key: "VISION_EXTRACTION" | "TEXT_EXTRACTION";
  state: AsyncState<AiInteraction>;
}

export type ExtractionProgressEvent =
  | ExtractionValidationEvent
  | ExtractionAiProgressEvent;
export type ExtractionStep = ExtractionProgressEvent["key"];

export interface ExtractionValidationEvent {
  key: "IMAGE_VALIDATION" | "DOCUMENT_TYPE_VALIDATION";
  state: AsyncState<string>;
}

export interface Extraction {
  id: string;
}

export interface AdditionalField {
  fieldName: string;
  fieldValue: string;
}

export interface DocumentType {
  id: string;
  category:
    | "IDENTITY"
    | "ACADEMIC"
    | "PROFESSIONAL"
    | "VEHICLE"
    | "FINANCIAL"
    | "MEDICAL"
    | "LEGAL"
    | "OTHER"; // A
  name: string;
  loyaltyPoints: number;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  replacementInstructions: string;
  averageReplacementCost: number;
  requiredVerification: "LOW" | "STANDARD" | "HIGH" | "INSTITUTIONAL";
  voided: boolean;
}

export type CaseType = "LOST" | "FOUND";

export type FoundDocumentCaseFormData = z.infer<typeof foundDocumentCaseSchema>;
export type DocumentCaseExtractionFormData = z.infer<
  typeof documentCaseExtractionSchema
>;

export type LostDocumentCaseFormData = z.infer<typeof lostDocumentCaseSchema>;
export type CaseDocumentFormData = z.infer<typeof caseDocumentSchema>;
export type CaseDocumentFormDataWithoutImages = Omit<CaseDocumentFormData, "images">;
export type CaseFilterFormData = z.infer<typeof caseFilterSchema>;
