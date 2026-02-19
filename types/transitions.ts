export interface TransitionReason {
  id: string;
  code: string;
  entityType: string;
  fromStatus: string;
  toStatus: string;
  auto: boolean;
  label: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}
