/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    CurrentSourceFetchUrlFragment,
    DatasetKind,
    DataSchemaFormat,
    DatasetLineageBasicsFragment,
    DatasetMetadata,
} from "src/app/api/kamu.graphql.interface";
import {
    DataUpdate,
    DataSqlErrorUpdate,
    DatasetHistoryUpdate,
    LineageUpdate,
    MetadataSchemaUpdate,
    OverviewUpdate,
} from "../dataset.subscriptions.interface";
import { mockDatasetBasicsDerivedFragment, mockPublicDatasetVisibility } from "src/app/search/mock.data";
import { Node } from "@swimlane/ngx-graph";
import { LineageNodeAccess } from "./lineage-component/lineage-model";
import { OperationColumnClassEnum } from "src/app/interface/dataset.interface";

export const mockDataUpdate: DataUpdate = {
    schema: {
        name: "id",
        type: "string",
        fields: [
            {
                name: "mockName",
                repetition: "mockRepetition",
                type: "mockType",
            },
        ],
    },
    content: [
        {
            mockName: {
                value: "someValueOfMockType",
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
        },
    ],
};

export const mockSqlErrorUpdate: DataSqlErrorUpdate = {
    error: "sql parser error",
};

export const TEST_ACCOUNT_ID = "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f";

export const mockHistoryUpdate: DatasetHistoryUpdate = {
    history: [
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
            sequenceNumber: 14,
            prevBlockHash: "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
            systemTime: "2022-08-05T21:19:28.817281255+00:00",
            author: {
                __typename: "Account",
                id: TEST_ACCOUNT_ID,
                accountName: "kamu",
            },
            event: {
                __typename: "AddData",
                newWatermark: "2022-08-01T00:00:00+00:00",
                prevCheckpoint: null,
                newData: {
                    __typename: "DataSlice",
                    offsetInterval: {
                        __typename: "OffsetInterval",
                        start: 0,
                        end: 596125,
                    },
                    logicalHash: "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
                    physicalHash: "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
                    size: 5993876,
                },
                newCheckpoint: {
                    __typename: "Checkpoint",
                    physicalHash: "zW1diFMSn97sDG4WMMKZ7pvM7vVenC5ytAesQK7V3qqALPv",
                    size: 2560,
                },
            },
        },
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1k7Mc19BhaEDPmuPrQcSLWJkRaCd9MB7X4SeGvqKzFi3d",
            prevBlockHash: "zW1jzqJxDwLStfBA8jj5oxAd51otwte3xNtZSBkMVtBAbyc",
            systemTime: "2022-08-05T21:17:30.613911358+00:00",
            sequenceNumber: 3,
            author: {
                __typename: "Account",
                id: TEST_ACCOUNT_ID,
                accountName: "kamu",
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
    ],
    pageInfo: {
        __typename: "PageBasedInfo",
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 0,
        totalPages: 10,
    },
};

export const mockCurrentSourceFetchUrlFragment: CurrentSourceFetchUrlFragment = {
    currentPollingSource: {
        __typename: "SetPollingSource",
        fetch: {
            __typename: "FetchStepUrl",
            url: "http://test.com",
        },
    },
};

export const mockGraphNode: DatasetLineageBasicsFragment = {
    ...mockDatasetBasicsDerivedFragment,
    createdAt: "2023-09-05T02:14:17.365614388+00:00",
    lastUpdatedAt: "2023-09-05T02:24:48.840536329+00:00",
    data: { __typename: "DatasetData", numRecordsTotal: 127, estimatedSize: 14515 },
    metadata: {
        ...mockCurrentSourceFetchUrlFragment,
        currentLicense: null,
        currentWatermark: "2023-09-05T02:14:17.365614388+00:00",
    },
};

export const mockLineageUpdate: LineageUpdate = {
    nodes: [mockGraphNode],
    edges: [[mockGraphNode, mockGraphNode]],
    origin: mockGraphNode,
};

export const mockLineageGraphUpdate: LineageUpdate = {
    origin: {
        __typename: "Dataset",
        id: "did:odf:z4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
        kind: DatasetKind.Root,
        name: "alberta.case-details",
        owner: {
            __typename: "Account",
            id: TEST_ACCOUNT_ID,
            accountName: "kamu",
            avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
        },
        alias: "kamu/alberta.case-details",
        visibility: mockPublicDatasetVisibility,
        metadata: {
            __typename: "DatasetMetadata",
            currentPollingSource: {
                __typename: "SetPollingSource",
                fetch: {
                    __typename: "FetchStepUrl",
                    url: "https://s3.us-west-2.amazonaws.com/datasets.kamu.dev/demo/covid/covid-19-alberta-statistics-data.csv",
                },
            },
            currentLicense: {
                __typename: "SetLicense",
                shortName: "OGL-Canada-2.0",
                name: "Open Government Licence - Canada",
                spdxId: "OGL-Canada-2.0",
                websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
            },
            currentWatermark: "2022-08-01T00:00:00+00:00",
        },
        data: {
            __typename: "DatasetData",

            numRecordsTotal: 596126,
            estimatedSize: 6585116,
        },
        createdAt: "2023-09-03T01:08:55.104604199+00:00",
        lastUpdatedAt: "2023-09-03T01:09:31.587025138+00:00",
    },
    nodes: [
        {
            __typename: "Dataset",
            id: "did:odf:z4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
            kind: DatasetKind.Root,
            name: "alberta.case-details",
            owner: {
                __typename: "Account",
                id: TEST_ACCOUNT_ID,
                accountName: "kamu",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
            },
            alias: "kamu/alberta.case-details",
            visibility: mockPublicDatasetVisibility,

            metadata: {
                __typename: "DatasetMetadata",
                currentPollingSource: {
                    __typename: "SetPollingSource",
                    fetch: {
                        __typename: "FetchStepUrl",
                        url: "https://s3.us-west-2.amazonaws.com/datasets.kamu.dev/demo/covid/covid-19-alberta-statistics-data.csv",
                    },
                },
                currentLicense: {
                    __typename: "SetLicense",
                    shortName: "OGL-Canada-2.0",
                    name: "Open Government Licence - Canada",
                    spdxId: "OGL-Canada-2.0",
                    websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                },
                currentWatermark: "2022-08-01T00:00:00+00:00",
            },
            data: {
                __typename: "DatasetData",
                numRecordsTotal: 596126,
                estimatedSize: 6585116,
            },
            createdAt: "2023-09-03T01:08:55.104604199+00:00",
            lastUpdatedAt: "2023-09-03T01:09:31.587025138+00:00",
        },
        {
            __typename: "Dataset",
            metadata: {
                __typename: "DatasetMetadata",
                currentPollingSource: null,
                currentLicense: {
                    __typename: "SetLicense",
                    shortName: "OGL-Canada-2.0",
                    name: "Open Government Licence - Canada",
                    spdxId: "OGL-Canada-2.0",
                    websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                },
                currentWatermark: "2022-08-01T00:00:00+00:00",
            },
            createdAt: "2023-09-03T01:08:55.125905488+00:00",
            lastUpdatedAt: "2023-09-03T01:17:14.151423006+00:00",
            data: {
                __typename: "DatasetData",
                numRecordsTotal: 596126,
                estimatedSize: 6562253,
            },
            owner: {
                __typename: "Account",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                id: TEST_ACCOUNT_ID,
                accountName: "kamu",
            },
            id: "did:odf:z4k88e8jmNqgCt5L84XPdaog32MttcHzGiXcktfuTuDY3QKwiyK",
            kind: DatasetKind.Derivative,
            name: "alberta.case-details.hm",
            alias: "alberta.case-details.hm",
            visibility: mockPublicDatasetVisibility,
        },
        {
            __typename: "Dataset",
            metadata: {
                __typename: "DatasetMetadata",
                currentPollingSource: null,
                currentLicense: {
                    __typename: "SetLicense",
                    shortName: "OGL-Canada-2.0",
                    name: "Open Government Licence - Canada",
                    spdxId: "OGL-Canada-2.0",
                    websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                },
                currentWatermark: "2021-06-02T12:00:00+00:00",
            },
            createdAt: "2023-09-03T01:32:07.215520327+00:00",
            lastUpdatedAt: "2023-09-03T01:32:15.469401365+00:00",
            data: {
                __typename: "DatasetData",
                numRecordsTotal: 4013015,
                estimatedSize: 39905730,
            },
            owner: {
                __typename: "Account",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                id: TEST_ACCOUNT_ID,
                accountName: "kamu",
            },
            id: "did:odf:z4k88e8nN5SdNPxsc5oeqwdCLvjzcvJzoyEQ938E87A15nTrkAk",
            kind: DatasetKind.Derivative,
            name: "canada.case-details",
            alias: "canada.case-details",
            visibility: mockPublicDatasetVisibility,
        },
        {
            __typename: "Dataset",
            metadata: {
                __typename: "DatasetMetadata",
                currentPollingSource: null,
                currentLicense: {
                    __typename: "SetLicense",
                    shortName: "OGL-Ontario",
                    name: "Open Government Licence - Ontario",
                    spdxId: null,
                    websiteUrl: "https://www.ontario.ca/page/open-government-licence-ontario",
                },
                currentWatermark: "2021-06-02T12:00:00+00:00",
            },
            createdAt: "2023-09-03T01:32:07.223403873+00:00",
            lastUpdatedAt: "2023-09-03T01:34:22.293688531+00:00",
            data: {
                __typename: "DatasetData",
                numRecordsTotal: 1870,
                estimatedSize: 21685,
            },
            owner: {
                __typename: "Account",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                id: TEST_ACCOUNT_ID,
                accountName: "kamu",
            },
            id: "did:odf:z4k88e8qAReYmLPFUyaKfk1UHCSY2Mkh6X1AHxuUGNhec76QsGq",
            kind: DatasetKind.Derivative,
            name: "canada.daily-cases",
            alias: "canada.daily-cases",
            visibility: mockPublicDatasetVisibility,
        },
    ],
    edges: [
        [
            {
                __typename: "Dataset",
                id: "did:odf:z4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
                kind: DatasetKind.Root,
                name: "alberta.case-details",
                owner: {
                    __typename: "Account",
                    id: TEST_ACCOUNT_ID,
                    accountName: "kamu",
                    avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                },
                alias: "kamu/alberta.case-details",
                visibility: mockPublicDatasetVisibility,
                metadata: {
                    __typename: "DatasetMetadata",
                    currentPollingSource: {
                        __typename: "SetPollingSource",
                        fetch: {
                            __typename: "FetchStepUrl",
                            url: "https://s3.us-west-2.amazonaws.com/datasets.kamu.dev/demo/covid/covid-19-alberta-statistics-data.csv",
                        },
                    },
                    currentLicense: {
                        __typename: "SetLicense",
                        shortName: "OGL-Canada-2.0",
                        name: "Open Government Licence - Canada",
                        spdxId: "OGL-Canada-2.0",
                        websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                    },
                    currentWatermark: "2022-08-01T00:00:00+00:00",
                },
                data: {
                    __typename: "DatasetData",
                    numRecordsTotal: 596126,
                    estimatedSize: 6585116,
                },
                createdAt: "2023-09-03T01:08:55.104604199+00:00",
                lastUpdatedAt: "2023-09-03T01:09:31.587025138+00:00",
            },
            {
                __typename: "Dataset",
                metadata: {
                    __typename: "DatasetMetadata",
                    currentPollingSource: null,
                    currentLicense: {
                        __typename: "SetLicense",
                        shortName: "OGL-Canada-2.0",
                        name: "Open Government Licence - Canada",
                        spdxId: "OGL-Canada-2.0",
                        websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                    },
                    currentWatermark: "2022-08-01T00:00:00+00:00",
                },
                createdAt: "2023-09-03T01:08:55.125905488+00:00",
                lastUpdatedAt: "2023-09-03T01:17:14.151423006+00:00",
                data: {
                    __typename: "DatasetData",
                    numRecordsTotal: 596126,
                    estimatedSize: 6562253,
                },
                owner: {
                    __typename: "Account",
                    avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                    id: TEST_ACCOUNT_ID,
                    accountName: "kamu",
                },
                id: "did:odf:z4k88e8jmNqgCt5L84XPdaog32MttcHzGiXcktfuTuDY3QKwiyK",
                kind: DatasetKind.Derivative,
                name: "alberta.case-details.hm",
                alias: "alberta.case-details.hm",
                visibility: mockPublicDatasetVisibility,
            },
        ],
        [
            {
                __typename: "Dataset",
                metadata: {
                    __typename: "DatasetMetadata",
                    currentPollingSource: null,
                    currentLicense: {
                        __typename: "SetLicense",
                        shortName: "OGL-Canada-2.0",
                        name: "Open Government Licence - Canada",
                        spdxId: "OGL-Canada-2.0",
                        websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                    },
                    currentWatermark: "2022-08-01T00:00:00+00:00",
                },
                createdAt: "2023-09-03T01:08:55.125905488+00:00",
                lastUpdatedAt: "2023-09-03T01:17:14.151423006+00:00",
                data: {
                    __typename: "DatasetData",
                    numRecordsTotal: 596126,
                    estimatedSize: 6562253,
                },
                owner: {
                    __typename: "Account",
                    avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                    id: TEST_ACCOUNT_ID,
                    accountName: "kamu",
                },
                id: "did:odf:z4k88e8jmNqgCt5L84XPdaog32MttcHzGiXcktfuTuDY3QKwiyK",
                kind: DatasetKind.Derivative,
                name: "alberta.case-details.hm",
                alias: "alberta.case-details.hm",
                visibility: mockPublicDatasetVisibility,
            },
            {
                __typename: "Dataset",
                metadata: {
                    __typename: "DatasetMetadata",
                    currentPollingSource: null,
                    currentLicense: {
                        __typename: "SetLicense",
                        shortName: "OGL-Canada-2.0",
                        name: "Open Government Licence - Canada",
                        spdxId: "OGL-Canada-2.0",
                        websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                    },
                    currentWatermark: "2021-06-02T12:00:00+00:00",
                },
                createdAt: "2023-09-03T01:32:07.215520327+00:00",
                lastUpdatedAt: "2023-09-03T01:32:15.469401365+00:00",
                data: {
                    __typename: "DatasetData",
                    numRecordsTotal: 4013015,
                    estimatedSize: 39905730,
                },
                owner: {
                    __typename: "Account",
                    avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                    id: TEST_ACCOUNT_ID,
                    accountName: "kamu",
                },
                id: "did:odf:z4k88e8nN5SdNPxsc5oeqwdCLvjzcvJzoyEQ938E87A15nTrkAk",
                kind: DatasetKind.Derivative,
                name: "canada.case-details",
                alias: "canada.case-details",
                visibility: mockPublicDatasetVisibility,
            },
        ],
        [
            {
                __typename: "Dataset",
                metadata: {
                    __typename: "DatasetMetadata",
                    currentPollingSource: null,
                    currentLicense: {
                        __typename: "SetLicense",
                        shortName: "OGL-Canada-2.0",
                        name: "Open Government Licence - Canada",
                        spdxId: "OGL-Canada-2.0",
                        websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
                    },
                    currentWatermark: "2021-06-02T12:00:00+00:00",
                },
                createdAt: "2023-09-03T01:32:07.215520327+00:00",
                lastUpdatedAt: "2023-09-03T01:32:15.469401365+00:00",
                data: {
                    __typename: "DatasetData",
                    numRecordsTotal: 4013015,
                    estimatedSize: 39905730,
                },
                owner: {
                    __typename: "Account",
                    avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                    id: TEST_ACCOUNT_ID,
                    accountName: "kamu",
                },
                id: "did:odf:z4k88e8nN5SdNPxsc5oeqwdCLvjzcvJzoyEQ938E87A15nTrkAk",
                kind: DatasetKind.Derivative,
                name: "canada.case-details",
                alias: "canada.case-details",
                visibility: mockPublicDatasetVisibility,
            },
            {
                __typename: "Dataset",
                metadata: {
                    __typename: "DatasetMetadata",
                    currentPollingSource: null,
                    currentLicense: {
                        __typename: "SetLicense",
                        shortName: "OGL-Ontario",
                        name: "Open Government Licence - Ontario",
                        spdxId: null,
                        websiteUrl: "https://www.ontario.ca/page/open-government-licence-ontario",
                    },
                    currentWatermark: "2021-06-02T12:00:00+00:00",
                },
                createdAt: "2023-09-03T01:32:07.223403873+00:00",
                lastUpdatedAt: "2023-09-03T01:34:22.293688531+00:00",
                data: {
                    __typename: "DatasetData",
                    numRecordsTotal: 1870,
                    estimatedSize: 21685,
                },
                owner: {
                    __typename: "Account",
                    avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                    id: TEST_ACCOUNT_ID,
                    accountName: "kamu",
                },
                id: "did:odf:z4k88e8qAReYmLPFUyaKfk1UHCSY2Mkh6X1AHxuUGNhec76QsGq",
                kind: DatasetKind.Derivative,
                name: "canada.daily-cases",
                alias: "canada.daily-cases",
                visibility: mockPublicDatasetVisibility,
            },
        ],
    ],
};

export const mockLineageGraphUpdateWithMqttSource: LineageUpdate = {
    origin: {
        __typename: "Dataset",
        id: "did:odf:fed01bbbdd6bf91ef55c042e10b741104517523301b13ff7120801b1c581da035cb5a",
        kind: DatasetKind.Root,
        name: "temp",
        owner: {
            __typename: "Account",
            id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
            accountName: "kamu",
            avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
        },
        alias: "temp",
        visibility: mockPublicDatasetVisibility,
        metadata: {
            __typename: "DatasetMetadata",
            currentPollingSource: {
                __typename: "SetPollingSource",
                fetch: {
                    __typename: "FetchStepMqtt",
                    host: "test.mosquitto.org",
                    port: 1883,
                },
            },
            currentLicense: null,
            currentWatermark: null,
        },
        createdAt: "2024-05-20T13:21:15.141982827+00:00",
        lastUpdatedAt: "2024-05-20T13:21:15.141982827+00:00",
        data: {
            __typename: "DatasetData",
            numRecordsTotal: 0,
            estimatedSize: 0,
        },
    },
    nodes: [
        {
            __typename: "Dataset",
            id: "did:odf:fed01bbbdd6bf91ef55c042e10b741104517523301b13ff7120801b1c581da035cb5a",
            kind: DatasetKind.Root,
            name: "temp",
            owner: {
                __typename: "Account",
                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                accountName: "kamu",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
            },
            alias: "temp",
            visibility: mockPublicDatasetVisibility,
            metadata: {
                __typename: "DatasetMetadata",
                currentPollingSource: {
                    __typename: "SetPollingSource",
                    fetch: {
                        __typename: "FetchStepMqtt",
                        host: "test.mosquitto.org",
                        port: 1883,
                    },
                },
                currentLicense: null,
                currentWatermark: null,
            },
            createdAt: "2024-05-20T13:21:15.141982827+00:00",
            lastUpdatedAt: "2024-05-20T13:21:15.141982827+00:00",
            data: {
                __typename: "DatasetData",
                numRecordsTotal: 0,
                estimatedSize: 0,
            },
        },
    ],
    edges: [],
};

export const mockBuildGraphNodesResult: Node[] = [
    {
        id: "source-node-didodfz4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
        label: "s3.us-west-2.amazonaws.com",
        data: {
            kind: "source",
            dataObject: {},
        },
    },
    {
        id: "didodfz4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
        label: "alberta.case-details",
        data: {
            kind: "dataset",
            dataObject: {
                id: "did:odf:z4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
                name: "alberta.case-details",
                kind: "ROOT",
                isCurrent: true,
                access: LineageNodeAccess.PUBLIC,
                accountName: "kamu",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
            },
        },
    },
    {
        id: "didodfz4k88e8jmNqgCt5L84XPdaog32MttcHzGiXcktfuTuDY3QKwiyK",
        label: "alberta.case-details.hm",
        data: {
            kind: "dataset",
            dataObject: {
                id: "did:odf:z4k88e8jmNqgCt5L84XPdaog32MttcHzGiXcktfuTuDY3QKwiyK",
                name: "alberta.case-details.hm",
                kind: "DERIVATIVE",
                isCurrent: false,
                access: LineageNodeAccess.PUBLIC,
                accountName: "kamu",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
            },
        },
    },
    {
        id: "didodfz4k88e8nN5SdNPxsc5oeqwdCLvjzcvJzoyEQ938E87A15nTrkAk",
        label: "canada.case-details",
        data: {
            kind: "dataset",
            dataObject: {
                id: "did:odf:z4k88e8nN5SdNPxsc5oeqwdCLvjzcvJzoyEQ938E87A15nTrkAk",
                name: "canada.case-details",
                kind: "DERIVATIVE",
                isCurrent: false,
                access: LineageNodeAccess.PUBLIC,
                accountName: "kamu",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
            },
        },
    },
    {
        id: "didodfz4k88e8qAReYmLPFUyaKfk1UHCSY2Mkh6X1AHxuUGNhec76QsGq",
        label: "canada.daily-cases",
        data: {
            kind: "dataset",
            dataObject: {
                id: "did:odf:z4k88e8qAReYmLPFUyaKfk1UHCSY2Mkh6X1AHxuUGNhec76QsGq",
                name: "canada.daily-cases",
                kind: "DERIVATIVE",
                isCurrent: false,
                access: LineageNodeAccess.PUBLIC,
                accountName: "kamu",
                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
            },
        },
    },
];

export const mockOverviewDataUpdate = {
    content: [
        {
            offset: {
                value: 6908,
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            system_time: {
                value: "2022-08-05 21:15:03.947",
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            block_time: {
                value: "2022-08-05 20:24:55",
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            token_symbol: {
                value: "rETH",
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            event_name: {
                value: "TokensMinted",
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            amount: {
                value: 0.009679238156255232,
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            eth_amount: {
                value: 0.010000000272564223,
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            block_number: {
                value: 15284454,
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            block_hash: {
                value: "0x887569ff02456b8cde2ade8e0ee5b48d441800c8c6d92d1414a9648902807558",
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            transaction_index: {
                value: 224,
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            transaction_hash: {
                value: "0xa88698d288550d09653e6cec3038ea30fe8f74eb40941eba93b05024037426d7",
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            log_index: {
                value: 355,
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
        },
    ],
    overview: {
        __typename: "Dataset",
        id: "did:odf:z4k88e8u3rDWqP6sq96Z7gfYdHXiuG9ZDGkdPxbtqFw8VCVJvEu",
        kind: DatasetKind.Root,
        name: "net.rocketpool.reth.mint-burn",
        owner: {
            __typename: "Account",
            id: TEST_ACCOUNT_ID,
            accountName: "kamu",
        },
        alias: "kamu/net.rocketpool.reth.mint-burn",
        data: {
            __typename: "DatasetData",
            numRecordsTotal: 6909,
            estimatedSize: 1102418,
        },
        metadata: {
            __typename: "DatasetMetadata",
            currentInfo: {
                __typename: "SetInfo",
                description: null,
                keywords: null,
            },
            currentLicense: null,
            currentWatermark: "2022-08-05T20:24:55+00:00",
            currentTransform: null,
            currentPushSources: [],
            currentPollingSource: {
                __typename: "SetPollingSource",
                fetch: {
                    __typename: "FetchStepUrl",
                    url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=SPY&outputsize=full&datatype=csv&apikey=${{ env.ALPHA_VANTAGE_API_KEY }}",
                    eventTime: null,
                    headers: null,
                    cache: null,
                },
                read: {
                    __typename: "ReadStepCsv",
                    schema: [
                        "timestamp TIMESTAMP",
                        "open FLOAT",
                        "high FLOAT",
                        "low FLOAT",
                        "close FLOAT",
                        "adjusted_close FLOAT",
                        "volume FLOAT",
                        "dividend_amount FLOAT",
                        "split_coefficient FLOAT",
                    ],
                    separator: null,
                    encoding: null,
                    quote: null,
                    escape: null,
                    dateFormat: null,
                    timestampFormat: null,
                },
                merge: {
                    __typename: "MergeStrategyLedger",
                    primaryKey: ["event_time"],
                },
                prepare: null,
                preprocess: {
                    __typename: "TransformSql",
                    engine: "spark",
                    version: null,
                    queries: [
                        {
                            __typename: "SqlQueryStep",
                            query: 'select\n  timestamp as event_time,\n  "spy" as from_symbol,\n  "usd" as to_symbol,\n  open,\n  high,\n  low,\n  close\nfrom input\n',
                            alias: null,
                        },
                    ],
                    temporalTables: null,
                },
            },
            currentSchema: {
                __typename: "DataSchema",
                format: "PARQUET_JSON",
                content:
                    '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT96"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT96"}, {"name": "token_symbol", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "event_name", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "eth_amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "block_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "transaction_index", "repetition": "OPTIONAL", "type": "INT32"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "log_index", "repetition": "OPTIONAL", "type": "INT32"}]}',
            },
            currentUpstreamDependencies: [],
            currentDownstreamDependencies: [],
            currentReadme: null,
            chain: {
                __typename: "MetadataChain",
                blocks: {
                    __typename: "MetadataBlockConnection",
                    nodes: [
                        {
                            __typename: "MetadataBlockExtended",
                            blockHash: "zW1fSULqRHyTyhGXeCP4f8zX8QxcNVKNhVui42BWRdzHet3",
                            prevBlockHash: "zW1prmMP3XKbMfdWn9MQWpy4WaT8u8LADxXb8us7CTVb1Vu",
                            systemTime: "2022-08-05T21:15:03.947245004+00:00",
                            sequenceNumber: 14,
                            author: {
                                __typename: "Account",
                                id: TEST_ACCOUNT_ID,
                                accountName: "kamu",
                            },
                            event: {
                                __typename: "AddData",
                                addedOutputData: {
                                    __typename: "DataSlice",
                                    interval: {
                                        __typename: "OffsetInterval",
                                        start: 0,
                                        end: 6908,
                                    },
                                    logicalHash: "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                                    physicalHash: "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                                },
                            },
                        },
                    ],
                    totalCount: 4,
                    pageInfo: {
                        __typename: "PageBasedInfo",
                        hasNextPage: true,
                        hasPreviousPage: false,
                        currentPage: 0,
                        totalPages: 4,
                    },
                },
            },
        },
        createdAt: "2022-08-05T21:10:57.332924745+00:00",
        lastUpdatedAt: "2022-08-05T21:15:03.947245004+00:00",
    },
    size: {
        __typename: "DatasetData",
        numRecordsTotal: 6909,
        estimatedSize: 1102418,
    },
};

export const mockOverviewDataUpdateNullable = {
    content: [
        {
            offset: 6908,
            system_time: "2022-08-05 21:15:03.947",
            block_time: "2022-08-05 20:24:55",
            token_symbol: "rETH",
            event_name: "TokensMinted",
            amount: 0.009679238156255232,
            eth_amount: 0.010000000272564223,
            block_number: 15284454,
            block_hash: "0x887569ff02456b8cde2ade8e0ee5b48d441800c8c6d92d1414a9648902807558",
            transaction_index: 224,
            transaction_hash: "0xa88698d288550d09653e6cec3038ea30fe8f74eb40941eba93b05024037426d7",
            log_index: 355,
        },
    ],
    overview: {
        __typename: "Dataset",
        id: "did:odf:z4k88e8u3rDWqP6sq96Z7gfYdHXiuG9ZDGkdPxbtqFw8VCVJvEu",
        kind: DatasetKind.Root,
        name: "net.rocketpool.reth.mint-burn",
        owner: {
            __typename: "Account",
            id: TEST_ACCOUNT_ID,
            accountName: "kamu",
        },
        alias: "kamu/net.rocketpool.reth.mint-burn",
        data: {
            __typename: "DatasetData",
            numRecordsTotal: 6909,
            estimatedSize: 1102418,
        },
        metadata: {
            __typename: "DatasetMetadata",
            currentInfo: {
                __typename: "SetInfo",
                description: null,
                keywords: null,
            },
            currentLicense: null,
            currentWatermark: "2022-08-05T20:24:55+00:00",
            currentTransform: null,
            currentPushSources: [],
            currentPollingSource: null,
            currentSchema: {
                __typename: "DataSchema",
                format: "PARQUET_JSON",
                content:
                    '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT96"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT96"}, {"name": "token_symbol", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "event_name", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "eth_amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "block_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "transaction_index", "repetition": "OPTIONAL", "type": "INT32"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "log_index", "repetition": "OPTIONAL", "type": "INT32"}]}',
            },
            currentUpstreamDependencies: [],
            currentDownstreamDependencies: [],
            currentReadme: null,
            chain: {
                __typename: "MetadataChain",
                blocks: {
                    __typename: "MetadataBlockConnection",
                    nodes: [
                        {
                            __typename: "MetadataBlockExtended",
                            blockHash: "zW1fSULqRHyTyhGXeCP4f8zX8QxcNVKNhVui42BWRdzHet3",
                            prevBlockHash: "zW1prmMP3XKbMfdWn9MQWpy4WaT8u8LADxXb8us7CTVb1Vu",
                            systemTime: "2022-08-05T21:15:03.947245004+00:00",
                            sequenceNumber: 14,
                            author: {
                                __typename: "Account",
                                id: TEST_ACCOUNT_ID,
                                accountName: "kamu",
                            },
                            event: {
                                __typename: "AddData",
                                addedOutputData: {
                                    __typename: "DataSlice",
                                    interval: {
                                        __typename: "OffsetInterval",
                                        start: 0,
                                        end: 6908,
                                    },
                                    logicalHash: "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                                    physicalHash: "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                                },
                            },
                        },
                    ],
                    totalCount: 4,
                    pageInfo: {
                        __typename: "PageBasedInfo",
                        hasNextPage: true,
                        hasPreviousPage: false,
                        currentPage: 0,
                        totalPages: 4,
                    },
                },
            },
        },
        createdAt: "2022-08-05T21:10:57.332924745+00:00",
        lastUpdatedAt: "2022-08-05T21:15:03.947245004+00:00",
    },
    size: {
        __typename: "DatasetData",
        numRecordsTotal: 6909,
        estimatedSize: 1102418,
    },
};

export const mockMetadataRootUpdate: MetadataSchemaUpdate = {
    schema: {
        name: "spark_schema",
        type: "struct",
        fields: [
            {
                name: "offset",
                repetition: "OPTIONAL",
                type: "INT64",
            },
            {
                name: "system_time",
                repetition: "REQUIRED",
                type: "INT64",
                logicalType: "TIMESTAMP_MILLIS",
            },
            {
                name: "date_reported",
                repetition: "OPTIONAL",
                type: "INT64",
                logicalType: "TIMESTAMP_MILLIS",
            },
            {
                name: "id",
                repetition: "OPTIONAL",
                type: "INT64",
            },
            {
                name: "zone",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "gender",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "age_group",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "case_status",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "case_type",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
        ],
    },
    pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
        currentPage: 1,
    },
    metadataSummary: {
        __typename: "Dataset",
        metadata: {
            __typename: "DatasetMetadata",
            currentPollingSource: {
                __typename: "SetPollingSource",
                fetch: {
                    __typename: "FetchStepUrl",
                    url: "https://www.alberta.ca/data/stats/covid-19-alberta-statistics-data.csv",
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
                    dateFormat: null,
                    timestampFormat: null,
                },
                merge: {
                    __typename: "MergeStrategyLedger",
                    primaryKey: ["id"],
                },
                prepare: null,
                preprocess: null,
            },
            currentTransform: null,
            currentPushSources: [],
            currentInfo: {
                __typename: "SetInfo",
                description: "Confirmed positive cases of COVID-19 in Alberta",
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
            currentWatermark: "2023-06-04T00:00:00+00:00",
            currentSchema: {
                __typename: "DataSchema",
                format: DataSchemaFormat.ParquetJson,
                content:
                    '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP_MILLIS"}, {"name": "date_reported", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP_MILLIS"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "zone", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "gender", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "age_group", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "case_status", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "case_type", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}]}',
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
                refs: [
                    {
                        name: "head",
                        blockHash: "f16207c1039f6d9f5e107a2285ccfe04bc88cb65ddd2b217ceb62b717774b2f85f1f5",
                    },
                ],
                blocks: {
                    __typename: "MetadataBlockConnection",
                    nodes: [
                        {
                            __typename: "MetadataBlockExtended",
                            blockHash: "zW1h1jepxH1cGJK7PwTci988ng1EiDWuEeDJHGb1wzhC3ri",
                            prevBlockHash: "zW1fDLR8CtfhywWktkMRvysBf2eTj7cV5FerxeQty1Ty5YP",
                            systemTime: "2023-09-04T19:27:35.059076203+00:00",
                            sequenceNumber: 13,
                            author: {
                                __typename: "Account",
                                id: TEST_ACCOUNT_ID,
                                accountName: "sergeiz",
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
                                                "# Confirmed positive cases of COVID-19 in Alberta\n\nThis dataset compiles daily snapshots of publicly reported data on 2019 Novel Coronavirus (COVID-19) testing in Alberta.\n\nData includes:\n- approximation of onset date\n- age group\n- patient gender\n- case acquisition information\n- patient outcome\n- reporting Public Health Unit (PHU)\n- postal code, website, longitude, and latitude of PHU\n\nThis dataset is subject to change. Please review the daily epidemiologic summaries for information on variables, methodology, and technical considerations.\n\n**Related dataset(s)**:\n- [Daily aggregate count of confirmed positive cases of COVID-19 in Alberta](#todo)\n",
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    totalCount: 14,
                    pageInfo: {
                        __typename: "PageBasedInfo",
                        hasNextPage: true,
                        hasPreviousPage: false,
                        currentPage: 0,
                        totalPages: 14,
                    },
                },
            },
        },
    },
};

export const mockMetadataRootPushSourceUpdate: MetadataSchemaUpdate = {
    schema: {
        name: "spark_schema",
        type: "struct",
        fields: [
            {
                name: "offset",
                repetition: "OPTIONAL",
                type: "INT64",
            },
            {
                name: "system_time",
                repetition: "REQUIRED",
                type: "INT64",
                logicalType: "TIMESTAMP_MILLIS",
            },
            {
                name: "date_reported",
                repetition: "OPTIONAL",
                type: "INT64",
                logicalType: "TIMESTAMP_MILLIS",
            },
            {
                name: "id",
                repetition: "OPTIONAL",
                type: "INT64",
            },
            {
                name: "zone",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "gender",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "age_group",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "case_status",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "case_type",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
        ],
    },
    pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
        currentPage: 1,
    },
    metadataSummary: {
        __typename: "Dataset",
        metadata: {
            __typename: "DatasetMetadata",
            currentPollingSource: null,
            currentTransform: null,
            currentPushSources: [
                {
                    __typename: "AddPushSource",
                    sourceName: "mockNmae",
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
                        dateFormat: null,
                        timestampFormat: null,
                    },
                    merge: {
                        __typename: "MergeStrategyLedger",
                        primaryKey: ["id"],
                    },
                    preprocess: null,
                },
            ],
            currentInfo: {
                __typename: "SetInfo",
                description: "Confirmed positive cases of COVID-19 in Alberta",
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
            currentWatermark: "2023-06-04T00:00:00+00:00",
            currentSchema: {
                __typename: "DataSchema",
                format: DataSchemaFormat.ParquetJson,
                content:
                    '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP_MILLIS"}, {"name": "date_reported", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP_MILLIS"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "zone", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "gender", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "age_group", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "case_status", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "case_type", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}]}',
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
                refs: [
                    {
                        name: "head",
                        blockHash: "f16207c1039f6d9f5e107a2285ccfe04bc88cb65ddd2b217ceb62b717774b2f85f1f5",
                    },
                ],
                blocks: {
                    __typename: "MetadataBlockConnection",
                    nodes: [
                        {
                            __typename: "MetadataBlockExtended",
                            blockHash: "zW1h1jepxH1cGJK7PwTci988ng1EiDWuEeDJHGb1wzhC3ri",
                            prevBlockHash: "zW1fDLR8CtfhywWktkMRvysBf2eTj7cV5FerxeQty1Ty5YP",
                            systemTime: "2023-09-04T19:27:35.059076203+00:00",
                            sequenceNumber: 13,
                            author: {
                                __typename: "Account",
                                id: TEST_ACCOUNT_ID,
                                accountName: "sergeiz",
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
                                                "# Confirmed positive cases of COVID-19 in Alberta\n\nThis dataset compiles daily snapshots of publicly reported data on 2019 Novel Coronavirus (COVID-19) testing in Alberta.\n\nData includes:\n- approximation of onset date\n- age group\n- patient gender\n- case acquisition information\n- patient outcome\n- reporting Public Health Unit (PHU)\n- postal code, website, longitude, and latitude of PHU\n\nThis dataset is subject to change. Please review the daily epidemiologic summaries for information on variables, methodology, and technical considerations.\n\n**Related dataset(s)**:\n- [Daily aggregate count of confirmed positive cases of COVID-19 in Alberta](#todo)\n",
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    totalCount: 14,
                    pageInfo: {
                        __typename: "PageBasedInfo",
                        hasNextPage: true,
                        hasPreviousPage: false,
                        currentPage: 0,
                        totalPages: 14,
                    },
                },
            },
        },
    },
};

export const mockMetadataDerivedUpdate: MetadataSchemaUpdate = {
    schema: {
        name: "spark_schema",
        type: "struct",
        fields: [
            {
                name: "offset",
                repetition: "OPTIONAL",
                type: "INT64",
            },
            {
                name: "system_time",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "block_time",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "token_symbol",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "event_name",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "amount",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "eth_amount",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "block_number",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "block_hash",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "transaction_index",
                repetition: "REQUIRED",
                type: "INT96",
            },

            {
                name: "transaction_hash",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "log_index",
                repetition: "REQUIRED",
                type: "INT96",
            },
        ],
    },
    metadataSummary: {
        __typename: "Dataset",
        metadata: {
            __typename: "DatasetMetadata",
            currentInfo: {
                __typename: "SetInfo",
                description: "Confirmed positive cases of COVID-19 in Alberta (harmonized).",
                keywords: [
                    "Healthcare",
                    "Epidemiology",
                    "COVID-19",
                    "SARS-CoV-2",
                    "Disaggregated",
                    "Anonymized",
                    "Alberta",
                    "Canada",
                    "Harmonized",
                ],
            },
            currentPushSources: [],
            currentLicense: {
                __typename: "SetLicense",
                shortName: "OGL-Canada-2.0",
                name: "Open Government Licence - Canada",
                spdxId: "OGL-Canada-2.0",
                websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
            },
            currentWatermark: "2022-08-01T00:00:00+00:00",
            currentTransform: {
                __typename: "SetTransform",
                inputs: [
                    {
                        __typename: "TransformInput",
                        datasetRef: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                        alias: "alberta.case-details",
                        inputDataset: {
                            message: "Success",
                            __typename: "TransformInputDatasetAccessible",
                            dataset: {
                                __typename: "Dataset",
                                id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                                kind: DatasetKind.Root,
                                name: "alberta.case-details",
                                owner: {
                                    __typename: "Account",
                                    id: TEST_ACCOUNT_ID,
                                    accountName: "kamu",
                                },
                                alias: "kamu/alberta.case-details",
                                visibility: mockPublicDatasetVisibility,
                            },
                        },
                    },
                ],
                transform: {
                    __typename: "TransformSql",
                    engine: "spark",
                    version: null,
                    queries: [
                        {
                            __typename: "SqlQueryStep",
                            alias: null,
                            query: "SELECT\n  id,\n  date_reported as reported_date,\n  case when lower(gender) = 'male' then 'M' \n       when lower(gender) = 'female' then 'F' \n       else 'U' end as gender,\n  case when age_group = 'Under 1 year' then '<20'\n       when age_group = '1-4 years' then '<20'\n       when age_group = '5-9 years' then '<20'\n       when age_group = '10-19 years' then '<20'\n       when age_group = '20-29 years' then '20s'\n       when age_group = '30-39 years' then '30s'\n       when age_group = '40-49 years' then '40s'\n       when age_group = '50-59 years' then '50s'\n       when age_group = '60-69 years' then '60s'\n       when age_group = '70-79 years' then '70s'\n       when age_group = '80+ years' then '80s'\n       else 'UNKNOWN' end as age_group,\n  zone as location\n  FROM `alberta.case-details`\n",
                        },
                    ],
                    temporalTables: null,
                },
            },
            currentSchema: {
                __typename: "DataSchema",
                format: DataSchemaFormat.ParquetJson,
                content:
                    '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT96"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "reported_date", "repetition": "OPTIONAL", "type": "INT96"}, {"name": "gender", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "age_group", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "location", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}]}',
            },
            currentReadme:
                "# Harmonized COVID-19 case data from Alberta\n\nSee [original dataset](#todo).\n\nSee [harmonization schema and semantics](#todo).\n",
            chain: {
                __typename: "MetadataChain",
                refs: [
                    {
                        name: "head",
                        blockHash: "f16207c1039f6d9f5e107a2285ccfe04bc88cb65ddd2b217ceb62b717774b2f85f1f5",
                    },
                ],
                blocks: {
                    __typename: "MetadataBlockConnection",
                    nodes: [
                        {
                            __typename: "MetadataBlockExtended",
                            blockHash: "zW1hNbxPz28K1oLNGbddudUzKKLT9LDPh8chjksEo6HcDev",
                            prevBlockHash: "zW1abnmxotsSC7H6SyfbL7bpWtQrMSQktUfiJds3KWX1xfm",
                            systemTime: "2022-08-05T21:20:08.053635579+00:00",
                            sequenceNumber: 6,
                            author: {
                                __typename: "Account",
                                id: TEST_ACCOUNT_ID,
                                accountName: "kamu",
                            },
                            event: {
                                __typename: "ExecuteTransform",
                                newData: {
                                    __typename: "DataSlice",
                                    offsetInterval: {
                                        __typename: "OffsetInterval",
                                        start: 0,
                                        end: 596125,
                                    },
                                    logicalHash: "z63ZND5B21T2Dbmr2bB2Eu2Y4fjEJzLYrwiumM7ApeU24N29qpna",
                                    physicalHash: "zW1i7cajDaJjwxCRaRyGHqJpDrqZXbm1wMZkaWrH8a8Cmbd",
                                    size: 2323,
                                },
                                prevCheckpoint: null,
                                newWatermark: "2022-08-01T00:00:00+00:00",
                                queryInputs: [
                                    {
                                        __typename: "ExecuteTransformInput",
                                        datasetId: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                                        prevBlockHash: "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX",
                                        newBlockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
                                        prevOffset: null,
                                        newOffset: 596125,
                                    },
                                ],
                                newCheckpoint: {
                                    __typename: "Checkpoint",
                                    physicalHash: "zW1otipGpjScUH8C2RfaF4s8RshReBbQVPDf2fPrp2R8Ft2",
                                    size: 2560,
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
    },
    pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
        currentPage: 1,
    },
};

export const mockOverviewWithSetInfo = {
    __typename: "Dataset",
    id: "did:odf:z4k88e8u3rDWqP6sq96Z7gfYdHXiuG9ZDGkdPxbtqFw8VCVJvEu",
    kind: DatasetKind.Root,
    name: "net.rocketpool.reth.mint-burn",
    owner: {
        __typename: "Account",
        id: TEST_ACCOUNT_ID,
        accountName: "kamu",
    },
    alias: "kamu/net.rocketpool.reth.mint-burn",
    data: {
        __typename: "DatasetData",
        numRecordsTotal: 6909,
        estimatedSize: 1102418,
    },
    metadata: {
        __typename: "DatasetMetadata",
        currentInfo: {
            __typename: "SetInfo",
            description: "mock description",
            keywords: ["mock1", "mock2"],
        },
        currentLicense: null,
        currentWatermark: "2022-08-05T20:24:55+00:00",
        currentTransform: null,
        currentPushSources: [],
        currentPollingSource: {
            __typename: "SetPollingSource",
            fetch: {
                __typename: "FetchStepUrl",
                url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=SPY&outputsize=full&datatype=csv&apikey=${{ env.ALPHA_VANTAGE_API_KEY }}",
                eventTime: null,
                headers: null,
                cache: null,
            },
            read: {
                __typename: "ReadStepCsv",
                schema: [
                    "timestamp TIMESTAMP",
                    "open FLOAT",
                    "high FLOAT",
                    "low FLOAT",
                    "close FLOAT",
                    "adjusted_close FLOAT",
                    "volume FLOAT",
                    "dividend_amount FLOAT",
                    "split_coefficient FLOAT",
                ],
                separator: null,
                encoding: null,
                quote: null,
                escape: null,
                dateFormat: null,
                timestampFormat: null,
            },
            merge: {
                __typename: "MergeStrategyLedger",
                primaryKey: ["event_time"],
            },
            prepare: null,
            preprocess: {
                __typename: "TransformSql",
                engine: "spark",
                version: null,
                queries: [
                    {
                        __typename: "SqlQueryStep",
                        query: 'select\n  timestamp as event_time,\n  "spy" as from_symbol,\n  "usd" as to_symbol,\n  open,\n  high,\n  low,\n  close\nfrom input\n',
                        alias: null,
                    },
                ],
                temporalTables: null,
            },
        },
        currentSchema: {
            __typename: "DataSchema",
            format: "PARQUET_JSON",
            content:
                '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT96"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT96"}, {"name": "token_symbol", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "event_name", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "eth_amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "block_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "transaction_index", "repetition": "OPTIONAL", "type": "INT32"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "log_index", "repetition": "OPTIONAL", "type": "INT32"}]}',
        },
        currentUpstreamDependencies: [],
        currentDownstreamDependencies: [],
        currentReadme: null,
        chain: {
            __typename: "MetadataChain",
            blocks: {
                __typename: "MetadataBlockConnection",
                nodes: [
                    {
                        __typename: "MetadataBlockExtended",
                        blockHash: "zW1fSULqRHyTyhGXeCP4f8zX8QxcNVKNhVui42BWRdzHet3",
                        prevBlockHash: "zW1prmMP3XKbMfdWn9MQWpy4WaT8u8LADxXb8us7CTVb1Vu",
                        systemTime: "2022-08-05T21:15:03.947245004+00:00",
                        sequenceNumber: 14,
                        author: {
                            __typename: "Account",
                            id: TEST_ACCOUNT_ID,
                            accountName: "kamu",
                        },
                        event: {
                            __typename: "AddData",
                            addedOutputData: {
                                __typename: "DataSlice",
                                interval: {
                                    __typename: "OffsetInterval",
                                    start: 0,
                                    end: 6908,
                                },
                                logicalHash: "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                                physicalHash: "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                            },
                        },
                    },
                ],
                totalCount: 4,
                pageInfo: {
                    __typename: "PageBasedInfo",
                    hasNextPage: true,
                    hasPreviousPage: false,
                    currentPage: 0,
                    totalPages: 4,
                },
            },
        },
    },
    createdAt: "2022-08-05T21:10:57.332924745+00:00",
    lastUpdatedAt: "2022-08-05T21:15:03.947245004+00:00",
};

export const mockOverviewWithSetLicense = {
    __typename: "Dataset",
    id: "did:odf:z4k88e8u3rDWqP6sq96Z7gfYdHXiuG9ZDGkdPxbtqFw8VCVJvEu",
    kind: DatasetKind.Root,
    name: "net.rocketpool.reth.mint-burn",
    owner: {
        __typename: "Account",
        id: TEST_ACCOUNT_ID,
        accountName: "kamu",
    },
    alias: "kamu/net.rocketpool.reth.mint-burn",
    data: {
        __typename: "DatasetData",
        numRecordsTotal: 6909,
        estimatedSize: 1102418,
    },
    metadata: {
        __typename: "DatasetMetadata",
        currentInfo: {
            __typename: "SetInfo",
            description: "mock description",
            keywords: ["mock1", "mock2"],
        },
        currentLicense: {
            shortName: "OGL-Canada-2.0",
            name: "Open Government Licence - Canada",
            spdxId: "OGL-Canada-2.0",
            websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
            __typename: "SetLicense",
        },
        currentWatermark: "2022-08-05T20:24:55+00:00",
        currentTransform: null,
        currentPushSources: [],
        currentPollingSource: {
            __typename: "SetPollingSource",
            fetch: {
                __typename: "FetchStepUrl",
                url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=SPY&outputsize=full&datatype=csv&apikey=${{ env.ALPHA_VANTAGE_API_KEY }}",
                eventTime: null,
                headers: null,
                cache: null,
            },
            read: {
                __typename: "ReadStepCsv",
                schema: [
                    "timestamp TIMESTAMP",
                    "open FLOAT",
                    "high FLOAT",
                    "low FLOAT",
                    "close FLOAT",
                    "adjusted_close FLOAT",
                    "volume FLOAT",
                    "dividend_amount FLOAT",
                    "split_coefficient FLOAT",
                ],
                separator: null,
                encoding: null,
                quote: null,
                escape: null,
                dateFormat: null,
                timestampFormat: null,
            },
            merge: {
                __typename: "MergeStrategyLedger",
                primaryKey: ["event_time"],
            },
            prepare: null,
            preprocess: {
                __typename: "TransformSql",
                engine: "spark",
                version: null,
                queries: [
                    {
                        __typename: "SqlQueryStep",
                        query: 'select\n  timestamp as event_time,\n  "spy" as from_symbol,\n  "usd" as to_symbol,\n  open,\n  high,\n  low,\n  close\nfrom input\n',
                        alias: null,
                    },
                ],
                temporalTables: null,
            },
        },
        currentSchema: {
            __typename: "DataSchema",
            format: "PARQUET_JSON",
            content:
                '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT96"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT96"}, {"name": "token_symbol", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "event_name", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "eth_amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "block_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "transaction_index", "repetition": "OPTIONAL", "type": "INT32"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "log_index", "repetition": "OPTIONAL", "type": "INT32"}]}',
        },
        currentUpstreamDependencies: [],
        currentDownstreamDependencies: [],
        currentReadme: null,
        chain: {
            __typename: "MetadataChain",
            blocks: {
                __typename: "MetadataBlockConnection",
                nodes: [
                    {
                        __typename: "MetadataBlockExtended",
                        blockHash: "zW1fSULqRHyTyhGXeCP4f8zX8QxcNVKNhVui42BWRdzHet3",
                        prevBlockHash: "zW1prmMP3XKbMfdWn9MQWpy4WaT8u8LADxXb8us7CTVb1Vu",
                        systemTime: "2022-08-05T21:15:03.947245004+00:00",
                        sequenceNumber: 14,
                        author: {
                            __typename: "Account",
                            id: TEST_ACCOUNT_ID,
                            accountName: "kamu",
                        },
                        event: {
                            __typename: "AddData",
                            addedOutputData: {
                                __typename: "DataSlice",
                                interval: {
                                    __typename: "OffsetInterval",
                                    start: 0,
                                    end: 6908,
                                },
                                logicalHash: "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                                physicalHash: "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                            },
                        },
                    },
                ],
                totalCount: 4,
                pageInfo: {
                    __typename: "PageBasedInfo",
                    hasNextPage: true,
                    hasPreviousPage: false,
                    currentPage: 0,
                    totalPages: 4,
                },
            },
        },
    },
    createdAt: "2022-08-05T21:10:57.332924745+00:00",
    lastUpdatedAt: "2022-08-05T21:15:03.947245004+00:00",
};

export const datasetMetadataDerivativeDataset: DatasetMetadata = {
    __typename: "DatasetMetadata",
    currentPollingSource: null,
    currentTransform: {
        __typename: "SetTransform",
        inputs: [],
        transform: {
            __typename: "TransformSql",
            engine: "flink",
            version: null,
            queries: [
                {
                    __typename: "SqlQueryStep",
                    alias: "token_transfers",
                    query: "select\n  *,\n  case\n    when `to` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then value_fp\n    when `from` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then -value_fp\n    else 0\n  end as token_amount\nfrom (\n  select\n    *,\n    cast(`value` as float) / power(10.0, cast(token_decimal as int)) as value_fp\n  from `account.tokens.transfers`\n)\n",
                },
                {
                    __typename: "SqlQueryStep",
                    alias: "transactions",
                    query: "select\n  *,\n  case\n    when `to` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then value_fp\n    when `from` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then -value_fp\n    else 0\n  end as eth_amount\nfrom (\n  select\n    *,\n    cast(`value` as float) / power(10.0, 18) as value_fp\n  from `account.transactions`\n)\n",
                },
                {
                    __typename: "SqlQueryStep",
                    alias: "token_transactions",
                    query: "select\n  tr.block_time,\n  tr.block_number,\n  tr.transaction_hash,\n  tx.symbol as account_symbol,\n  tr.token_symbol,\n  tr.token_amount,\n  tx.eth_amount\nfrom token_transfers as tr\nleft join transactions as tx\non \n  tr.transaction_hash = tx.transaction_hash\n  and tr.block_time = tx.block_time\n",
                },
                {
                    __typename: "SqlQueryStep",
                    alias: null,
                    query: "select\n  *,\n  sum(token_amount) over (partition by token_symbol order by block_time) as token_balance,\n  sum(-eth_amount) over (partition by token_symbol order by block_time) as token_book_value_eth\nfrom token_transactions\n",
                },
            ],
            temporalTables: null,
        },
    },
    currentPushSources: [],
    currentInfo: {
        __typename: "SetInfo",
        description: null,
        keywords: null,
    },
    currentLicense: null,
    currentWatermark: "2025-02-13T03:47:11+00:00",
    currentSchema: {
        __typename: "DataSchema",
        format: DataSchemaFormat.ParquetJson,
        content:
            '{"name": "arrow_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "REQUIRED", "type": "INT64"}, {"name": "op", "repetition": "REQUIRED", "type": "INT32"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "account_symbol", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "token_symbol", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "token_amount", "repetition": "OPTIONAL", "type": "FLOAT"}, {"name": "eth_amount", "repetition": "OPTIONAL", "type": "FLOAT"}, {"name": "token_balance", "repetition": "OPTIONAL", "type": "FLOAT"}, {"name": "token_book_value_eth", "repetition": "OPTIONAL", "type": "FLOAT"}]}',
    },
    currentVocab: {
        __typename: "SetVocab",
        offsetColumn: null,
        operationTypeColumn: null,
        systemTimeColumn: null,
        eventTimeColumn: "block_time",
    },
    currentReadme: null,
    currentUpstreamDependencies: [],
    currentDownstreamDependencies: [],
    chain: {
        __typename: undefined,
        blockByHash: undefined,
        blockByHashEncoded: undefined,
        blocks: {
            __typename: undefined,
            edges: [],
            nodes: [],
            pageInfo: {
                __typename: undefined,
                currentPage: 0,
                hasNextPage: false,
                hasPreviousPage: false,
                totalPages: undefined,
            },
            totalCount: 0,
        },
        refs: [],
    },
    pushSyncStatuses: {
        __typename: undefined,
        statuses: [],
    },
};

export const datasetMetadataRootDataset: DatasetMetadata = {
    __typename: "DatasetMetadata",
    currentPollingSource: {
        __typename: "SetPollingSource",
        fetch: {
            __typename: "FetchStepUrl",
            url: "https://api.etherscan.io/api?module=account&action=tokentx&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}",
            eventTime: null,
            headers: null,
            cache: null,
        },
        read: {
            __typename: "ReadStepJson",
            subPath: "result",
            schema: null,
            dateFormat: null,
            encoding: null,
            timestampFormat: null,
        },
        merge: {
            __typename: "MergeStrategyLedger",
            primaryKey: ["transaction_hash"],
        },
        prepare: null,
        preprocess: {
            __typename: "TransformSql",
            engine: "datafusion",
            version: null,
            queries: [
                {
                    __typename: "SqlQueryStep",
                    query: 'SELECT\n  to_timestamp_seconds(cast(timeStamp as bigint)) as block_time,\n  cast(blockNumber as bigint) as block_number,\n  blockHash as block_hash,\n  hash as transaction_hash,\n  transactionIndex as transaction_index,\n  nonce,\n  "from",\n  to,\n  value,\n  contractAddress as contract_address,\n  tokenName as token_name,\n  tokenSymbol as token_symbol,\n  tokenDecimal as token_decimal,\n  gas,\n  gasPrice as gas_price,\n  gasUsed as gas_used,\n  cumulativeGasUsed as cumulative_gas_used,\n  confirmations\nFROM input\n',
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
        description: null,
        keywords: null,
    },
    currentLicense: {
        __typename: "SetLicense",
        shortName: "DDDD",
        name: "SADSAD",
        spdxId: null,
        websiteUrl: "http://test.com",
    },
    currentWatermark: "2025-02-13T03:47:11+00:00",
    currentSchema: {
        __typename: "DataSchema",
        format: DataSchemaFormat.ParquetJson,
        content:
            '{"name": "arrow_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "REQUIRED", "type": "INT64"}, {"name": "op", "repetition": "REQUIRED", "type": "INT32"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "block_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "transaction_index", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "nonce", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "from", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "to", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "value", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "contract_address", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "token_name", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "token_symbol", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "token_decimal", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "gas", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "gas_price", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "gas_used", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "cumulative_gas_used", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "confirmations", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}]}',
    },
    currentVocab: {
        __typename: "SetVocab",
        offsetColumn: null,
        operationTypeColumn: null,
        systemTimeColumn: null,
        eventTimeColumn: "block_time",
    },
    currentReadme: null,
    chain: {
        __typename: undefined,
        blockByHash: undefined,
        blockByHashEncoded: undefined,
        blocks: {
            __typename: undefined,
            edges: [],
            nodes: [],
            pageInfo: {
                __typename: undefined,
                currentPage: 0,
                hasNextPage: false,
                hasPreviousPage: false,
                totalPages: undefined,
            },
            totalCount: 0,
        },
        refs: [],
    },
    currentDownstreamDependencies: [],
    currentUpstreamDependencies: [],
    pushSyncStatuses: {
        __typename: undefined,
        statuses: [],
    },
};

export const mockOverviewUpdate = {
    schema: mockMetadataRootPushSourceUpdate.schema,
    content: mockOverviewDataUpdate.content,
    overview: structuredClone(mockOverviewDataUpdate.overview), // clone, as we modify this data in the tests
    size: mockOverviewDataUpdate.size,
} as OverviewUpdate;
