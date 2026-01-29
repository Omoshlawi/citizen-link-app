import {
  completeReferralSchema,
  referralSchema,
  screenClientSchema,
} from "@/constants/schemas";
import z from "zod";
import { Client } from "./client";
import { Coordinates, HealthFacility } from "./facilities";

export type Screening = {
  id: string;
  clientId: string;
  lifeTimePatners: number;
  firstIntercourseAge: number;
  everDiagnosedWithHIV: "YES" | "NO" | "NOT_SURE";
  everDiagnosedWithHPV: "YES" | "NO" | "NOT_SURE";
  everDiagnosedWithSTI: "YES" | "NO" | "NOT_SURE";
  totalBirths: number;
  everScreenedForCervicalCancer: "YES" | "NO" | "NOT_SURE";
  usedOralContraceptivesForMoreThan5Years: "YES" | "NO" | "NOT_SURE";
  smoking: "CURRENTLY" | "NEVER" | "PAST";
  familyMemberDiagnosedWithCervicalCancer: "YES" | "NO" | "NOT_SURE";
  createdAt: string;
  updatedAt: string;
  client?: Client;
  scoringResult?: ScoringResult;
  coordinates?: Coordinates;
};

export type ScreenClientFormData = z.infer<typeof screenClientSchema>;
export type ReferralFormData = z.infer<typeof referralSchema>;
export type CompleteReferralFormData = z.infer<typeof completeReferralSchema>;
export enum RiskFactor {
  AGE = "AGE",
  EARLY_SEXUAL_DEBUT = "EARLY_SEXUAL_DEBUT",
  MULTIPLE_PARTNERS = "MULTIPLE_PARTNERS",
  SEXUALLY_TRANSMITTED_INFECTION = "SEXUALLY_TRANSMITTED_INFECTION",
  PARITY = "PARITY",
  NEVER_SCREENED = "NEVER_SCREENED",
  ORAL_CONTRACEPTIVES = "ORAL_CONTRACEPTIVES",
  SMOKING = "SMOKING",
  FAMILY_HISTORY = "FAMILY_HISTORY",
}

export enum RiskInterpretation {
  LOW_RISK = "LOW_RISK",
  MEDIUM_RISK = "MEDIUM_RISK",
  HIGH_RISK = "HIGH_RISK",
}

export interface RiskFactorScore {
  factor: RiskFactor;
  score: number;
  reason: string;
}

export interface ScoringResult {
  clientAge: number | null;
  breakdown: RiskFactorScore[];
  aggregateScore: number;
  interpretation: RiskInterpretation;
  shouldAutoScreen: boolean;
}

export enum ReferralStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Referral {
  id: string;
  clientId: string;
  screeningId: string;
  appointmentTime: string;
  healthFacilityId: string;
  additionalNotes: string;
  createdAt: string;
  updatedAt: string;
  screening?: Screening;
  healthFacility?: HealthFacility;
  status: ReferralStatus;
  testResult?: CompleteReferralFormData["testResult"];
  finalDiagnosis?: string;
}
