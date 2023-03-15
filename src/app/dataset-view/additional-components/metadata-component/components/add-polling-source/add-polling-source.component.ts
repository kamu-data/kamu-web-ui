import { NavigationService } from "src/app/services/navigation.service";
import { SetPollingSource } from "./../../../../../api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as monaco from "monaco-editor";
import AppValues from "src/app/common/app.values";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPollingSourceComponent extends BaseComponent implements OnInit {
    public currentStep = 1;
    public yamlTemplate =
        "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: setPollingSource\n";

    public readonly sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
        {
            theme: "vs",
            language: "yaml",
            renderLineHighlight: "none",
            minimap: {
                enabled: false,
            },
        };

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
    // end merge

    public pollingSourceForm: FormGroup = this.fb.group({
        fetch: this.fetchFormByKind[
            this.fetchUrlForm.controls.kind.value as string
        ],
        read: this.readFormByKind[
            this.readCsvForm.controls.kind.value as string
        ],
        merge: this.mergeFormByKind[
            this.mergeAppendForm.controls.kind.value as string
        ],
    });

    constructor(
        private fb: FormBuilder,
        private createDatasetService: AppDatasetCreateService,
        private yamlEventService: TemplatesYamlEventsService,
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.stepKindChanges();
    }

    public nextStep(): void {
        this.currentStep++;
    }

    public prevStep(): void {
        this.currentStep--;
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
        console.log("edit");
    }
}
