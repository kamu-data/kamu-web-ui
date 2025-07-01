/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BaseComponent } from "src/app/common/components/base.component";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUrlFormType } from "./file-from-url-modal.types";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-file-from-url-modal",
    templateUrl: "./file-from-url-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatDividerModule, FormsModule, ReactiveFormsModule],
})
export class FileFromUrlModalComponent extends BaseComponent {
    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);

    public fileUrlForm: FormGroup<FileUrlFormType> = this.fb.group({
        fileUrl: ["", [Validators.required]],
    });
}
