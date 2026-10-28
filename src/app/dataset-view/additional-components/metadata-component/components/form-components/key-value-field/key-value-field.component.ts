/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormArray, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { NgxTrimDirectiveModule } from "ngx-trim-directive";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import { NameValueControls } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { nameValueGroup } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    selector: "app-key-value-field",
    templateUrl: "./key-value-field.component.html",
    styleUrls: ["./key-value-field.component.scss"],
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
export class KeyValueFieldComponent extends BaseField<FormArray<FormGroup<NameValueControls>>> {
    @Input({ required: true }) public buttonText: string;

    public addItem(): void {
        this.control.push(nameValueGroup());
    }

    public removeItem(index: number): void {
        this.control.removeAt(index);
    }
}
