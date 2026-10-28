/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { ArrayKeysFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/array-keys-field/array-keys-field.component";
import { KeyValueFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/key-value-field/key-value-field.component";
import { SchemaFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/schema-field/schema-field.component";
import { SelectDateFormatFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-date-format-field/select-date-format-field.component";
import { TopicsFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/topics-field/topics-field.component";
import { ControlType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { CompositeSourceField } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";

@Component({
    selector: "app-composite-source-field",
    templateUrl: "./composite-source-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ArrayKeysFieldComponent,
        KeyValueFieldComponent,
        SchemaFieldComponent,
        SelectDateFormatFieldComponent,
        TopicsFieldComponent,
    ],
})
export class CompositeSourceFieldComponent {
    @Input({ required: true }) public field: CompositeSourceField;
    @Input({ required: true }) public dataTestId: string;

    public readonly ControlType: typeof ControlType = ControlType;
}
