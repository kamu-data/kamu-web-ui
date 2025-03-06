/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormBuilder, FormArray, FormGroup } from "@angular/forms";
import { BaseField } from "../base-field";
import { MqttQos } from "src/app/api/kamu.graphql.interface";
import { KeyValueFormType } from "./topics-field.types";

@Component({
    selector: "app-topics-field",
    templateUrl: "./topics-field.component.html",
    styleUrls: ["./topics-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicsFieldComponent extends BaseField {
    @Input({ required: true }) public buttonText: string;
    @Input() public requiredField?: boolean;
    public readonly MqttQos: typeof MqttQos = MqttQos;

    private fb = inject(FormBuilder);

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public get keyValueForm(): FormGroup<KeyValueFormType> {
        return this.fb.group<KeyValueFormType>({
            path: this.fb.control("", RxwebValidators.required()),
            qos: this.fb.control(""),
        });
    }

    public addItem(): void {
        this.items.push(this.keyValueForm);
    }

    public removeItem(index: number): void {
        this.items.removeAt(index);
    }
}
