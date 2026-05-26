// This file is auto-generated from the Intigriti Company API v2.1 OpenAPI spec.
// Source: https://api.intigriti.com/external/company/swagger/v2.1/swagger.json
// Do not edit by hand. Regenerate with `npm run generate-types`.

export interface paths {
    "/v2.1/programs/{programId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get program detail */
        get: operations["Programs_GetProgram"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs/{programId}/import-submission": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** [BETA] Import known issues and historical vulnerability reports through this API endpoint. */
        post: operations["Programs_ImportSubmission"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/company-bonuses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create one or more company submission bonusses */
        post: operations["Submissions_AddCompanyBonus"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/pdf-exports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Export submission as a PDF file */
        post: operations["Submissions_ExportSubmissionPdf"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/csv-exports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Export submission as a CSV file */
        post: operations["Submissions_ExportSubmissionCsv"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/attachment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** [BETA] Add an additional attachment to a submission. */
        post: operations["Submissions_AddAttachment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/company-assets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get company assets */
        get: operations["CompanyAssets_GetCompanyAssets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/company-assets/{assetId}/custom-fields": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get custom fields of a company asset */
        get: operations["CompanyAssets_GetCompanyAssetCustomFields"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/company-assets/{assetId}/required-skills": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the required skills of a company asset */
        get: operations["CompanyAssets_GetCompanyAssetRequiredSkills"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all groups */
        get: operations["Groups_GetAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/groups/{groupId}/submissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all group submissions */
        get: operations["Groups_GetGroupSubmissions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/payouts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all company payouts */
        get: operations["Payouts_GetPayouts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all programs */
        get: operations["Programs_GetAllPrograms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs/{programId}/submissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all program submissions */
        get: operations["Programs_GetProgramSubmissions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs/{programId}/researchers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all researchers of a program */
        get: operations["Programs_GetProgramResearchers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs/{programId}/payouts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all program payouts */
        get: operations["Programs_GetProgramPayouts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs/updates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all program updates (company-wide) */
        get: operations["ProgramUpdates_GetAllUpdates"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs/{programId}/updates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all program updates of a program */
        get: operations["ProgramUpdates_GetByProgramId"];
        put?: never;
        /** Create program update */
        post: operations["ProgramUpdates_Create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs/{programId}/updates/{programUpdateId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update program update */
        put: operations["ProgramUpdates_Update"];
        post?: never;
        /** Delete program update */
        delete: operations["ProgramUpdates_Delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs/{programId}/updates/{programUpdateId}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Publish program update */
        post: operations["ProgramUpdates_Publish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submission-possible-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all possible submission types */
        get: operations["SubmissionPossibleTypes_GetSubmissionTypes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all submissions */
        get: operations["Submissions_GetOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get submission detail */
        get: operations["Submissions_Get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get submission events */
        get: operations["Submissions_GetEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/state": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update submission state */
        put: operations["Submissions_EditState"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/comments/internal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Post internal submission message */
        post: operations["Submissions_PlaceInternalMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/comments/external": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Post external submission message */
        post: operations["Submissions_PlaceExternalMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/internal-reference": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update submission internal reference and internal reference link */
        put: operations["Submissions_EditInternalReference"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/severity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update submission severity */
        put: operations["Submissions_EditSeverity"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/assign/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update submission assignee to self */
        put: operations["Submissions_EditAssignee"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/personal-data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update submission personal data flag */
        put: operations["Submissions_EditPersonalData"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/awaiting-feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update submission awaiting feedback flag */
        put: operations["Submissions_EditAwaitingFeedBack"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/company-bonuses/{payoutId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete company submission bonus */
        delete: operations["Submissions_DeleteCompanyBonus"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/payouts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get submission payouts */
        get: operations["Submissions_GetPayouts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/integrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get submission integrations */
        get: operations["Submissions_GetIntegrations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/possible-groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all possible groups for a submission */
        get: operations["Submissions_GetPossibleGroups"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/group": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update submission group */
        put: operations["Submissions_EditGroup"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/tags/{tag}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remove submission tag */
        delete: operations["Submissions_RemoveSubmissionTag"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create submission tag */
        post: operations["Submissions_AddSubmissionTag"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/domain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update submission domain */
        put: operations["Submissions_EditAsset"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/submissions/{submissionCode}/custom-bounty": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Set a custom bounty */
        post: operations["Submissions_SetCustomBounty"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/iplookup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Check user IP */
        get: operations["User_Get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/programs/{programId}/researchers/{researcherUserName}/access": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Check researcher program access */
        get: operations["User_ResearcherAccess"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/reward-system/reward-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all reward requests */
        get: operations["RewardSystem_GetOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/reward-system/reward-requests/{rewardRequestId}/payout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get payout of a reward request */
        get: operations["RewardSystem_Get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/reward-system/reward-requests/{rewardRequestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete reward request */
        delete: operations["RewardSystem_Delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/reward-system/payout-reward-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create reward request for a payout */
        post: operations["RewardSystem_Create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2.1/reward-system/budget": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the reward bucket budget */
        get: operations["RewardSystem_GetRewardBucket"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ProgramDetailViewModel: {
            /** Format: guid */
            programId: string;
            handle: string | null;
            name: string | null;
            /** Format: guid */
            companyId: string;
            companyHandle: string | null;
            description: string | null;
            options: components["schemas"]["EnumerationViewModel"][] | null;
            state: components["schemas"]["ProgramCompanyStateViewModel"] | null;
            confidentialityLevel: components["schemas"]["EnumerationViewModel"] | null;
            maxConfidentialityLevel: components["schemas"]["EnumerationViewModel"] | null;
            logoUrl: string | null;
            domain: components["schemas"]["DomainViewModel"][] | null;
            inScope: components["schemas"]["AttachmentWrapperViewModelOfString"] | null;
            outOfScope: components["schemas"]["AttachmentWrapperViewModelOfString"] | null;
            faq: components["schemas"]["AttachmentWrapperViewModelOfString"] | null;
            severityAssessment: components["schemas"]["AttachmentWrapperViewModelOfString"] | null;
            rulesOfEngagement: components["schemas"]["AttachmentWrapperViewModelOfRulesOfEngagementViewModel"] | null;
            submissionQuestions: components["schemas"]["SubmissionQuestionViewModel"][] | null;
            bountyTable: components["schemas"]["BountyTableViewModel"][] | null;
            /** Format: int32 */
            attachmentCount: number;
            bugBounty: components["schemas"]["BugBountyViewModel"] | null;
            type: components["schemas"]["EnumerationViewModel"] | null;
            programBudget: components["schemas"]["ProgramBudgetViewModel"] | null;
            tacRequired: boolean;
            tacEmpty: boolean;
            identityCheckedRequired: boolean;
            twoFactorRequired: boolean;
            skipTriage: boolean;
            awardRep: boolean;
            allowResearcherCollaboration: boolean;
            defaultAssignee: components["schemas"]["CompanyUserViewModel"] | null;
            /** Format: int64 */
            createdAt: number;
            /** Format: int64 */
            lastUpdatedAt: number | null;
            webLinks: components["schemas"]["WebLinksViewModel"] | null;
        };
        EnumerationViewModel: {
            /** Format: int32 */
            id?: number;
            value?: string | null;
        };
        ProgramCompanyStateViewModel: {
            status?: components["schemas"]["EnumerationViewModel"] | null;
            lastStatusTriggerId?: components["schemas"]["EnumerationViewModel"] | null;
        };
        DomainViewModel: {
            /** Format: guid */
            id: string;
            /** Format: guid */
            companyAssetId: string;
            type: components["schemas"]["EnumerationViewModel"] | null;
            endpoint: string | null;
            tier: components["schemas"]["EnumerationViewModel"] | null;
            description: string | null;
            requiredSkills: components["schemas"]["SkillViewModel"][] | null;
        };
        SkillViewModel: {
            id: string | null;
            name: string | null;
        };
        AttachmentWrapperViewModelOfString: {
            content?: string | null;
            attachments?: components["schemas"]["AttachmentViewModel"][] | null;
        };
        AttachmentViewModel: {
            url?: string | null;
            /** Format: int32 */
            code?: number;
        };
        AttachmentWrapperViewModelOfRulesOfEngagementViewModel: {
            content?: components["schemas"]["RulesOfEngagementViewModel"] | null;
            attachments?: components["schemas"]["AttachmentViewModel"][] | null;
        };
        RulesOfEngagementViewModel: {
            description?: string | null;
            testingRequirements?: components["schemas"]["TestingRequirementsViewModel"] | null;
            safeHarbour?: boolean;
            /** Format: int64 */
            createdAt?: number;
        };
        TestingRequirementsViewModel: {
            intigritiMe?: boolean;
            /** Format: int32 */
            automatedTooling?: number | null;
            userAgent?: string | null;
            requestHeader?: string | null;
        };
        SubmissionQuestionViewModel: {
            type?: components["schemas"]["EnumerationViewModel"] | null;
            question?: string | null;
            customAnswerOptions?: string[] | null;
        };
        BountyTableViewModel: {
            bountyRows?: components["schemas"]["BountyRowViewModel"][] | null;
            /** Format: int64 */
            createdAt?: number;
        };
        BountyRowViewModel: {
            bountyTier?: components["schemas"]["EnumerationViewModel"] | null;
            bountyRanges?: components["schemas"]["BountyRangeViewModel"][] | null;
        };
        BountyRangeViewModel: {
            minBounty?: components["schemas"]["MoneyViewModel"] | null;
            maxBounty?: components["schemas"]["MoneyViewModel"] | null;
            /** Format: decimal */
            minScore?: number;
            /** Format: decimal */
            maxScore?: number;
            severity?: components["schemas"]["EnumerationViewModel"] | null;
        };
        MoneyViewModel: {
            /** Format: decimal */
            value?: number;
            currency?: string | null;
        };
        BugBountyViewModel: {
            autoSuspendThreshold?: components["schemas"]["MoneyViewModel"] | null;
            leaderboardVisibility?: components["schemas"]["EnumerationViewModel"] | null;
        };
        ProgramBudgetViewModel: {
            budgetLeft?: components["schemas"]["MoneyViewModel"] | null;
            budgetSpent?: components["schemas"]["MoneyViewModel"] | null;
            budgetInValidation?: components["schemas"]["MoneyViewModel"] | null;
            budgetTotal?: components["schemas"]["MoneyViewModel"] | null;
        };
        CompanyUserViewModel: components["schemas"]["UserViewModel"] & {
            email?: string | null;
        };
        UserViewModel: {
            /** Format: guid */
            userId?: string;
            userName?: string | null;
            avatarUrl?: string | null;
            role?: string | null;
        };
        WebLinksViewModel: {
            details?: string | null;
            submissions?: string | null;
        };
        SubmissionCodeViewModel: {
            code?: string | null;
        };
        ImportSubmissionCreateModel: {
            /** Format: int64 */
            createdAt?: number | null;
            title?: string | null;
            /** Format: guid */
            typeId?: string;
            internalReference?: string | null;
            internalReferenceUrl?: string | null;
            endpointVulnerableComponent?: string | null;
            pocDescription?: string | null;
            impact?: string | null;
            recommendedSolution?: string | null;
            ipAddress?: string | null;
            personalData?: boolean;
            /** Format: int32 */
            severityId?: number | null;
            severityVector?: string | null;
            /** Format: int32 */
            statusId?: number;
            /** Format: int32 */
            closeReasonId?: number | null;
            /** Format: guid */
            assetId?: string | null;
            awaitingFeedback?: boolean;
            tags?: string[] | null;
            messages?: components["schemas"]["ImportSubmissionMessageCreateModel"][] | null;
            /** Format: guid */
            groupId?: string | null;
            questionAnswers?: components["schemas"]["ImportSubmissionQuestionCreateModel"][] | null;
        };
        ImportSubmissionMessageCreateModel: {
            content?: string | null;
            external?: boolean;
            /** Format: int64 */
            createdAt?: number | null;
        };
        ImportSubmissionQuestionCreateModel: {
            question?: string | null;
            answer?: string | null;
        };
        SubmissionPayoutIdViewModel: {
            payoutIds?: string[] | null;
        };
        AddCompanyBonusCreateModel: {
            amount?: components["schemas"]["MoneyCreateModel"] | null;
            /** Format: guid */
            researcherId?: string | null;
        };
        MoneyCreateModel: {
            /** Format: decimal */
            value?: number;
            currency?: string | null;
        };
        CompanyAssetViewModel: {
            /** Format: guid */
            id?: string;
            name?: string | null;
            status?: components["schemas"]["EnumerationViewModel"] | null;
            type?: components["schemas"]["EnumerationViewModel"] | null;
        };
        CompanyAssetCustomFieldViewModel: {
            /** Format: guid */
            id: string;
            name: string | null;
            value: string | null;
            status: components["schemas"]["EnumerationViewModel"] | null;
        };
        GroupOverviewViewModel: {
            /** Format: guid */
            id?: string;
            /** Format: guid */
            companyId?: string;
            name?: string | null;
            description?: string | null;
        };
        SubmissionOverviewViewModel: {
            code?: string | null;
            originators?: components["schemas"]["SubmissionOriginatorsViewModel"] | null;
            internalReference?: components["schemas"]["SubmissionInternalReferenceViewModel"] | null;
            title?: string | null;
            severity?: components["schemas"]["SubmissionSeverityViewModel"] | null;
            state?: components["schemas"]["SubmissionOverviewStateViewModel"] | null;
            totalPayout?: components["schemas"]["MoneyViewModel"] | null;
            /** Format: int64 */
            createdAt?: number;
            /** Format: int64 */
            lastUpdatedAt?: number | null;
            awaitingFeedback?: boolean;
            destroyed?: boolean;
            assignee?: components["schemas"]["CompanyUserViewModel"] | null;
            tags?: string[] | null;
            /** Format: guid */
            groupId?: string | null;
            submitter?: components["schemas"]["ResearcherViewModel"] | null;
            /** Format: int32 */
            collaboratorCount?: number;
            webLinks?: components["schemas"]["WebLinksViewModel2"] | null;
        };
        SubmissionOriginatorsViewModel: {
            /** Format: guid */
            programId?: string | null;
            pentestCode?: string | null;
        };
        SubmissionInternalReferenceViewModel: {
            reference?: string | null;
            url?: string | null;
        };
        SubmissionSeverityViewModel: {
            /** Format: int32 */
            id: number;
            vector: string | null;
            value: string | null;
            /** Format: decimal */
            score: number | null;
        };
        SubmissionOverviewStateViewModel: {
            status?: components["schemas"]["EnumerationViewModel"] | null;
            closeReason?: components["schemas"]["EnumerationViewModel"] | null;
        };
        ResearcherViewModel: components["schemas"]["UserViewModel"] & {
            ranking?: components["schemas"]["ResearcherRankingViewModel"] | null;
            identityChecked?: boolean;
        };
        ResearcherRankingViewModel: {
            /** Format: int32 */
            rank?: number;
            /** Format: int32 */
            reputation?: number;
            streak?: components["schemas"]["EnumerationViewModel"] | null;
        };
        WebLinksViewModel2: {
            details?: string | null;
        };
        PayoutViewModel: {
            id?: string | null;
            originators?: components["schemas"]["PayoutOriginatorsViewModel"] | null;
            amount?: components["schemas"]["MoneyViewModel"] | null;
            type?: components["schemas"]["EnumerationViewModel"] | null;
            researcher?: components["schemas"]["ResearcherViewModel"] | null;
            status?: components["schemas"]["EnumerationViewModel"] | null;
            /** Format: int64 */
            createdAt?: number;
            /** Format: int64 */
            paidAt?: number | null;
            /** Format: int64 */
            lastUpdatedAt?: number | null;
        };
        PayoutOriginatorsViewModel: {
            /** Format: guid */
            programId: string | null;
            pentestCode: string | null;
            submissionCode: string | null;
            /** Format: guid */
            rewardRequestId: string | null;
            /** Format: guid */
            retestId: string | null;
        };
        ProgramOverviewViewModel: {
            /** Format: guid */
            id?: string;
            handle?: string | null;
            /** Format: guid */
            companyId?: string;
            companyHandle?: string | null;
            logoUrl?: string | null;
            name?: string | null;
            status?: components["schemas"]["EnumerationViewModel"] | null;
            confidentialityLevel?: components["schemas"]["EnumerationViewModel"] | null;
            webLinks?: components["schemas"]["WebLinksViewModel3"] | null;
            type?: components["schemas"]["EnumerationViewModel"] | null;
        };
        WebLinksViewModel3: {
            details?: string | null;
        };
        ProgramResearcherViewModel: {
            user?: components["schemas"]["UserViewModel"] | null;
            metrics?: components["schemas"]["ProgramResearcherRankingViewModel"] | null;
            /** Format: int64 */
            createdAt?: number;
            status?: components["schemas"]["EnumerationViewModel"] | null;
        };
        ProgramResearcherRankingViewModel: components["schemas"]["ResearcherRankingViewModel"] & {
            /** Format: double */
            validity?: number;
        };
        ProgramUpdateOverviewViewModel: {
            /** Format: guid */
            id?: string;
            originators?: components["schemas"]["ProgramUpdateOriginatorsViewModel"] | null;
            title?: string | null;
            description?: string | null;
            /** Format: int64 */
            createdAt?: number;
            /** Format: int64 */
            publishedAt?: number | null;
        };
        ProgramUpdateOriginatorsViewModel: {
            /** Format: guid */
            programId?: string | null;
        };
        ProgramUpdateIdViewModel: {
            /** Format: guid */
            programId?: string;
            /** Format: guid */
            id?: string;
        };
        ProgramUpdateCreateModel: {
            title?: string | null;
            description?: string | null;
            publish?: boolean;
            notifyResearchers?: boolean;
        };
        ProgramUpdateUpdateModel: {
            title?: string | null;
            description?: string | null;
        };
        PublishProgramUpdateModel: {
            notifyResearchers?: boolean;
        };
        SubmissionPossibleTypeViewModel: {
            /** Format: guid */
            id?: string;
            cwe?: string | null;
            name?: string | null;
            category?: components["schemas"]["SubmissionPossibleTypeCategoryViewModel"] | null;
        };
        SubmissionPossibleTypeCategoryViewModel: {
            /** Format: guid */
            id?: string;
            name?: string | null;
        };
        SubmissionDetailsViewModel: {
            code?: string | null;
            originators?: components["schemas"]["SubmissionOriginatorsViewModel"] | null;
            internalReference?: components["schemas"]["SubmissionInternalReferenceViewModel"] | null;
            title?: string | null;
            report?: components["schemas"]["SubmissionReportViewModel"] | null;
            state?: components["schemas"]["SubmissionDetailsStateViewModel"] | null;
            severity?: components["schemas"]["SubmissionSeverityViewModel"] | null;
            awaitingFeedback?: boolean;
            reward?: components["schemas"]["SubmissionRewardViewModel"] | null;
            /** Format: int64 */
            createdAt?: number;
            destroyed?: components["schemas"]["DestroyedViewModel"] | null;
            assignee?: components["schemas"]["CompanyUserViewModel"] | null;
            tags?: string[] | null;
            /** Format: guid */
            groupId?: string | null;
            submitter?: components["schemas"]["ResearcherViewModel"] | null;
            lastUpdated?: components["schemas"]["SubmissionLastUpdatedViewModel"] | null;
            /** Format: int32 */
            attachmentCount?: number;
            webLinks?: components["schemas"]["WebLinksViewModel4"] | null;
            /** Format: int32 */
            integrationCount?: number;
            customFields?: components["schemas"]["SubmissionCustomFieldViewModel"][] | null;
            aiSummary?: components["schemas"]["AiSummaryViewModel"] | null;
        };
        SubmissionReportViewModel: {
            originalTitle?: string | null;
            type?: components["schemas"]["SubmissionTypeViewModel"] | null;
            questions?: components["schemas"]["SubmissionQuestionViewModel2"][] | null;
            domain?: components["schemas"]["SubmissionDetailsDomainViewModel"] | null;
            endpointVulnerableComponent?: string | null;
            pocDescription?: string | null;
            impact?: string | null;
            personalData?: boolean;
            recommendedSolution?: string | null;
            attachments?: components["schemas"]["AttachmentViewModel"][] | null;
            ip?: string | null;
        };
        SubmissionTypeViewModel: {
            name?: string | null;
            category?: string | null;
            cwe?: string | null;
        };
        SubmissionQuestionViewModel2: {
            question?: string | null;
            type?: components["schemas"]["SubmissionQuestionTypeViewModel"] | null;
            answer?: string | null;
        };
        SubmissionQuestionTypeViewModel: {
            /** Format: int32 */
            id?: number;
            value?: string | null;
        };
        SubmissionDetailsDomainViewModel: {
            /** Format: guid */
            companyAssetId: string | null;
            name: string | null;
            motivation: string | null;
            type: components["schemas"]["EnumerationViewModel"] | null;
            tier: components["schemas"]["EnumerationViewModel"] | null;
            description: string | null;
        };
        SubmissionDetailsStateViewModel: components["schemas"]["SubmissionStateViewModel"] & {
            /** Format: int64 */
            validatedAt?: number | null;
            /** Format: int64 */
            acceptedAt?: number | null;
            /** Format: int64 */
            closedAt?: number | null;
            /** Format: int64 */
            archivedAt?: number | null;
        };
        SubmissionStateViewModel: {
            status?: components["schemas"]["EnumerationViewModel"] | null;
            closeReason?: components["schemas"]["EnumerationViewModel"] | null;
            duplicateInfo?: components["schemas"]["SubmissionDuplicateInfoViewModel"] | null;
        };
        SubmissionDuplicateInfoViewModel: {
            parentSubmissionCode?: string | null;
            childSubmissionCodes?: string[] | null;
        };
        SubmissionRewardViewModel: {
            totalPayout?: components["schemas"]["MoneyViewModel"] | null;
            totalBountyPayout?: components["schemas"]["MoneyViewModel"] | null;
            totalBonusPayout?: components["schemas"]["MoneyViewModel"] | null;
            possibleBounty?: components["schemas"]["MoneyViewModel"] | null;
            totalRetestBountyPayout?: components["schemas"]["MoneyViewModel"] | null;
        };
        DestroyedViewModel: {
            destroyedBy?: components["schemas"]["CompanyUserViewModel"] | null;
            /** Format: int64 */
            destroyedAt?: number;
        };
        SubmissionLastUpdatedViewModel: {
            lastUpdater?: components["schemas"]["UserViewModel"] | null;
            /** Format: int64 */
            lastUpdatedAt?: number;
        };
        WebLinksViewModel4: {
            details?: string | null;
        };
        SubmissionCustomFieldViewModel: {
            key?: string | null;
            value?: string | null;
            type?: components["schemas"]["SubmissionCustomFieldTypeViewModel"] | null;
        };
        SubmissionCustomFieldTypeViewModel: {
            /** Format: int32 */
            id?: number;
            value?: string | null;
        };
        AiSummaryViewModel: {
            status: components["schemas"]["EnumerationViewModel"];
            summary: string;
            /** Format: int64 */
            generatedAt: number | null;
        };
        SubmissionEventViewModel: {
            type?: components["schemas"]["EnumerationViewModel"] | null;
            /** Format: int64 */
            createdAt?: number;
            visibility?: components["schemas"]["EnumerationViewModel"] | null;
            user?: components["schemas"]["UserViewModel"] | null;
        };
        SubmissionPossibleStatusTriggersViewModel: {
            statusTriggers?: number[] | null;
        };
        EditStateCreateModel: {
            /** Format: int32 */
            statusTrigger?: number;
            /** Format: int32 */
            closeReason?: number | null;
            duplicateSubmission?: string | null;
        };
        SubmissionMessageIdViewModel: {
            /** Format: guid */
            messageId?: string;
        };
        PlaceInternalMessageCreateModel: {
            message?: string | null;
        };
        PlaceExternalMessageCreateModel: {
            message?: string | null;
        };
        UpdateSubmissionInternalReferenceModel: {
            reference?: string | null;
            url?: string | null;
        };
        UpdateSubmissionSeverityModel: {
            /** Format: int32 */
            id?: number | null;
            vector?: string | null;
        };
        UpdateSubmissionPersonalDataFlagModel: {
            personalData: boolean;
        };
        UpdateSubmissionAwaitingFeedbackFlagModel: {
            awaitingFeedback: boolean;
        };
        SubmissionIntegrationViewModel: {
            /** Format: guid */
            integrationId?: string;
            /** Format: uri */
            url?: string | null;
            /** Format: int64 */
            createdAt?: number;
            /** Format: int64 */
            deletedAt?: number;
            type?: components["schemas"]["EnumerationViewModel"] | null;
            name?: string | null;
            reference?: string | null;
        };
        SubmissionPossibleGroupViewModel: {
            /** Format: guid */
            id?: string;
            name?: string | null;
        };
        UpdateSubmissionGroupUpdateModel: {
            /** Format: guid */
            groupId: string | null;
        };
        AddSubmissionTagCreateModel: {
            tag?: string | null;
        };
        UpdateSubmissionDomainUpdateModel: {
            /** Format: guid */
            domainId?: string | null;
            motivation?: string | null;
        };
        SetCustomBountyCreateModel: {
            message: string | null;
            customBounty: components["schemas"]["MoneyCreateModel2"];
        };
        MoneyCreateModel2: {
            /** Format: decimal */
            value?: number;
            currency?: string | null;
        };
        IpLookupViewModel: {
            exists?: boolean;
        };
        ResearcherAccessViewModel: {
            canCreateSubmission?: boolean;
            canViewProgramDetail?: boolean;
            canViewProgramPreview?: boolean;
            canViewProgramList?: boolean;
            canViewProgramTac?: boolean;
        };
        PaginationWrapperViewModelOfRewardRequestOverviewViewModel: {
            /** Format: int32 */
            count?: number;
            /** Format: int32 */
            maxCount?: number;
            records?: components["schemas"]["RewardRequestOverviewViewModel"][] | null;
        };
        RewardRequestOverviewViewModel: {
            /** Format: guid */
            id?: string;
            title?: string | null;
            internalReference?: string | null;
            recipientEmail?: string | null;
            status?: components["schemas"]["EnumerationViewModel"] | null;
            isDeletable?: boolean;
            reward?: components["schemas"]["RewardViewModel"] | null;
            createdBy?: components["schemas"]["RewardSystemUserViewModel"] | null;
            /** Format: int64 */
            createdAt?: number;
            claimedBy?: components["schemas"]["ResearcherViewModel"] | null;
            /** Format: int64 */
            claimedAt?: number | null;
            /** Format: int64 */
            lastUpdatedAt?: number;
        };
        RewardViewModel: {
            payout?: components["schemas"]["PayoutRewardViewModel"] | null;
        };
        PayoutRewardViewModel: {
            payoutId?: string | null;
            amount?: components["schemas"]["MoneyViewModel"] | null;
            severity?: components["schemas"]["EnumerationViewModel"] | null;
        };
        RewardSystemUserViewModel: components["schemas"]["UserViewModel"] & {
            email?: string | null;
        };
        ErrorModel: {
            /** Format: guid */
            identifier?: string;
            title?: string | null;
            /** Format: int32 */
            status?: number;
            code?: string | null;
            extraParameters?: {
                [key: string]: string[];
            } | null;
        };
        CreatePayoutRewardRequestIdViewModel: {
            /** Format: guid */
            rewardRequestId?: string;
        };
        PayoutRewardRequestCreateModel: {
            title?: string | null;
            internalReference?: string | null;
            recipientEmail?: string | null;
            /** Format: int32 */
            severity?: number | null;
            amount?: components["schemas"]["MoneyCreateModel2"] | null;
        };
        RewardBucketViewModel: {
            budgetLeft: components["schemas"]["MoneyViewModel"] | null;
            budgetInValidation: components["schemas"]["MoneyViewModel"] | null;
            budgetSpent: components["schemas"]["MoneyViewModel"] | null;
            budgetTotal: components["schemas"]["MoneyViewModel"] | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    Programs_GetProgram: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns a full representation of the given program. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProgramDetailViewModel"];
                };
            };
        };
    };
    Programs_ImportSubmission: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ImportSubmissionCreateModel"];
            };
        };
        responses: {
            /** @description The submission code for the imported submission. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionCodeViewModel"];
                };
            };
        };
    };
    Submissions_AddCompanyBonus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddCompanyBonusCreateModel"];
            };
        };
        responses: {
            /** @description One or more company bonusses are added to the provided submission. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionPayoutIdViewModel"];
                };
            };
        };
    };
    Submissions_ExportSubmissionPdf: {
        parameters: {
            query?: {
                timeZone?: string | null;
            };
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns the exported submission as a PDF file. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    Submissions_ExportSubmissionCsv: {
        parameters: {
            query?: {
                timeZone?: string | null;
            };
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns the exported submission as a CSV file. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    Submissions_AddAttachment: {
        parameters: {
            query?: {
                attachmentCode?: number | null;
            };
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description The file to upload
                     */
                    file: string;
                };
            };
        };
        responses: {
            /** @description Information of the added attachment to the provided submission. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttachmentViewModel"];
                };
            };
        };
    };
    CompanyAssets_GetCompanyAssets: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns assets of the company. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanyAssetViewModel"][];
                };
            };
        };
    };
    CompanyAssets_GetCompanyAssetCustomFields: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                assetId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns the custom fields of a given company asset. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanyAssetCustomFieldViewModel"][];
                };
            };
        };
    };
    CompanyAssets_GetCompanyAssetRequiredSkills: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                assetId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Get the required skills of a company asset */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SkillViewModel"][];
                };
            };
        };
    };
    Groups_GetAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all groups of the company. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GroupOverviewViewModel"][];
                };
            };
        };
    };
    Groups_GetGroupSubmissions: {
        parameters: {
            query?: {
                /** @description Return records that were updated as of the given date time in unix timestamp format. */
                UpdatedSince?: number | null;
            };
            header?: never;
            path: {
                groupId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all submissions of the given group. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionOverviewViewModel"][];
                };
            };
        };
    };
    Payouts_GetPayouts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all payouts of the company. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutViewModel"][];
                };
            };
        };
    };
    Programs_GetAllPrograms: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Returns all your programs that are visible on the intigriti platform.
             *
             *     The scope of programs is determined by the Bearer Token provided in the request.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProgramOverviewViewModel"][];
                };
            };
        };
    };
    Programs_GetProgramSubmissions: {
        parameters: {
            query?: {
                /** @description Return records that were updated as of the given date time in unix timestamp format. */
                UpdatedSince?: number | null;
            };
            header?: never;
            path: {
                programId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all submissions of the given program. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionOverviewViewModel"][];
                };
            };
        };
    };
    Programs_GetProgramResearchers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all linked researchers of the given program. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProgramResearcherViewModel"][];
                };
            };
        };
    };
    Programs_GetProgramPayouts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all payouts of a given program. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutViewModel"][];
                };
            };
        };
    };
    ProgramUpdates_GetAllUpdates: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all program updates of your company. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProgramUpdateOverviewViewModel"][];
                };
            };
        };
    };
    ProgramUpdates_GetByProgramId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all program updates of the given program. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProgramUpdateOverviewViewModel"][];
                };
            };
        };
    };
    ProgramUpdates_Create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProgramUpdateCreateModel"];
            };
        };
        responses: {
            /**
             * @description Creates a draft update or publishes an update on the given program.
             *
             *     When publishing an update, a researcher notification can be triggered (optionally).
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProgramUpdateIdViewModel"];
                };
            };
        };
    };
    ProgramUpdates_Update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
                programUpdateId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProgramUpdateUpdateModel"];
            };
        };
        responses: {
            /** @description The existing (draft) update on the given program is updated. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProgramUpdateIdViewModel"];
                };
            };
        };
    };
    ProgramUpdates_Delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
                programUpdateId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The existing update on the given program is deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProgramUpdates_Publish: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
                programUpdateId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PublishProgramUpdateModel"];
            };
        };
        responses: {
            /** @description The existing update on the given program is published. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProgramUpdateIdViewModel"];
                };
            };
        };
    };
    SubmissionPossibleTypes_GetSubmissionTypes: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all possible submission types. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionPossibleTypeViewModel"][];
                };
            };
        };
    };
    Submissions_GetOverview: {
        parameters: {
            query?: {
                /** @description Return records that were updated as of the given date time in unix timestamp format. */
                UpdatedSince?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all submissions of the company. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionOverviewViewModel"][];
                };
            };
        };
    };
    Submissions_Get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns a full representation of the given submission. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionDetailsViewModel"];
                };
            };
        };
    };
    Submissions_GetEvents: {
        parameters: {
            query?: {
                /** @description Return records that were created as of the given date time in unix timestamp format. */
                CreatedSince?: number | null;
            };
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all events of the given submission. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionEventViewModel"][];
                };
            };
        };
    };
    Submissions_EditState: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditStateCreateModel"];
            };
        };
        responses: {
            /** @description The state of the provided submission is updated. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionPossibleStatusTriggersViewModel"];
                };
            };
        };
    };
    Submissions_PlaceInternalMessage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PlaceInternalMessageCreateModel"];
            };
        };
        responses: {
            /** @description The internal message is added to the provided submission. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionMessageIdViewModel"];
                };
            };
        };
    };
    Submissions_PlaceExternalMessage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PlaceExternalMessageCreateModel"];
            };
        };
        responses: {
            /** @description The external message is added to the provided submission. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionMessageIdViewModel"];
                };
            };
        };
    };
    Submissions_EditInternalReference: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSubmissionInternalReferenceModel"];
            };
        };
        responses: {
            /** @description The internal reference and/or internal reference link is updated on the provided submission. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_EditSeverity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSubmissionSeverityModel"];
            };
        };
        responses: {
            /** @description The severity is updated on the provided submission. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_EditAssignee: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The provided submission is assigned to yourself. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_EditPersonalData: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSubmissionPersonalDataFlagModel"];
            };
        };
        responses: {
            /** @description The personal data flag is updated on the provided submission. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_EditAwaitingFeedBack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSubmissionAwaitingFeedbackFlagModel"];
            };
        };
        responses: {
            /** @description The awaiting feedback flag is updated on the provided submission. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_DeleteCompanyBonus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
                payoutId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The company bonus is deleted from the provided submission. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_GetPayouts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all payouts of the given submission. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutViewModel"][];
                };
            };
        };
    };
    Submissions_GetIntegrations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all integrations of the given submission. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionIntegrationViewModel"][];
                };
            };
        };
    };
    Submissions_GetPossibleGroups: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all possible groups for the given submission. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubmissionPossibleGroupViewModel"][];
                };
            };
        };
    };
    Submissions_EditGroup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSubmissionGroupUpdateModel"];
            };
        };
        responses: {
            /** @description The submission's group is updated. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_RemoveSubmissionTag: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
                tag: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The tag is removed from the provided submission. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_AddSubmissionTag: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddSubmissionTagCreateModel"];
            };
        };
        responses: {
            /** @description The tag is added to the provided submission. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_EditAsset: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSubmissionDomainUpdateModel"];
            };
        };
        responses: {
            /** @description The domain is updated on the provided submission. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Submissions_SetCustomBounty: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                submissionCode: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetCustomBountyCreateModel"];
            };
        };
        responses: {
            /** @description A custom bounty has been set on the provided submission. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    User_Get: {
        parameters: {
            query?: {
                ipAddress?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns whether the IP address is in use by an Intigriti user or not. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IpLookupViewModel"];
                };
            };
        };
    };
    User_ResearcherAccess: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                programId: string;
                researcherUserName: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns a list of program views and whether the researchers can access them or not. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResearcherAccessViewModel"];
                };
            };
        };
    };
    RewardSystem_GetOverview: {
        parameters: {
            query?: {
                /** @description Maximum amount of records that are retrieved. */
                Limit?: number | null;
                /** @description Amount of records to be skipped when retrieving. */
                Offset?: number | null;
                /** @description Return records that were created as of the given date time in unix timestamp format. */
                CreatedSince?: number | null;
                /** @description Return records that were updated as of the given date time in unix timestamp format. */
                UpdatedSince?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all reward requests of the company. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginationWrapperViewModelOfRewardRequestOverviewViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    RewardSystem_Get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                rewardRequestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns the payout of the given reward request. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    RewardSystem_Delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                rewardRequestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The reward request is deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    RewardSystem_Create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PayoutRewardRequestCreateModel"];
            };
        };
        responses: {
            /** @description The reward request is created. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreatePayoutRewardRequestIdViewModel"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    RewardSystem_GetRewardBucket: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns the reward bucket budget of the company. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RewardBucketViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
}
