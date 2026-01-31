import { z } from "zod";
import { apiListQuerySchema } from "./api";
import { PHONE_NUMBER_REGEX } from "./constants";

const optionalString = z
  .string()
  .trim()
  .max(255, "Too long")
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined);

const optionalNullableString = z
  .string()
  .trim()
  .max(255, "Too long")
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

// Local Authentication Constants
export const PIN_LENGTH = 4;
export const PIN_MIN_LENGTH = 4;

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});
export const emailSignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export const phoneNumberSignInSchema = z.object({
  phoneNumber: z.string().min(3),
  password: z.string().min(8),
});
export const usernameSignInSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const registerSchema = z
  .object({
    email: z.email(),
    username: z.string().optional(),
    phoneNumber: z.string().regex(PHONE_NUMBER_REGEX).optional(),
    name: z.string().nonempty(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8),
    currentPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const levelKeys = ["level1", "level2", "level3", "level4", "level5"] as const;

export const addressSchema = z.object({
  type: z.enum(["HOME", "WORK", "BILLING", "SHIPPING", "OFFICE", "OTHER"]),
  label: optionalNullableString,
  address1: z.string().trim().min(1, "Address line 1 is required").max(255),
  address2: optionalNullableString,
  landmark: optionalNullableString,
  level1: z.string().trim().min(1, "Level 1 is required").max(255),
  level2: optionalNullableString,
  level3: optionalNullableString,
  level4: optionalNullableString,
  level5: optionalNullableString,
  cityVillage: optionalNullableString,
  stateProvince: optionalNullableString,
  country: z
    .string()
    .trim()
    .length(2, "Use ISO 3166-1 alpha-2 code")
    .transform((value) => value.toUpperCase()),
  postalCode: optionalNullableString,
  latitude: z.coerce
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),
  longitude: z.coerce
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .nullable()
    .optional(),
  plusCode: optionalNullableString,
  startDate: z.iso.date(),
  endDate: z.iso.date().optional(),
  preferred: z.boolean().default(false),
  formatted: optionalNullableString,
  localeFormat: z
    .object(
      levelKeys.reduce(
        (shape, key) => ({
          ...shape,
          [key]: optionalNullableString,
        }),
        {} as Record<(typeof levelKeys)[number], typeof optionalNullableString>
      )
    )
    .partial()
    .optional(),
});

export const documentImageItemSchema = z.object({
  url: z.string(),
  imageType: z.enum(["FRONT", "BACK", "FULL"]).optional(),
});

export const documentImageSchema = z.object({
  images: documentImageItemSchema.array(),
});

export const caseDocumentFieldSchema = z.object({
  documentId: z.string().uuid(),
  fieldName: z.string().min(1, "Required"),
  fieldValue: z.string().min(1, "Required"), // All values stored as strings and converted as needed
});

export const caseDocumentSchema = z.object({
  serialNumber: z.string().optional(), // Secondary identifier like serial number if present
  documentNumber: z.string().optional(), // Generic document number (ID number, passport number, etc.)
  batchNumber: z.string().optional(), // Batch number if available
  issuer: z.string().optional(),
  ownerName: z.string().min(1, "Owner name required"),
  dateOfBirth: z.coerce.date().optional(), // Owner's date of birth
  placeOfBirth: z.string().optional(), // Owner's place of birth
  placeOfIssue: z.string().optional(),
  gender: z.enum(["Male", "Female", "Unknown"]).optional(), // Owner's gender
  nationality: z.string().optional(),
  note: z.string().optional(), // Additional notes, could be also any identifying marks on document as well, any instruction,e.t.c
  typeId: z.string().min(1, "Type required"),
  issuanceDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  images: documentImageItemSchema.array().optional(),
  additionalFields: caseDocumentFieldSchema
    .omit({ documentId: true })
    .array()
    .optional(),
});

export const documentFieldSchema = z.object({
  documentId: z.string().uuid(),
  fieldName: z.string().min(1, "Required"),
  fieldValue: z.string().min(1, "Required"),
});

export const documentCaseSchema = z.object({
  documentId: z.string().min(1),
  addressId: z.string().min(1),
  description: z.string().optional(),
  eventDate: z.coerce.date(),
  tags: z.string().min(1).array().optional(),
  status: z.enum([
    "ACTIVE",
    "MATCHED",
    "RETURNED",
    "EXPIRED",
    "CLAIMED",
    "PENDING_VERIFICATION",
    "ARCHIVED",
  ]),
});

export const foundDocumentCaseSchema = z.object({
  addressId: z.string().uuid(),
  eventDate: z.coerce.date(),
  tags: z.string().min(1).array().optional(),
  description: z.string().optional(),
});

export const lostDocumentCaseSchema = foundDocumentCaseSchema
  .merge(caseDocumentSchema)
  .omit({
    images: true,
  });

export const caseFilterSchema = apiListQuerySchema.extend({
  search: z.string().optional(),
  documentType: z.uuid().optional(),
  caseType: z.enum(["FOUND", "LOST"]).optional(),
  ownerName: z.string().optional(),
  eventDateFrom: z.iso.date().optional(),
  eventDateTo: z.iso.date().optional(),
  dateReportedFrom: z.iso.date().optional(),
  dateReportedTo: z.iso.date().optional(),
  tags: z.string().array().optional(),
  documentIssuer: z.string().optional(),
  documentNumber: z.string().optional(),
  docuemtExpiryDateFrom: z.iso.date().optional(),
  docuemtExpiryDateTo: z.iso.date().optional(),
  docuemtIssueDateFrom: z.iso.date().optional(),
  docuemtIssueDateTo: z.iso.date().optional(),
  includeVoided: z
    .stringbool({
      truthy: ["true", "1"],
      falsy: ["false", "0"],
    })
    .optional(),
  includeForOtherUsers: z // TODO:  validate only for admin users else throw forbidden error
    .stringbool({
      truthy: ["true", "1"],
      falsy: ["false", "0"],
    })
    .optional(),
});
