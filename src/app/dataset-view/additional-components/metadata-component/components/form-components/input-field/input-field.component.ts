/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { NgxTrimDirectiveModule } from "ngx-trim-directive";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import { TextControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";

@Component({
    selector: "app-input-field",
    templateUrl: "./input-field.component.html",
    styleUrls: ["./input-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        NgxTrimDirectiveModule,
        //-----//
        TooltipIconComponent,
        FormValidationErrorsDirective,
    ],
})
export class InputFieldComponent extends BaseField<TextControl> {
    @Input() public placeholder?: string;
    @Input() public inputType: "text" | "password" = "text";
}
