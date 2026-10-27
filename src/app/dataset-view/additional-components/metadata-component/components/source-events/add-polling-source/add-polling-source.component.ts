/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { RouterLink } from "@angular/router";

import { enumValueOf, requireValue } from "@common/helpers/app.helpers";
import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { DatasetInfo } from "@interface/navigation.interface";

import { BaseSourceEventComponent } from "src/app/dataset-view/additional-components/metadata-component/components/base-source-event.component";
import {
    FetchKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
import { FETCH_STEP_RADIO_CONTROLS } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/form-control.source";
import { SourcesSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import {
    FetchControls,
    MergeControls,
    PollingSourceControls,
    PrepareStepForm,
    ReadControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { SourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { BaseStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/base-step/base-step.component";
import { FETCH_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/fetch-form-data";
import { PrepareStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/prepare-step/prepare-step.component";
import { PreprocessStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/preprocess-step/preprocess-step.component";
import { StepperNavigationComponent } from "src/app/dataset-view/additional-components/metadata-component/components/stepper-navigation/stepper-navigation.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true },
        },
    ],
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        //-----//
        MatStepperModule,
        //-----//
        BaseStepComponent,
        PrepareStepComponent,
        PreprocessStepComponent,
        StepperNavigationComponent,
        DatasetLinkPipe,
    ],
})
export class AddPollingSourceComponent extends BaseSourceEventComponent implements OnInit {
    @Input(RoutingResolvers.ADD_POLLING_SOURCE_KEY) public eventYamlByHash: string;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public currentStep: SetPollingSourceSection = SetPollingSourceSection.FETCH;
    public steps: typeof SetPollingSourceSection = SetPollingSourceSection;
    // ---------------------------------
    public readonly FETCH_STEP_RADIO_DATA = FETCH_STEP_RADIO_CONTROLS;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    public readonly pollingSourceForm = new FormGroup<PollingSourceControls>({
        fetch: new FormGroup<FetchControls>({ kind: new FormControl(FetchKind.URL, { nonNullable: true }) }),
        prepare: new FormArray<PrepareStepForm>([]),
        read: this.createReadForm(),
        merge: this.createMergeForm(),
    });
    /** The fetch step; the event time the user set stays when they pick another source. */
    public readonly fetchSection = new SourceSection(
        this.fetchForm,
        this.fetchForm.controls.kind,
        FETCH_FORM_DATA,
        this.destroyRef,
        ["eventTime"],
    );
    public readonly readSection = this.createReadSection(this.readForm);
    public readonly mergeSection = this.createMergeSection(this.mergeForm);

    private editService = inject(EditPollingSourceService);

    public get fetchForm(): FormGroup<FetchControls> {
        return this.pollingSourceForm.controls.fetch;
    }

    public get prepareForm(): FormArray<PrepareStepForm> {
        return this.pollingSourceForm.controls.prepare;
    }

    public get readForm(): FormGroup<ReadControls> {
        return this.pollingSourceForm.controls.read;
    }

    public get mergeForm(): FormGroup<MergeControls> {
        return this.pollingSourceForm.controls.merge;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.eventYamlByHash) {
            const event = this.editService.parseEventFromYaml(this.eventYamlByHash);
            this.showPreprocessStep = Boolean(event.preprocess);
            this.editService.patchFetchStep(this.fetchForm, event.fetch);
            this.editService.patchPrepareStep(this.prepareForm, event.prepare);
            this.editService.patchReadStep(this.readForm, event.read, this.datasetInfo, this.destroyRef);
            this.editService.patchMergeStep(this.mergeForm, event.merge);
        }
    }

    public changeStep(step: SourcesSection): void {
        this.currentStep = requireValue(enumValueOf(SetPollingSourceSection, step), "Unknown source event step");
    }

    public onSaveEvent(): void {
        this.saveSourceEvent();
    }

    public onEditYaml(): void {
        this.editSourceYaml();
    }

    protected buildEventYaml(): string {
        return this.yamlEventService.buildYamlSetPollingSourceEvent(
            this.processFormService.pollingSourceEvent(this.pollingSourceForm.getRawValue()),
            this.preprocessStep,
        );
    }
}
