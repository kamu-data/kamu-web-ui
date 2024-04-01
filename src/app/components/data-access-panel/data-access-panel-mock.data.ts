import { DatasetEndpoints } from "src/app/api/kamu.graphql.interface";

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
