import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
    SetLicense,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetSchema, DataRow } from "src/app/interface/dataset.interface";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { DatasetCommitService } from "../../services/dataset-commit.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { finalize } from "rxjs";
import { LicenseFormType } from "./edit-license-modal.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-edit-license-modal",
    templateUrl: "./edit-license-modal.component.html",
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
        data: DataRow[];
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
