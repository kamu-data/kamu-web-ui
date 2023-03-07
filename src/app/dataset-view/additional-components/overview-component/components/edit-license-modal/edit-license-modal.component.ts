import AppValues from "src/app/common/app.values";
/* eslint-disable @typescript-eslint/unbound-method */
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { DatasetSchema, DataRow } from "src/app/interface/dataset.interface";

@Component({
    selector: "app-edit-license-modal",
    templateUrl: "./edit-license-modal.component.html",
    styleUrls: ["./edit-license-modal.component.sass"],
})
export class EditLicenseModalComponent implements OnInit {
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
        websiteUrl: [
            "",
            [
                Validators.required,
                Validators.pattern(AppValues.URL_REX_EXPRESSION),
            ],
        ],
        spdxId: [""],
    });

    constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

    ngOnInit(): void {
        if (this.currentState?.overview.metadata.currentLicense) {
            const { name, shortName, spdxId, websiteUrl } =
                this.currentState.overview.metadata.currentLicense;
            this.licenseForm.patchValue({
                name,
                shortName,
                spdxId,
                websiteUrl,
            });
        }
    }

    public onEditLicense(): void {
        console.log("form=", this.licenseForm.value);
    }
}
