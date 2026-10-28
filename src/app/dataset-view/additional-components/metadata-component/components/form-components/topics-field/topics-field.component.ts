/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormArray, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { NgxTrimDirectiveModule } from "ngx-trim-directive";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import { TopicControls } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
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
        //-----//
        TooltipIconComponent,
        FormValidationErrorsDirective,
    ],
})
export class TopicsFieldComponent extends BaseField<FormArray<FormGroup<TopicControls>>> {
    @Input({ required: true }) public buttonText: string;
    @Input() public requiredField?: boolean;

    public addItem(): void {
        this.control.push(topicGroup());
    }

    public removeItem(index: number): void {
        this.control.removeAt(index);
    }
}
