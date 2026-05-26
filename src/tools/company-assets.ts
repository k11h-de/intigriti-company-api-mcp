import type { ToolDef, AnyToolDef } from "./types.js";
import { READ_ONLY_ANNOTATIONS } from "./types.js";
import {
  CompanyAssetsListInputSchema,
  CompanyAssetsGetCustomFieldsInputSchema,
  CompanyAssetsGetRequiredSkillsInputSchema,
  type CompanyAssetsListInput,
  type CompanyAssetsGetCustomFieldsInput,
  type CompanyAssetsGetRequiredSkillsInput,
} from "../schemas/company-assets.js";

const companyAssetsList: ToolDef<CompanyAssetsListInput> = {
  name: "intigriti_company_assets_list",
  description:
    "List all company assets available in the Intigriti platform. Returns the full catalogue of assets that can be scoped to programs.",
  inputSchema: CompanyAssetsListInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (_input, client) =>
    client.request({ method: "GET", path: "/v2.1/company-assets" }),
};

const companyAssetsGetCustomFields: ToolDef<CompanyAssetsGetCustomFieldsInput> =
  {
    name: "intigriti_company_assets_get_custom_fields",
    description:
      "Retrieve the custom fields defined for a specific company asset. Custom fields extend the default asset schema with company-specific metadata.",
    inputSchema: CompanyAssetsGetCustomFieldsInputSchema,
    annotations: READ_ONLY_ANNOTATIONS,
    handler: (input, client) =>
      client.request({
        method: "GET",
        path: "/v2.1/company-assets/{assetId}/custom-fields",
        pathParams: { assetId: input.assetId },
      }),
  };

const companyAssetsGetRequiredSkills: ToolDef<CompanyAssetsGetRequiredSkillsInput> =
  {
    name: "intigriti_company_assets_get_required_skills",
    description:
      "Retrieve the required skills associated with a specific company asset. Useful for understanding what expertise researchers need to test this asset.",
    inputSchema: CompanyAssetsGetRequiredSkillsInputSchema,
    annotations: READ_ONLY_ANNOTATIONS,
    handler: (input, client) =>
      client.request({
        method: "GET",
        path: "/v2.1/company-assets/{assetId}/required-skills",
        pathParams: { assetId: input.assetId },
      }),
  };

export const companyAssetsTools: AnyToolDef[] = [
  companyAssetsList,
  companyAssetsGetCustomFields,
  companyAssetsGetRequiredSkills,
];
