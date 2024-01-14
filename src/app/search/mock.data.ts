import {
    AccountBasicsFragment,
    CommitEventToDatasetMutation,
    CreateDatasetFromSnapshotMutation,
    CreateEmptyDatasetMutation,
    DatasetPermissionsFragment,
    DeleteDatasetMutation,
    GetDatasetLineageQuery,
    PageBasedInfo,
    RenameDatasetMutation,
    UpdateReadmeMutation,
} from "../api/kamu.graphql.interface";
import {
    DataBatchFormat,
    DataQueryResultErrorKind,
    DataSchemaFormat,
    DatasetBasicsFragment,
    DatasetCurrentInfoFragment,
    DatasetKind,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryQuery,
    GetDatasetMainDataQuery,
    LicenseFragment,
    SearchDatasetsOverviewQuery,
} from "../api/kamu.graphql.interface";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { DatasetInfo } from "../interface/navigation.interface";
import { DatasetAutocompleteItem, DatasetSearchResult, TypeNames } from "../interface/search.interface";
import {
    FetchKind,
    ReadKind,
    MergeKind,
    AddPollingSourceEditFormType,
    PrepareKind,
    PreprocessStepValue,
} from "../dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { DatasetHistoryUpdate } from "../dataset-view/dataset.subscriptions.interface";
import {
    LineageGraphDatasetNodeObject,
    LineageGraphNodeKind,
    LineageNodeAccess,
} from "../dataset-view/additional-components/lineage-component/lineage-model";
import { GraphQLError } from "graphql";
import { TEST_AVATAR_URL } from "../api/mock/auth.mock";
import { AddPushSourceEditFormType } from "../dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";

export const mockPageBasedInfo: PageBasedInfo = {
    currentPage: 1,
    hasNextPage: true,
    hasPreviousPage: true,
    totalPages: 7,
};

export const mockDatasetInfo: DatasetInfo = {
    accountName: "kamu",
    datasetName: "test name",
};

export const mockOwnerFields: AccountBasicsFragment = {
    id: "1",
    accountName: "kamu",
};

export const mockOwnerFieldsWithAvatar: AccountBasicsFragment & { avatarUrl?: string } = {
    id: "1",
    accountName: "kamu",
    avatarUrl: TEST_AVATAR_URL,
};

export const mockAutocompleteItems: DatasetAutocompleteItem[] = [
    {
        dataset: {
            id: "id1",
            kind: DatasetKind.Root,
            name: "mockName1",
            owner: mockOwnerFields,
            alias: mockOwnerFields.accountName + "/mockName1",
        },
        dummy: false,
        __typename: TypeNames.datasetType,
    },

    {
        dataset: {
            id: "id2",
            kind: DatasetKind.Derivative,
            name: "mockName2",
            owner: mockOwnerFields,
            alias: mockOwnerFields.accountName + "/mockName2",
        },
        dummy: false,
        __typename: TypeNames.allDataType,
    },
];

export const mockMetadataCurrentInfo: DatasetCurrentInfoFragment = {
    __typename: "SetInfo",
    description: "Confirmed positive cases of COVID-19 in Alberta.",
    keywords: [
        "Healthcare",
        "Epidemiology",
        "COVID-19",
        "SARS-CoV-2",
        "Disaggregated",
        "Anonymized",
        "Alberta",
        "Canada",
    ],
};

const mockMetadataCurrentLicense: LicenseFragment = {
    __typename: "SetLicense",
    shortName: "OGL-Canada-2.0",
    name: "Open Government Licence - Canada",
    spdxId: "OGL-Canada-2.0",
    websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
};

export const mockDatasetSearchResult: DatasetSearchResult = {
    datasets: [
        {
            __typename: "Dataset",
            id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
            kind: DatasetKind.Root,
            name: "alberta.case-details",
            owner: {
                __typename: "Account",
                ...mockOwnerFields,
            },
            alias: mockOwnerFields.accountName + "/alberta.case-details",
            createdAt: "2022-08-05T21:17:30.613911358+00:00",
            lastUpdatedAt: "2022-08-05T21:19:28.817281255+00:00",
            metadata: {
                currentInfo: mockMetadataCurrentInfo,
                currentLicense: mockMetadataCurrentLicense,
                currentDownstreamDependencies: [],
            },
        },
    ],
    totalCount: 1,
    pageInfo: {
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    },
    currentPage: 1,
};

export const mockSearchDatasetOverviewQuery: SearchDatasetsOverviewQuery = {
    __typename: "Query",
    search: {
        __typename: "Search",
        query: {
            __typename: "SearchResultConnection",
            totalCount: 1,
            nodes: [
                {
                    __typename: "Dataset",
                    ...mockDatasetSearchResult.datasets[0],
                },
            ],
            pageInfo: {
                currentPage: 1,
                hasNextPage: true,
                hasPreviousPage: false,
            },
        },
    },
};

export const mockDatasetBasicsRootFragment: DatasetBasicsFragment = {
    id: "id",
    kind: DatasetKind.Root,
    name: "mockNameRoot",
    owner: { __typename: "Account", ...mockOwnerFields },
    alias: mockOwnerFields.accountName + "/mockNameRoot",
};

export const mockDatasetBasicsDerivedFragment: DatasetBasicsFragment = {
    id: "id",
    kind: DatasetKind.Derivative,
    name: "mockNameDerived",
    owner: { __typename: "Account", ...mockOwnerFieldsWithAvatar },
    alias: mockOwnerFields.accountName + "/mockNameDerived",
};

export const mockFullPowerDatasetPermissionsFragment: DatasetPermissionsFragment = {
    permissions: {
        canView: true,
        canDelete: true,
        canRename: true,
        canCommit: true,
    },
};

export const mockReadonlyDatasetPermissionsFragment: DatasetPermissionsFragment = {
    permissions: {
        canView: true,
        canDelete: false,
        canRename: false,
        canCommit: false,
    },
};

export const mockDatasetResponseNotFound: GetDatasetMainDataQuery = {
    datasets: {
        __typename: "Datasets",
    },
};

export const mockDatasetMainDataId = "did:odf:z4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP";

export const mockDatasetMainDataResponse: GetDatasetMainDataQuery = {
    datasets: {
        __typename: "Datasets",
        byOwnerAndName: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
            kind: DatasetKind.Root,
            name: "alberta.case-details",
            owner: {
                __typename: "Account",
                id: "12345",
                accountName: "kamu",
            },
            alias: "kamu/alberta.case-details",
            metadata: {
                __typename: "DatasetMetadata",
                currentPollingSource: {
                    __typename: "SetPollingSource",
                    fetch: {
                        __typename: "FetchStepUrl",
                        url: "https://s3.us-west-2.amazonaws.com/datasets.kamu.dev/demo/covid/covid-19-alberta-statistics-data.csv",
                        eventTime: null,
                        headers: null,
                        cache: null,
                    },
                    read: {
                        __typename: "ReadStepCsv",
                        schema: [
                            "id BIGINT",
                            "date_reported TIMESTAMP",
                            "zone STRING",
                            "gender STRING",
                            "age_group STRING",
                            "case_status STRING",
                            "case_type STRING",
                        ],
                        separator: null,
                        encoding: null,
                        quote: null,
                        escape: null,
                        header: true,
                        inferSchema: null,
                        nullValue: null,
                        dateFormat: null,
                        timestampFormat: null,
                    },
                    merge: {
                        __typename: "MergeStrategyLedger",
                        primaryKey: ["id"],
                    },
                    prepare: null,
                    preprocess: {
                        __typename: "TransformSql",
                        engine: "datafusion",
                        version: null,
                        queries: [
                            {
                                __typename: "SqlQueryStep",
                                query: "select * from input",
                                alias: null,
                            },
                        ],
                        temporalTables: null,
                    },
                },
                currentTransform: null,
                currentPushSources: [],
                currentInfo: {
                    __typename: "SetInfo",
                    description: "Confirmed positive cases of COVID-19 in Alberta.",
                    keywords: [
                        "Healthcare",
                        "Epidemiology",
                        "COVID-19",
                        "SARS-CoV-2",
                        "Disaggregated",
                        "Anonymized",
                        "Alberta",
                        "Canada",
                    ],
                },
                currentLicense: {
                    __typename: "SetLicense",
                    shortName: "OGL-Canada-2.0",
                    name: "Open Government Licence - Canada",
                    spdxId: "OGL-Canada-2.0",
                    websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                },
                currentWatermark: "2022-08-01T00:00:00+00:00",
                currentSchema: {
                    __typename: "DataSchema",
                    format: DataSchemaFormat.ParquetJson,
                    content:
                        '{"name": "arrow_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "REQUIRED", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "date_reported", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "zone", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "gender", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "age_group", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "case_status", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "case_type", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}]}',
                },
                currentVocab: {
                    __typename: "SetVocab",
                    systemTimeColumn: null,
                    eventTimeColumn: "date_reported",
                    offsetColumn: null,
                    operationTypeColumn: null,
                },
                currentReadme:
                    "# Confirmed positive cases of COVID-19 in Alberta\n\nThis dataset compiles daily snapshots of publicly reported data on 2019 Novel Coronavirus (COVID-19) testing in Alberta.\n\nData includes:\n- approximation of onset date\n- age group\n- patient gender\n- case acquisition information\n- patient outcome\n- reporting Public Health Unit (PHU)\n- postal code, website, longitude, and latitude of PHU\n\nThis dataset is subject to change. Please review the daily epidemiologic summaries for information on variables, methodology, and technical considerations.\n\n**Related dataset(s)**:\n- [Daily aggregate count of confirmed positive cases of COVID-19 in Alberta](#todo)\n",
                chain: {
                    __typename: "MetadataChain",
                    blocks: {
                        __typename: "MetadataBlockConnection",
                        nodes: [
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash: "zW1aBqdzZkZAYb6t6omkjWNP2ULPj4qyXPWyt7i1kbYLWpF",
                                prevBlockHash: "zW1arvtcx4kTYFLi3iqNybLMxFwJj8Cf3XEMc4ByGPGRkWU",
                                systemTime: "2023-09-03T01:09:31.587025138+00:00",
                                sequenceNumber: 6,
                                author: {
                                    __typename: "Account",
                                    id: "12345",
                                    accountName: "kamu",
                                    avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                },
                                event: {
                                    __typename: "AddData",
                                    addDataWatermark: "2022-08-01T00:00:00+00:00",
                                    prevCheckpoint: null,
                                    newData: {
                                        __typename: "DataSlice",
                                        offsetInterval: {
                                            __typename: "OffsetInterval",
                                            start: 0,
                                            end: 596125,
                                        },
                                        logicalHash: "z63ZND5B5QeYpE5oKPS9Pg5zU97oCr4W4Q6ngjww8zVp4NyUquvR",
                                        physicalHash: "zW1bSq3dDJvAfuHJbVzH3TLKuWWCvXBdNqMrNNeRXuYj8WJ",
                                        size: 6585116,
                                    },
                                    newCheckpoint: null,
                                },
                            },
                        ],
                        totalCount: 7,
                        pageInfo: {
                            __typename: "PageBasedInfo",
                            hasNextPage: true,
                            hasPreviousPage: false,
                            currentPage: 0,
                            totalPages: 7,
                        },
                    },
                },
            },
            data: {
                __typename: "DatasetData",
                tail: {
                    __typename: "DataQueryResultSuccess",
                    schema: {
                        __typename: "DataSchema",
                        format: DataSchemaFormat.ParquetJson,
                        content:
                            "message arrow_schema {\n  REQUIRED INT64 offset;\n  REQUIRED INT64 system_time (TIMESTAMP(NANOS,false));\n  OPTIONAL INT64 date_reported (TIMESTAMP(NANOS,false));\n  OPTIONAL INT64 id;\n  OPTIONAL BYTE_ARRAY zone (STRING);\n  OPTIONAL BYTE_ARRAY gender (STRING);\n  OPTIONAL BYTE_ARRAY age_group (STRING);\n  OPTIONAL BYTE_ARRAY case_status (STRING);\n  OPTIONAL BYTE_ARRAY case_type (STRING);\n}\n",
                    },
                    data: {
                        __typename: "DataBatch",
                        format: DataBatchFormat.Json,
                        content:
                            '[{"age_group":"50-59 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":595254,"offset":596125,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"30-39 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":377821,"offset":596124,"system_time":"2023-09-03T01:09:31.587","zone":"North Zone"},{"age_group":"60-69 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":595723,"offset":596123,"system_time":"2023-09-03T01:09:31.587","zone":"South Zone"},{"age_group":"30-39 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":457371,"offset":596122,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"20-29 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":457368,"offset":596121,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"60-69 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":351389,"offset":596120,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":298274,"offset":596119,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"30-39 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":324898,"offset":596118,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"70-79 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":484338,"offset":596117,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"30-39 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":351387,"offset":596116,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"20-29 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":594747,"offset":596115,"system_time":"2023-09-03T01:09:31.587","zone":"South Zone"},{"age_group":"60-69 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":484350,"offset":596114,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"30-39 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":595630,"offset":596113,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":404155,"offset":596112,"system_time":"2023-09-03T01:09:31.587","zone":"North Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":43652,"offset":596111,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"20-29 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":484345,"offset":596110,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"50-59 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":404145,"offset":596109,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"30-39 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":377841,"offset":596108,"system_time":"2023-09-03T01:09:31.587","zone":"South Zone"},{"age_group":"30-39 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":594417,"offset":596107,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"40-49 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":484348,"offset":596106,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":377837,"offset":596105,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"50-59 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":351373,"offset":596104,"system_time":"2023-09-03T01:09:31.587","zone":"North Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":484353,"offset":596103,"system_time":"2023-09-03T01:09:31.587","zone":"North Zone"},{"age_group":"70-79 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":298285,"offset":596102,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"20-29 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":484347,"offset":596101,"system_time":"2023-09-03T01:09:31.587","zone":"North Zone"},{"age_group":"70-79 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":457357,"offset":596100,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"50-59 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":430616,"offset":596099,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"60-69 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":351386,"offset":596098,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":430612,"offset":596097,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"50-59 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":377844,"offset":596096,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":377823,"offset":596095,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"70-79 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":430615,"offset":596094,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"Under 1 year","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":324896,"offset":596093,"system_time":"2023-09-03T01:09:31.587","zone":"North Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":484337,"offset":596092,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"40-49 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":324879,"offset":596091,"system_time":"2023-09-03T01:09:31.587","zone":"North Zone"},{"age_group":"20-29 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":351384,"offset":596090,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"60-69 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":377827,"offset":596089,"system_time":"2023-09-03T01:09:31.587","zone":"North Zone"},{"age_group":"20-29 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":404157,"offset":596088,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"50-59 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":43659,"offset":596087,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"40-49 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":298278,"offset":596086,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"1-4 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":457353,"offset":596085,"system_time":"2023-09-03T01:09:31.587","zone":"Central Zone"},{"age_group":"70-79 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":595849,"offset":596084,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"50-59 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":351385,"offset":596083,"system_time":"2023-09-03T01:09:31.587","zone":"Edmonton Zone"},{"age_group":"60-69 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":377833,"offset":596082,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":404154,"offset":596081,"system_time":"2023-09-03T01:09:31.587","zone":"North Zone"},{"age_group":"30-39 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":324888,"offset":596080,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"70-79 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":298279,"offset":596079,"system_time":"2023-09-03T01:09:31.587","zone":"Central Zone"},{"age_group":"80+ years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":43644,"offset":596078,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"10-19 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Male","id":457374,"offset":596077,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"},{"age_group":"50-59 years","case_status":"NA","case_type":"Confirmed","date_reported":"2022-08-01T00:00:00","gender":"Female","id":430619,"offset":596076,"system_time":"2023-09-03T01:09:31.587","zone":"Calgary Zone"}]',
                    },
                },
                numRecordsTotal: 596126,
                estimatedSize: 6585116,
            },
            permissions: {
                __typename: "DatasetPermissions",
                canView: true,
                canDelete: true,
                canRename: true,
                canCommit: true,
            },
            createdAt: "2023-09-03T01:08:55.104604199+00:00",
            lastUpdatedAt: "2023-09-03T01:09:31.587025138+00:00",
        },
    },
};

export const mockDatasetLineageResponse: GetDatasetLineageQuery = {
    datasets: {
        __typename: "Datasets",
        byOwnerAndName: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8rjrvsAsD3E95ThuEwcv5YgA3rNTFK3CYKkM3XzejkTua",
            kind: DatasetKind.Root,
            name: "account.transactions",
            owner: {
                __typename: "Account",
                id: "12345",
                accountName: "kamu",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
            },
            alias: "kamu/account.transactions",
            metadata: {
                __typename: "DatasetMetadata",
                currentUpstreamDependencies: [],
                currentDownstreamDependencies: [
                    {
                        __typename: "Dataset",
                        metadata: {
                            __typename: "DatasetMetadata",
                            currentDownstreamDependencies: [
                                {
                                    __typename: "Dataset",
                                    metadata: {
                                        __typename: "DatasetMetadata",
                                        currentDownstreamDependencies: [
                                            {
                                                __typename: "Dataset",
                                                metadata: {
                                                    __typename: "DatasetMetadata",
                                                    currentDownstreamDependencies: [],
                                                    currentPollingSource: null,
                                                    currentLicense: null,
                                                    currentWatermark: "2023-08-06T18:57:59+00:00",
                                                },
                                                createdAt: "2023-09-05T02:14:17.375838448+00:00",
                                                lastUpdatedAt: "2023-09-07T01:39:02.143781596+00:00",
                                                data: {
                                                    __typename: "DatasetData",
                                                    numRecordsTotal: 31292,
                                                    estimatedSize: 486985,
                                                },
                                                owner: {
                                                    __typename: "Account",
                                                    avatarUrl:
                                                        "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                                    id: "12345",
                                                    accountName: "kamu",
                                                },
                                                id: "did:odf:z4k88e8e4Zxc7gWaPoi1U62QuPqk5TeDJWw9HrwCBdcbvwjL4zy",
                                                kind: DatasetKind.Derivative,
                                                name: "account.tokens.portfolio.market-value",
                                                alias: "account.tokens.portfolio.market-value",
                                            },
                                            {
                                                __typename: "Dataset",
                                                metadata: {
                                                    __typename: "DatasetMetadata",
                                                    currentDownstreamDependencies: [
                                                        {
                                                            __typename: "Dataset",
                                                            metadata: {
                                                                __typename: "DatasetMetadata",
                                                                currentDownstreamDependencies: [],
                                                                currentPollingSource: null,
                                                                currentLicense: null,
                                                                currentWatermark: "2023-08-06T18:57:59+00:00",
                                                            },
                                                            createdAt: "2023-09-05T02:14:17.378963613+00:00",
                                                            lastUpdatedAt: "2023-09-07T01:39:55.364415863+00:00",
                                                            data: {
                                                                __typename: "DatasetData",
                                                                numRecordsTotal: 417,
                                                                estimatedSize: 10136,
                                                            },
                                                            owner: {
                                                                __typename: "Account",
                                                                avatarUrl:
                                                                    "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                                                id: "12345",
                                                                accountName: "kamu",
                                                            },
                                                            id: "did:odf:z4k88e8oTx4k79T3hff88ArDf7pJ1nbxSnackQva5c2dwWPBngW",
                                                            kind: DatasetKind.Derivative,
                                                            name: "account.whatif.reth-vs-snp500.market-value",
                                                            alias: "account.whatif.reth-vs-snp500.market-value",
                                                        },
                                                    ],
                                                    currentPollingSource: null,
                                                    currentLicense: null,
                                                    currentWatermark: "2023-08-06T18:57:59+00:00",
                                                },
                                                createdAt: "2023-09-05T02:14:17.372865885+00:00",
                                                lastUpdatedAt: "2023-09-07T01:39:02.144063797+00:00",
                                                data: {
                                                    __typename: "DatasetData",
                                                    numRecordsTotal: 46,
                                                    estimatedSize: 10032,
                                                },
                                                owner: {
                                                    __typename: "Account",
                                                    avatarUrl:
                                                        "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                                    id: "12345",
                                                    accountName: "kamu",
                                                },
                                                id: "did:odf:z4k88e8gayUCbQ92pUcnSghtZamfoyPHrbMudTw8Fn2SJSdYwSS",
                                                kind: DatasetKind.Derivative,
                                                name: "account.whatif.reth-vs-snp500.portfolio",
                                                alias: "account.whatif.reth-vs-snp500.portfolio",
                                            },
                                        ],
                                        currentPollingSource: null,
                                        currentLicense: null,
                                        currentWatermark: "2023-08-06T18:57:59+00:00",
                                    },
                                    createdAt: "2023-09-05T02:14:17.369209162+00:00",
                                    lastUpdatedAt: "2023-09-07T01:38:15.023678417+00:00",
                                    data: {
                                        __typename: "DatasetData",
                                        numRecordsTotal: 86,
                                        estimatedSize: 12021,
                                    },
                                    owner: {
                                        __typename: "Account",
                                        avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                        id: "12345",
                                        accountName: "kamu",
                                    },
                                    id: "did:odf:z4k88e8jSFz98biMiuj5YftgbMQm6WZ9C48An4bBFH6jdZpBgsf",
                                    kind: DatasetKind.Derivative,
                                    name: "account.tokens.portfolio.usd",
                                    alias: "account.tokens.portfolio.usd",
                                },
                            ],
                            currentPollingSource: null,
                            currentLicense: null,
                            currentWatermark: "2023-08-06T18:57:59+00:00",
                        },
                        createdAt: "2023-09-05T02:14:17.365614388+00:00",
                        lastUpdatedAt: "2023-09-05T02:24:48.840536329+00:00",
                        data: {
                            __typename: "DatasetData",
                            numRecordsTotal: 127,
                            estimatedSize: 14515,
                        },
                        owner: {
                            __typename: "Account",
                            avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                            id: "12345",
                            accountName: "kamu",
                        },
                        id: "did:odf:z4k88e8pkrnwUSr3ZYjfWbwWPPbEmbSW2DJ4qJ6zjRwFkpDKwdy",
                        kind: DatasetKind.Derivative,
                        name: "account.tokens.portfolio",
                        alias: "account.tokens.portfolio",
                    },
                ],
                currentPollingSource: {
                    __typename: "SetPollingSource",
                    fetch: {
                        __typename: "FetchStepUrl",
                        url: "https://api.etherscan.io/api?module=account&action=txlist&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}",
                    },
                },
                currentLicense: null,
                currentWatermark: "2023-08-06T18:57:59+00:00",
            },
            createdAt: "2023-09-03T01:08:55.268034366+00:00",
            lastUpdatedAt: "2023-09-03T01:09:31.576478695+00:00",
            data: {
                __typename: "DatasetData",
                numRecordsTotal: 123,
                estimatedSize: 39817,
            },
        },
    },
};

export const mockDatasetHistoryResponse: GetDatasetHistoryQuery = {
    datasets: {
        __typename: "Datasets",
        byOwnerAndName: {
            __typename: "Dataset",
            metadata: {
                __typename: "DatasetMetadata",
                chain: {
                    __typename: "MetadataChain",
                    blocks: {
                        __typename: "MetadataBlockConnection",
                        totalCount: 7,
                        nodes: [
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
                                prevBlockHash: "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
                                sequenceNumber: 12,
                                systemTime: "2022-08-05T21:19:28.817281255+00:00",
                                author: {
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
                                },
                                event: {
                                    __typename: "AddData",
                                    prevCheckpoint: "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
                                    addDataWatermark: "2022-08-05T21:17:30.613911358+00:00",
                                    newData: {
                                        __typename: "DataSlice",
                                        offsetInterval: {
                                            __typename: "OffsetInterval",
                                            start: 0,
                                            end: 596125,
                                        },
                                        logicalHash: "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
                                        physicalHash: "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
                                        size: 300,
                                    },
                                    newCheckpoint: {
                                        physicalHash: "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
                                        size: 11213,
                                    },
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash: "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
                                prevBlockHash: "zW1mdEmQaQFQZj6cz9yopVisYEPtbEGyv5ofGjmW8VmAiBA",
                                sequenceNumber: 12,
                                systemTime: "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
                                },
                                event: {
                                    __typename: "SetLicense",
                                    shortName: "OGL-Canada-2.0",
                                    name: "Open Government Licence - Canada",
                                    spdxId: "OGL-Canada-2.0",
                                    websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash: "zW1mdEmQaQFQZj6cz9yopVisYEPtbEGyv5ofGjmW8VmAiBA",
                                prevBlockHash: "zW1k7Mc19BhaEDPmuPrQcSLWJkRaCd9MB7X4SeGvqKzFi3d",
                                sequenceNumber: 12,
                                systemTime: "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
                                },
                                event: {
                                    __typename: "SetAttachments",
                                    attachments: {
                                        __typename: "AttachmentsEmbedded",
                                        items: [
                                            {
                                                __typename: "AttachmentEmbedded",
                                                path: "README.md",
                                                content:
                                                    "# Confirmed positive cases of COVID-19 in Quebec\n\nThis dataset compiles daily snapshots of publicly reported data on 2019 Novel Coronavirus (COVID-19) testing in Quebec.\n\nData includes:\n- approximation of onset date\n- age group\n- patient gender\n- case acquisition information\n- patient outcome\n- reporting Public Health Unit (PHU)\n- postal code, website, longitude, and latitude of PHU\n\nThis dataset is subject to change. Please review the daily epidemiologic summaries for information on variables, methodology, and technical considerations.\n\n**Related dataset(s)**:\n- [Daily aggregate count of confirmed positive cases of COVID-19 in Quebec](#todo)\n",
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash: "zW1k7Mc19BhaEDPmuPrQcSLWJkRaCd9MB7X4SeGvqKzFi3d",
                                prevBlockHash: "zW1jzqJxDwLStfBA8jj5oxAd51otwte3xNtZSBkMVtBAbyc",
                                systemTime: "2022-08-05T21:17:30.613911358+00:00",
                                sequenceNumber: 12,
                                author: {
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
                                },
                                event: {
                                    __typename: "SetInfo",
                                    description: "Confirmed positive cases of COVID-19 in Ontario.",
                                    keywords: [
                                        "Healthcare",
                                        "Epidemiology",
                                        "COVID-19",
                                        "SARS-CoV-2",
                                        "Disaggregated",
                                        "Anonymized",
                                        "Ontario",
                                        "Canada",
                                    ],
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash: "zW1jzqJxDwLStfBA8jj5oxAd51otwte3xNtZSBkMVtBAbyc",
                                prevBlockHash: "zW1eG5uSWyHACt6TuK8dSJUkQ39SCWfKzNARBSMpFbvZKvL",
                                sequenceNumber: 12,
                                systemTime: "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
                                },
                                event: {
                                    __typename: "SetVocab",
                                    systemTimeColumn: null,
                                    eventTimeColumn: "case_reported_date",
                                    offsetColumn: null,
                                    operationTypeColumn: null,
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash: "zW1eG5uSWyHACt6TuK8dSJUkQ39SCWfKzNARBSMpFbvZKvL",
                                prevBlockHash: "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX",
                                sequenceNumber: 12,
                                systemTime: "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
                                },
                                event: {
                                    __typename: "SetInfo",
                                    description: "Confirmed positive cases of COVID-19 in Ontario.",
                                    keywords: [
                                        "Healthcare",
                                        "Epidemiology",
                                        "COVID-19",
                                        "SARS-CoV-2",
                                        "Disaggregated",
                                        "Anonymized",
                                        "Ontario",
                                        "Canada",
                                    ],
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash: "zW1nqifmGW3NoCZXWyzPgrtmnGoC7wctsr93V9npsdTKbT4",
                                prevBlockHash: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
                                systemTime: "2023-06-02T08:44:54.984731027+00:00",
                                sequenceNumber: 1,
                                author: {
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
                                },
                                event: {
                                    __typename: "AddPushSource",
                                    sourceName: "mockSourceName",
                                    read: {
                                        __typename: "ReadStepCsv",
                                        schema: null,
                                        separator: ",",
                                        encoding: "UTF-8",
                                        quote: '"',
                                        escape: "\\",
                                        header: null,
                                        inferSchema: null,
                                        nullValue: null,
                                        dateFormat: "yyyy-MM-dd",
                                        timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
                                    },
                                    merge: {
                                        __typename: "MergeStrategyAppend",
                                    },
                                    preprocess: null,
                                },
                            },

                            {
                                __typename: "MetadataBlockExtended",
                                blockHash: "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX",
                                prevBlockHash: null,
                                systemTime: "2022-08-05T21:17:30.613911358+00:00",
                                sequenceNumber: 12,
                                author: {
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
                                },
                                event: {
                                    __typename: "Seed",
                                    datasetId: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                                    datasetKind: DatasetKind.Root,
                                },
                            },
                        ],
                        pageInfo: {
                            __typename: "PageBasedInfo",
                            hasNextPage: false,
                            hasPreviousPage: false,
                            currentPage: 0,
                            totalPages: 1,
                        },
                    },
                },
            },
            id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
            kind: DatasetKind.Root,
            name: "alberta.case-details",
            owner: {
                __typename: "Account",
                ...mockOwnerFields,
            },
            alias: mockOwnerFields.accountName + "/alberta.case-details",
        },
    },
};

export const mockDatasetDataSqlRunResponse: GetDatasetDataSqlRunQuery = {
    data: {
        __typename: "DataQueries",
        query: {
            __typename: "DataQueryResultSuccess",
            schema: {
                __typename: "DataSchema",
                format: DataSchemaFormat.ParquetJson,
                content:
                    '{"name": "arrow_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP(NANOS,false)"}, {"name": "date_reported", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP(NANOS,false)"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "zone", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "gender", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "age_group", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "case_status", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "case_type", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}]}',
            },
            data: {
                __typename: "DataBatch",
                format: DataBatchFormat.Json,
                content:
                    '[{"offset":0,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-05 00:00:00","id":505748,"zone":"Calgary Zone","gender":"Female","age_group":"50-59 years","case_status":"NA","case_type":"Probable"},{"offset":1,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-07 00:00:00","id":594071,"zone":"Calgary Zone","gender":"Female","age_group":"30-39 years","case_status":"NA","case_type":"Probable"},{"offset":2,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-08 00:00:00","id":505749,"zone":"Calgary Zone","gender":"Male","age_group":"30-39 years","case_status":"NA","case_type":"Probable"},{"offset":3,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-09 00:00:00","id":562273,"zone":"Edmonton Zone","gender":"Male","age_group":"60-69 years","case_status":"NA","case_type":"Confirmed"},{"offset":4,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-09 00:00:00","id":564560,"zone":"Edmonton Zone","gender":"Male","age_group":"40-49 years","case_status":"NA","case_type":"Confirmed"},{"offset":5,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-09 00:00:00","id":542824,"zone":"Edmonton Zone","gender":"Female","age_group":"70-79 years","case_status":"NA","case_type":"Confirmed"},{"offset":6,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-09 00:00:00","id":592371,"zone":"Calgary Zone","gender":"Female","age_group":"50-59 years","case_status":"NA","case_type":"Confirmed"},{"offset":7,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-10 00:00:00","id":518086,"zone":"Edmonton Zone","gender":"Female","age_group":"60-69 years","case_status":"NA","case_type":"Confirmed"},{"offset":8,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-10 00:00:00","id":578137,"zone":"Calgary Zone","gender":"Female","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":9,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-10 00:00:00","id":549230,"zone":"Calgary Zone","gender":"Male","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":10,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-10 00:00:00","id":588685,"zone":"Edmonton Zone","gender":"Male","age_group":"70-79 years","case_status":"NA","case_type":"Confirmed"},{"offset":11,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-10 00:00:00","id":547940,"zone":"Calgary Zone","gender":"Female","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":12,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-10 00:00:00","id":592743,"zone":"Edmonton Zone","gender":"Female","age_group":"20-29 years","case_status":"NA","case_type":"Confirmed"},{"offset":13,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-10 00:00:00","id":571387,"zone":"Calgary Zone","gender":"Male","age_group":"50-59 years","case_status":"NA","case_type":"Confirmed"},{"offset":14,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-10 00:00:00","id":511281,"zone":"Calgary Zone","gender":"Female","age_group":"40-49 years","case_status":"NA","case_type":"Confirmed"},{"offset":15,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-10 00:00:00","id":552094,"zone":"Calgary Zone","gender":"Male","age_group":"20-29 years","case_status":"NA","case_type":"Confirmed"},{"offset":16,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-11 00:00:00","id":571585,"zone":"Edmonton Zone","gender":"Male","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":17,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-11 00:00:00","id":552338,"zone":"Calgary Zone","gender":"Male","age_group":"1-4 years","case_status":"NA","case_type":"Confirmed"},{"offset":18,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-11 00:00:00","id":535233,"zone":"Calgary Zone","gender":"Female","age_group":"70-79 years","case_status":"NA","case_type":"Confirmed"},{"offset":19,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-11 00:00:00","id":520531,"zone":"Calgary Zone","gender":"Male","age_group":"50-59 years","case_status":"NA","case_type":"Confirmed"},{"offset":20,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-11 00:00:00","id":562700,"zone":"Calgary Zone","gender":"Female","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":21,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-11 00:00:00","id":520891,"zone":"Central Zone","gender":"Female","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":22,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-11 00:00:00","id":523194,"zone":"Calgary Zone","gender":"Male","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":23,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-12 00:00:00","id":541605,"zone":"Calgary Zone","gender":"Male","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":24,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-12 00:00:00","id":590969,"zone":"Calgary Zone","gender":"Female","age_group":"1-4 years","case_status":"NA","case_type":"Confirmed"},{"offset":25,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-12 00:00:00","id":505750,"zone":"North Zone","gender":"Male","age_group":"50-59 years","case_status":"NA","case_type":"Probable"},{"offset":26,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-13 00:00:00","id":585909,"zone":"Calgary Zone","gender":"Male","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":27,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-13 00:00:00","id":557096,"zone":"Calgary Zone","gender":"Male","age_group":"60-69 years","case_status":"NA","case_type":"Confirmed"},{"offset":28,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-13 00:00:00","id":546383,"zone":"Calgary Zone","gender":"Female","age_group":"50-59 years","case_status":"NA","case_type":"Confirmed"},{"offset":29,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-13 00:00:00","id":513579,"zone":"Calgary Zone","gender":"Male","age_group":"10-19 years","case_status":"NA","case_type":"Confirmed"},{"offset":30,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-13 00:00:00","id":588456,"zone":"Edmonton Zone","gender":"Male","age_group":"40-49 years","case_status":"NA","case_type":"Confirmed"},{"offset":31,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-13 00:00:00","id":575058,"zone":"Calgary Zone","gender":"Male","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":32,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-13 00:00:00","id":586471,"zone":"Calgary Zone","gender":"Female","age_group":"50-59 years","case_status":"NA","case_type":"Confirmed"},{"offset":33,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-13 00:00:00","id":533052,"zone":"Calgary Zone","gender":"Male","age_group":"40-49 years","case_status":"NA","case_type":"Confirmed"},{"offset":34,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":576184,"zone":"Edmonton Zone","gender":"Female","age_group":"60-69 years","case_status":"NA","case_type":"Confirmed"},{"offset":35,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":505753,"zone":"Edmonton Zone","gender":"Male","age_group":"40-49 years","case_status":"NA","case_type":"Probable"},{"offset":36,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":505752,"zone":"Edmonton Zone","gender":"Female","age_group":"30-39 years","case_status":"NA","case_type":"Probable"},{"offset":37,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":535738,"zone":"Calgary Zone","gender":"Male","age_group":"10-19 years","case_status":"NA","case_type":"Confirmed"},{"offset":38,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":540352,"zone":"Calgary Zone","gender":"Male","age_group":"10-19 years","case_status":"NA","case_type":"Confirmed"},{"offset":39,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":528310,"zone":"Edmonton Zone","gender":"Male","age_group":"60-69 years","case_status":"NA","case_type":"Confirmed"},{"offset":40,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":591775,"zone":"Calgary Zone","gender":"Male","age_group":"20-29 years","case_status":"NA","case_type":"Confirmed"},{"offset":41,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":521559,"zone":"Calgary Zone","gender":"Male","age_group":"1-4 years","case_status":"NA","case_type":"Confirmed"},{"offset":42,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":554295,"zone":"Calgary Zone","gender":"Male","age_group":"40-49 years","case_status":"NA","case_type":"Confirmed"},{"offset":43,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":516855,"zone":"Edmonton Zone","gender":"Male","age_group":"60-69 years","case_status":"Died","case_type":"Confirmed"},{"offset":44,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":562248,"zone":"Calgary Zone","gender":"Male","age_group":"40-49 years","case_status":"NA","case_type":"Confirmed"},{"offset":45,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":554006,"zone":"Edmonton Zone","gender":"Female","age_group":"70-79 years","case_status":"NA","case_type":"Confirmed"},{"offset":46,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":568336,"zone":"Calgary Zone","gender":"Male","age_group":"40-49 years","case_status":"NA","case_type":"Confirmed"},{"offset":47,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":505751,"zone":"Edmonton Zone","gender":"Male","age_group":"1-4 years","case_status":"NA","case_type":"Probable"},{"offset":48,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":552713,"zone":"Calgary Zone","gender":"Female","age_group":"20-29 years","case_status":"NA","case_type":"Confirmed"},{"offset":49,"system_time":"2022-08-05 21:19:28.817","date_reported":"2020-03-14 00:00:00","id":575427,"zone":"Calgary Zone","gender":"Female","age_group":"40-49 years","case_status":"NA","case_type":"Confirmed"}]',
            },
            limit: 50,
        },
    },
};

export const mockDatasetDataSqlRunInvalidSqlResponse: GetDatasetDataSqlRunQuery = {
    data: {
        __typename: "DataQueries",
        query: {
            __typename: "DataQueryResultError",
            errorMessage: "invalid SQL query",
            errorKind: DataQueryResultErrorKind.InvalidSql,
        },
    },
};

export const mockDatasetDataSqlRunInternalErrorResponse: GetDatasetDataSqlRunQuery = {
    data: {
        __typename: "DataQueries",
        query: {
            __typename: "DataQueryResultError",
            errorMessage: "internal server error",
            errorKind: DataQueryResultErrorKind.InternalError,
        },
    },
};

export const mockCreateEmptyDatasetResponse: CreateEmptyDatasetMutation = {
    datasets: {
        createEmpty: {
            __typename: "CreateDatasetResultSuccess",
            message: "Success",
        },
    },
};

export const mockCreateEmptyDatasetNameCollisionResponse: CreateEmptyDatasetMutation = {
    datasets: {
        createEmpty: {
            __typename: "CreateDatasetResultNameCollision",
            message: "Dataset with name 'my-test' already exists",
        },
    },
};

export const mockCreateDatasetFromSnapshotResponse: CreateDatasetFromSnapshotMutation = {
    datasets: {
        createFromSnapshot: {
            __typename: "CreateDatasetResultSuccess",
            message: "Success",
            dataset: mockDatasetBasicsDerivedFragment,
        },
    },
};

export const mockCreateDatasetFromSnapshotMailformedResponse: CreateDatasetFromSnapshotMutation = {
    datasets: {
        createFromSnapshot: {
            __typename: "MetadataManifestMalformed",
            message: "Some manifest format error",
        },
    },
};

export const mockCommitEventResponse: CommitEventToDatasetMutation = {
    datasets: {
        byId: {
            metadata: {
                chain: {
                    commitEvent: {
                        __typename: "CommitResultSuccess",
                        message: "Success",
                        oldHead: "zW1nXNFNR3oFTVnBTkFCkFRJu3ELxFh2XbK1KWP6MgGgTdB",
                        newHead: "zW1hgfvGgmdsbrDMhVoBE5TRX2RX4DV2mhh4QgEAeA3fx4Q",
                    },
                },
            },
        },
    },
};

export const mockCommitEventToDatasetErrorMessage = "Fail";

export const mockCommitEventToDatasetResultAppendError: CommitEventToDatasetMutation = {
    datasets: {
        byId: {
            metadata: {
                chain: {
                    commitEvent: {
                        __typename: "CommitResultAppendError",
                        message: mockCommitEventToDatasetErrorMessage,
                    },
                    __typename: "MetadataChainMut",
                },
                __typename: "DatasetMetadataMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCommitEventToDataseMetadataManifestMalformedError: CommitEventToDatasetMutation = {
    datasets: {
        byId: {
            metadata: {
                chain: {
                    commitEvent: {
                        __typename: "MetadataManifestMalformed",
                        message: mockCommitEventToDatasetErrorMessage,
                    },
                    __typename: "MetadataChainMut",
                },
                __typename: "DatasetMetadataMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCommitEventToDataseMetadataManifestUnsupportedVersionError: CommitEventToDatasetMutation = {
    datasets: {
        byId: {
            metadata: {
                chain: {
                    commitEvent: {
                        __typename: "MetadataManifestUnsupportedVersion",
                        message: mockCommitEventToDatasetErrorMessage,
                    },
                    __typename: "MetadataChainMut",
                },
                __typename: "DatasetMetadataMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCommitEventToDatasetMutation: CommitEventToDatasetMutation = {
    datasets: {
        byId: {
            metadata: {
                chain: {
                    commitEvent: {
                        __typename: "CommitResultSuccess",
                        message: "Success",
                        oldHead: "zW1cMmaF6PdmJPM6LNyy2RyyWFWkF3EojZ54ezAvT2dVgKB",
                        newHead: "zW1eXXAXqgtfNDFt7oXpMfLfDy5Tzg3dMDLWQTz2YJE6ooX",
                    },
                    __typename: "MetadataChainMut",
                },
                __typename: "DatasetMetadataMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockUpdateReadmeSuccessResponse: UpdateReadmeMutation = {
    datasets: {
        byId: {
            metadata: {
                updateReadme: {
                    __typename: "CommitResultSuccess",
                    message: "Success",
                    oldHead: "zW1oSh19bxPZqLhY9awS7cnFrmQUueZ5MF21wVf8poHDnaX",
                },
                __typename: "DatasetMetadataMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockUpdateReadmeErrorMessage: UpdateReadmeMutation = {
    datasets: {
        byId: {
            metadata: {
                updateReadme: {
                    __typename: "CommitResultAppendError",
                    message: mockCommitEventToDatasetErrorMessage,
                },
                __typename: "DatasetMetadataMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDeleteSuccessResponse: DeleteDatasetMutation = {
    datasets: {
        byId: {
            delete: {
                message: "Success",
                deletedDataset: "account.tokens.portfolio",
                __typename: "DeleteResultSuccess",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDeleteDanglingReferenceError: DeleteDatasetMutation = {
    datasets: {
        byId: {
            delete: {
                message: "Dataset 'account.tokens.transfers' has 1 dangling reference(s)",
                danglingChildRefs: ["account.tokens.portfolio"],
                notDeletedDataset: "account.tokens.transfers",
                __typename: "DeleteResultDanglingReference",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const MOCK_OLD_DATASET_NAME = "oldName";
export const MOCK_NEW_DATASET_NAME = "newName";

export const mockRenameSuccessResponse: RenameDatasetMutation = {
    datasets: {
        byId: {
            rename: {
                __typename: "RenameResultSuccess",
                message: "Success",
                oldName: MOCK_OLD_DATASET_NAME,
                newName: MOCK_NEW_DATASET_NAME,
            },
        },
    },
};

export const mockRenameResultNameCollision: RenameDatasetMutation = {
    datasets: {
        byId: {
            rename: {
                __typename: "RenameResultNameCollision",
                message: "Dataset 'account.portfolio' already exists",
                collidingAlias: MOCK_NEW_DATASET_NAME,
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockRenameResultNoChanges: RenameDatasetMutation = {
    datasets: {
        byId: {
            rename: {
                __typename: "RenameResultNoChanges",
                preservedName: MOCK_OLD_DATASET_NAME,
                message: "No changes",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDataset403OperationError: GraphQLError = new GraphQLError("Dataset operation unauthorized", {
    extensions: { alias: "someAccount/oldName" },
});

export const mockParseSetPollingSourceEventFromYamlToObject: AddPollingSourceEditFormType = {
    kind: "setPollingSource",
    fetch: {
        kind: FetchKind.FILES_GLOB,
        path: "path",
        eventTime: {
            kind: "fromMetadata",
        },
    },
    read: {
        kind: ReadKind.CSV,
        separator: ",",
        encoding: "UTF-8",
        quote: '"',
        escape: "\\",
        enforceSchema: true,
        nanValue: "NaN",
        positiveInf: "Inf",
        negativeInf: "-Inf",
        dateFormat: "yyyy-MM-dd",
        timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
    },
    merge: {
        kind: MergeKind.APPEND,
    },
};

export const mockParseAddPushSourceEventFromYamlToObject: AddPushSourceEditFormType = {
    kind: "addPushSource",
    sourceName: "mockSource",
    read: {
        kind: ReadKind.CSV,
        schema: ["id INT"],
        separator: ",",
        encoding: "utf8",
        quote: '"',
        escape: "\\",
        enforceSchema: true,
        nanValue: "NaN",
        positiveInf: "Inf",
        negativeInf: "-Inf",
        dateFormat: "rfc3339",
        timestampFormat: "rfc3339",
    },
    merge: {
        kind: MergeKind.APPEND,
    },
};

export const mockHistoryEditPollingSourceService: DatasetHistoryUpdate = {
    history: [
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            prevBlockHash: null,
            systemTime: "2023-06-02T08:44:28.324101693+00:00",
            sequenceNumber: 0,
            author: {
                __typename: "Account",
                id: "1",
                accountName: "kamu",
            },
            event: {
                __typename: "Seed",
                datasetId: "did:odf:z4k88e8nBPEwSAHGs8pXfm39J3RijoXGtCcp24HhAt3t4VmX2fN",
                datasetKind: DatasetKind.Root,
            },
        },
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            prevBlockHash: null,
            systemTime: "2023-06-02T08:44:28.324101693+00:00",
            sequenceNumber: 0,
            author: {
                __typename: "Account",
                id: "1",
                accountName: "kamu",
            },
            event: {
                __typename: "Seed",
                datasetId: "did:odf:z4k88e8nBPEwSAHGs8pXfm39J3RijoXGtCcp24HhAt3t4VmX2fN",
                datasetKind: DatasetKind.Root,
            },
        },
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1nqifmGW3NoCZXWyzPgrtmnGoC7wctsr93V9npsdTKbT4",
            prevBlockHash: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            systemTime: "2023-06-02T08:44:54.984731027+00:00",
            sequenceNumber: 1,
            author: {
                __typename: "Account",
                id: "1",
                accountName: "kamu",
            },
            event: {
                __typename: "SetPollingSource",
                fetch: {
                    __typename: "FetchStepFilesGlob",
                    path: "path",
                    eventTime: {
                        __typename: "EventTimeSourceFromMetadata",
                    },
                    cache: null,
                    order: null,
                },
                read: {
                    __typename: "ReadStepCsv",
                    schema: null,
                    separator: ",",
                    encoding: "UTF-8",
                    quote: '"',
                    escape: "\\",
                    header: null,
                    inferSchema: null,
                    nullValue: null,
                    dateFormat: "yyyy-MM-dd",
                    timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
                },
                merge: {
                    __typename: "MergeStrategyAppend",
                },
                prepare: null,
                preprocess: null,
            },
        },
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            prevBlockHash: null,
            systemTime: "2023-06-02T08:44:28.324101693+00:00",
            sequenceNumber: 0,
            author: {
                __typename: "Account",
                id: "1",
                accountName: "kamu",
            },
            event: {
                __typename: "Seed",
                datasetId: "did:odf:z4k88e8nBPEwSAHGs8pXfm39J3RijoXGtCcp24HhAt3t4VmX2fN",
                datasetKind: DatasetKind.Root,
            },
        },
    ],
    pageInfo: {
        __typename: "PageBasedInfo",
        hasNextPage: true,
        hasPreviousPage: false,
        currentPage: 0,
        totalPages: 4,
    },
};

export const mockHistoryEditAddPushSourceService: DatasetHistoryUpdate = {
    history: [
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            prevBlockHash: null,
            systemTime: "2023-06-02T08:44:28.324101693+00:00",
            sequenceNumber: 0,
            author: {
                __typename: "Account",
                id: "1",
                accountName: "kamu",
            },
            event: {
                __typename: "Seed",
                datasetId: "did:odf:z4k88e8nBPEwSAHGs8pXfm39J3RijoXGtCcp24HhAt3t4VmX2fN",
                datasetKind: DatasetKind.Root,
            },
        },
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            prevBlockHash: null,
            systemTime: "2023-06-02T08:44:28.324101693+00:00",
            sequenceNumber: 0,
            author: {
                __typename: "Account",
                id: "1",
                accountName: "kamu",
            },
            event: {
                __typename: "Seed",
                datasetId: "did:odf:z4k88e8nBPEwSAHGs8pXfm39J3RijoXGtCcp24HhAt3t4VmX2fN",
                datasetKind: DatasetKind.Root,
            },
        },
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1nqifmGW3NoCZXWyzPgrtmnGoC7wctsr93V9npsdTKbT4",
            prevBlockHash: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            systemTime: "2023-06-02T08:44:54.984731027+00:00",
            sequenceNumber: 1,
            author: {
                __typename: "Account",
                id: "1",
                accountName: "kamu",
            },
            event: {
                __typename: "AddPushSource",
                sourceName: "mockSourceName",
                read: {
                    __typename: "ReadStepCsv",
                    schema: null,
                    separator: ",",
                    encoding: "UTF-8",
                    quote: '"',
                    escape: "\\",
                    header: null,
                    inferSchema: null,
                    nullValue: null,
                    dateFormat: "yyyy-MM-dd",
                    timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
                },
                merge: {
                    __typename: "MergeStrategyAppend",
                },
                preprocess: null,
            },
        },
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            prevBlockHash: null,
            systemTime: "2023-06-02T08:44:28.324101693+00:00",
            sequenceNumber: 0,
            author: {
                __typename: "Account",
                id: "1",
                accountName: "kamu",
            },
            event: {
                __typename: "Seed",
                datasetId: "did:odf:z4k88e8nBPEwSAHGs8pXfm39J3RijoXGtCcp24HhAt3t4VmX2fN",
                datasetKind: DatasetKind.Root,
            },
        },
    ],
    pageInfo: {
        __typename: "PageBasedInfo",
        hasNextPage: true,
        hasPreviousPage: false,
        currentPage: 0,
        totalPages: 4,
    },
};

export const mockNode: Node = {
    id: "testId",
    label: "british-columbia.case-details.hm",
    data: {
        kind: LineageGraphNodeKind.Dataset,
        dataObject: {
            id: mockDatasetBasicsDerivedFragment.id,
            name: mockDatasetBasicsDerivedFragment.name,
            kind: mockDatasetBasicsDerivedFragment.kind,
            isCurrent: false,
            access: LineageNodeAccess.PUBLIC,
            accountName: mockDatasetBasicsDerivedFragment.owner.accountName,
        } as LineageGraphDatasetNodeObject,
    },
};

export const mockNodesWithEqualNames: Node[] = [
    {
        id: "testId1",
        label: "british-columbia.case-details.hm",
        data: {
            kind: LineageGraphNodeKind.Dataset,
            dataObject: {
                id: "testId:1",
                name: "british-columbia.case-details.hm",
                kind: DatasetKind.Root,
                isCurrent: false,
                access: LineageNodeAccess.PUBLIC,
                accountName: "accountName1",
            } as LineageGraphDatasetNodeObject,
        },
    },
    {
        id: "testId2",
        label: "british-columbia.case-details.hm",
        data: {
            kind: LineageGraphNodeKind.Dataset,
            dataObject: {
                id: "testId:2",
                name: "british-columbia.case-details.hm",
                kind: DatasetKind.Root,
                isCurrent: false,
                access: LineageNodeAccess.PUBLIC,
                accountName: "accountName2",
            } as LineageGraphDatasetNodeObject,
        },
    },
    {
        id: "testId3",
        label: "british-columbia.case-details.hm",
        data: {
            kind: LineageGraphNodeKind.Dataset,
            dataObject: {
                id: "testId:3",
                name: "british-columbia.case-details.hm",
                kind: DatasetKind.Derivative,
                isCurrent: false,
                access: LineageNodeAccess.PUBLIC,
                accountName: "accountName3",
            } as LineageGraphDatasetNodeObject,
        },
    },
];

export const mockSetPollingSourceEditFormWithReadNdJsonFormat: AddPollingSourceEditFormType = {
    fetch: {
        kind: FetchKind.URL,
        eventTime: {
            kind: "fromMetadata",
        },
        url: "https://opendata.vancouver.ca/explore/dataset/block-outlines/download/?format=geojson&timezone=America/Los_Angeles&lang=en",
    },
    prepare: [
        {
            kind: PrepareKind.PIPE,
            command: ["jq", "-c", ".features[]", "|", "select(.geometry", "!=", "null)", "|", "."],
        },
    ],
    read: {
        kind: ReadKind.All_JSON,
        jsonKind: ReadKind.ND_JSON,
        encoding: "utf8",
        dateFormat: "rfc3339",
        timestampFormat: "rfc3339",
        subPath: "/test",
    },
    merge: {
        kind: MergeKind.APPEND,
    },
};

export const mockPreprocessStepValue: PreprocessStepValue = {
    engine: "spark",
    queries: [
        {
            query: 'SELECT\n  CAST(UNIX_TIMESTAMP(Reported_Date, "yyyy-MM-dd") as TIMESTAMP) as reported_date,\n  Classification_Reported as classification,\n  ROW_NUMBER() OVER (ORDER BY (Reported_Date, HA)) as id,\n  ha,\n  sex,\n  age_group\nFROM input\n',
            alias: null,
        },
    ],
};
