import { Injectable } from "@angular/core";
import { Observable, of, delay } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ProtocolsApi {
    public getProtocols(): Observable<Protocols[]> {
        return of([
            {
                __typename: "LinkProtocolDesc",
                webUrl: `- comming soon -`,
            },
            {
                __typename: "CliProtocolDesc",
                pullUrl: `- comming soon -`,
                pushUrl: `- comming soon -`,
            },
            {
                __typename: "RestProtocolDesc",
                lastEventsUrl: "- comming soon -",
                arbitraryUrl: "- comming soon -",
                pushUrl: "- comming soon -",
            },
            {
                __typename: "JdbcDesc",
                url: "- comming soon -",
            },
            {
                __typename: "FlightSqlDesc",
                url: "- comming soon -",
            },
            {
                __typename: "PostgreSqlDesc",
                url: "- comming soon -",
            },
            {
                __typename: "KafkaProtocolDesc",
                url: "- comming soon -",
            },
            {
                __typename: "WebSocketProtocolDesc",
                url: "- comming soon -",
            },
            {
                __typename: "OdataProtocolDesc",
                endpointUrl: "- comming soon -",
                collectionUrl: "- comming soon -",
            },
        ]).pipe(delay(500));
    }
}

export type Protocols =
    | LinkProtocolDesc
    | CliProtocolDesc
    | RestProtocolDesc
    | FlightSqlDesc
    | JdbcDesc
    | PostgreSqlDesc
    | KafkaProtocolDesc
    | WebSocketProtocolDesc
    | OdataProtocolDesc;

export interface LinkProtocolDesc {
    __typename: string;
    webUrl: string;
}

export interface CliProtocolDesc {
    __typename: string;
    pullUrl: string;
    pushUrl: string;
}

export interface RestProtocolDesc {
    __typename: string;
    lastEventsUrl: string;
    arbitraryUrl: string;
    pushUrl: string;
}

export interface FlightSqlDesc {
    __typename: string;
    url: string;
}

export interface JdbcDesc {
    __typename: string;
    url: string;
}

export interface PostgreSqlDesc {
    __typename: string;
    url: string;
}

export interface KafkaProtocolDesc {
    __typename: string;
    url: string;
}

export interface WebSocketProtocolDesc {
    __typename: string;
    url: string;
}

export interface OdataProtocolDesc {
    __typename: string;
    endpointUrl: string;
    collectionUrl: string;
}
