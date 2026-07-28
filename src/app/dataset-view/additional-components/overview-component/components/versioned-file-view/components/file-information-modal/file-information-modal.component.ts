/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";

import { FileFormType } from "../../versioned-file-view.model";

@Component({
    selector: "app-file-information-modal",
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,

        //-----//
        MatDividerModule,

        //-----//
        FormValidationErrorsDirective,
    ],
    templateUrl: "./file-information-modal.component.html",
    styleUrl: "./file-information-modal.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInformationModalComponent implements OnInit {
    @Input({ required: true }) public fileInformation: File;

    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);

    public fileForm: FormGroup<FileFormType> = this.fb.group({
        name: ["", [Validators.required]],
        contentLength: [0, [Validators.required]],
        contentType: ["", [Validators.required]],
    });

    public ngOnInit(): void {
        this.fileForm.patchValue({
            name: this.fileInformation.name,
            contentLength: this.fileInformation.size,
            contentType: this.fileInformation.type,
        });
        this.fileForm.controls.contentLength.disable();
        this.fileForm.controls.name.disable();
    }

    public onUploadFile(): void {
        this.activeModal.close(this.fileForm.value);
    }
}
