/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { DatasetVisibilityOutput } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-dataset-visibility",
    templateUrl: "./dataset-visibility.component.html",
    styleUrls: ["./dataset-visibility.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass],
})
export class DatasetVisibilityComponent {
    @Input({ required: true }) public datasetVisibility: DatasetVisibilityOutput;

    public get isPrivate(): boolean {
        return this.datasetVisibility.__typename === "PrivateDatasetVisibility";
    }
}
