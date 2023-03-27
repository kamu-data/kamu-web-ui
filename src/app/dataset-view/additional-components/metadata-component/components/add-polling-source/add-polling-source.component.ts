/* eslint-disable @typescript-eslint/unbound-method */
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { SetPollingSource } from "./../../../../../api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { PollingSourceSteps } from "./add-polling-source.types";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPollingSourceComponent extends BaseComponent {
    public currentStep: PollingSourceSteps = PollingSourceSteps.FETCH;
    public steps: typeof PollingSourceSteps = PollingSourceSteps;
    public isAddPrepareStep = false;
    public isAddPreprocessStep = false;

    public pollingSourceForm: FormGroup = this.fb.group({
        fetch: this.fb.group({
            kind: ["url"],
        }),
        read: this.fb.group({
            kind: ["csv"],
        }),
        merge: this.fb.group({
            kind: ["append"],
        }),
    });

    public get fetchForm(): FormGroup {
        return this.pollingSourceForm.get("fetch") as FormGroup;
    }

    public get readForm(): FormGroup {
        return this.pollingSourceForm.get("read") as FormGroup;
    }

    public get mergeForm(): FormGroup {
        return this.pollingSourceForm.get("merge") as FormGroup;
    }

    public onCheckedPrepareStep(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            this.pollingSourceForm.addControl(
                "prepare",
                this.fb.group({
                    kind: "pipe",
                }),
            );
        } else {
            this.pollingSourceForm.removeControl("prepare");
        }
    }

    public onCheckedPreprocessStep(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            this.pollingSourceForm.addControl(
                "preprocess",
                this.fb.group({
                    kind: "sql",
                }),
            );
        } else {
            this.pollingSourceForm.removeControl("preprocess");
        }
    }

    constructor(
        private fb: FormBuilder,
        private createDatasetService: AppDatasetCreateService,
        private yamlEventService: TemplatesYamlEventsService,
        private activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private modalService: NgbModal,
    ) {
        super();
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
