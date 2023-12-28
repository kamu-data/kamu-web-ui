import { AddPushSource, MetadataBlockFragment } from "./../../../../../api/kamu.graphql.interface";
import { SupportedEvents } from "./../../../../../dataset-block/metadata-block/components/event-details/supported.events";
import ProjectLinks from "src/app/project-links";
import { MaybeNull } from "./../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, NgZone } from "@angular/core";
import { ReadKind, MergeKind, PreprocessStepValue } from "../add-polling-source/add-polling-source-form.types";
import { READ_STEP_RADIO_CONTROLS, MERGE_STEP_RADIO_CONTROLS } from "../add-polling-source/form-control.source";
import { MERGE_FORM_DATA } from "../add-polling-source/steps/data/merge-form-data";
import { READ_FORM_DATA } from "../add-polling-source/steps/data/read-form-data";
import { BaseMainEventComponent } from "../base-main-event.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ProcessFormService } from "../../services/process-form.service";
import { AddPushSourceSection } from "src/app/shared/shared.types";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { from } from "rxjs";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { AddPushSourceEditFormType } from "./add-push-source-form.types";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { SourcesSection } from "../add-polling-source/process-form.service.types";
import { ParamMap } from "@angular/router";
import { EditAddPushSourceService } from "./edit-add-push-source.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";

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
        private editService: EditAddPushSourceService,
        private zone: NgZone,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.checkDatasetEditability(DatasetKind.Root);
        this.initEditForm();
        this.subsribeErrorMessage();
    }

    public addPushSourceForm: FormGroup = this.fb.group({
        sourceName: this.fb.control("", [RxwebValidators.required()]),
        read: this.fb.group({
            kind: [this.READ_DEFAULT_KIND],
        }),
        merge: this.fb.group({
            kind: [this.MERGE_DEFAULT_KIND],
        }),
    });

    public initEditForm(): void {
        this.trackSubscription(
            this.editService
                .getEventAsYaml(this.getDatasetInfoFromUrl(), this.queryParamName ?? "")
                .subscribe((result) => {
                    this.history = this.editService.history;
                    if (this.sourceNameNotExist()) {
                        this.zone.run(() => {
                            this.navigationServices.navigateToPageNotFound();
                        });
                    }
                    if (result) {
                        this.eventYamlByHash = result;
                        const currentPushSourceEvent = this.editService.parseEventFromYaml(this.eventYamlByHash);
                        this.addPushSourceForm.patchValue({ sourceName: currentPushSourceEvent.sourceName });
                    }
                    if (!this.queryParamName) {
                        this.addPushSourceForm.controls.sourceName.addValidators(
                            RxwebValidators.noneOf({
                                matchValues: [...this.getAllSourceNames(this.history), "default"],
                            }),
                        );
                    }
                    this.cdr.detectChanges();
                }),
        );
    }

    private getAllSourceNames(historyUpdate: MaybeNull<DatasetHistoryUpdate>): string[] {
        if (!historyUpdate) {
            return [];
        } else {
            const data = historyUpdate.history
                .filter((item: MetadataBlockFragment) => item.event.__typename === SupportedEvents.AddPushSource)
                .map((data: MetadataBlockFragment) => data.event as AddPushSource);
            return data.map((event) => event.sourceName ?? "");
        }
    }

    private sourceNameNotExist(): boolean {
        return (
            !!this.queryParamName &&
            !this.history?.history.filter(
                (item) =>
                    item.event.__typename === SupportedEvents.AddPushSource &&
                    item.event.sourceName === this.queryParamName,
            ).length
        );
    }

    public get readPushForm(): FormGroup {
        return this.addPushSourceForm.get(AddPushSourceSection.READ) as FormGroup;
    }

    public get mergePushForm(): FormGroup {
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

    public changeStep(step: SourcesSection): void {
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

    public onSaveEvent(): void {
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

    public get queryParamName(): MaybeNull<string> {
        const paramMap: ParamMap = this.activatedRoute.snapshot.queryParamMap;
        return paramMap.get(ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME);
    }
}
