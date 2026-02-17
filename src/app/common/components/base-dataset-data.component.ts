/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";

import { Observable } from "rxjs";

import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

import { BaseProcessingComponent } from "@common/components/base.processing.component";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "@api/kamu.graphql.interface";

export abstract class BaseDatasetDataComponent extends BaseProcessingComponent {
    protected datasetService = inject(DatasetService);
    protected datasetSubsService = inject(DatasetSubscriptionsService);

    protected datasetBasics$: Observable<DatasetBasicsFragment>;
    protected datasetPermissions$: Observable<DatasetPermissionsFragment>;
}
