/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { RouterLink } from "@angular/router";

import { enumValueOf, requireValue } from "@common/helpers/app.helpers";
import { queryParamValue } from "@common/helpers/url-params.helpers";
import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { uniqueValueValidator } from "@common/validation/collection.validators";
import { notBlankValidator } from "@common/validation/text.validators";
import { MaybeUndefined } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { BaseSourceEventComponent } from "src/app/dataset-view/additional-components/metadata-component/components/base-source-event.component";
import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
import { SourcesSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { AddPushSourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";
import { EditAddPushSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/edit-add-push-source.service";
import {
    MergeControls,
    PushSourceControls,
    ReadControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { textControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { BaseStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/base-step/base-step.component";
import { PreprocessStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/preprocess-step/preprocess-step.component";
import { SourceNameStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/source-name-step/source-name-step.component";
import { StepperNavigationComponent } from "src/app/dataset-view/additional-components/metadata-component/components/stepper-navigation/stepper-navigation.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-add-push-source",
    templateUrl: "./add-push-source.component.html",
    styleUrls: ["./add-push-source.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        //-----//
        MatStepperModule,
        //-----//
        BaseStepComponent,
        PreprocessStepComponent,
        SourceNameStepComponent,
        StepperNavigationComponent,
        DatasetLinkPipe,
    ],
})
export class AddPushSourceComponent extends BaseSourceEventComponent implements AfterViewInit {
    @Input({ alias: ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME, transform: queryParamValue })
    public queryParamName: MaybeUndefined<string>;
    @Input(RoutingResolvers.ADD_PUSH_SOURCE_KEY) public eventYamlByHash: string;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public currentStep: AddPushSourceSection = AddPushSourceSection.READ;
    public steps: typeof AddPushSourceSection = AddPushSourceSection;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    private editService = inject(EditAddPushSourceService);
    private pollingEditService = inject(EditPollingSourceService);
    private blockService = inject(BlockService);

    public ngOnInit(): void {
        super.ngOnInit();
        this.initEditForm();
    }

    public ngAfterViewInit(): void {
        if (this.eventYamlByHash && this.queryParamName) {
            this.editService.patchSchemaField(
                this.readPushForm,
                this.datasetInfo,
                this.queryParamName,
                this.destroyRef,
            );
        }
    }

    public readonly addPushSourceForm = new FormGroup<PushSourceControls>({
        sourceName: textControl("", [Validators.required, notBlankValidator()]),
        read: this.createReadForm(),
        merge: this.createMergeForm(),
    });
    public readonly readSection = this.createReadSection(this.readPushForm);
    public readonly mergeSection = this.createMergeSection(this.mergePushForm);

    public initEditForm(): void {
        if (this.eventYamlByHash) {
            const event = this.editService.parseEventFromYaml(this.eventYamlByHash);
            this.showPreprocessStep = Boolean(event.preprocess);
            if (this.queryParamName) {
                this.addPushSourceForm.controls.sourceName.setValue(event.sourceName);
            }
            this.pollingEditService.patchReadStep(this.readPushForm, event.read, null, this.destroyRef);
            this.pollingEditService.patchMergeStep(this.mergePushForm, event.merge);
        }
        if (!this.queryParamName) {
            // The backend compares source names case-sensitively.
            this.addPushSourceForm.controls.sourceName.addValidators(
                uniqueValueValidator(() => this.getAllSourceNames()),
            );
            this.addPushSourceForm.controls.sourceName.updateValueAndValidity();
        }
    }

    private getAllSourceNames(): string[] {
        return this.blockService.sourceNames;
    }

    public get readPushForm(): FormGroup<ReadControls> {
        return this.addPushSourceForm.controls.read;
    }

    public get mergePushForm(): FormGroup<MergeControls> {
        return this.addPushSourceForm.controls.merge;
    }

    public changeStep(step: SourcesSection): void {
        this.currentStep = requireValue(enumValueOf(AddPushSourceSection, step), "Unknown source event step");
    }

    public onEditYaml(): void {
        this.editSourceYaml();
    }

    public onSaveEvent(): void {
        this.saveSourceEvent();
    }

    protected buildEventYaml(): string {
        return this.yamlEventService.buildYamlAddPushSourceEvent(
            this.processFormService.pushSourceEvent(this.addPushSourceForm.getRawValue()),
            this.preprocessStep,
        );
    }
}
