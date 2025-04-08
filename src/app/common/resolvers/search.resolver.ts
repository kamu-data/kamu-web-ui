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
import { AppConfigService } from "src/app/app-config.service";

export const searchResolver: ResolveFn<Observable<DatasetSearchResult>> = (route: ActivatedRouteSnapshot) => {
    const searchService = inject(SearchService);
    const appConfigService = inject(AppConfigService);
    const isSemanticSearchAvailable =
        appConfigService.semanticSearchTresholdScore !== undefined && appConfigService.semanticSearchTresholdScore >= 0;

    const page = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE) ?? 1;
    const query = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_QUERY) ?? "";

    return searchService.searchDatasets(query, Number(page) - 1).pipe(
        switchMap((result: DatasetSearchResult) => {
            // Semantic search is not available:
            // 1. If the text search contains results
            // 2. If the query is empty
            // 3. If the UI configuration does not contain the option
            return result.datasets.length || !query || !isSemanticSearchAvailable
                ? of(result)
                : searchService.semanticSearchDatasets(query);
        }),
    );
};
