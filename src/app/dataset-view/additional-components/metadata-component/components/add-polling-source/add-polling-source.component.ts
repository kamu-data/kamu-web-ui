import {
    FetchKind,
    ReadKind,
    MergeKind,
    PrepareKind,
    PreprocessKind,
} from "./add-polling-source-form.types";
/* eslint-disable @typescript-eslint/unbound-method */
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { SetPollingSource } from "./../../../../../api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SetPollingSourceSection } from "src/app/shared/shared.types";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPollingSourceComponent extends BaseComponent {
    public currentStep: SetPollingSourceSection = SetPollingSourceSection.FETCH;
    public steps: typeof SetPollingSourceSection = SetPollingSourceSection;
    public isAddPrepareStep = false;
    public isAddPreprocessStep = false;
    private defaultFetchKind = FetchKind.URL;
    private defaultReadKind = ReadKind.CSV;
    private defaultMergeKind = MergeKind.APPEND;
    private defaultPrepareKind = PrepareKind.PIPE;
    private defaultPreprocessKind = PreprocessKind.SQL;

    public pollingSourceForm: FormGroup = this.fb.group({
        fetch: this.fb.group({
            kind: [this.defaultFetchKind],
        }),
        read: this.fb.group({
            kind: [this.defaultReadKind],
        }),
        merge: this.fb.group({
            kind: [this.defaultMergeKind],
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
    ) {
        super();
    }

    public changeStep(step: SetPollingSourceSection): void {
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
