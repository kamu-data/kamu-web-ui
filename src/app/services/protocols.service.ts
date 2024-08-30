import { MaybeUndefined } from "src/app/common/app.types";
import { inject, Injectable } from "@angular/core";
import { ProtocolsApi } from "../api/protocols.api";
import { Observable, map } from "rxjs";
import { DatasetEndpoints, DatasetProtocolsQuery } from "../api/kamu.graphql.interface";
import { DatasetInfo } from "../interface/navigation.interface";

@Injectable({
    providedIn: "root",
})
export class ProtocolsService {
    private protocolsApi = inject(ProtocolsApi);

    public getProtocols(datasetInfo: DatasetInfo): Observable<MaybeUndefined<DatasetEndpoints>> {
        return this.protocolsApi.getProtocols(datasetInfo).pipe(
            map((data: DatasetProtocolsQuery) => {
                return data.datasets.byOwnerAndName?.endpoints;
            }),
        );
    }
}
