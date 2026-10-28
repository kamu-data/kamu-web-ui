/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import { InputFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.component";
import { TypeaheadFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/typeahead-field/typeahead-field.component";
import { EventTimeSourceKind } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { EventTimeControls } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";

@Component({
    selector: "app-select-date-format-field",
    templateUrl: "./select-date-format-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        InputFieldComponent,
        TooltipIconComponent,
        TypeaheadFieldComponent,
    ],
})
export class SelectDateFormatFieldComponent extends BaseField<FormGroup<EventTimeControls>> {
    @Input({ required: true }) public innerTooltips: Record<string, string>;
    public readonly EventTimeSourceKind: typeof EventTimeSourceKind = EventTimeSourceKind;
    public readonly PATTERN_TOOLTIP = "Regular expression where first group contains the timestamp string.";
    public readonly TIMESTAMP_TOOLTIP = "Format of the expected timestamp in java.text.SimpleDateFormat form.";
    public readonly FORMATS: string[] = [
        "YYYY-MM-DDTHH:mm:ss.sss",
        "YYYY-MM-DDTHH:mm:ss",
        "YYYY-MM-DD",
        "YYYY-M-DTHH:mm:ss.sss",
        "YYYY-M-DTHH:mm:ss",
        "YYYY-M-D",
    ];
}
