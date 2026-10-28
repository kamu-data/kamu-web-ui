/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TitleCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { SelectKindFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-kind-field/select-kind-field.component";
import { RadioControlType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/form-control.source";
import { SourcesSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { SourceStepSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { SourceFieldsComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/source-fields/source-fields.component";

@Component({
    selector: "app-base-step",
    templateUrl: "./base-step.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        TitleCasePipe,
        //-----//
        SelectKindFieldComponent,
        SourceFieldsComponent,
    ],
})
export class BaseStepComponent {
    @Input({ required: true }) public section: SourceStepSection;
    @Input({ required: true }) public sectionStepRadioData: RadioControlType[];
    @Input({ required: true }) public description: string;
    @Input({ required: true }) public sectionName: SourcesSection;
}
