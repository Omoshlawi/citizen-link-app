import { User } from "better-auth";

export type Activity = {
  id: string;
  userId: string;
  user: User;
  action: string; // e.g., "create", "update", "delete", "view"
  resource: string; // e.g., "screening", "client", "referral"
  resourceId?: string | null; // ID of the affected resource
  metadata?: Record<string, any> | null; // Additional data about the activity
  description?: string | null; // Human-readable description of the activity
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
};
