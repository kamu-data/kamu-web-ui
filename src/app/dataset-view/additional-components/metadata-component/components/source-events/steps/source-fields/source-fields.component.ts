/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { SourceField } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { isScalarSourceField } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-field";
import { CompositeSourceFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/source-fields/composite-source-field.component";
import { ScalarSourceFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/source-fields/scalar-source-field.component";

/** The fields of a source event step, each rendered with the field component its layout names. */
@Component({
    selector: "app-source-fields",
    templateUrl: "./source-fields.component.html",
    styleUrls: ["./source-fields.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        CompositeSourceFieldComponent,
        ScalarSourceFieldComponent,
    ],
})
export class SourceFieldsComponent {
    @Input({ required: true }) public fields: readonly SourceField[];
    /** Prefixes each field's test id, unless its layout names one. */
    @Input({ required: true }) public sectionName: string;

    public readonly isScalarSourceField = isScalarSourceField;
}
