import { LineageGraphNodeType } from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    DataBatchFormat,
    DatasetKind,
    DatasetsByAccountNameQuery,
    DatasetSearchOverviewFragment,
    GetDatasetDataSqlRunQuery,
    GetMetadataBlockQuery,
} from "../kamu.graphql.interface";
import { DataSchemaFormat } from "../kamu.graphql.interface";
import { DatasetsAccountResponse } from "src/app/interface/dataset.interface";

export const TEST_USER_NAME = "test-user";
export const TEST_DATASET_NAME = "test-dataset";
export const TEST_BLOCK_HASH = "zW1hNbxPz28K1oLNGbddudUzKKLT9LDPh8chjksEo6HcDev";

export const mockDatasetDataSqlRunResponse: GetDatasetDataSqlRunQuery = {
    data: {
        __typename: "DataQueries",
        query: {
            __typename: "DataQueryResultSuccess",
            schema: {
                __typename: "DataSchema",
                format: DataSchemaFormat.ParquetJson,
                content:
                    '{"name": "arrow_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP(NANOS,false)"}, {"name": "reported_date", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP(NANOS,false)"}, {"name": "classification", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT32"}, {"name": "ha", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "sex", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "age_group", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}]}',
            },
            data: {
                __typename: "DataBatch",
                format: DataBatchFormat.Json,
                content:
                    '[{"offset":0,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-01-29 00:00:00","classification":"Lab-diagnosed","id":1,"ha":"Out of Canada","sex":"M","age_group":"40-49"},{"offset":1,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-06 00:00:00","classification":"Lab-diagnosed","id":2,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":2,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-10 00:00:00","classification":"Lab-diagnosed","id":4,"ha":"Out of Canada","sex":"F","age_group":"20-29"},{"offset":3,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-10 00:00:00","classification":"Lab-diagnosed","id":3,"ha":"Out of Canada","sex":"M","age_group":"30-39"},{"offset":4,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-18 00:00:00","classification":"Lab-diagnosed","id":5,"ha":"Interior","sex":"F","age_group":"30-39"},{"offset":5,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-24 00:00:00","classification":"Lab-diagnosed","id":6,"ha":"Fraser","sex":"M","age_group":"40-49"},{"offset":6,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-24 00:00:00","classification":"Lab-diagnosed","id":7,"ha":"Fraser","sex":"F","age_group":"30-39"},{"offset":7,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":12,"ha":"Vancouver Coastal","sex":"M","age_group":"60-69"},{"offset":8,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":11,"ha":"Vancouver Coastal","sex":"F","age_group":"30-39"},{"offset":9,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":8,"ha":"Fraser","sex":"M","age_group":"50-59"},{"offset":10,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":9,"ha":"Vancouver Coastal","sex":"F","age_group":"60-69"},{"offset":11,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":10,"ha":"Vancouver Coastal","sex":"F","age_group":"80-89"},{"offset":12,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":16,"ha":"Out of Canada","sex":"F","age_group":"50-59"},{"offset":13,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":14,"ha":"Out of Canada","sex":"F","age_group":"50-59"},{"offset":14,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":18,"ha":"Vancouver Coastal","sex":"M","age_group":"20-29"},{"offset":15,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":20,"ha":"Vancouver Coastal","sex":"M","age_group":"60-69"},{"offset":16,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":13,"ha":"Fraser","sex":"F","age_group":"50-59"},{"offset":17,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":19,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":18,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":17,"ha":"Vancouver Coastal","sex":"M","age_group":"30-39"},{"offset":19,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":15,"ha":"Out of Canada","sex":"F","age_group":"50-59"},{"offset":20,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":23,"ha":"Fraser","sex":"M","age_group":"60-69"},{"offset":21,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":26,"ha":"Vancouver Coastal","sex":"F","age_group":"70-79"},{"offset":22,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":22,"ha":"Fraser","sex":"M","age_group":"60-69"},{"offset":23,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":21,"ha":"Fraser","sex":"F","age_group":"50-59"},{"offset":24,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":27,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":25,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":24,"ha":"Fraser","sex":"F","age_group":"60-69"},{"offset":26,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":25,"ha":"Vancouver Coastal","sex":"M","age_group":"80-89"},{"offset":27,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-07 00:00:00","classification":"Lab-diagnosed","id":28,"ha":"Vancouver Coastal","sex":"M","age_group":"30-39"},{"offset":28,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-08 00:00:00","classification":"Lab-diagnosed","id":30,"ha":"Fraser","sex":"M","age_group":"50-59"},{"offset":29,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-08 00:00:00","classification":"Lab-diagnosed","id":29,"ha":"Fraser","sex":"F","age_group":"40-49"},{"offset":30,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-08 00:00:00","classification":"Lab-diagnosed","id":32,"ha":"Northern","sex":"F","age_group":"60-69"},{"offset":31,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-08 00:00:00","classification":"Lab-diagnosed","id":31,"ha":"Fraser","sex":"M","age_group":"10-19"},{"offset":32,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-09 00:00:00","classification":"Lab-diagnosed","id":34,"ha":"Vancouver Coastal","sex":"F","age_group":"30-39"},{"offset":33,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-09 00:00:00","classification":"Lab-diagnosed","id":33,"ha":"Northern","sex":"M","age_group":"70-79"},{"offset":34,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-09 00:00:00","classification":"Lab-diagnosed","id":35,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":35,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":42,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":36,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":41,"ha":"Vancouver Coastal","sex":"M","age_group":"90+"},{"offset":37,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":39,"ha":"Fraser","sex":"M","age_group":"90+"},{"offset":38,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":37,"ha":"Fraser","sex":"M","age_group":"70-79"},{"offset":39,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":44,"ha":"Vancouver Coastal","sex":"M","age_group":"40-49"},{"offset":40,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":38,"ha":"Fraser","sex":"M","age_group":"60-69"},{"offset":41,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":36,"ha":"Fraser","sex":"F","age_group":"60-69"},{"offset":42,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":45,"ha":"Vancouver Island","sex":"M","age_group":"60-69"},{"offset":43,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":43,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":44,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":40,"ha":"Fraser","sex":"M","age_group":"40-49"},{"offset":45,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":54,"ha":"Vancouver Coastal","sex":"F","age_group":"60-69"},{"offset":46,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":56,"ha":"Vancouver Coastal","sex":"F","age_group":"40-49"},{"offset":47,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":59,"ha":"Vancouver Coastal","sex":"M","age_group":"60-69"},{"offset":48,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":61,"ha":"Vancouver Coastal","sex":"F","age_group":"30-39"},{"offset":49,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":46,"ha":"Fraser","sex":"F","age_group":"50-59"}]',
            },
            limit: 50,
        },
    },
};

export const mockDatasetListItem: DatasetSearchOverviewFragment = {
    __typename: "Dataset",
    createdAt: "2022-08-05T21:17:30.613911358+00:00",
    lastUpdatedAt: "2022-08-05T21:19:28.817281255+00:00",
    metadata: {
        __typename: "DatasetMetadata",
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
        currentDownstreamDependencies: [
            {
                __typename: "Dataset",
                id: "did:odf:z4k88e8kmp7wTEePmNDSprhY2TqwDxSiFwHiau8fnUk4V4Cpgu7",
                kind: DatasetKind.Derivative,
            },
        ],
    },
    id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
    kind: DatasetKind.Root,
    name: "alberta.case-details",
    owner: {
        __typename: "User",
        id: "1",
        name: "kamu",
    },
};

export const mockDatasetsAccountResponse: DatasetsAccountResponse = {
    datasets: [mockDatasetListItem],
    pageInfo: {
        __typename: "PageBasedInfo",
        hasNextPage: true,
        hasPreviousPage: false,
        currentPage: 0,
        totalPages: 2,
    },
    datasetTotalCount: 1,
};

export const mockDatasetsByAccountNameQuery: DatasetsByAccountNameQuery = {
    datasets: {
        __typename: "Datasets",
        byAccountName: {
            __typename: "DatasetConnection",
            nodes: [
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:17:30.613911358+00:00",
                    lastUpdatedAt: "2022-08-05T21:19:28.817281255+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
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
                        currentDownstreamDependencies: [
                            {
                                __typename: "Dataset",
                                id: "did:odf:z4k88e8kmp7wTEePmNDSprhY2TqwDxSiFwHiau8fnUk4V4Cpgu7",
                                kind: DatasetKind.Derivative,
                            },
                        ],
                    },
                    id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                    kind: DatasetKind.Root,
                    name: "alberta.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
            ],
            totalCount: 1,
            pageInfo: {
                __typename: "PageBasedInfo",
                hasNextPage: true,
                hasPreviousPage: false,
                currentPage: 0,
                totalPages: 2,
            },
        },
    },
};

export const mockGetMetadataBlockQuery: GetMetadataBlockQuery = {
    datasets: {
        __typename: "Datasets",
        byOwnerAndName: {
            __typename: "Dataset",
            metadata: {
                __typename: "DatasetMetadata",
                chain: {
                    __typename: "MetadataChain",
                    blockByHashEncoded:
                        "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2022-08-05T21:17:30.621941313Z\n  prevBlockHash: zW1auBfep4NvrY6RqNN7asdjTzuNMAugdcsw7VfrsQFDqj1\n  sequenceNumber: 3\n  event:\n    kind: setInfo\n    description: British Columbia COVID-19 case data updated regularly from the B.C. Centre for Disease Control, Provincial Health Services Authority and the B.C. Ministry of Health.\n    keywords:\n    - Healthcare\n    - Epidemiology\n    - COVID-19\n    - SARS-CoV-2\n    - Disaggregated\n    - Anonymized\n    - British Columbia\n    - Canada\n",
                    blockByHash: {
                        __typename: "MetadataBlockExtended",
                        blockHash: "zW1hNbxPz28K1oLNGbddudUzKKLT9LDPh8chjksEo6HcDev",
                        prevBlockHash: "zW1abnmxotsSC7H6SyfbL7bpWtQrMSQktUfiJds3KWX1xfm",
                        systemTime: "2022-08-05T21:20:08.053635579+00:00",
                        sequenceNumber: 6,
                        author: {
                            __typename: "User",
                            id: "1",
                            name: "kamu",
                        },
                        event: {
                            __typename: "ExecuteQuery",
                            queryOutputData: {
                                __typename: "DataSlice",
                                interval: {
                                    __typename: "OffsetInterval",
                                    start: 0,
                                    end: 596125,
                                },
                                logicalHash: "z63ZND5B21T2Dbmr2bB2Eu2Y4fjEJzLYrwiumM7ApeU24N29qpna",
                                physicalHash: "zW1i7cajDaJjwxCRaRyGHqJpDrqZXbm1wMZkaWrH8a8Cmbd",
                            },
                            inputCheckpoint: null,
                            watermark: "2022-08-01T00:00:00+00:00",
                            inputSlices: [
                                {
                                    __typename: "InputSlice",
                                    datasetId: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                                    blockInterval: {
                                        __typename: "BlockInterval",
                                        start: "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX",
                                        end: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
                                    },
                                    dataInterval: {
                                        __typename: "OffsetInterval",
                                        start: 0,
                                        end: 596125,
                                    },
                                },
                            ],
                            outputCheckpoint: {
                                __typename: "Checkpoint",
                                physicalHash: "zW1otipGpjScUH8C2RfaF4s8RshReBbQVPDf2fPrp2R8Ft2",
                                size: 2560,
                            },
                        },
                    },
                },
            },
        },
    },
};

export const MOCK_NODES = [
    {
        id: "didodfz4k88e8qmphemqz8ZfEio3bGRrAjoKtP83U22XidbGtHrUcEghj",
        label: "com.naturalearthdata.admin0.countries.50m",
        data: {
            nodeKind: LineageGraphNodeType.Dataset,

            nodeDataObject: {
                id: "did:odf:z4k88e8qmphemqz8ZfEio3bGRrAjoKtP83U22XidbGtHrUcEghj",
                name: "com.naturalearthdata.admin0.countries.50m",
                kind: "ROOT",
                isRoot: true,
                isCurrent: true,
                color: "#7aa3e5",
                accountName: "kamu",
            },
        },
        meta: {
            forceDimensions: false,
        },
        dimension: {
            width: 308.9427490234375,
            height: 30,
        },
        position: {
            x: 174.47137451171875,
            y: 65,
        },
        transform: "translate(20, 50)",
    },
    {
        id: "didodfz4k88e8h7woj2Njge7MpGneHHEo8nuSA6npPrAroFpETcukCenC",
        label: "com.naturalearthdata.admin0.countries",
        data: {
            nodeKind: LineageGraphNodeType.Dataset,
            nodeDataObject: {
                id: "did:odf:z4k88e8h7woj2Njge7MpGneHHEo8nuSA6npPrAroFpETcukCenC",
                name: "com.naturalearthdata.admin0.countries",
                kind: "DERIVATIVE",
                isRoot: false,
                isCurrent: false,
                color: "#a8385d",
                accountName: "kamu",
            },
        },
        meta: {
            forceDimensions: false,
        },
        dimension: {
            width: 279.571044921875,
            height: 90,
        },
        position: {
            x: 568.728271484375,
            y: 65,
        },
        transform: "translate(428.9427490234375, 20)",
    },
];

export const MOCK_LINKS = [
    {
        id: "didodfz4k88e8qmphemqz8ZfEio3bGRrAjoKtP83U22XidbGtHrUcEghj__and__didodfz4k88e8h7woj2Njge7MpGneHHEo8nuSA6npPrAroFpETcukCenC",
        source: "didodfz4k88e8qmphemqz8ZfEio3bGRrAjoKtP83U22XidbGtHrUcEghj",
        target: "didodfz4k88e8h7woj2Njge7MpGneHHEo8nuSA6npPrAroFpETcukCenC",
    },
];

export const MOCK_CLUSTERS = [
    {
        id: "ROOT_cluster",
        label: "ROOT",
        data: {
            customColor: "#A52A2A59",
        },
        position: {
            x: 10,
            y: 10,
        },
        childNodeIds: ["did:odf:z4k88e8qmphemqz8ZfEio3bGRrAjoKtP83U22XidbGtHrUcEghj"],
    },
    {
        id: "DERIVATIVE_cluster",
        label: "DERIVATIVE",
        data: {
            customColor: "#00800039",
        },
        position: {
            x: 10,
            y: 10,
        },
        childNodeIds: ["did:odf:z4k88e8h7woj2Njge7MpGneHHEo8nuSA6npPrAroFpETcukCenC"],
    },
];
