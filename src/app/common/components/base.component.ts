/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRoute, ParamMap, Params } from "@angular/router";

import { map, Observable } from "rxjs";

import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";

import { requireValue } from "../helpers/app.helpers";
import { UnsubscribeDestroyRefAdapter } from "./unsubscribe.ondestroy.adapter";

export abstract class BaseComponent extends UnsubscribeDestroyRefAdapter {
    protected activatedRoute = inject(ActivatedRoute);

    protected get searchString(): string {
        return window.location.search;
    }

    protected getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            // Both parameters are mandatory in URL, router would not activate this component otherwise
            accountName: requireValue(paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME)),
            datasetName: requireValue(paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME)),
        };
    }

    protected get datasetInfoFromUrlChanges(): Observable<DatasetInfo> {
        return this.activatedRoute.params.pipe(
            map((params: Params) => {
                return {
                    // Both parameters are mandatory in URL, router would not activate this component otherwise
                    accountName: requireValue(params[ProjectLinks.URL_PARAM_ACCOUNT_NAME] as string),
                    datasetName: requireValue(params[ProjectLinks.URL_PARAM_DATASET_NAME] as string),
                };
            }),
        );
    }
}
