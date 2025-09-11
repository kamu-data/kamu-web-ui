/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseComponent } from "src/app/common/components/base.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormValidationErrorsDirective } from "src/app/common/directives/form-validation-errors.directive";
import { TimeDeltaFormComponent } from "src/app/common/components/time-delta-form/time-delta-form.component";
import { MaybeNull } from "src/app/interface/app.types";
import { BufferingBatchingRuleFormType } from "./buffering-batching-rule-form.types";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";

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

    public readonly TimeUnit: typeof TimeUnit = TimeUnit;

    public static buildForm(): FormGroup<BufferingBatchingRuleFormType> {
        const timeDeltaForm = TimeDeltaFormComponent.buildForm();

        const formGroup = new FormGroup<BufferingBatchingRuleFormType>({
            minRecordsToAwait: new FormControl<MaybeNull<number>>(null, [Validators.required, Validators.min(1)]),
            maxBatchingInterval: timeDeltaForm,
        });

        return formGroup;
    }
}
