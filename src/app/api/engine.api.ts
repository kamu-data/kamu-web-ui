/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { EnginesGQL, EnginesQuery } from "./kamu.graphql.interface";
import { ApolloQueryResult } from "@apollo/client";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class EngineApi {
    private enginesGQL = inject(EnginesGQL);

    public getEngines(): Observable<EnginesQuery> {
        return this.enginesGQL.watch().valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<EnginesQuery>) => {
                return result.data;
            }),
        );
    }
}
