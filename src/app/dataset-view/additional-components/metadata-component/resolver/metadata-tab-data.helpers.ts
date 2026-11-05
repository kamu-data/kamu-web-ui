/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RedirectCommand } from "@angular/router";

import { combineLatest, map, Observable, of, OperatorFunction, switchMap, take } from "rxjs";

import { enumValueOf } from "@common/helpers/app.helpers";
import { isMultihash } from "@common/helpers/url-params.helpers";
import { MaybeUndefined } from "@interface/app.types";

import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import {
    CommitStepMode,
    MetadataTabData,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { MetadataSnapshotService } from "src/app/dataset-view/additional-components/metadata-component/services/metadata-snapshot.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

/** The step mode in the URL; metadata changes when the parameter is missing or unknown */
export function commitStepModeFromRoute(route: ActivatedRouteSnapshot): CommitStepMode {
    return (
        enumValueOf(CommitStepMode, route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_STEPS)) ??
        CommitStepMode.MetadataChanges
    );
}

/**
 * The Metadata tab section a route shows, from its own data or from its active child.
 * The parent route inherits the dataset view's own tab under the same key, so each value is
 * checked against the sections separately.
 */
export function metadataTabFromRoute(route: ActivatedRouteSnapshot): MaybeUndefined<MetadataTabs> {
    return (
        enumValueOf(MetadataTabs, route.data[ProjectLinks.URL_PARAM_TAB]) ??
        enumValueOf(MetadataTabs, route.children[0]?.data[ProjectLinks.URL_PARAM_TAB])
    );
}

/**
 * The dataset, its permissions and its metadata as of the block in the `head` query parameter.
 * A `head` that is malformed or names no block of the chain redirects to the same section
 * without it, so the page shows the latest metadata. A failed request propagates.
 */
export function requestMetadataTabData(route: ActivatedRouteSnapshot): Observable<MetadataTabData | RedirectCommand> {
    const datasetService = inject(DatasetService);
    const datasetSubsService = inject(DatasetSubscriptionsService);
    const metadataSnapshotService = inject(MetadataSnapshotService);
    const navigationService = inject(NavigationService);

    const head = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_HEAD) ?? undefined;
    return combineLatest([datasetService.datasetChanges, datasetSubsService.permissionsChanges]).pipe(
        take(1),
        switchMap(([datasetBasics, datasetPermissions]) => {
            const datasetInfo = { accountName: datasetBasics.owner.accountName, datasetName: datasetBasics.name };
            const latestRedirect = new RedirectCommand(
                navigationService.datasetViewUrlTree({
                    ...datasetInfo,
                    tab: DatasetViewTypeEnum.Metadata,
                    section: metadataTabFromRoute(route),
                    steps: commitStepModeFromRoute(route),
                }),
            );
            if (head && !isMultihash(head)) {
                return of(latestRedirect);
            }
            return metadataSnapshotService
                .requestSnapshot(datasetInfo, head)
                .pipe(map((snapshot) => (snapshot ? { datasetBasics, datasetPermissions, snapshot } : latestRedirect)));
        }),
    );
}

/**
 * Leads a sub-tab whose content the shown commit lacks to the Schema section of the same commit.
 * The latest commit keeps its own rules: the menu hides such a tab, and its resolver decides.
 */
export function schemaTabIfMissingAtCommit(
    route: ActivatedRouteSnapshot,
    isMissing: (data: MetadataTabData) => boolean,
): OperatorFunction<MetadataTabData | RedirectCommand, MetadataTabData | RedirectCommand> {
    const navigationService = inject(NavigationService);

    return map((data) =>
        data instanceof RedirectCommand || data.snapshot.isLatest || !isMissing(data)
            ? data
            : new RedirectCommand(
                  navigationService.datasetViewUrlTree({
                      accountName: data.datasetBasics.owner.accountName,
                      datasetName: data.datasetBasics.name,
                      tab: DatasetViewTypeEnum.Metadata,
                      section: MetadataTabs.Schema,
                      head: data.snapshot.block.blockHash,
                      steps: commitStepModeFromRoute(route),
                  }),
              ),
    );
}
