/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { first, map, Observable } from "rxjs";

import { DatasetProtocolsGQL, DatasetProtocolsQuery } from "@api/kamu.graphql.interface";
import { ObservableQuery } from "@apollo/client/core";
import { onlyCompleteData } from "apollo-angular";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Injectable({
    providedIn: "root",
})
export class ProtocolsApi {
    private protocolsGQL = inject(DatasetProtocolsGQL);

    public getProtocols(datasetInfo: DatasetInfo): Observable<DatasetProtocolsQuery> {
        return this.protocolsGQL.watch({ variables: { ...datasetInfo } }).valueChanges.pipe(
            onlyCompleteData(),
            first(),
            map((result: ObservableQuery.Result<DatasetProtocolsQuery>) => {
                return result.data as DatasetProtocolsQuery;
            }),
        );
    }
}
