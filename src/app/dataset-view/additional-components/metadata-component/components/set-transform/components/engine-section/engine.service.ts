/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { EngineApi } from "../../../../../../../api/engine.api";
import { EnginesQuery } from "../../../../../../../api/kamu.graphql.interface";

@Injectable({
    providedIn: "root",
})
export class EngineService {
    private engineApi = inject(EngineApi);

    public engines(): Observable<EnginesQuery> {
        return this.engineApi.getEngines();
    }
}
