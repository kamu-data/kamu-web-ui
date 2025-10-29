/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export default class RoutingResolvers {
    public static readonly DATASET_INFO_KEY = "datasetInfoData";
    public static readonly METADATA_BLOCK_KEY = "blockData";
    public static readonly ADD_POLLING_SOURCE_KEY = "pollingSourceData";
    public static readonly SET_TRANSFORM_KEY = "setTransformData";
    public static readonly ADD_PUSH_SOURCE_KEY = "addPushSourceData";
    public static readonly SEARCH_KEY = "searchData";
    public static readonly ACCOUNT_DATASETS_KEY = "accountDatasetsData";
    public static readonly ACCOUNT_ACTIVE_TAB_KEY = "accountActiveTabData";
    public static readonly FLOW_DETAILS_KEY = "flowDetailsData";
    public static readonly FLOW_DETAILS_ACTIVE_TAB_KEY = "flowDetailsActiveTabData";
    public static readonly FLOW_DETAILS_LOGS_KEY = "flowDetailsLogsData";
    public static readonly FLOW_DETAILS_SUMMARY_KEY = "flowDetailsSummaryData";
    public static readonly FLOW_DETAILS_HISTORY_KEY = "flowDetailsHistoryData";
    public static readonly ACCOUNT_SETTINGS_ACTIVE_TAB_KEY = "accountSettingsActiveTabData";
    public static readonly ACCOUNT_SETTINGS_EMAIL_KEY = "accountSettingsEmailData";
    public static readonly ACCOUNT_SETTINGS_ACCOUNT_KEY = "accountSettingsAccountData";
    public static readonly ACCOUNT_SETTINGS_ACCESS_TOKENS_KEY = "accountSettingsAccessTokensData";
    public static readonly ACCOUNT_SETTINGS_PASSWORD_AND_AUTHENTICATION_KEY =
        "accountSettingsPasswordAndAuthenticationData";

    public static readonly DATASET_VIEW_ACTIVE_TAB_KEY = "datasetViewActiveTabData";
    public static readonly DATASET_VIEW_KEY = "datasetViewData";
    public static readonly DATASET_VIEW_OVERVIEW_KEY = "datasetViewOverviewData";
    public static readonly DATASET_VIEW_DATA_KEY = "datasetViewDataData";
    public static readonly DATASET_VIEW_METADATA_KEY = "datasetViewMetadataData";
    public static readonly DATASET_VIEW_HISTORY_KEY = "datasetViewHistoryData";
    public static readonly DATASET_VIEW_LINEAGE_KEY = "datasetViewLineageData";
    public static readonly DATASET_VIEW_FLOWS_KEY = "datasetViewFlowsData";
    public static readonly DATASET_VIEW_SETTINGS_KEY = "datasetViewSettingsData";
    public static readonly DATASET_VIEW_SETTINGS_ACTIVE_SECTION_KEY = "datasetViewSettingsActiveSectionData";

    public static readonly DATASET_SETTINGS_GENERAL_KEY = "datasetSettingsGeneralData";
    public static readonly DATASET_SETTINGS_SCHEDULING_KEY = "datasetSettingsSchedulingData";
    public static readonly DATASET_SETTINGS_INGEST_CONFIGURATION_KEY = "datasetSettingsIngestConfigurationData";
    public static readonly DATASET_SETTINGS_TRANSFORM_KEY = "datasetSettingsTransformData";
    public static readonly DATASET_SETTINGS_ACCESS_KEY = "datasetSettingsAccessData";
    public static readonly DATASET_SETTINGS_COMPACTION_KEY = "datasetSettingsCompactionData";
    public static readonly DATASET_SETTINGS_VARIABLES_AND_SECRETS_KEY = "datasetSettingsVariablesSecretsData";
    public static readonly DATASET_SETTINGS_WEBHOOKS_KEY = "datasetSettingsWebhooksData";

    public static readonly DATASET_METADATA_ACTIVE_TAB_KEY = "datasetMetadataActiveTabData";
    public static readonly METADATA_SCHEMA_TAB_KEY = "metadataSchemaTabData";
    public static readonly METADATA_LICENSE_TAB_KEY = "metadataLicenseTabData";
    public static readonly METADATA_WATERMARK_TAB_KEY = "metadataWatermarkTabData";
    public static readonly METADATA_TRANSFORMATION_TAB_KEY = "metadataTransformationTabData";
    public static readonly METADATA_POLLING_SOURCE_TAB_KEY = "metadataPollingSourceTabData";
    public static readonly METADATA_PUSH_SOURCES_TAB_KEY = "metadataPUshSourcesTabData";

    public static readonly WEBHOOKS_ADD_NEW_KEY = "webhooksAddNewData";
    public static readonly WEBHOOKS_EDIT_KEY = "webhooksEditData";
    public static readonly WEBHOOKS_ROTATE_SECRET = "webhooksRotateSecretData";
}
