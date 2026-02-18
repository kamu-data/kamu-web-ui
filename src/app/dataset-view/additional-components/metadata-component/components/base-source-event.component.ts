/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup } from "@angular/forms";

import { catchError, from, of, take } from "rxjs";

import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { DatasetKind } from "@api/kamu.graphql.interface";

import {
    SourcesEvents,
    SupportedEvents,
} from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { FinalYamlModalComponent } from "src/app/dataset-view/additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
import {
    AddPollingSourceEditFormType,
    MergeKind,
    PreprocessStepValue,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    MERGE_STEP_RADIO_CONTROLS,
    READ_STEP_RADIO_CONTROLS,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/form-control.source";
import { AddPushSourceEditFormType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";
import { BaseMainEventComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/base-main-event.component";
import { MERGE_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/merge-form-data";
import { READ_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/read-form-data";
import { ProcessFormService } from "src/app/dataset-view/additional-components/metadata-component/services/process-form.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Injectable()
export abstract class BaseSourceEventComponent extends BaseMainEventComponent implements OnInit {
    protected fb = inject(FormBuilder);
    protected processFormService = inject(ProcessFormService);
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

    public ngOnInit(): void {
        this.subscribeErrorMessage();
        this.checkDatasetEditability(DatasetKind.Root);
    }

    public onShowPreprocessStep(showPreprocessStep: boolean): void {
        this.showPreprocessStep = showPreprocessStep;
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

    public editSourceYaml(form: FormGroup, sourceEvent: SourcesEvents): void {
        const modalRef: NgbModalRef = this.modalService.open(FinalYamlModalComponent, { size: "lg" });
        const instance = modalRef.componentInstance as FinalYamlModalComponent;
        instance.yamlTemplate =
            this.errorMessage && this.changedEventYamlByHash
                ? this.changedEventYamlByHash
                : this.selectSourceEvent(form, sourceEvent);
        instance.datasetInfo = this.getDatasetInfoFromUrl();

        from(modalRef.result)
            .pipe(
                take(1),
                catchError(() => of(null)),
            )
            .subscribe((eventYaml: string) => {
                this.changedEventYamlByHash = eventYaml;
            });
    }

    public saveSourceEvent(form: FormGroup, sourceEvent: SourcesEvents): void {
        this.datasetCommitService
            .commitEventToDataset({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                accountName: this.getDatasetInfoFromUrl().accountName,
                datasetName: this.getDatasetInfoFromUrl().datasetName,
                event: this.selectSourceEvent(form, sourceEvent),
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.navigationServices.navigateToDatasetView({
                    accountName: this.getDatasetInfoFromUrl().accountName,
                    datasetName: this.getDatasetInfoFromUrl().datasetName,
                    tab: DatasetViewTypeEnum.Overview,
                });
            });
    }

    private selectSourceEvent(form: FormGroup, event: SourcesEvents): string {
        this.processFormService.transformForm(form);
        if (event === SupportedEvents.SetPollingSource) {
            return this.yamlEventService.buildYamlSetPollingSourceEvent(
                form.value as AddPollingSourceEditFormType,
                this.showPreprocessStep ? this.preprocessStepValue : null,
            );
        }
        return this.yamlEventService.buildYamlAddPushSourceEvent(
            form.value as AddPushSourceEditFormType,
            this.showPreprocessStep ? this.preprocessStepValue : null,
        );
    }
}
