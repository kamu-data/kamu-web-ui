/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { BaseField } from "../base-field";

@Component({
    selector: "app-cache-field",
    templateUrl: "./cache-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        RxReactiveFormsModule,
        //-----//
        TooltipIconComponent,
    ],
})
export class CacheFieldComponent extends BaseField {
    private fb = inject(FormBuilder);

    public onCheckedCache(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            this.form.addControl(this.controlName, this.fb.control(true));
        } else {
            this.form.removeControl(this.controlName);
        }
    }
}
