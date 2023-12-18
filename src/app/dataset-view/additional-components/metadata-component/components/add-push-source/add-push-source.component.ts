import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReadKind, MergeKind, PreprocessStepValue } from "../add-polling-source/add-polling-source-form.types";
import { READ_STEP_RADIO_CONTROLS, MERGE_STEP_RADIO_CONTROLS } from "../add-polling-source/form-control.source";
import { MERGE_FORM_DATA } from "../add-polling-source/steps/data/merge-form-data";
import { READ_FORM_DATA } from "../add-polling-source/steps/data/read-form-data";
import { BaseMainEventComponent } from "../base-main-event.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { EditPollingSourceService } from "../add-polling-source/edit-polling-source.service";
import { ProcessFormService } from "../add-polling-source/process-form.service";
import { AddPushSourceSection, SetPollingSourceSection } from "src/app/shared/shared.types";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "src/app/common/app.types";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { from } from "rxjs";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { AddPushSourceEditFormType } from "./add-push-source-form.types";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

@Component({
    selector: "app-add-push-source",
    templateUrl: "./add-push-source.component.html",
    styleUrls: ["./add-push-source.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPushSourceComponent extends BaseMainEventComponent {
    public currentStep: AddPushSourceSection = AddPushSourceSection.READ;
    public steps: typeof AddPushSourceSection = AddPushSourceSection;
    public showPreprocessStep = false;
    public preprocessStepValue: PreprocessStepValue = {
        engine: "",
        queries: [],
    };

    // ---------------------------------
    public readonly READ_STEP_RADIO_DATA = READ_STEP_RADIO_CONTROLS;
    public readonly READ_FORM_DATA = READ_FORM_DATA;
    public readonly READ_DEFAULT_KIND = ReadKind.CSV;
    // ---------------------------------
    public readonly MERGE_STEP_RADIO_DATA = MERGE_STEP_RADIO_CONTROLS;
    public readonly MERGE_FORM_DATA = MERGE_FORM_DATA;
    public readonly MERGE_DEFAULT_KIND = MergeKind.APPEND;

    constructor(
        private fb: FormBuilder,
        private processFormService: ProcessFormService,
        private editService: EditPollingSourceService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.checkDatasetEditability(DatasetKind.Root);
        this.trackSubscriptions(
            this.editService
                .getEventAsYaml(this.getDatasetInfoFromUrl(), SupportedEvents.AddPushSource)
                .subscribe((result: MaybeNullOrUndefined<string>) => {
                    if (result) {
                        this.eventYamlByHash = result;
                    }
                    this.history = this.editService.history;
                    this.cdr.detectChanges();
                }),
        );
        this.subsribeErrorMessage();
    }

    public addPushSourceForm: FormGroup = this.fb.group({
        sourceName: this.fb.control("", RxwebValidators.noneOf({ matchValues: ["test1", "test2"] })),
        read: this.fb.group({
            kind: [this.READ_DEFAULT_KIND],
        }),
        merge: this.fb.group({
            kind: [this.MERGE_DEFAULT_KIND],
        }),
    });

    public get readForm(): FormGroup {
        return this.addPushSourceForm.get(AddPushSourceSection.READ) as FormGroup;
    }

    public get mergeForm(): FormGroup {
        return this.addPushSourceForm.get(AddPushSourceSection.MERGE) as FormGroup;
    }

    public onShowErrors(): void {
        const elems = document.querySelectorAll<HTMLInputElement>("input.ng-invalid");
        elems.forEach((element: HTMLInputElement) => {
            setTimeout(() => {
                element.focus();
                element.blur();
            });
        });
    }

    public changeStep(step: SetPollingSourceSection | AddPushSourceSection): void {
        this.currentStep = step as AddPushSourceSection;
    }

    public onShowPreprcessStep(showPreprocessStep: boolean): void {
        this.showPreprocessStep = showPreprocessStep;
    }

    public onEditYaml(): void {
        const modalRef: NgbModalRef = this.modalService.open(FinalYamlModalComponent, { size: "lg" });
        const instance = modalRef.componentInstance as FinalYamlModalComponent;
        this.processFormService.transformForm(this.addPushSourceForm);

        instance.yamlTemplate =
            this.errorMessage && this.changedEventYamlByHash
                ? this.changedEventYamlByHash
                : this.yamlEventService.buildYamlAddPushSourceEvent(
                      this.addPushSourceForm.value as AddPushSourceEditFormType,
                      this.showPreprocessStep ? this.preprocessStepValue : null,
                  );
        instance.datasetInfo = this.getDatasetInfoFromUrl();
        this.trackSubscription(
            from(modalRef.result).subscribe((eventYaml: string) => {
                this.changedEventYamlByHash = eventYaml;
            }),
        );
    }

    protected onSaveEvent(): void {
        this.processFormService.transformForm(this.addPushSourceForm);
        this.trackSubscription(
            this.datasetCommitService
                .commitEventToDataset(
                    this.getDatasetInfoFromUrl().accountName,
                    this.getDatasetInfoFromUrl().datasetName,
                    this.yamlEventService.buildYamlAddPushSourceEvent(
                        this.addPushSourceForm.value as AddPushSourceEditFormType,
                        this.showPreprocessStep ? this.preprocessStepValue : null,
                    ),
                )
                .subscribe(),
        );
    }
}
