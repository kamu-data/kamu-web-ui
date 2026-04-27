/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-collection-view",
    imports: [],
    templateUrl: "./collection-view.component.html",
    styleUrl: "./collection-view.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionViewComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
}
