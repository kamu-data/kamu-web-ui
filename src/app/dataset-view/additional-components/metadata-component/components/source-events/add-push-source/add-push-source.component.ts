import { AddPushSource, MetadataBlockFragment } from "../../../../../../api/kamu.graphql.interface";
import { SupportedEvents } from "../../../../../../dataset-block/metadata-block/components/event-details/supported.events";
import ProjectLinks from "src/app/project-links";
import { MaybeNull, MaybeNullOrUndefined } from "../../../../../../interface/app.types";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { SourcesSection } from "../add-polling-source/process-form.service.types";
import { ParamMap } from "@angular/router";
import { EditAddPushSourceService } from "./edit-add-push-source.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { BaseSourceEventComponent } from "../../base-source-event.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AddPushSourceSection } from "./add-push-source-form.types";

@Component({
    selector: "app-add-push-source",
    templateUrl: "./add-push-source.component.html",
    styleUrls: ["./add-push-source.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPushSourceComponent extends BaseSourceEventComponent {
    public currentStep: AddPushSourceSection = AddPushSourceSection.READ;
    public steps: typeof AddPushSourceSection = AddPushSourceSection;

    private editService = inject(EditAddPushSourceService);

    public ngOnInit(): void {
        super.ngOnInit();
        this.initEditForm();
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
        this.editService
            .getEventAsYaml(this.getDatasetInfoFromUrl(), SupportedEvents.AddPushSource, this.queryParamName)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result: MaybeNullOrUndefined<string>) => {
                this.history = this.editService.history;
                if (this.unsupportedSourceName()) {
                    this.navigationServices.navigateToPageNotFound();
                }
                if (result) {
                    this.eventYamlByHash = result;
                    const currentPushSourceEvent = this.editService.parseEventFromYaml(this.eventYamlByHash);
                    this.addPushSourceForm.patchValue({
                        sourceName: this.queryParamName ? currentPushSourceEvent.sourceName : "",
                    });
                }
                if (!this.queryParamName) {
                    this.addPushSourceForm.controls.sourceName.addValidators(
                        RxwebValidators.noneOf({
                            matchValues: [...this.getAllSourceNames(this.history)],
                        }),
                    );
                }
                this.cdr.detectChanges();
            });
    }

    private getAllSourceNames(historyUpdate: DatasetHistoryUpdate): string[] {
        return historyUpdate.history
            .filter((item: MetadataBlockFragment) => item.event.__typename === SupportedEvents.AddPushSource)
            .map((data: MetadataBlockFragment) => (data.event as AddPushSource).sourceName);
    }

    private unsupportedSourceName(): boolean {
        return (
            Boolean(this.queryParamName) &&
            !this.editService.filterHistoryByType(
                this.history.history,
                SupportedEvents.AddPushSource,
                this.queryParamName,
            ).length
        );
    }

    public get readPushForm(): FormGroup {
        return this.addPushSourceForm.get(AddPushSourceSection.READ) as FormGroup;
    }

    public get mergePushForm(): FormGroup {
        return this.addPushSourceForm.get(AddPushSourceSection.MERGE) as FormGroup;
    }

    public changeStep(step: SourcesSection): void {
        this.currentStep = step as AddPushSourceSection;
    }

    public onEditYaml(): void {
        this.editSourceYaml(this.addPushSourceForm, SupportedEvents.AddPushSource);
    }

    public onSaveEvent(): void {
        this.saveSourceEvent(this.addPushSourceForm, SupportedEvents.AddPushSource);
        this.addPushSourceForm.reset();
    }

    public get queryParamName(): MaybeNull<string> {
        const paramMap: ParamMap = this.activatedRoute.snapshot.queryParamMap;
        return paramMap.get(ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME);
    }
}
