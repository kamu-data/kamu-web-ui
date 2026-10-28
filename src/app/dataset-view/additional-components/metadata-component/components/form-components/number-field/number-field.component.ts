/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import { NumberInputControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";

@Component({
    selector: "app-number-field",
    templateUrl: "./number-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        TooltipIconComponent,
        FormValidationErrorsDirective,
    ],
})
export class NumberFieldComponent extends BaseField<NumberInputControl> {
    @Input() public placeholder?: string;
    @Input() public requiredField?: boolean;
    @Input({ required: true }) public min: number;
    @Input() public max?: number;
}
