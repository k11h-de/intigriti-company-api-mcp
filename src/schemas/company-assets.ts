import { z } from "zod";

export const CompanyAssetsListInputSchema = z.object({}).strict();
export type CompanyAssetsListInput = z.infer<typeof CompanyAssetsListInputSchema>;

export const CompanyAssetsGetCustomFieldsInputSchema = z.object({
  assetId: z.string().min(1).describe("Asset identifier"),
}).strict();
export type CompanyAssetsGetCustomFieldsInput = z.infer<
  typeof CompanyAssetsGetCustomFieldsInputSchema
>;

export const CompanyAssetsGetRequiredSkillsInputSchema = z.object({
  assetId: z.string().min(1).describe("Asset identifier"),
}).strict();
export type CompanyAssetsGetRequiredSkillsInput = z.infer<
  typeof CompanyAssetsGetRequiredSkillsInputSchema
>;
