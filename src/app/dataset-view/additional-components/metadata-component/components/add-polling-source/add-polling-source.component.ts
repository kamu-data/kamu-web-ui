/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    FetchKind,
    ReadKind,
    MergeKind,
    PrepareKind,
    PreprocessKind,
} from "./add-polling-source-form.types";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { SetPollingSource } from "./../../../../../api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import {
    FETCH_STEP_RADIO_CONTROLS,
    MERGE_STEP_RADIO_CONTROLS,
    READ_STEP_RADIO_CONTROLS,
} from "./form-control.source";
import { FETCH_FORM_DATA } from "./steps/data/fetch-form-data";
import { READ_FORM_DATA } from "./steps/data/read-form-data";
import { MERGE_FORM_DATA } from "./steps/data/merge-form-data";
import { ProcessFormService } from "./process-form.service";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPollingSourceComponent extends BaseComponent implements OnInit {
    public currentStep: SetPollingSourceSection = SetPollingSourceSection.READ;
    public steps: typeof SetPollingSourceSection = SetPollingSourceSection;
    public isAddPrepareStep = false;
    public isAddPreprocessStep = false;
    public errorMessage = "";
    // --------------------------------
    private readonly defaultPrepareKind = PrepareKind.PIPE;
    private readonly defaultPreprocessKind = PreprocessKind.SQL;
    // ---------------------------------
    public readonly fetchStepRadioData = FETCH_STEP_RADIO_CONTROLS;
    public readonly fetchFormData = FETCH_FORM_DATA;
    public readonly fetchDefaultKind = FetchKind.URL;
    // ---------------------------------
    public readonly readStepRadioData = READ_STEP_RADIO_CONTROLS;
    public readonly readFormData = READ_FORM_DATA;
    public readonly readDefaultKind = ReadKind.CSV;
    // ---------------------------------
    public readonly mergeStepRadioData = MERGE_STEP_RADIO_CONTROLS;
    public readonly mergeFormData = MERGE_FORM_DATA;
    public readonly mergeDefaultKind = MergeKind.APPEND;

    public pollingSourceForm: FormGroup = this.fb.group({
        fetch: this.fb.group({
            kind: [this.fetchDefaultKind],
        }),
        read: this.fb.group({
            kind: [this.readDefaultKind],
        }),
        merge: this.fb.group({
            kind: [this.mergeDefaultKind],
        }),
    });

    public get fetchForm(): FormGroup {
        return this.pollingSourceForm.get(
            SetPollingSourceSection.FETCH,
        ) as FormGroup;
    }

    public get readForm(): FormGroup {
        return this.pollingSourceForm.get(
            SetPollingSourceSection.READ,
        ) as FormGroup;
    }

    public get mergeForm(): FormGroup {
        return this.pollingSourceForm.get(
            SetPollingSourceSection.MERGE,
        ) as FormGroup;
    }

    public onCheckedPrepareStep(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            this.pollingSourceForm.addControl(
                SetPollingSourceSection.PREPARE,
                this.fb.group({
                    kind: this.defaultPrepareKind,
                }),
            );
        } else {
            this.pollingSourceForm.removeControl(
                SetPollingSourceSection.PREPARE,
            );
        }
    }

    public onCheckedPreprocessStep(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            this.pollingSourceForm.addControl(
                SetPollingSourceSection.PREPROCESS,
                this.fb.group({
                    kind: this.defaultPreprocessKind,
                }),
            );
        } else {
            this.pollingSourceForm.removeControl(
                SetPollingSourceSection.PREPROCESS,
            );
        }
    }

    constructor(
        private fb: FormBuilder,
        private createDatasetService: AppDatasetCreateService,
        private yamlEventService: TemplatesYamlEventsService,
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef,
        private processFormService: ProcessFormService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.createDatasetService.onErrorCommitEventChanges.subscribe(
                (message: string) => {
                    this.errorMessage = message;
                    this.cdr.detectChanges();
                },
            ),
        );
    }

    public changeStep(step: SetPollingSourceSection): void {
        this.currentStep = step;
    }

    public onSubmit(): void {
        this.processFormService.transformSchema(this.pollingSourceForm);
        this.processFormService.processFetchOrderControl(
            this.pollingSourceForm,
        );
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
                .subscribe(),
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
        this.processFormService.transformSchema(this.pollingSourceForm);
        this.processFormService.processFetchOrderControl(
            this.pollingSourceForm,
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

    private processFetchOrderControl(): void {
        const form = this.pollingSourceForm.value;
        if (form.fetch.order && form.fetch.order === "none") {
            delete form.fetch.order;
        }
    }
}
