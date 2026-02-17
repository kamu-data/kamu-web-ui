/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { BaseField } from "../base-field";

@Component({
    selector: "app-number-field",
    templateUrl: "./number-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        //-----//
        RxReactiveFormsModule,
        //-----//
        TooltipIconComponent,
        FormValidationErrorsDirective,
    ],
})
export class NumberFieldComponent extends BaseField {
    @Input({ required: true }) public value: string;
    @Input() public placeholder?: string;
    @Input() public requiredField?: boolean;
}
