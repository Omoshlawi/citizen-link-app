import z from "zod";

export const apiPaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});
export const apiSortQuerySchema = z.object({
  orderBy: z.string().optional(),
});
export const apiRepresentationQuerySchema = z.object({
  v: z.string().optional(),
});

export const apiListQuerySchema = apiPaginationQuerySchema
  .extend(apiSortQuerySchema.shape)
  .extend(apiRepresentationQuerySchema.shape);
