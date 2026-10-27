/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { afterNextRender, Directive, ElementRef, inject, Injector, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { catchError, combineLatest, from, of, take } from "rxjs";

import { openModal } from "@common/helpers/modal.helpers";
import { MaybeNull } from "@interface/app.types";

import { FinalYamlModalComponent } from "src/app/dataset-view/additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
import {
    MergeKind,
    PreprocessStepValue,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    MERGE_STEP_RADIO_CONTROLS,
    READ_STEP_RADIO_CONTROLS,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/form-control.source";
import { BaseMainEventComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/base-main-event.component";
import {
    MergeControls,
    ReadControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { SourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { MERGE_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/merge-form-data";
import { READ_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/read-form-data";
import { ProcessFormService } from "src/app/dataset-view/additional-components/metadata-component/services/process-form.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Directive()
export abstract class BaseSourceEventComponent extends BaseMainEventComponent implements OnInit {
    protected fb = inject(FormBuilder);
    protected processFormService = inject(ProcessFormService);
    private injector = inject(Injector);
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    public showPreprocessStep = false;
    public preprocessStepValue: PreprocessStepValue = {
        engine: "",
        queries: [],
    };
    // ---------------------------------
    public readonly READ_STEP_RADIO_DATA = READ_STEP_RADIO_CONTROLS;
    public readonly READ_DEFAULT_KIND = ReadKind.CSV;
    // ---------------------------------
    public readonly MERGE_STEP_RADIO_DATA = MERGE_STEP_RADIO_CONTROLS;
    public readonly MERGE_DEFAULT_KIND = MergeKind.APPEND;

    public ngOnInit(): void {
        this.subscribeErrorMessage();
    }

    public onShowPreprocessStep(showPreprocessStep: boolean): void {
        this.showPreprocessStep = showPreprocessStep;
    }

    public onShowErrors(): void {
        afterNextRender(
            () => {
                const elems = this.elementRef.nativeElement.querySelectorAll<HTMLInputElement>("input.ng-invalid");
                elems.forEach((element: HTMLInputElement) => {
                    element.focus();
                    element.blur();
                });
            },
            { injector: this.injector },
        );
    }

    public editSourceYaml(): void {
        const { modalRef, instance } = openModal(this.modalService, FinalYamlModalComponent, { size: "lg" });
        instance.yamlTemplate =
            this.errorMessage && this.changedEventYamlByHash ? this.changedEventYamlByHash : this.buildEventYaml();
        instance.datasetInfo = this.getDatasetInfoFromUrl();

        combineLatest([
            from(modalRef.result).pipe(
                take(1),
                catchError(() => of(null)),
            ),
            this.datasetCommitService.commitEventErrorOccurrences,
        ]).subscribe(([eventYaml, message]) => {
            this.changedEventYamlByHash = typeof eventYaml === "string" ? eventYaml : null;
            if (!message) {
                this.navigationServices.navigateToDatasetView({
                    accountName: this.getDatasetInfoFromUrl().accountName,
                    datasetName: this.getDatasetInfoFromUrl().datasetName,
                    tab: DatasetViewTypeEnum.Overview,
                });
            }
        });
    }

    public saveSourceEvent(): void {
        this.datasetCommitService.emitCommitEventErrorOccurred("");
        this.datasetCommitService
            .commitEventToDataset({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                accountName: this.getDatasetInfoFromUrl().accountName,
                datasetName: this.getDatasetInfoFromUrl().datasetName,
                event: this.buildEventYaml(),
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((success: boolean) => {
                if (success) {
                    this.navigationServices.navigateToDatasetView({
                        accountName: this.getDatasetInfoFromUrl().accountName,
                        datasetName: this.getDatasetInfoFromUrl().datasetName,
                        tab: DatasetViewTypeEnum.Overview,
                    });
                }
            });
    }

    /** The preprocess step's value, when the user turned that step on. */
    protected get preprocessStep(): MaybeNull<PreprocessStepValue> {
        return this.showPreprocessStep ? this.preprocessStepValue : null;
    }

    protected createReadForm(): FormGroup<ReadControls> {
        return new FormGroup<ReadControls>({ kind: new FormControl(this.READ_DEFAULT_KIND, { nonNullable: true }) });
    }

    /** The read step; the schema the user entered stays when they pick another format. */
    protected createReadSection(form: FormGroup<ReadControls>): SourceSection<ReadControls> {
        return new SourceSection(form, form.controls.kind, READ_FORM_DATA, this.destroyRef, ["schema"]);
    }

    protected createMergeForm(): FormGroup<MergeControls> {
        return new FormGroup<MergeControls>({ kind: new FormControl(this.MERGE_DEFAULT_KIND, { nonNullable: true }) });
    }

    protected createMergeSection(form: FormGroup<MergeControls>): SourceSection<MergeControls> {
        return new SourceSection(form, form.controls.kind, MERGE_FORM_DATA, this.destroyRef);
    }

    /** The event the editor's form describes, as YAML. */
    protected abstract buildEventYaml(): string;
}
