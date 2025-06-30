/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseField } from "../base-field";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-checkbox-field",
    templateUrl: "./checkbox-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RxReactiveFormsModule,
        TooltipIconComponent,
    ],
})
export class CheckboxFieldComponent extends BaseField {
    @Input({ required: true }) public checked: boolean;
}
