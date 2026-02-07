export interface Match {
  id: string;
  matchNumber: number;
  aiInteractionId: string;
  lostDocumentCaseId: string;
  foundDocumentCaseId: string;
  matchScore: number;
  aiAnalysis: AiAnalysis;
  status: MatchStatus;
  createdAt: string;
  updatedAt: string;
  notifiedAt?: string;
  viewedAt?: string;
  voided: boolean;
}

export interface AiAnalysis {
  overallScore: number;
  confidence: MatchConfidence;
  recommendation: string;
  reasoning: string;
  fieldAnalysis: FieldAnalysi[];
  matchingFields: string[];
  conflictingFields: string[];
  redFlags: string[];
  confidenceFactors: ConfidenceFactors;
}

export interface FieldAnalysi {
  fieldName: string;
  match: boolean;
  confidence: number;
  note: string;
}

export interface ConfidenceFactors {
  strengths: string[];
  weaknesses: string[];
}

export enum MatchStatus {
  PENDING = "PENDING", // Match found, awaiting user action
  REJECTED = "REJECTED", // User rejected match
  CLAIMED = "CLAIMED", // User claimed this match
  EXPIRED = "EXPIRED", // Match expired without action
}

export enum MatchConfidence {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  NO_MATCH = "NO_MATCH",
}
