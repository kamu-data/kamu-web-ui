/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import {
    ControlContainer,
    FormArray,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

import { BaseComponent } from "@common/components/base.component";
import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import {
    AddPollingSourceEditFormType,
    DecompressFormat,
    PrepareKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
import { MaybeNull } from "src/app/interface/app.types";

@Component({
    selector: "app-prepare-step",
    templateUrl: "./prepare-step.component.html",
    styleUrls: ["./prepare-step.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
    imports: [
        //-----//
        FormsModule,
        NgFor,
        NgIf,
        ReactiveFormsModule,
        //-----//
        MatIconModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class PrepareStepComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public eventYamlByHash: MaybeNull<string> = null;
    @Input({ required: true }) public sectionName: SetPollingSourceSection;
    public parentForm: FormGroup;
    public setPollingSourceEvent: MaybeNull<AddPollingSourceEditFormType> = null;
    public readonly prepareKind: typeof PrepareKind = PrepareKind;

    private rootFormGroupDirective = inject(FormGroupDirective);
    private fb = inject(FormBuilder);
    private editService = inject(EditPollingSourceService);

    public ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        if (this.eventYamlByHash) {
            this.setPollingSourceEvent = this.editService.parseEventFromYaml(this.eventYamlByHash);
            this.initExistingPrepareStep(this.setPollingSourceEvent);
        }
    }

    private initExistingPrepareStep(event: AddPollingSourceEditFormType): void {
        let group: FormGroup;
        if (event.prepare && this.sectionForm.length === 0) {
            event.prepare.forEach((item) => {
                if (item.kind === PrepareKind.PIPE && Array.isArray(item.command)) {
                    group = this.fb.group({
                        kind: this.fb.control(PrepareKind.PIPE),
                        command: this.fb.control(item.command.join(" "), Validators.required),
                    });
                } else if (item.kind === PrepareKind.DECOMPRESS) {
                    group = this.fb.group({
                        kind: this.fb.control(PrepareKind.DECOMPRESS),
                        format: this.fb.control(item.format),
                        subPath: this.fb.control(item.subPath),
                    });
                }
                this.sectionForm.push(group);
            });
        }
    }

    public get sectionForm(): FormArray {
        return this.parentForm.get(this.sectionName) as FormArray;
    }

    public addPipe(): void {
        this.sectionForm.push(
            this.fb.group({
                kind: this.fb.control(PrepareKind.PIPE),
                command: this.fb.control("", Validators.required),
            }),
        );
    }

    public addDecompress(): void {
        this.sectionForm.push(
            this.fb.group({
                kind: this.fb.control(PrepareKind.DECOMPRESS),
                format: this.fb.control(DecompressFormat.ZIP),
                subPath: this.fb.control(""),
            }),
        );
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
