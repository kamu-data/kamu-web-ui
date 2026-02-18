/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { DataHelpers } from "@common/helpers/data.helpers";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { EventPropertyLogo } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

@Component({
    selector: "app-merge-strategy-property",
    templateUrl: "./merge-strategy-property.component.html",
    styleUrls: ["./merge-strategy-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf],
})
export class MergeStrategyPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;

    public get descriptionMergeStrategy(): EventPropertyLogo {
        return DataHelpers.descriptionMergeStrategy(this.data);
    }
}
