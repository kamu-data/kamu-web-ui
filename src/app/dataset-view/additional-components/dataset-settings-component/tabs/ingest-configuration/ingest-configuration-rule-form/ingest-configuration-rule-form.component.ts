/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { FlowConfigRuleIngest } from "@api/kamu.graphql.interface";
import { BaseComponent } from "@common/components/base.component";
import { MaybeNull } from "src/app/interface/app.types";

import {
    IngestConfigurationRuleFormType,
    IngestConfigurationRuleFormValue,
} from "./ingest-configuration-rule-form.types";

@Component({
    selector: "app-ingest-configuration-rule-form",
    templateUrl: "./ingest-configuration-rule-form.component.html",
    styleUrls: ["./ingest-configuration-rule-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        MatCheckboxModule,
    ],
})
export class IngestConfigurationRuleFormComponent extends BaseComponent {
    @Input({ required: true }) public form: FormGroup<IngestConfigurationRuleFormType>;

    public static buildForm(): FormGroup<IngestConfigurationRuleFormType> {
        return new FormGroup<IngestConfigurationRuleFormType>({
            fetchUncacheable: new FormControl<boolean>(false, { nonNullable: true }),
            fetchNextIteration: new FormControl<boolean>(false, { nonNullable: true }),
        });
    }

    public static buildFormValue(ingestionRule: MaybeNull<FlowConfigRuleIngest>): IngestConfigurationRuleFormValue {
        return {
            fetchUncacheable: ingestionRule?.fetchUncacheable ?? false,
            fetchNextIteration: ingestionRule?.fetchNextIteration ?? false,
        };
    }

    public static buildFlowConfigIngestInput(formValue: IngestConfigurationRuleFormValue): FlowConfigRuleIngest {
        return {
            fetchUncacheable: formValue.fetchUncacheable,
            fetchNextIteration: formValue.fetchNextIteration,
        };
    }

    public get fetchUncacheableControl(): FormControl<boolean> {
        return this.form.controls.fetchUncacheable;
    }

    public get fetchNextIterationControl(): FormControl<boolean> {
        return this.form.controls.fetchNextIteration;
    }
}
