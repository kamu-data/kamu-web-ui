import { inject, Injectable } from "@angular/core";
import { Observable, first, map } from "rxjs";
import { DatasetProtocolsGQL, DatasetProtocolsQuery } from "./kamu.graphql.interface";
import { DatasetInfo } from "../interface/navigation.interface";
import { ApolloQueryResult } from "@apollo/client";

@Injectable({
    providedIn: "root",
})
export class ProtocolsApi {
    private protocolsGQL = inject(DatasetProtocolsGQL);

    public getProtocols(datasetInfo: DatasetInfo): Observable<DatasetProtocolsQuery> {
        return this.protocolsGQL.watch({ ...datasetInfo }).valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<DatasetProtocolsQuery>) => {
                return result.data;
            }),
        );
    }
}
