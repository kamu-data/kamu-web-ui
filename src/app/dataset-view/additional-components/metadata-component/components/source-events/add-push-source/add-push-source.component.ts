/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { RouterLink } from "@angular/router";

import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { BaseSourceEventComponent } from "src/app/dataset-view/additional-components/metadata-component/components/base-source-event.component";
import { SourcesSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { AddPushSourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";
import { EditAddPushSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/edit-add-push-source.service";
import { BaseStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/base-step/base-step.component";
import { PreprocessStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/preprocess-step/preprocess-step.component";
import { SourceNameStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/source-name-step/source-name-step.component";
import { StepperNavigationComponent } from "src/app/dataset-view/additional-components/metadata-component/components/stepper-navigation/stepper-navigation.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";

import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { DatasetInfo } from "@interface/navigation.interface";

@Component({
    selector: "app-add-push-source",
    templateUrl: "./add-push-source.component.html",
    styleUrls: ["./add-push-source.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        RouterLink,
        //-----//
        MatStepperModule,
        //-----//
        BaseStepComponent,
        PreprocessStepComponent,
        SourceNameStepComponent,
        StepperNavigationComponent,
    ],
})
export class AddPushSourceComponent extends BaseSourceEventComponent {
    @Input(ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME) public queryParamName: string;
    @Input(RoutingResolvers.ADD_PUSH_SOURCE_KEY) public eventYamlByHash: string;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public currentStep: AddPushSourceSection = AddPushSourceSection.READ;
    public steps: typeof AddPushSourceSection = AddPushSourceSection;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    private editService = inject(EditAddPushSourceService);
    private blockService = inject(BlockService);

    public ngOnInit(): void {
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
        if (this.eventYamlByHash) {
            const currentPushSourceEvent = this.editService.parseEventFromYaml(this.eventYamlByHash);
            this.addPushSourceForm.patchValue({
                sourceName: this.queryParamName ? currentPushSourceEvent.sourceName : "",
            });
        }
        if (!this.queryParamName) {
            this.addPushSourceForm.controls.sourceName.addValidators(
                RxwebValidators.noneOf({
                    matchValues: [...this.getAllSourceNames()],
                }),
            );
        }
    }

    private getAllSourceNames(): string[] {
        return this.blockService.sourceNames;
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
    }
}
