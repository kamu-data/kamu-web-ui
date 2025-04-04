/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { SearchService } from "src/app/search/search.service";
import { Observable, of, switchMap } from "rxjs";
import { DatasetSearchResult } from "src/app/interface/search.interface";

export const searchResolver: ResolveFn<Observable<DatasetSearchResult>> = (route: ActivatedRouteSnapshot) => {
    const searchService = inject(SearchService);
    const page = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE) ?? 1;
    const query = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_QUERY) ?? "";
    return searchService.searchDatasets(query, Number(page) - 1).pipe(
        switchMap((result: DatasetSearchResult) => {
            return result.datasets.length ? of(result) : searchService.semanticSearchDatasets(query);
        }),
    );
};
