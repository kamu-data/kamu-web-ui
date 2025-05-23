/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetEndpoints, DatasetKind, DatasetProtocolsQuery } from "src/app/api/kamu.graphql.interface";
import { mockPublicDatasetVisibility } from "src/app/search/mock.data";

export const mockDatasetEndPoints: DatasetEndpoints = {
    __typename: "DatasetEndpoints",
    cli: {
        __typename: "CliProtocolDesc",
        pullCommand: "kamu pull http://127.0.0.1:8080/kamu/account.tokens.portfolio",
        pushCommand: "kamu push http://127.0.0.1:8080/kamu/account.tokens.portfolio",
    },
    webLink: {
        __typename: "LinkProtocolDesc",
        url: "http://127.0.0.1:8080/kamu/account.tokens.portfolio",
    },
    rest: {
        __typename: "RestProtocolDesc",
        tailUrl: "http://127.0.0.1:8080/kamu/account.tokens.portfolio/tail?limit=10",
        queryUrl: "http://127.0.0.1:8080/graphql?query=query {%0A%20 apiVersion%0A}%0A",
        pushUrl: "http://127.0.0.1:8080/kamu/account.tokens.portfolio/push",
    },
    flightsql: {
        __typename: "FlightSqlDesc",
        url: "grpc://localhost:50050",
    },
    jdbc: {
        __typename: "JdbcDesc",
        url: "jdbc:arrow-flight-sql://localhost:50050",
    },
    postgresql: {
        __typename: "PostgreSqlDesl",
        url: "- coming soon -",
    },
    kafka: {
        __typename: "KafkaProtocolDesc",
        url: "- coming soon -",
    },
    websocket: {
        __typename: "WebSocketProtocolDesc",
        url: "- coming soon -",
    },
    odata: {
        __typename: "OdataProtocolDesc",
        serviceUrl: "http://127.0.0.1:8080/odata/kamu",
        collectionUrl: "http://127.0.0.1:8080/odata/kamu/account.tokens.portfolio",
    },
};

export const mockDatasetProtocolsQuery: DatasetProtocolsQuery = {
    datasets: {
        __typename: "Datasets",
        byOwnerAndName: {
            __typename: "Dataset",
            endpoints: {
                __typename: "DatasetEndpoints",
                cli: {
                    __typename: "CliProtocolDesc",
                    pullCommand: "kamu pull http://127.0.0.1:8080/kamu/account.tokens.portfolio",
                    pushCommand: "kamu push http://127.0.0.1:8080/kamu/account.tokens.portfolio",
                },
                webLink: {
                    __typename: "LinkProtocolDesc",
                    url: "http://127.0.0.1:8080/kamu/account.tokens.portfolio",
                },
                rest: {
                    __typename: "RestProtocolDesc",
                    tailUrl: "http://127.0.0.1:8080/kamu/account.tokens.portfolio/tail?limit=10",
                    queryUrl: "http://127.0.0.1:8080/graphql?query=query {%0A%20 apiVersion%0A}%0A",
                    pushUrl: "http://127.0.0.1:8080/kamu/account.tokens.portfolio/push",
                },
                flightsql: {
                    __typename: "FlightSqlDesc",
                    url: "grpc://localhost:50050",
                },
                jdbc: {
                    __typename: "JdbcDesc",
                    url: "jdbc:arrow-flight-sql://localhost:50050",
                },
                postgresql: {
                    __typename: "PostgreSqlDesl",
                    url: "- coming soon -",
                },
                kafka: {
                    __typename: "KafkaProtocolDesc",
                    url: "- coming soon -",
                },
                websocket: {
                    __typename: "WebSocketProtocolDesc",
                    url: "- coming soon -",
                },
                odata: {
                    __typename: "OdataProtocolDesc",
                    serviceUrl: "http://127.0.0.1:8080/odata/kamu",
                    collectionUrl: "http://127.0.0.1:8080/odata/kamu/account.tokens.portfolio",
                },
            },
            id: "did:odf:fed016c0070664336545c0f49dc6a7a860c6862ab3336b630c2d7e779394a26da2e1e",
            kind: DatasetKind.Derivative,
            name: "account.tokens.portfolio",
            owner: {
                __typename: "Account",
                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                accountName: "kamu",
                accountProvider: "password",
            },
            alias: "kamu/account.tokens.portfolio",
            visibility: mockPublicDatasetVisibility,
        },
    },
};
