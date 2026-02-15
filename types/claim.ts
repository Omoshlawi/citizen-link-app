import { claimFormSchema } from "@/lib/schemas";
import { User } from "better-auth";
import { z } from "zod";
import { PickupStation } from "./address";

export enum ClaimStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  DISPUTED = "DISPUTED",
  CANCELLED = "CANCELLED",
}

export interface ClaimAttachment {
  id: string;
  claimId: string;
  storageKey: string;
  uploadedById: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  userId: string;
  user?: User;
  foundDocumentCaseId: string;
  attachments: ClaimAttachment[];
  matchId: string;
  status: ClaimStatus;
  pickupStationId?: string;
  pickupStation?: PickupStation;
  preferredHandoverDate?: string;
  verification: ClaimVerification;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimVerification {
  id: string;
  claimId: string;
  userResponses: ClaimUserResponse[];
  passed: boolean;
  createdAt: string;
}

export interface ClaimUserResponse {
  question: string;
  response: string;
}

export type ClaimFormData = z.infer<typeof claimFormSchema>;
