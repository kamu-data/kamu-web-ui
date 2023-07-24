/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    FetchKind,
    ReadKind,
    MergeKind,
    PreprocessStepValue,
} from "./add-polling-source-form.types";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import {
    DatasetKind,
    SetPollingSource,
} from "./../../../../../api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
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
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { EditPollingSourceService } from "./edit-polling-source.service";
import { MaybeNull } from "src/app/common/app.types";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true },
        },
    ],
})
export class AddPollingSourceComponent extends BaseComponent implements OnInit {
    public currentStep: SetPollingSourceSection = SetPollingSourceSection.FETCH;
    public steps: typeof SetPollingSourceSection = SetPollingSourceSection;
    public showPreprocessStep = false;
    public errorMessage = "";
    public history: DatasetHistoryUpdate;
    public eventYamlByHash: MaybeNull<string>;
    public datasetKind: DatasetKind;
    public preprocessStepValue: PreprocessStepValue = {
        engine: "",
        queries: [],
    };
    // ---------------------------------
    public readonly FETCH_STEP_RADIO_DATA = FETCH_STEP_RADIO_CONTROLS;
    public readonly FETCH_FORM_DATA = FETCH_FORM_DATA;
    public readonly FETCH_DEFAULT_KIND = FetchKind.URL;
    // ---------------------------------
    public readonly READ_STEP_RADIO_DATA = READ_STEP_RADIO_CONTROLS;
    public readonly READ_FORM_DATA = READ_FORM_DATA;
    public readonly READ_DEFAULT_KIND = ReadKind.CSV;
    // ---------------------------------
    public readonly MERGE_STEP_RADIO_DATA = MERGE_STEP_RADIO_CONTROLS;
    public readonly MERGE_FORM_DATA = MERGE_FORM_DATA;
    public readonly MERGE_DEFAULT_KIND = MergeKind.APPEND;

    public pollingSourceForm: FormGroup = this.fb.group({
        fetch: this.fb.group({
            kind: [this.FETCH_DEFAULT_KIND],
        }),
        prepare: this.fb.array([]),
        read: this.fb.group({
            kind: [this.READ_DEFAULT_KIND],
        }),
        merge: this.fb.group({
            kind: [this.MERGE_DEFAULT_KIND],
        }),
    });

    public get fetchForm(): FormGroup {
        return this.pollingSourceForm.get(
            SetPollingSourceSection.FETCH,
        ) as FormGroup;
    }

    public get prepareForm(): FormArray {
        return this.pollingSourceForm.get(
            SetPollingSourceSection.PREPARE,
        ) as FormArray;
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

    constructor(
        private fb: FormBuilder,
        private createDatasetService: AppDatasetCreateService,
        private yamlEventService: TemplatesYamlEventsService,
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef,
        private processFormService: ProcessFormService,
        private editService: EditPollingSourceService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getDatasetKind();
        this.trackSubscriptions(
            this.editService
                .getEventAsYaml(
                    this.getDatasetInfoFromUrl(),
                    SupportedEvents.SetPollingSource,
                )
                .subscribe((result: string | undefined | null) => {
                    if (result) {
                        this.eventYamlByHash = result;
                    }
                    this.history = this.editService.history;
                    this.cdr.detectChanges();
                }),
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
        this.processFormService.transformForm(this.pollingSourceForm);
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
                        this.showPreprocessStep
                            ? this.preprocessStepValue
                            : null,
                    ),
                )
                .subscribe(),
        );
    }

    public onEditYaml(): void {
        const modalRef: NgbModalRef = this.modalService.open(
            FinalYamlModalComponent,
            { size: "lg" },
        );
        const instance = modalRef.componentInstance as FinalYamlModalComponent;
        this.processFormService.transformForm(this.pollingSourceForm);
        instance.yamlTemplate =
            this.yamlEventService.buildYamlSetPollingSourceEvent(
                this.pollingSourceForm.value as Omit<
                    SetPollingSource,
                    "__typename"
                >,
                this.showPreprocessStep ? this.preprocessStepValue : null,
            );
        instance.datasetInfo = this.getDatasetInfoFromUrl();
    }

    public onShowPreprcessStep(showPreprocessStep: boolean): void {
        this.showPreprocessStep = showPreprocessStep;
    }

    private getDatasetKind(): void {
        this.trackSubscription(
            this.editService.onKindChanges.subscribe((kind: DatasetKind) => {
                this.datasetKind = kind;
            }),
        );
    }

    public onShowErrors(): void {
        const elems =
            document.querySelectorAll<HTMLInputElement>("input.ng-invalid");
        elems.forEach((element: HTMLInputElement) => {
            setTimeout(() => {
                element.focus();
                element.blur();
            });
        });
    }
}
