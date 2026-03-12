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

export interface StatusTransition {
  id: string;
  entityId: string;
  entityType: string;
  fromStatus: string;
  toStatus: string;
  reasonId: string;
  comment: string;
  changedById: string;
  createdAt: string;
}
