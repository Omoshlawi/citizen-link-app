export type HealthFacilityType = {
  id: string;
  name: string;
  description: string;
};

export type HealthFacilityReferral = {
  id: string;
  screeningId: string;
  appointmentTime: string;
  additionalNotes: string;
  healthFacilityId: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type HealthFacility = {
  id: string;
  kmflCode: string;
  name: string;
  county: string;
  subcounty: string;
  ward?: string;
  owner?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string;
  coordinates?: Coordinates;
  typeId: string;
  type: HealthFacilityType;
  referrals: HealthFacilityReferral[];
  createdAt: string;
  updatedAt: string;
};
