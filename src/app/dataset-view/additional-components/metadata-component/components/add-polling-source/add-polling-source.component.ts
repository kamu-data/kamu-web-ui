/* eslint-disable @typescript-eslint/unbound-method */
import {
    fetchStepRadioControls,
    mergeStepRadioControls,
    readStepRadioControls,
} from "./form-control.source";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { NavigationService } from "src/app/services/navigation.service";
import { SetPollingSource } from "./../../../../../api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import AppValues from "src/app/common/app.values";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { PollingSourceSteps } from "./add-polling-source.types";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPollingSourceComponent extends BaseComponent implements OnInit {
    public currentStep: PollingSourceSteps = PollingSourceSteps.FETCH;
    public steps: typeof PollingSourceSteps = PollingSourceSteps;

    //    fetch step
    public fetchUrlForm: FormGroup = this.fb.group({
        kind: ["url"],
        url: [
            "",
            [Validators.required, Validators.pattern(AppValues.URL_PATTERN)],
        ],
    });

    public fetchFilesGlobForm: FormGroup = this.fb.group({
        kind: ["filesGlob"],
        path: ["", [Validators.required]],
    });

    public fetchContainerForm: FormGroup = this.fb.group({
        kind: ["container"],
        image: ["", [Validators.required]],
    });

    private fetchFormByKind: Record<string, FormGroup> = {
        url: this.fetchUrlForm,
        filesGlob: this.fetchFilesGlobForm,
        container: this.fetchContainerForm,
    };

    public fetchStepRadioData = fetchStepRadioControls;
    //    end fetch step

    // read step
    public readCsvForm: FormGroup = this.fb.group({
        kind: ["csv"],
        separator: [""],
    });

    public readJsonLinesForm: FormGroup = this.fb.group({
        kind: ["jsonLines"],
        dateFormat: [""],
    });

    private readGeoJsonForm: FormGroup = this.fb.group({
        kind: ["geoJson"],
    });

    public readEsriShapefileForm: FormGroup = this.fb.group({
        kind: ["esriShapefile"],
    });

    public readParquetForm: FormGroup = this.fb.group({
        kind: ["parquet"],
    });

    private readFormByKind: Record<string, FormGroup> = {
        csv: this.readCsvForm,
        jsonLines: this.readJsonLinesForm,
        geoJson: this.readGeoJsonForm,
        esriShapefile: this.readEsriShapefileForm,
        parquet: this.readParquetForm,
    };

    public readStepRadioData = readStepRadioControls;
    // end read step

    // merge step
    public mergeAppendForm: FormGroup = this.fb.group({
        kind: ["append"],
    });

    public mergeLedgerForm: FormGroup = this.fb.group({
        kind: ["ledger"],
    });

    public mergeSnapshotForm: FormGroup = this.fb.group({
        kind: ["snapshot"],
    });

    private mergeFormByKind: Record<string, FormGroup> = {
        append: this.mergeAppendForm,
        snapshot: this.mergeSnapshotForm,
        ledger: this.mergeLedgerForm,
    };

    public mergeStepRadioData = mergeStepRadioControls;
    // end merge

    public pollingSourceForm: FormGroup = this.fb.group({
        fetch: this.fetchUrlForm,
        read: this.readCsvForm,
        merge: this.mergeAppendForm,
    });

    constructor(
        private fb: FormBuilder,
        private createDatasetService: AppDatasetCreateService,
        private yamlEventService: TemplatesYamlEventsService,
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService,
        private modalService: NgbModal,
    ) {
        super();
    }

    ngOnInit(): void {
        this.stepKindChanges();
    }

    public changeStep(step: PollingSourceSteps): void {
        this.currentStep = step;
    }

    public onSubmit(): void {
        this.trackSubscription(
            this.createDatasetService
                .commitEventToDataset(
                    this.getDatasetInfoFromUrl().accountName,
                    this.getDatasetInfoFromUrl().datasetName,
                    this.yamlEventService.buildYamlSetPollingSourceEvent(
                        this.pollingSourceForm.value as Omit<
                            SetPollingSource,
                            "__typename"
                        >,
                    ),
                )
                .subscribe(() => {
                    this.navigationService.navigateToDatasetView({
                        ...this.getDatasetInfoFromUrl(),
                        tab: DatasetViewTypeEnum.Metadata,
                    });
                }),
        );
    }

    private stepKindChanges(): void {
        this.trackSubscriptions(
            this.fetchUrlForm.controls.kind.valueChanges.subscribe(() => {
                this.pollingSourceForm.controls.fetch =
                    this.fetchFormByKind[
                        this.fetchUrlForm.controls.kind.value as string
                    ];
            }),
            this.readCsvForm.controls.kind.valueChanges.subscribe(() => {
                this.pollingSourceForm.controls.read =
                    this.readFormByKind[
                        this.readCsvForm.controls.kind.value as string
                    ];
            }),
            this.mergeAppendForm.controls.kind.valueChanges.subscribe(() => {
                this.pollingSourceForm.controls.merge =
                    this.mergeFormByKind[
                        this.mergeAppendForm.controls.kind.value as string
                    ];
            }),
        );
    }

    public getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            accountName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
            ),
            datasetName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
            ),
        };
    }

    public onEditYaml(): void {
        const modalRef: NgbModalRef = this.modalService.open(
            FinalYamlModalComponent,
            { size: "lg" },
        );
        (modalRef.componentInstance as FinalYamlModalComponent).yamlTemplate =
            this.yamlEventService.buildYamlSetPollingSourceEvent(
                this.pollingSourceForm.value as Omit<
                    SetPollingSource,
                    "__typename"
                >,
            );
        (modalRef.componentInstance as FinalYamlModalComponent).datasetInfo =
            this.getDatasetInfoFromUrl();
    }
}
