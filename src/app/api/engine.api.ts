/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { EnginesGQL, EnginesQuery } from "./kamu.graphql.interface";
import { ObservableQuery } from "@apollo/client/core";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { onlyCompleteData } from "apollo-angular";

@Injectable({
    providedIn: "root",
})
export class EngineApi {
    private enginesGQL = inject(EnginesGQL);

    public getEngines(): Observable<EnginesQuery> {
        return this.enginesGQL.watch().valueChanges.pipe(
            onlyCompleteData(),
            first(),
            map((result: ObservableQuery.Result<EnginesQuery>) => {
                return result.data as EnginesQuery;
            }),
        );
    }
}
