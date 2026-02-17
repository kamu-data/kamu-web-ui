/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { finalize } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "@common/components/base.component";
import { DynamicTableDataRow } from "@common/components/dynamic-table/dynamic-table.interface";
import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import AppValues from "@common/values/app.values";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
    SetLicense,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetSchema } from "@interface/dataset-schema.interface";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LicenseFormType } from "src/app/dataset-view/additional-components/overview-component/components/edit-license-modal/edit-license-modal.types";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";

@Component({
    selector: "app-edit-license-modal",
    templateUrl: "./edit-license-modal.component.html",
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class EditLicenseModalComponent extends BaseComponent implements OnInit {
    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);
    private datasetCommitService = inject(DatasetCommitService);
    private yamlEventService = inject(TemplatesYamlEventsService);
    private loggedUserService = inject(LoggedUserService);

    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DynamicTableDataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };
    public licenseForm: FormGroup<LicenseFormType> = this.fb.group({
        name: ["", [Validators.required]],
        shortName: ["", [Validators.required]],
        websiteUrl: ["", [Validators.required, Validators.pattern(AppValues.URL_PATTERN)]],
        spdxId: [""],
    });

    public ngOnInit(): void {
        if (this.currentState?.overview.metadata.currentLicense) {
            const { name, shortName, spdxId, websiteUrl } = this.currentState.overview.metadata.currentLicense;
            this.licenseForm.patchValue({
                name,
                shortName,
                spdxId,
                websiteUrl,
            });
        }
    }

    public onEditLicense(): void {
        this.datasetCommitService
            .commitEventToDataset({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                accountName: this.datasetBasics.owner.accountName,
                datasetName: this.datasetBasics.name,
                event: this.yamlEventService.buildYamlSetLicenseEvent(
                    this.licenseForm.value as Omit<SetLicense, "__typename">,
                ),
            })
            .pipe(
                finalize(() => this.activeModal.close()),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
