/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";

@Component({
    selector: "app-cache-field",
    templateUrl: "./cache-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        TooltipIconComponent,
    ],
})
export class CacheFieldComponent extends BaseField<FormControl<boolean>> {}
