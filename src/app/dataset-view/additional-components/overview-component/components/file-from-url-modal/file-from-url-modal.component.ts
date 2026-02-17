/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/common/components/base.component";

import { FileUrlFormType } from "./file-from-url-modal.types";

@Component({
    selector: "app-file-from-url-modal",
    templateUrl: "./file-from-url-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
    ],
})
export class FileFromUrlModalComponent extends BaseComponent {
    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);

    public fileUrlForm: FormGroup<FileUrlFormType> = this.fb.group({
        fileUrl: ["", [Validators.required]],
    });
}
