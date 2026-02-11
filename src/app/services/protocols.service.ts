/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeUndefined } from "src/app/interface/app.types";
import { inject, Injectable } from "@angular/core";
import { ProtocolsApi } from "../api/protocols.api";
import { Observable, map } from "rxjs";
import { DatasetEndpoints, DatasetProtocolsQuery } from "../api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";

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
