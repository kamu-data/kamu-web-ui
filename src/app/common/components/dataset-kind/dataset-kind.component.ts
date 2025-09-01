/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-dataset-kind",
    standalone: true,
    imports: [NgClass],
    templateUrl: "./dataset-kind.component.html",
    styleUrls: ["./dataset-kind.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetKindComponent {
    @Input({ required: true }) public kind: DatasetKind;

    public get isRoot(): boolean {
        return this.kind === DatasetKind.Root;
    }
}
