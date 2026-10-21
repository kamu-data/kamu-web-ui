/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { RedirectCommand, ResolveFn } from "@angular/router";

import { map, Observable } from "rxjs";

import { datasetOverviewTabResolverFn } from "src/app/dataset-view/additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetPermissionsService } from "src/app/dataset-view/dataset.permissions.service";
import { NavigationService } from "src/app/services/navigation.service";

export const datasetFlowsTabResolverFn: ResolveFn<DatasetOverviewTabData> = (route, state) => {
    const datasetPermissionsService = inject(DatasetPermissionsService);
    const navigationService = inject(NavigationService);

    // The overview tab resolver always returns an Observable
    return (datasetOverviewTabResolverFn(route, state) as Observable<DatasetOverviewTabData | RedirectCommand>).pipe(
        map((data) =>
            data instanceof RedirectCommand || datasetPermissionsService.shouldAllowFlowsTab(data.datasetPermissions)
                ? data
                : navigationService.pageNotFoundRedirect(),
        ),
    );
};
