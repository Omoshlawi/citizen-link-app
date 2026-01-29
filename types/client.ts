import { clientSchema } from "@/constants/schemas";
import z from "zod";
import { Screening } from "./screening";

export type ClientFormData = z.infer<typeof clientSchema>;

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  county: string;
  subcounty: string;
  ward: string;
  nationalId: string;
  maritalStatus: ClientFormData["maritalStatus"];
  level?: "low" | "medium" | "high";
  screenings?: Pick<Screening, "id" | "createdAt" | "scoringResult">[];
}
