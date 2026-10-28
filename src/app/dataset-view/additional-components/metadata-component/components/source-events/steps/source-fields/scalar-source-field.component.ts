/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { CacheFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/cache-field/cache-field.component";
import { CheckboxFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/checkbox-field/checkbox-field.component";
import { InputFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.component";
import { JsonKindFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/json-kind-field/json-kind-field.component";
import { NumberFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/number-field/number-field.component";
import { OrderFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/order-field/order-field.component";
import { TypeaheadFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/typeahead-field/typeahead-field.component";
import { ControlType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { ScalarSourceField } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";

@Component({
    selector: "app-scalar-source-field",
    templateUrl: "./scalar-source-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        CacheFieldComponent,
        CheckboxFieldComponent,
        InputFieldComponent,
        JsonKindFieldComponent,
        NumberFieldComponent,
        OrderFieldComponent,
        TypeaheadFieldComponent,
    ],
})
export class ScalarSourceFieldComponent {
    @Input({ required: true }) public field: ScalarSourceField;
    @Input({ required: true }) public dataTestId: string;

    public readonly ControlType: typeof ControlType = ControlType;
}
