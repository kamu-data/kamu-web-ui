/* eslint-disable @typescript-eslint/unbound-method */
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { NavigationService } from "src/app/services/navigation.service";
import { SetPollingSource } from "./../../../../../api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { PollingSourceSteps } from "./add-polling-source.types";
import { PollingSourceFormService } from "src/app/services/polling-source-form.service";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPollingSourceComponent extends BaseComponent implements OnInit {
    public currentStep: PollingSourceSteps = PollingSourceSteps.FETCH;
    public steps: typeof PollingSourceSteps = PollingSourceSteps;
    public fetchForm: FormGroup = this.formService.fetchFormByKind.url;
    public readForm: FormGroup = this.formService.readFormByKind.csv;
    public mergeForm: FormGroup = this.formService.mergeFormByKind.append;

    public pollingSourceForm: FormGroup = this.fb.group({
        fetch: this.fetchForm,
        read: this.readForm,
        merge: this.mergeForm,
    });

    constructor(
        private fb: FormBuilder,
        private createDatasetService: AppDatasetCreateService,
        private yamlEventService: TemplatesYamlEventsService,
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService,
        private modalService: NgbModal,
        private formService: PollingSourceFormService,
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
            this.fetchForm.controls.kind.valueChanges.subscribe(() => {
                this.pollingSourceForm.controls.fetch =
                    this.formService.fetchFormByKind[
                        this.fetchForm.controls.kind.value as string
                    ];
            }),
            this.readForm.controls.kind.valueChanges.subscribe(() => {
                this.pollingSourceForm.controls.read =
                    this.formService.readFormByKind[
                        this.readForm.controls.kind.value as string
                    ];
            }),
            this.mergeForm.controls.kind.valueChanges.subscribe(() => {
                this.pollingSourceForm.controls.merge =
                    this.formService.mergeFormByKind[
                        this.mergeForm.controls.kind.value as string
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
