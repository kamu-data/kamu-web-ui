/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { map, Observable } from "rxjs";

import { UnsubscribeDestroyRefAdapter } from "@common/components/unsubscribe.ondestroy.adapter";
import { requireValue } from "@common/helpers/app.helpers";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import ProjectLinks from "src/app/project-links";

export abstract class BaseComponent extends UnsubscribeDestroyRefAdapter {
    protected activatedRoute = inject(ActivatedRoute);

    /** `null` when the URL has no page */
    protected pageFromUrl(): MaybeNull<number> {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        return pageParam ? +pageParam : null;
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
        return this.activatedRoute.paramMap.pipe(
            map((paramMap: ParamMap) => {
                return {
                    // Both parameters are mandatory in URL, router would not activate this component otherwise
                    accountName: requireValue(paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME)),
                    datasetName: requireValue(paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME)),
                };
            }),
        );
    }
}
