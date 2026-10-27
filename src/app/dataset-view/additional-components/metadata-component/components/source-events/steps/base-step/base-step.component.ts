/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TitleCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { ArrayKeysFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/array-keys-field/array-keys-field.component";
import { CacheFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/cache-field/cache-field.component";
import { CheckboxFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/checkbox-field/checkbox-field.component";
import { InputFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.component";
import { JsonKindFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/json-kind-field/json-kind-field.component";
import { KeyValueFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/key-value-field/key-value-field.component";
import { NumberFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/number-field/number-field.component";
import { OrderFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/order-field/order-field.component";
import { SchemaFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/schema-field/schema-field.component";
import { SelectDateFormatFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-date-format-field/select-date-format-field.component";
import { SelectKindFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-kind-field/select-kind-field.component";
import { TopicsFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/topics-field/topics-field.component";
import { TypeaheadFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/typeahead-field/typeahead-field.component";
import { ControlType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { RadioControlType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/form-control.source";
import { SourcesSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { SourceStepSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    selector: "app-base-step",
    templateUrl: "./base-step.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        TitleCasePipe,
        //-----//
        ArrayKeysFieldComponent,
        JsonKindFieldComponent,
        InputFieldComponent,
        SelectKindFieldComponent,
        KeyValueFieldComponent,
        CheckboxFieldComponent,
        SchemaFieldComponent,
        SelectDateFormatFieldComponent,
        CacheFieldComponent,
        OrderFieldComponent,
        TypeaheadFieldComponent,
        NumberFieldComponent,
        TopicsFieldComponent,
    ],
})
export class BaseStepComponent {
    @Input({ required: true }) public section: SourceStepSection;
    @Input({ required: true }) public sectionStepRadioData: RadioControlType[];
    @Input({ required: true }) public description: string;
    @Input({ required: true }) public sectionName: SourcesSection;
    public controlType: typeof ControlType = ControlType;

    public get currentKind(): string {
        return this.section.kindControl.value;
    }
}
