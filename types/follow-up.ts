import {
  cancelFollowUpSchema,
  followUpSchema,
  outreachActionSchema,
  updateFollowUpSchema,
} from "@/constants/schemas";
import z from "zod";
import { Client } from "./client";
import { Referral, Screening } from "./screening";

export interface FollowUp {
  id: string;
  clientId: string;
  referralId: string;
  category: FollowUpFormData["category"];
  priority: FollowUpFormData["priority"];
  startDate: string;
  dueDate: string;
  providerId: string;
  triggerScreeningId: string;
  completedAt?: string;
  outcomeNotes?: string;
  resolvingScreeningId?: string;
  resolvingScreening?: Screening;
  cancelReason: CancelFollowUpFormData["cancelReason"];
  cancelNotes?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
  outreachActions?: OutreachAction[];
  triggerScreening: Screening;
  referral?: Referral;
  client?: Client;
}
export interface OutreachAction {
  id: string;
  followUpId: string;
  actionType: OutreachActionFormData["actionType"];
  actionDate: string;
  outcome: OutreachActionFormData["outcome"];
  location?: string;
  duration?: number;
  notes?: string;
  barriers?: string;
  nextPlannedDate?: string;
  verifiedAtFacility: boolean;
  hospitalRegisterPhoto: string;
  createdAt: string;
}

export type FollowUpFormData = z.infer<typeof followUpSchema>;
export type OutreachActionFormData = z.infer<typeof outreachActionSchema>;
export type UpdateFollowUpFormData = z.infer<typeof updateFollowUpSchema>;
export type CancelFollowUpFormData = z.infer<typeof cancelFollowUpSchema>;
