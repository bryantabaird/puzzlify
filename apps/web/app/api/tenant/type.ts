import z from "zod";

export const tenantSchema = z.object({
  id: z.string().uuid(),
  tenantName: z.string(),
  dateCreated: z.string().datetime(),
});

export type Tenant = z.infer<typeof tenantSchema>;

export const tenantIdRequiredSchema = tenantSchema.pick({ id: true });

export type TenantIdRequired = z.infer<typeof tenantIdRequiredSchema>;
