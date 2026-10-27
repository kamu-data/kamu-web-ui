/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormArray, ReactiveFormsModule } from "@angular/forms";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { requireFormArray } from "@common/helpers/form.helpers";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
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
        RxReactiveFormsModule,
        //-----//
        TooltipIconComponent,
    ],
})
export class KeyValueFieldComponent extends BaseField {
    @Input({ required: true }) public buttonText: string;

    public get items(): FormArray {
        return requireFormArray(this.form, this.controlName);
    }

    public addItem(): void {
        this.items.push(nameValueGroup());
    }

    public removeItem(index: number): void {
        this.items.removeAt(index);
    }
}
