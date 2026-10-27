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
import { MqttQos } from "@api/kamu.graphql.interface";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import { topicGroup } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    selector: "app-topics-field",
    templateUrl: "./topics-field.component.html",
    styleUrls: ["./topics-field.component.scss"],
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
export class TopicsFieldComponent extends BaseField {
    @Input({ required: true }) public buttonText: string;
    @Input() public requiredField?: boolean;
    public readonly MqttQos: typeof MqttQos = MqttQos;

    public get items(): FormArray {
        return requireFormArray(this.form, this.controlName);
    }

    public addItem(): void {
        this.items.push(topicGroup());
    }

    public removeItem(index: number): void {
        this.items.removeAt(index);
    }
}
