import {
    DatasetAutocompleteItem,
    TypeNames,
} from "../../interface/search.interface";
import {
    DatasetKind,
    SearchDatasetsAutocompleteQuery,
    SearchDatasetsOverviewQuery,
} from "../kamu.graphql.interface";

export const mockSearchOverviewResponse: SearchDatasetsOverviewQuery = {
    search: {
        __typename: "Search",
        query: {
            __typename: "SearchResultConnection",
            nodes: [
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:17:30.613911358+00:00",
                    lastUpdatedAt: "2022-08-05T21:19:28.817281255+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description:
                                "Confirmed positive cases of COVID-19 in Alberta.",
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
                            websiteUrl:
                                "https://open.canada.ca/en/open-government-licence-canada",
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
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:17:30.646318293+00:00",
                    lastUpdatedAt: "2022-08-05T21:20:08.053635579+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description:
                                "Confirmed positive cases of COVID-19 in Alberta (harmonized).",
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
                        currentLicense: {
                            __typename: "SetLicense",
                            shortName: "OGL-Canada-2.0",
                            name: "Open Government Licence - Canada",
                            spdxId: "OGL-Canada-2.0",
                            websiteUrl:
                                "https://open.canada.ca/en/open-government-licence-canada",
                        },
                        currentDownstreamDependencies: [
                            {
                                __typename: "Dataset",
                                id: "did:odf:z4k88e8epAntnrFDUiDYxSGkCRcTc6wNzcwbpubzLCPQLVLUMcF",
                                kind: DatasetKind.Derivative,
                            },
                        ],
                    },
                    id: "did:odf:z4k88e8kmp7wTEePmNDSprhY2TqwDxSiFwHiau8fnUk4V4Cpgu7",
                    kind: DatasetKind.Derivative,
                    name: "alberta.case-details.hm",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:17:30.621941313+00:00",
                    lastUpdatedAt: "2022-08-05T21:19:43.875457619+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description:
                                "British Columbia COVID-19 case data updated regularly from the B.C. Centre for Disease Control, Provincial Health Services Authority and the B.C. Ministry of Health.",
                            keywords: [
                                "Healthcare",
                                "Epidemiology",
                                "COVID-19",
                                "SARS-CoV-2",
                                "Disaggregated",
                                "Anonymized",
                                "British Columbia",
                                "Canada",
                            ],
                        },
                        currentLicense: {
                            __typename: "SetLicense",
                            shortName: "OGL-Canada-2.0",
                            name: "Open Government Licence - Canada",
                            spdxId: "OGL-Canada-2.0",
                            websiteUrl:
                                "https://open.canada.ca/en/open-government-licence-canada",
                        },
                        currentDownstreamDependencies: [
                            {
                                __typename: "Dataset",
                                id: "did:odf:z4k88e8rAFwtkT53U5hCMU2k5E1EqNLif5uYfC3AwN6FD62onvP",
                                kind: DatasetKind.Derivative,
                            },
                        ],
                    },
                    id: "did:odf:z4k88e8i1YPqnKHsAqwPkaUhT1t4vtHQzS2fVCqtggE7SJWDVza",
                    kind: DatasetKind.Root,
                    name: "british-columbia.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:17:30.653131829+00:00",
                    lastUpdatedAt: "2022-08-05T21:20:08.054410604+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description:
                                "Confirmed positive cases of COVID-19 in British Columbia (harmonized).",
                            keywords: [
                                "Healthcare",
                                "Epidemiology",
                                "COVID-19",
                                "SARS-CoV-2",
                                "Disaggregated",
                                "Anonymized",
                                "British Columbia",
                                "Canada",
                                "Harmonized",
                            ],
                        },
                        currentLicense: {
                            __typename: "SetLicense",
                            shortName: "OGL-Canada-2.0",
                            name: "Open Government Licence - Canada",
                            spdxId: "OGL-Canada-2.0",
                            websiteUrl:
                                "https://open.canada.ca/en/open-government-licence-canada",
                        },
                        currentDownstreamDependencies: [
                            {
                                __typename: "Dataset",
                                id: "did:odf:z4k88e8epAntnrFDUiDYxSGkCRcTc6wNzcwbpubzLCPQLVLUMcF",
                                kind: DatasetKind.Derivative,
                            },
                        ],
                    },
                    id: "did:odf:z4k88e8rAFwtkT53U5hCMU2k5E1EqNLif5uYfC3AwN6FD62onvP",
                    kind: DatasetKind.Derivative,
                    name: "british-columbia.case-details.hm",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:17:30.674732425+00:00",
                    lastUpdatedAt: "2022-08-05T21:21:24.090843159+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description:
                                "Pan-Canadian COVID-19 case data combined from variety of official provincial and municipal data sources.",
                            keywords: [
                                "Collection",
                                "Healthcare",
                                "Epidemiology",
                                "COVID-19",
                                "SARS-CoV-2",
                                "Disaggregated",
                                "Anonymized",
                                "Canada",
                            ],
                        },
                        currentLicense: {
                            __typename: "SetLicense",
                            shortName: "OGL-Canada-2.0",
                            name: "Open Government Licence - Canada",
                            spdxId: "OGL-Canada-2.0",
                            websiteUrl:
                                "https://open.canada.ca/en/open-government-licence-canada",
                        },
                        currentDownstreamDependencies: [
                            {
                                __typename: "Dataset",
                                id: "did:odf:z4k88e8thqpQ7kupbJCiFbeXr5WZVCor7hmybhfmyUTLnWifwz6",
                                kind: DatasetKind.Derivative,
                            },
                        ],
                    },
                    id: "did:odf:z4k88e8epAntnrFDUiDYxSGkCRcTc6wNzcwbpubzLCPQLVLUMcF",
                    kind: DatasetKind.Derivative,
                    name: "canada.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:17:30.685808071+00:00",
                    lastUpdatedAt: "2022-08-05T21:22:20.904074078+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description:
                                "Pan-Canadian COVID-19 daily case counts on per Health Region level of aggregation.",
                            keywords: [
                                "Healthcare",
                                "Epidemiology",
                                "COVID-19",
                                "SARS-CoV-2",
                                "Aggregated",
                                "Canada",
                            ],
                        },
                        currentLicense: {
                            __typename: "SetLicense",
                            shortName: "OGL-Ontario",
                            name: "Open Government Licence - Ontario",
                            spdxId: null,
                            websiteUrl:
                                "https://www.ontario.ca/page/open-government-licence-ontario",
                        },
                        currentDownstreamDependencies: [],
                    },
                    id: "did:odf:z4k88e8thqpQ7kupbJCiFbeXr5WZVCor7hmybhfmyUTLnWifwz6",
                    kind: DatasetKind.Derivative,
                    name: "canada.daily-cases",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:11:01.512976747+00:00",
                    lastUpdatedAt: "2022-08-05T21:11:09.022264552+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description: null,
                            keywords: null,
                        },
                        currentLicense: null,
                        currentDownstreamDependencies: [],
                    },
                    id: "did:odf:z4k88e8kYjmgyhEpMcQfN3U1hAKSJ1Lvj63vbeu8xQocriPMP1Q",
                    kind: DatasetKind.Root,
                    name: "co.alphavantage.tickers.daily.spy",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:10:50.529788971+00:00",
                    lastUpdatedAt: "2022-08-05T21:12:00.443869718+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description: null,
                            keywords: null,
                        },
                        currentLicense: {
                            __typename: "SetLicense",
                            shortName: "Proprietary",
                            name: "CryptoCompare - API License Agreement",
                            spdxId: null,
                            websiteUrl:
                                "https://www.cryptocompare.com/api-licence-agreement/",
                        },
                        currentDownstreamDependencies: [],
                    },
                    id: "did:odf:z4k88e8e5sAUjHVvsBaqLs42wX2bhgohzbhaLnKZ7K1ywCjygig",
                    kind: DatasetKind.Root,
                    name: "com.cryptocompare.ohlcv.eth-usd",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:10:57.332924745+00:00",
                    lastUpdatedAt: "2022-08-05T21:15:03.947245004+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description: null,
                            keywords: null,
                        },
                        currentLicense: null,
                        currentDownstreamDependencies: [],
                    },
                    id: "did:odf:z4k88e8u3rDWqP6sq96Z7gfYdHXiuG9ZDGkdPxbtqFw8VCVJvEu",
                    kind: DatasetKind.Root,
                    name: "net.rocketpool.reth.mint-burn",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    createdAt: "2022-08-05T21:17:30.633297439+00:00",
                    lastUpdatedAt: "2022-08-05T21:19:09.092316475+00:00",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentInfo: {
                            __typename: "SetInfo",
                            description:
                                "Confirmed positive cases of COVID-19 in Ontario.",
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
                        currentLicense: {
                            __typename: "SetLicense",
                            shortName: "OGL-Ontario",
                            name: "Open Government Licence - Ontario",
                            spdxId: null,
                            websiteUrl:
                                "https://www.ontario.ca/page/open-government-licence-ontario",
                        },
                        currentDownstreamDependencies: [
                            {
                                __typename: "Dataset",
                                id: "did:odf:z4k88e8gCvWKoSD2eaVa7ocoLDzuUcGu8VW89Pks775fM5MgDom",
                                kind: DatasetKind.Derivative,
                            },
                        ],
                    },
                    id: "did:odf:z4k88e8uUcKWpJVMbvAyww4R6iarRhSy93yhd3ohg3QdDQP86D4",
                    kind: DatasetKind.Root,
                    name: "ontario.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
            ],
            totalCount: 13,
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

export const mockAutoCompleteResponse: SearchDatasetsAutocompleteQuery = {
    search: {
        __typename: "Search",
        query: {
            __typename: "SearchResultConnection",
            nodes: [
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                    kind: DatasetKind.Root,
                    name: "alberta.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8kmp7wTEePmNDSprhY2TqwDxSiFwHiau8fnUk4V4Cpgu7",
                    kind: DatasetKind.Derivative,
                    name: "alberta.case-details.hm",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8i1YPqnKHsAqwPkaUhT1t4vtHQzS2fVCqtggE7SJWDVza",
                    kind: DatasetKind.Root,
                    name: "british-columbia.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8rAFwtkT53U5hCMU2k5E1EqNLif5uYfC3AwN6FD62onvP",
                    kind: DatasetKind.Derivative,
                    name: "british-columbia.case-details.hm",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8epAntnrFDUiDYxSGkCRcTc6wNzcwbpubzLCPQLVLUMcF",
                    kind: DatasetKind.Derivative,
                    name: "canada.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8thqpQ7kupbJCiFbeXr5WZVCor7hmybhfmyUTLnWifwz6",
                    kind: DatasetKind.Derivative,
                    name: "canada.daily-cases",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8kYjmgyhEpMcQfN3U1hAKSJ1Lvj63vbeu8xQocriPMP1Q",
                    kind: DatasetKind.Root,
                    name: "co.alphavantage.tickers.daily.spy",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8e5sAUjHVvsBaqLs42wX2bhgohzbhaLnKZ7K1ywCjygig",
                    kind: DatasetKind.Root,
                    name: "com.cryptocompare.ohlcv.eth-usd",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8uUcKWpJVMbvAyww4R6iarRhSy93yhd3ohg3QdDQP86D4",
                    kind: DatasetKind.Root,
                    name: "ontario.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
                {
                    __typename: "Dataset",
                    id: "did:odf:z4k88e8gCvWKoSD2eaVa7ocoLDzuUcGu8VW89Pks775fM5MgDom",
                    kind: DatasetKind.Derivative,
                    name: "ontario.case-details.hm",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
            ],
        },
    },
};

export const searchResult: DatasetAutocompleteItem[] = [
    {
        __typename: TypeNames.allDataType,
        dataset: {
            id: "a",
            name: "a",
            kind: DatasetKind.Root,
            owner: {
                id: "anonymous",
                name: "anonymous",
            },
        },
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
            kind: DatasetKind.Root,
            name: "alberta.case-details",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8kmp7wTEePmNDSprhY2TqwDxSiFwHiau8fnUk4V4Cpgu7",
            kind: DatasetKind.Derivative,
            name: "alberta.case-details.hm",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8i1YPqnKHsAqwPkaUhT1t4vtHQzS2fVCqtggE7SJWDVza",
            kind: DatasetKind.Root,
            name: "british-columbia.case-details",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8rAFwtkT53U5hCMU2k5E1EqNLif5uYfC3AwN6FD62onvP",
            kind: DatasetKind.Derivative,
            name: "british-columbia.case-details.hm",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8epAntnrFDUiDYxSGkCRcTc6wNzcwbpubzLCPQLVLUMcF",
            kind: DatasetKind.Derivative,
            name: "canada.case-details",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8thqpQ7kupbJCiFbeXr5WZVCor7hmybhfmyUTLnWifwz6",
            kind: DatasetKind.Derivative,
            name: "canada.daily-cases",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8kYjmgyhEpMcQfN3U1hAKSJ1Lvj63vbeu8xQocriPMP1Q",
            kind: DatasetKind.Root,
            name: "co.alphavantage.tickers.daily.spy",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8e5sAUjHVvsBaqLs42wX2bhgohzbhaLnKZ7K1ywCjygig",
            kind: DatasetKind.Root,
            name: "com.cryptocompare.ohlcv.eth-usd",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8uUcKWpJVMbvAyww4R6iarRhSy93yhd3ohg3QdDQP86D4",
            kind: DatasetKind.Root,
            name: "ontario.case-details",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
    {
        dataset: {
            __typename: "Dataset",
            id: "did:odf:z4k88e8gCvWKoSD2eaVa7ocoLDzuUcGu8VW89Pks775fM5MgDom",
            kind: DatasetKind.Derivative,
            name: "ontario.case-details.hm",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
        __typename: TypeNames.datasetType,
    },
];