/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, DatePipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { DisplaySizePipe } from "@common/pipes/display-size.pipe";

import { FileFormType } from "../../../versioned-file-view/versioned-file-view.model";
import { RenameCollectionItemForm } from "../../collection-view.model";

@Component({
    selector: "app-rename-collection-item-modal",
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        //-----//
        FormValidationErrorsDirective,
    ],
    templateUrl: "./rename-collection-item-modal.component.html",
    styleUrl: "./rename-collection-item-modal.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenameCollectionItemModalComponent implements OnInit {
    @Input({ required: true }) public name: string;

    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);

    public renameItemForm: FormGroup<RenameCollectionItemForm> = this.fb.group({
        name: ["", [Validators.required]],
    });

    public ngOnInit(): void {
        this.renameItemForm.patchValue({
            name: this.name,
        });
    }

    public onRenameItem(): void {
        this.activeModal.close(this.renameItemForm.controls.name.value);
    }
}
