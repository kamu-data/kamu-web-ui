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
import { listItemControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    selector: "app-array-keys-field",
    templateUrl: "./array-keys-field.component.html",
    styleUrls: ["./array-keys-field.component.scss"],
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
export class ArrayKeysFieldComponent extends BaseField {
    @Input({ required: true }) public buttonText: string;
    @Input({ required: true }) public placeholder: string;

    public get items(): FormArray {
        return requireFormArray(this.form, this.controlName);
    }

    public addPrimaryKey(): void {
        this.items.push(listItemControl());
    }

    public removePrimaryKey(index: number): void {
        this.items.removeAt(index);
    }
}
