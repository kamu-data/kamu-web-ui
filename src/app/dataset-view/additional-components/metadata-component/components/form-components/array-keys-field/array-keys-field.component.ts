/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { BaseField } from "../base-field";

@Component({
    selector: "app-array-keys-field",
    templateUrl: "./array-keys-field.component.html",
    styleUrls: ["./array-keys-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayKeysFieldComponent extends BaseField {
    @Input({ required: true }) public buttonText: string;
    @Input({ required: true }) public placeholder: string;

    private fb = inject(FormBuilder);

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public addPrimaryKey(): void {
        this.items.push(this.fb.control("", [Validators.required]));
    }

    public removePrimaryKey(index: number): void {
        this.items.removeAt(index);
    }
}
