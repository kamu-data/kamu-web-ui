/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataHelpers } from "src/app/common/helpers/data.helpers";

@Component({
    selector: "app-step-type-property",
    templateUrl: "./step-type-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepTypePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;

    public get type(): string {
        return DataHelpers.descriptionSetPollingSourceSteps(this.data);
    }
}
