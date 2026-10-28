/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import {
    ReadFormatControlType,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

@Component({
    selector: "app-json-kind-field",
    templateUrl: "./json-kind-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        TooltipIconComponent,
    ],
})
export class JsonKindFieldComponent extends BaseField<FormControl<ReadKind>> {
    @Input({ required: true }) public controlDescriptors: ReadFormatControlType[];
}
