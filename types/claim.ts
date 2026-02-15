import { claimFormSchema } from "@/lib/schemas";
import { User } from "better-auth";
import { z } from "zod";
import { PickupStation } from "./address";

export enum ClaimVerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  FAILED = "FAILED",
}

export interface Claim {
  id: string;
  claimNumber: string;
  userId: string;
  user?: User;
  foundDocumentCaseId: string;
  matchId: string;
  verificationStatus: ClaimVerificationStatus;
  pickupStationId?: string;
  pickupStation?: PickupStation;
  preferredHandoverDate?: string;
}

export type ClaimFormData = z.infer<typeof claimFormSchema>;
