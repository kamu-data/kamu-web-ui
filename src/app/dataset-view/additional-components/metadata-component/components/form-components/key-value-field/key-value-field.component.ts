/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { BaseField } from "../base-field";
import { KeyValueForm } from "./key-value-field.types";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";
import { NgFor } from "@angular/common";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

@Component({
    selector: "app-key-value-field",
    templateUrl: "./key-value-field.component.html",
    styleUrls: ["./key-value-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RxReactiveFormsModule,
        TooltipIconComponent,
        NgFor,
        NgxTrimDirectiveModule,
    ],
})
export class KeyValueFieldComponent extends BaseField {
    @Input({ required: true }) public buttonText: string;

    private fb = inject(FormBuilder);

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public get keyValueForm(): FormGroup<KeyValueForm> {
        return this.fb.group<KeyValueForm>({
            name: this.fb.control(""),
            value: this.fb.control(""),
        });
    }

    public addItem(): void {
        this.items.push(this.keyValueForm);
    }

    public removeItem(index: number): void {
        this.items.removeAt(index);
    }
}
