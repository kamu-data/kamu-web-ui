/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseField } from "../base-field";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";
import { NgIf } from "@angular/common";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-input-field",
    templateUrl: "./input-field.component.html",
    styleUrls: ["./input-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RxReactiveFormsModule,
        TooltipIconComponent,
        NgIf,
        NgxTrimDirectiveModule,
    ],
})
export class InputFieldComponent extends BaseField {
    @Input() public value: string;
    @Input() public placeholder?: string;
    @Input() public requiredField?: boolean;
}
