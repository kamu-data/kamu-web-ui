/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetVisibilityOutput } from "src/app/api/kamu.graphql.interface";
import { NgClass } from "@angular/common";

@Component({
    selector: "app-dataset-visibility",
    templateUrl: "./dataset-visibility.component.html",
    styleUrls: ["./dataset-visibility.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass],
})
export class DatasetVisibilityComponent {
    @Input({ required: true }) public datasetVisibility: DatasetVisibilityOutput;

    public get isPrivate(): boolean {
        return this.datasetVisibility.__typename === "PrivateDatasetVisibility";
    }
}
