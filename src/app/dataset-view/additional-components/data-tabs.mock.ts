/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DynamicTableColumnClassEnum } from "@common/components/dynamic-table/dynamic-table.interface";
import {
    CurrentSourceFetchUrlFragment,
    DataSchemaFormat,
    DatasetKind,
    DatasetLineageBasicsFragment,
    DatasetOverviewFragment,
    DatasetOverviewMetadataDataFragment,
} from "@api/kamu.graphql.interface";
import { TEST_AVATAR_URL } from "@api/mock/auth.mock";
import { OdfTypes } from "@interface/dataset-schema.interface";

import {
    LineageGraphNode,
    LineageGraphNodeKind,
    LineageNodeAccess,
} from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import {
    DatasetHistoryUpdate,
    DataSqlErrorUpdate,
    DataUpdate,
    LineageUpdate,
    MetadataSchemaUpdate,
    OverviewUpdate,
} from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    mockDatasetBasicsDerivedFragment,
    mockMetadataCurrentLicense,
    mockOwnerFieldsWithAvatar,
    mockPublicDatasetVisibility,
} from "src/app/search/mock.data";

export const mockDataUpdate: DataUpdate = {
    schema: {
        fields: [
            {
                name: "mockName",
                type: {
                    kind: OdfTypes.String,
                },
            },
        ],
    },
    content: [
        {
            mockName: {
                value: "someValueOfMockType",
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
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
                ...mockOwnerFieldsWithAvatar,
            },
            event: {
                __typename: "AddData",
                newWatermark: "2022-08-01T00:00:00+00:00",
                prevCheckpoint: null,
                newData: {
                    __typename: "DataSlice",
                    offsetInterval: {
                        __typename: "OffsetInterval",
                        start: "0",
                        end: "596125",
                    },
                    logicalHash: "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
                    physicalHash: "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
                    size: "5993876",
                },
                newCheckpoint: {
                    __typename: "Checkpoint",
                    physicalHash: "zW1diFMSn97sDG4WMMKZ7pvM7vVenC5ytAesQK7V3qqALPv",
                    size: "2560",
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
    __typename: "DatasetMetadata",
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
    data: { __typename: "DatasetData", numRecordsTotal: 127, estimatedSizeBytes: 14515 },
    metadata: {
        ...mockCurrentSourceFetchUrlFragment,
        currentLicense: null,
        currentPushSources: [],
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
            ...mockOwnerFieldsWithAvatar,
        },
        alias: "kamu/alberta.case-details",
        visibility: mockPublicDatasetVisibility,
        metadata: {
            __typename: "DatasetMetadata",
            currentPushSources: [],
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
            estimatedSizeBytes: 6585116,
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
                ...mockOwnerFieldsWithAvatar,
            },
            alias: "kamu/alberta.case-details",
            visibility: mockPublicDatasetVisibility,

            metadata: {
                __typename: "DatasetMetadata",
                currentPushSources: [],
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
                estimatedSizeBytes: 6585116,
            },
            createdAt: "2023-09-03T01:08:55.104604199+00:00",
            lastUpdatedAt: "2023-09-03T01:09:31.587025138+00:00",
        },
        {
            __typename: "Dataset",
            metadata: {
                __typename: "DatasetMetadata",
                currentPollingSource: null,
                currentPushSources: [],
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
                estimatedSizeBytes: 6562253,
            },
            owner: {
                ...mockOwnerFieldsWithAvatar,
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
                currentPushSources: [],
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
                estimatedSizeBytes: 39905730,
            },
            owner: {
                ...mockOwnerFieldsWithAvatar,
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
                currentPushSources: [],
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
                estimatedSizeBytes: 21685,
            },
            owner: {
                ...mockOwnerFieldsWithAvatar,
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
                    ...mockOwnerFieldsWithAvatar,
                },
                alias: "kamu/alberta.case-details",
                visibility: mockPublicDatasetVisibility,
                metadata: {
                    __typename: "DatasetMetadata",
                    currentPushSources: [],
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
                    estimatedSizeBytes: 6585116,
                },
                createdAt: "2023-09-03T01:08:55.104604199+00:00",
                lastUpdatedAt: "2023-09-03T01:09:31.587025138+00:00",
            },
            {
                __typename: "Dataset",
                metadata: {
                    __typename: "DatasetMetadata",
                    currentPollingSource: null,
                    currentPushSources: [],
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
                    estimatedSizeBytes: 6562253,
                },
                owner: {
                    ...mockOwnerFieldsWithAvatar,
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
                    currentPushSources: [],
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
                    estimatedSizeBytes: 6562253,
                },
                owner: {
                    ...mockOwnerFieldsWithAvatar,
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
                    currentPushSources: [],
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
                    estimatedSizeBytes: 39905730,
                },
                owner: {
                    ...mockOwnerFieldsWithAvatar,
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
                    currentPushSources: [],
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
                    estimatedSizeBytes: 39905730,
                },
                owner: {
                    ...mockOwnerFieldsWithAvatar,
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
                    currentPushSources: [],
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
                    estimatedSizeBytes: 21685,
                },
                owner: {
                    ...mockOwnerFieldsWithAvatar,
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
            ...mockOwnerFieldsWithAvatar,
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
            currentPushSources: [],
            currentWatermark: null,
        },
        createdAt: "2024-05-20T13:21:15.141982827+00:00",
        lastUpdatedAt: "2024-05-20T13:21:15.141982827+00:00",
        data: {
            __typename: "DatasetData",
            numRecordsTotal: 0,
            estimatedSizeBytes: 0,
        },
    },
    nodes: [
        {
            __typename: "Dataset",
            id: "did:odf:fed01bbbdd6bf91ef55c042e10b741104517523301b13ff7120801b1c581da035cb5a",
            kind: DatasetKind.Root,
            name: "temp",
            owner: {
                ...mockOwnerFieldsWithAvatar,
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
                currentPushSources: [],
                currentWatermark: null,
            },
            createdAt: "2024-05-20T13:21:15.141982827+00:00",
            lastUpdatedAt: "2024-05-20T13:21:15.141982827+00:00",
            data: {
                __typename: "DatasetData",
                numRecordsTotal: 0,
                estimatedSizeBytes: 0,
            },
        },
    ],
    edges: [],
};

export const mockBuildGraphNodesResult: LineageGraphNode[] = [
    {
        id: "source-node-didodfz4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
        label: "s3.us-west-2.amazonaws.com",
        data: {
            kind: LineageGraphNodeKind.Source,
        },
    },
    {
        id: "didodfz4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
        label: "alberta.case-details",
        data: {
            kind: LineageGraphNodeKind.Dataset,
            dataObject: {
                id: "did:odf:z4k88e8egJJeQEd4HHuL4BSwYTWm8qiWxzqhydvHQcX2TPCrMyP",
                name: "alberta.case-details",
                kind: DatasetKind.Root,
                isCurrent: true,
                access: LineageNodeAccess.PUBLIC,
                accountName: "kamu",
                avatarUrl: TEST_AVATAR_URL,
            },
        },
    },
    {
        id: "didodfz4k88e8jmNqgCt5L84XPdaog32MttcHzGiXcktfuTuDY3QKwiyK",
        label: "alberta.case-details.hm",
        data: {
            kind: LineageGraphNodeKind.Dataset,
            dataObject: {
                id: "did:odf:z4k88e8jmNqgCt5L84XPdaog32MttcHzGiXcktfuTuDY3QKwiyK",
                name: "alberta.case-details.hm",
                kind: DatasetKind.Derivative,
                isCurrent: false,
                access: LineageNodeAccess.PUBLIC,
                accountName: "kamu",
                avatarUrl: TEST_AVATAR_URL,
            },
        },
    },
    {
        id: "didodfz4k88e8nN5SdNPxsc5oeqwdCLvjzcvJzoyEQ938E87A15nTrkAk",
        label: "canada.case-details",
        data: {
            kind: LineageGraphNodeKind.Dataset,
            dataObject: {
                id: "did:odf:z4k88e8nN5SdNPxsc5oeqwdCLvjzcvJzoyEQ938E87A15nTrkAk",
                name: "canada.case-details",
                kind: DatasetKind.Derivative,
                isCurrent: false,
                access: LineageNodeAccess.PUBLIC,
                accountName: "kamu",
                avatarUrl: TEST_AVATAR_URL,
            },
        },
    },
    {
        id: "didodfz4k88e8qAReYmLPFUyaKfk1UHCSY2Mkh6X1AHxuUGNhec76QsGq",
        label: "canada.daily-cases",
        data: {
            kind: LineageGraphNodeKind.Dataset,
            dataObject: {
                id: "did:odf:z4k88e8qAReYmLPFUyaKfk1UHCSY2Mkh6X1AHxuUGNhec76QsGq",
                name: "canada.daily-cases",
                kind: DatasetKind.Derivative,
                isCurrent: false,
                access: LineageNodeAccess.PUBLIC,
                accountName: "kamu",
                avatarUrl: TEST_AVATAR_URL,
            },
        },
    },
];

export const mockOverviewDataUpdate: OverviewUpdate = {
    schema: null,
    content: [
        {
            offset: {
                value: 6908,
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            system_time: {
                value: "2022-08-05 21:15:03.947",
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            block_time: {
                value: "2022-08-05 20:24:55",
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            token_symbol: {
                value: "rETH",
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            event_name: {
                value: "TokensMinted",
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            amount: {
                value: 0.009679238156255232,
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            eth_amount: {
                value: 0.010000000272564223,
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            block_number: {
                value: 15284454,
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            block_hash: {
                value: "0x887569ff02456b8cde2ade8e0ee5b48d441800c8c6d92d1414a9648902807558",
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            transaction_index: {
                value: 224,
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            transaction_hash: {
                value: "0xa88698d288550d09653e6cec3038ea30fe8f74eb40941eba93b05024037426d7",
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
            log_index: {
                value: 355,
                cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
            },
        },
    ],
    overview: {
        __typename: "Dataset",
        data: {
            __typename: "DatasetData",
            numRecordsTotal: 6909,
            estimatedSizeBytes: 1102418,
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
            currentPollingSource: { __typename: "SetPollingSource" },
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
                                ...mockOwnerFieldsWithAvatar,
                            },
                            event: {
                                __typename: "AddData",
                                newData: {
                                    __typename: "DataSlice",
                                    offsetInterval: {
                                        __typename: "OffsetInterval",
                                        start: "0",
                                        end: "6908",
                                    },
                                    logicalHash: "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                                    physicalHash: "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                                    size: "1102418",
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
        estimatedSizeBytes: 1102418,
    },
};

export const mockOverviewDataUpdateNullable: OverviewUpdate = {
    schema: null,
    content: mockOverviewDataUpdate.content,
    overview: {
        ...structuredClone(mockOverviewDataUpdate.overview),
        metadata: {
            ...structuredClone(mockOverviewDataUpdate.overview.metadata),
            currentLicense: mockMetadataCurrentLicense,
            currentPollingSource: null,
        },
    },
    size: structuredClone(mockOverviewDataUpdate.size),
};

export const mockMetadataRootUpdate: MetadataSchemaUpdate = {
    schema: {
        fields: [
            {
                name: "offset",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "system_time",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "date_reported",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "id",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "zone",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "gender",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "age_group",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "case_status",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "case_type",
                type: {
                    kind: OdfTypes.String,
                },
            },
        ],
    },
    pageInfo: {
        __typename: "PageBasedInfo",
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
        currentPage: 1,
    },
    metadataSummary: {
        __typename: "Dataset",
        metadata: {
            __typename: "DatasetMetadata",
            currentDownstreamDependenciesCount: 0,
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
                    schema: {
                        format: DataSchemaFormat.OdfJson,
                        content:
                            '{"fields":[{"name":"id","type":{"kind":"Option","inner":{"kind":"Int64"}}},{"name":"source","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"captures","type":{"kind":"Option","inner":{"kind":"Int32"}}},{"name":"capture_measure","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"taxon_name","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"scientific_name","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"parent_taxon","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"year","type":{"kind":"Option","inner":{"kind":"Int32"}}},{"name":"rfmo","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"gear_name","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"gear_code","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"flag","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"ocean","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"latitude","type":{"kind":"Option","inner":{"kind":"Float32"}}},{"name":"longitude","type":{"kind":"Option","inner":{"kind":"Float32"}}},{"name":"dataset_organisation","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"dataset_acknowledgement","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"dataset_url","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"dataset_date","type":{"kind":"Date"}}]}',
                        __typename: "DataSchema",
                    },
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
                        __typename: "BlockRef",
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
        fields: [
            {
                name: "offset",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "system_time",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "date_reported",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "id",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "zone",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "gender",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "age_group",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "case_status",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "case_type",
                type: {
                    kind: OdfTypes.String,
                },
            },
        ],
    },
    pageInfo: {
        __typename: "PageBasedInfo",
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
            currentDownstreamDependenciesCount: 0,
            currentPushSources: [
                {
                    __typename: "AddPushSource",
                    sourceName: "mockNmae",
                    read: {
                        __typename: "ReadStepCsv",
                        schema: {
                            format: DataSchemaFormat.OdfJson,
                            content:
                                '{"fields":[{"name":"id","type":{"kind":"Option","inner":{"kind":"Int64"}}},{"name":"source","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"captures","type":{"kind":"Option","inner":{"kind":"Int32"}}},{"name":"capture_measure","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"taxon_name","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"scientific_name","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"parent_taxon","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"year","type":{"kind":"Option","inner":{"kind":"Int32"}}},{"name":"rfmo","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"gear_name","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"gear_code","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"flag","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"ocean","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"latitude","type":{"kind":"Option","inner":{"kind":"Float32"}}},{"name":"longitude","type":{"kind":"Option","inner":{"kind":"Float32"}}},{"name":"dataset_organisation","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"dataset_acknowledgement","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"dataset_url","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"dataset_date","type":{"kind":"Date"}}]}',
                            __typename: "DataSchema",
                        },
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
                        __typename: "BlockRef",
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
        fields: [
            {
                name: "offset",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "system_time",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "block_time",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "token_symbol",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "event_name",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "amount",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "eth_amount",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "block_number",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "block_hash",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "transaction_index",
                type: {
                    kind: OdfTypes.String,
                },
            },

            {
                name: "transaction_hash",
                type: {
                    kind: OdfTypes.String,
                },
            },
            {
                name: "log_index",
                type: {
                    kind: OdfTypes.String,
                },
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
            currentDownstreamDependenciesCount: 0,
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
                                    ...mockOwnerFieldsWithAvatar,
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
                        __typename: "BlockRef",
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
                                ...mockOwnerFieldsWithAvatar,
                            },
                            event: {
                                __typename: "ExecuteTransform",
                                newData: {
                                    __typename: "DataSlice",
                                    offsetInterval: {
                                        __typename: "OffsetInterval",
                                        start: "0",
                                        end: "596125",
                                    },
                                    logicalHash: "z63ZND5B21T2Dbmr2bB2Eu2Y4fjEJzLYrwiumM7ApeU24N29qpna",
                                    physicalHash: "zW1i7cajDaJjwxCRaRyGHqJpDrqZXbm1wMZkaWrH8a8Cmbd",
                                    size: "2323",
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
                                        newOffset: "596125",
                                    },
                                ],
                                newCheckpoint: {
                                    __typename: "Checkpoint",
                                    physicalHash: "zW1otipGpjScUH8C2RfaF4s8RshReBbQVPDf2fPrp2R8Ft2",
                                    size: "2560",
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
        __typename: "PageBasedInfo",
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
        currentPage: 1,
    },
};

export const mockOverviewWithSetInfo: DatasetOverviewFragment = {
    ...structuredClone(mockOverviewDataUpdate.overview),
    metadata: {
        ...structuredClone(mockOverviewDataUpdate.overview.metadata),
        currentInfo: {
            __typename: "SetInfo",
            description: "mock description",
            keywords: ["mock1", "mock2"],
        },
    },
};

export const mockOverviewWithSetLicense: DatasetOverviewFragment = {
    ...structuredClone(mockOverviewWithSetInfo),
    metadata: {
        ...structuredClone(mockOverviewWithSetInfo.metadata),
        currentLicense: structuredClone(mockMetadataCurrentLicense),
    },
};

export const datasetMetadataDerivativeDataset: DatasetOverviewMetadataDataFragment = {
    ...structuredClone(mockOverviewDataUpdate.overview.metadata),
    currentPollingSource: null,
    currentTransform: { __typename: "SetTransform" },
    currentPushSources: [],
};

export const datasetMetadataRootDataset: DatasetOverviewMetadataDataFragment = {
    ...structuredClone(mockOverviewDataUpdate.overview.metadata),
    currentPollingSource: { __typename: "SetPollingSource" },
    currentTransform: null,
    currentPushSources: [],
};

export const mockOverviewUpdate: OverviewUpdate = {
    ...structuredClone(mockOverviewDataUpdate), // clone, as we modify this data in the tests
    schema: mockMetadataRootPushSourceUpdate.schema,
};

export const mockDerivedOverviewUpdate: OverviewUpdate = {
    ...structuredClone(mockOverviewDataUpdateNullable),
    schema: mockMetadataDerivedUpdate.schema,
};

export const mockRootOverviewUpdate: OverviewUpdate = {
    ...structuredClone(mockOverviewDataUpdate),
    schema: mockMetadataRootUpdate.schema,
};

export const mockOverviewUpdateWithDerivedSchema: OverviewUpdate = {
    ...structuredClone(mockOverviewDataUpdate),
    schema: mockMetadataDerivedUpdate.schema,
};
