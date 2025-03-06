/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-dataset-name-property",
    templateUrl: "./dataset-name-property.component.html",
    styleUrls: ["./dataset-name-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetNamePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: { datasetName: string; ownerAccountName: string };
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
}
