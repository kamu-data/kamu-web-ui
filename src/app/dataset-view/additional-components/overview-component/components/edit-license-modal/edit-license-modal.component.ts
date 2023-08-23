import { BaseComponent } from "src/app/common/base.component";
import AppValues from "src/app/common/app.values";
/* eslint-disable @typescript-eslint/unbound-method */
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
    SetLicense,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { DatasetSchema, DataRow } from "src/app/interface/dataset.interface";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { DatasetCommitService } from "../../services/dataset-commit.service";

@Component({
    selector: "app-edit-license-modal",
    templateUrl: "./edit-license-modal.component.html",
    styleUrls: ["./edit-license-modal.component.sass"],
})
export class EditLicenseModalComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Input() public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };
    public licenseForm: FormGroup = this.fb.group({
        name: ["", [Validators.required]],
        shortName: ["", [Validators.required]],
        websiteUrl: ["", [Validators.required, Validators.pattern(AppValues.URL_PATTERN)]],
        spdxId: [""],
    });

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private datasetCommitService: DatasetCommitService,
        private yamlEventService: TemplatesYamlEventsService,
    ) {
        super();
    }

    ngOnInit(): void {
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
        if (this.datasetBasics)
            this.trackSubscription(
                this.datasetCommitService
                    .commitEventToDataset(
                        this.datasetBasics.owner.name,
                        this.datasetBasics.name,
                        this.yamlEventService.buildYamlSetLicenseEvent(
                            this.licenseForm.value as Omit<SetLicense, "__typename">,
                        ),
                    )
                    .subscribe(),
            );
    }
}
