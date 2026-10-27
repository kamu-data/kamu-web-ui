/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ControlContainer, FormArray, FormGroup, FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { MaybeNull } from "@interface/app.types";

import {
    PrepareKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    PipeStepControls,
    PrepareStepForm,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import {
    decompressStepGroup,
    pipeStepGroup,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    selector: "app-prepare-step",
    templateUrl: "./prepare-step.component.html",
    styleUrls: ["./prepare-step.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        MatIconModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class PrepareStepComponent {
    @Input({ required: true }) public sectionName: SetPollingSourceSection;
    @Input({ required: true }) public sectionForm: FormArray<PrepareStepForm>;

    /** The step as a pipe step's form, or `null` for a step of another kind. */
    public pipeStep(step: PrepareStepForm): MaybeNull<FormGroup<PipeStepControls>> {
        return isPipeStep(step) ? step : null;
    }

    public addPipe(): void {
        this.sectionForm.push(pipeStepGroup());
    }

    public addDecompress(): void {
        this.sectionForm.push(decompressStepGroup());
    }

    public delete(index: number): void {
        this.sectionForm.removeAt(index);
    }

    public swap(index: number, direction: number): void {
        const current = this.sectionForm.at(index);
        this.sectionForm.removeAt(index);
        this.sectionForm.insert(index + direction, current);
    }

    public isLastItem(index: number): boolean {
        return index === this.sectionForm.length - 1;
    }

    public isFirstItem(index: number): boolean {
        return index === 0;
    }
}

function isPipeStep(step: PrepareStepForm): step is FormGroup<PipeStepControls> {
    return step.controls.kind.value === PrepareKind.PIPE;
}
