/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FetchKind, SetPollingSourceSection } from "./add-polling-source-form.types";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FETCH_STEP_RADIO_CONTROLS } from "./form-control.source";
import { FETCH_FORM_DATA } from "../steps/data/fetch-form-data";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { SourcesSection } from "./process-form.service.types";
import { BaseSourceEventComponent } from "../../base-source-event.component";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { PreprocessStepComponent } from "../steps/preprocess-step/preprocess-step.component";
import { PrepareStepComponent } from "../steps/prepare-step/prepare-step.component";
import { StepperNavigationComponent } from "../../stepper-navigation/stepper-navigation.component";
import { BaseStepComponent } from "../steps/base-step/base-step.component";
import { MatStepperModule } from "@angular/material/stepper";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { EditorModule } from "src/app/editor/editor.module";

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
        NgIf,
        ReactiveFormsModule,
        RouterLink,
        //-----//
        MatStepperModule,
        EditorModule,
        //-----//
        BaseStepComponent,
        PrepareStepComponent,
        PreprocessStepComponent,
        StepperNavigationComponent,
    ],
})
export class AddPollingSourceComponent extends BaseSourceEventComponent implements OnInit {
    @Input(RoutingResolvers.ADD_POLLING_SOURCE_KEY) public eventYamlByHash: string;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public currentStep: SetPollingSourceSection = SetPollingSourceSection.FETCH;
    public steps: typeof SetPollingSourceSection = SetPollingSourceSection;
    // ---------------------------------
    public readonly FETCH_STEP_RADIO_DATA = FETCH_STEP_RADIO_CONTROLS;
    public readonly FETCH_FORM_DATA = FETCH_FORM_DATA;
    public readonly FETCH_DEFAULT_KIND = FetchKind.URL;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

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
        return this.pollingSourceForm.get(SetPollingSourceSection.FETCH) as FormGroup;
    }

    public get prepareForm(): FormArray {
        return this.pollingSourceForm.get(SetPollingSourceSection.PREPARE) as FormArray;
    }

    public get readForm(): FormGroup {
        return this.pollingSourceForm.get(SetPollingSourceSection.READ) as FormGroup;
    }

    public get mergeForm(): FormGroup {
        return this.pollingSourceForm.get(SetPollingSourceSection.MERGE) as FormGroup;
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public changeStep(step: SourcesSection): void {
        this.currentStep = step as SetPollingSourceSection;
    }

    public onSaveEvent(): void {
        this.saveSourceEvent(this.pollingSourceForm, SupportedEvents.SetPollingSource);
    }

    public onEditYaml(): void {
        this.editSourceYaml(this.pollingSourceForm, SupportedEvents.SetPollingSource);
    }
}
