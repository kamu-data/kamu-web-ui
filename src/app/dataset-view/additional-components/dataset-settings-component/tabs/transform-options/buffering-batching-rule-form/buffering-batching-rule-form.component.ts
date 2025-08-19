/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseComponent } from "src/app/common/components/base.component";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BufferingBatchingRuleFormType } from "../transform-trigger-form/transform-trigger-form.types";
import { FormValidationErrorsDirective } from "src/app/common/directives/form-validation-errors.directive";
import { TimeDeltaFormComponent } from "src/app/common/components/time-delta-form/time-delta-form.component";

@Component({
    selector: "app-buffering-batching-rule-form",
    templateUrl: "./buffering-batching-rule-form.component.html",
    styleUrls: ["./buffering-batching-rule-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,

        //-----//

        //-----//
        FormValidationErrorsDirective,
        TimeDeltaFormComponent,
    ],
})
export class BufferingBatchingRuleFormComponent extends BaseComponent {
    @Input({ required: true }) public form: FormGroup<BufferingBatchingRuleFormType>;
}
