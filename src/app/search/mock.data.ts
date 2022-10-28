import {
    DataBatchFormat,
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
import {
    DatasetAutocompleteItem,
    DatasetSearchResult,
    TypeNames,
} from "../interface/search.interface";

export const mockDatasetInfo: DatasetInfo = {
    accountName: "kamu",
    datasetName: "test name",
};

export const mockNode: Node = {
    id: "testId",
    label: "british-columbia.case-details.hm",
};

export const mockOwnerFields = {
    id: "1",
    name: "kamu",
};

export const mockAutocompleteItems: DatasetAutocompleteItem[] = [
    {
        dataset: {
            id: "id1",
            kind: DatasetKind.Root,
            name: "mockName1",
            owner: mockOwnerFields,
        },
        __typename: TypeNames.datasetType,
    },

    {
        dataset: {
            id: "id2",
            kind: DatasetKind.Derivative,
            name: "mockName2",
            owner: mockOwnerFields,
        },
        __typename: TypeNames.allDataType,
    },
];

const mockMetadataCurrentInfo: DatasetCurrentInfoFragment = {
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
                __typename: "User",
                ...mockOwnerFields,
            },
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

export const mockDatasetBasicsFragment: DatasetBasicsFragment = {
    id: "id",
    kind: DatasetKind.Derivative,
    name: "mockName",
    owner: { __typename: "User", ...mockOwnerFields },
};

export const mockDatasetResponseNotFound: GetDatasetMainDataQuery = {
    datasets: {
        __typename: "Datasets",
    },
};

export const mockDatasetMainDataResponse: GetDatasetMainDataQuery = {
    datasets: {
        __typename: "Datasets",
        byOwnerAndName: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
            kind: DatasetKind.Root,
            name: "alberta.case-details",
            owner: {
                __typename: "User",
                ...mockOwnerFields,
            },
            data: {
                __typename: "DatasetData",
                tail: {
                    __typename: "DataQuerySuccessResult",
                    schema: {
                        __typename: "DataSchema",
                        format: DataSchemaFormat.Parquet,
                        content:
                            "message arrow_schema {\n  OPTIONAL INT64 offset;\n  REQUIRED INT64 system_time (TIMESTAMP(NANOS,false));\n  OPTIONAL INT64 date_reported (TIMESTAMP(NANOS,false));\n  OPTIONAL INT64 id;\n  OPTIONAL BYTE_ARRAY zone (STRING);\n  OPTIONAL BYTE_ARRAY gender (STRING);\n  OPTIONAL BYTE_ARRAY age_group (STRING);\n  OPTIONAL BYTE_ARRAY case_status (STRING);\n  OPTIONAL BYTE_ARRAY case_type (STRING);\n}\n",
                    },
                    data: {
                        __typename: "DataBatch",
                        format: DataBatchFormat.Json,
                        content:
                            '[{"offset":596125,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":595254,"zone":"Calgary Zone","gender":"Female","age_group":"50-59 years","case_status":"NA","case_type":"Confirmed"},{"offset":596124,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":377821,"zone":"North Zone","gender":"Male","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":596123,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":595723,"zone":"South Zone","gender":"Female","age_group":"60-69 years","case_status":"NA","case_type":"Confirmed"},{"offset":596122,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":457371,"zone":"Calgary Zone","gender":"Male","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":596121,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":457368,"zone":"Edmonton Zone","gender":"Female","age_group":"20-29 years","case_status":"NA","case_type":"Confirmed"},{"offset":596120,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":351389,"zone":"Edmonton Zone","gender":"Female","age_group":"60-69 years","case_status":"NA","case_type":"Confirmed"},{"offset":596119,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":298274,"zone":"Calgary Zone","gender":"Female","age_group":"80+ years","case_status":"NA","case_type":"Confirmed"},{"offset":596118,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":324898,"zone":"Calgary Zone","gender":"Female","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"},{"offset":596117,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":484338,"zone":"Calgary Zone","gender":"Female","age_group":"70-79 years","case_status":"NA","case_type":"Confirmed"},{"offset":596116,"system_time":"2022-08-05 21:19:28.817","date_reported":"2022-08-01 00:00:00","id":351387,"zone":"Edmonton Zone","gender":"Female","age_group":"30-39 years","case_status":"NA","case_type":"Confirmed"}]',
                    },
                },
                numRecordsTotal: 596126,
                estimatedSize: 5993876,
            },
            metadata: {
                __typename: "DatasetMetadata",
                currentInfo: mockMetadataCurrentInfo,
                currentLicense: mockMetadataCurrentLicense,
                currentWatermark: "2022-08-01T00:00:00+00:00",
                currentTransform: null,
                currentSchema: {
                    __typename: "DataSchema",
                    format: DataSchemaFormat.ParquetJson,
                    content:
                        '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT96"}, {"name": "date_reported", "repetition": "OPTIONAL", "type": "INT96"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "zone", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "gender", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "age_group", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "case_status", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "case_type", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}]}',
                },
                currentUpstreamDependencies: [
                    {
                        __typename: "Dataset",
                        metadata: {
                            __typename: "DatasetMetadata",
                            currentUpstreamDependencies: [
                                {
                                    __typename: "Dataset",
                                    metadata: {
                                        __typename: "DatasetMetadata",
                                        currentUpstreamDependencies: [
                                            {
                                                __typename: "Dataset",
                                                metadata: {
                                                    __typename:
                                                        "DatasetMetadata",
                                                    currentUpstreamDependencies:
                                                        [
                                                            {
                                                                __typename:
                                                                    "Dataset",
                                                                metadata: {
                                                                    __typename:
                                                                        "DatasetMetadata",
                                                                    currentUpstreamDependencies:
                                                                        [
                                                                            {
                                                                                __typename:
                                                                                    "Dataset",
                                                                                metadata:
                                                                                    {
                                                                                        __typename:
                                                                                            "DatasetMetadata",
                                                                                        currentUpstreamDependencies:
                                                                                            [],
                                                                                    },
                                                                                id: "did:odf:z4k66d7thqpab83a24iYbeXr5yDYBAxaB7hnzbhfmyUTLnWifwz6",
                                                                                kind: DatasetKind.Derivative,
                                                                                name: "fake.upstream-level-5",
                                                                                owner: {
                                                                                    __typename:
                                                                                        "User",
                                                                                    ...mockOwnerFields,
                                                                                },
                                                                            },
                                                                        ],
                                                                },
                                                                id: "did:odf:z4k55d7thqpab83a24iZbeXr5yDYBAxaB7hnzbhfmyUTLnWifwz6",
                                                                kind: DatasetKind.Derivative,
                                                                name: "fake.upstream-level-4",
                                                                owner: {
                                                                    __typename:
                                                                        "User",
                                                                    ...mockOwnerFields,
                                                                },
                                                            },
                                                        ],
                                                },
                                                id: "did:odf:z4k55e8thqpab83a24iZbeXr5yDYBAxaB7hmybhfmyUTLnWifwz6",
                                                kind: DatasetKind.Derivative,
                                                name: "fake.upstream-level-3",
                                                owner: {
                                                    __typename: "User",
                                                    ...mockOwnerFields,
                                                },
                                            },
                                        ],
                                    },
                                    id: "did:odf:z4k55e8thqpab83a24iZbeXr5yCVCDxaB7hmybhfmyUTLnWifwz6",
                                    kind: DatasetKind.Derivative,
                                    name: "fake.upstream-level-2",
                                    owner: {
                                        __typename: "User",
                                        ...mockOwnerFields,
                                    },
                                },
                            ],
                        },
                        id: "did:odf:z4k55e8thqpab83a24iZbeXr5WZVCxaB7hmybhfmyUTLnWifwz6",
                        kind: DatasetKind.Derivative,
                        name: "fake.upstream-level-1",
                        owner: {
                            __typename: "User",
                            ...mockOwnerFields,
                        },
                    },
                ],
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
                                                    __typename:
                                                        "DatasetMetadata",
                                                    currentDownstreamDependencies:
                                                        [
                                                            {
                                                                __typename:
                                                                    "Dataset",
                                                                metadata: {
                                                                    __typename:
                                                                        "DatasetMetadata",
                                                                    currentDownstreamDependencies:
                                                                        [
                                                                            {
                                                                                __typename:
                                                                                    "Dataset",
                                                                                metadata:
                                                                                    {
                                                                                        __typename:
                                                                                            "DatasetMetadata",
                                                                                        currentDownstreamDependencies:
                                                                                            [],
                                                                                    },
                                                                                id: "did:odf:z4k88e8thqpab83a24iFbeXr5WZVCxaB7hmybhfmyUTLnWifwz6",
                                                                                kind: DatasetKind.Derivative,
                                                                                name: "world.daily-cases",
                                                                                owner: {
                                                                                    __typename:
                                                                                        "User",
                                                                                    ...mockOwnerFields,
                                                                                },
                                                                            },
                                                                        ],
                                                                },
                                                                id: "did:odf:z4k88e8thqpab83aJCiFbeXr5WZVCor7hmybhfmyUTLnWifwz6",
                                                                kind: DatasetKind.Derivative,
                                                                name: "america.daily-cases",
                                                                owner: {
                                                                    __typename:
                                                                        "User",
                                                                    ...mockOwnerFields,
                                                                },
                                                            },
                                                        ],
                                                },
                                                id: "did:odf:z4k88e8thqpQ7kupbJCiFbeXr5WZVCor7hmybhfmyUTLnWifwz6",
                                                kind: DatasetKind.Derivative,
                                                name: "canada.daily-cases",
                                                owner: {
                                                    __typename: "User",
                                                    ...mockOwnerFields,
                                                },
                                            },
                                        ],
                                    },
                                    id: "did:odf:z4k88e8epAntnrFDUiDYxSGkCRcTc6wNzcwbpubzLCPQLVLUMcF",
                                    kind: DatasetKind.Derivative,
                                    name: "canada.case-details",
                                    owner: {
                                        __typename: "User",
                                        ...mockOwnerFields,
                                    },
                                },
                            ],
                        },
                        id: "did:odf:z4k88e8kmp7wTEePmNDSprhY2TqwDxSiFwHiau8fnUk4V4Cpgu7",
                        kind: DatasetKind.Derivative,
                        name: "alberta.case-details.hm",
                        owner: {
                            __typename: "User",
                            ...mockOwnerFields,
                        },
                    },
                ],
                currentReadme:
                    "# Confirmed positive cases of COVID-19 in Alberta\n\nThis dataset compiles daily snapshots of publicly reported data on 2019 Novel Coronavirus (COVID-19) testing in Alberta.\n\nData includes:\n- approximation of onset date\n- age group\n- patient gender\n- case acquisition information\n- patient outcome\n- reporting Public Health Unit (PHU)\n- postal code, website, longitude, and latitude of PHU\n\nThis dataset is subject to change. Please review the daily epidemiologic summaries for information on variables, methodology, and technical considerations.\n\n**Related dataset(s)**:\n- [Daily aggregate count of confirmed positive cases of COVID-19 in Alberta](#todo)\n",
                chain: {
                    __typename: "MetadataChain",
                    blocks: {
                        __typename: "MetadataBlockConnection",
                        nodes: [
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash:
                                    "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
                                prevBlockHash:
                                    "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
                                systemTime:
                                    "2022-08-05T21:19:28.817281255+00:00",
                                author: {
                                    __typename: "User",
                                    ...mockOwnerFields,
                                },
                                event: {
                                    __typename: "AddData",
                                    addedOutputData: {
                                        __typename: "DataSlice",
                                        interval: {
                                            __typename: "OffsetInterval",
                                            start: 0,
                                            end: 596125,
                                        },
                                        logicalHash:
                                            "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
                                        physicalHash:
                                            "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
                                    },
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
            createdAt: "2022-08-05T21:17:30.613911358+00:00",
            lastUpdatedAt: "2022-08-05T21:19:28.817281255+00:00",
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
                                blockHash:
                                    "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
                                prevBlockHash:
                                    "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
                                systemTime:
                                    "2022-08-05T21:19:28.817281255+00:00",
                                author: {
                                    __typename: "User",
                                    ...mockOwnerFields,
                                },
                                event: {
                                    __typename: "AddData",
                                    addedOutputData: {
                                        __typename: "DataSlice",
                                        interval: {
                                            __typename: "OffsetInterval",
                                            start: 0,
                                            end: 596125,
                                        },
                                        logicalHash:
                                            "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
                                        physicalHash:
                                            "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
                                    },
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash:
                                    "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
                                prevBlockHash:
                                    "zW1mdEmQaQFQZj6cz9yopVisYEPtbEGyv5ofGjmW8VmAiBA",
                                systemTime:
                                    "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "User",
                                    ...mockOwnerFields,
                                },
                                event: {
                                    __typename: "SetLicense",
                                    name: "Open Government Licence - Canada",
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash:
                                    "zW1mdEmQaQFQZj6cz9yopVisYEPtbEGyv5ofGjmW8VmAiBA",
                                prevBlockHash:
                                    "zW1k7Mc19BhaEDPmuPrQcSLWJkRaCd9MB7X4SeGvqKzFi3d",
                                systemTime:
                                    "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "User",
                                    ...mockOwnerFields,
                                },
                                event: {
                                    __typename: "SetAttachments",
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash:
                                    "zW1k7Mc19BhaEDPmuPrQcSLWJkRaCd9MB7X4SeGvqKzFi3d",
                                prevBlockHash:
                                    "zW1jzqJxDwLStfBA8jj5oxAd51otwte3xNtZSBkMVtBAbyc",
                                systemTime:
                                    "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "User",
                                    ...mockOwnerFields,
                                },
                                event: {
                                    __typename: "SetInfo",
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash:
                                    "zW1jzqJxDwLStfBA8jj5oxAd51otwte3xNtZSBkMVtBAbyc",
                                prevBlockHash:
                                    "zW1eG5uSWyHACt6TuK8dSJUkQ39SCWfKzNARBSMpFbvZKvL",
                                systemTime:
                                    "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "User",
                                    ...mockOwnerFields,
                                },
                                event: {
                                    __typename: "SetVocab",
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash:
                                    "zW1eG5uSWyHACt6TuK8dSJUkQ39SCWfKzNARBSMpFbvZKvL",
                                prevBlockHash:
                                    "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX",
                                systemTime:
                                    "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "User",
                                    ...mockOwnerFields,
                                },
                                event: {
                                    __typename: "SetPollingSource",
                                },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                blockHash:
                                    "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX",
                                prevBlockHash: null,
                                systemTime:
                                    "2022-08-05T21:17:30.613911358+00:00",
                                author: {
                                    __typename: "User",
                                    ...mockOwnerFields,
                                },
                                event: {
                                    __typename: "Seed",
                                    datasetId:
                                        "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
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
                __typename: "User",
                ...mockOwnerFields,
            },
        },
    },
};

export const mockDatasetDataSqlRunResponse: GetDatasetDataSqlRunQuery = {
    data: {
        __typename: "DataQueries",
        query: {
            __typename: "DataQuerySuccessResult",
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
            __typename: "DataQueryInvalidSqlResult",
            error: "invalid SQL query"
        },
    },
};

export const mockDatasetDataSqlRunInternalErrorResponse: GetDatasetDataSqlRunQuery = {
    data: {
        __typename: "DataQueries",
        query: {
            __typename: "DataQueryInternalErrorResult",
            error: "internal server error"
        },
    },
};
