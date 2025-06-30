/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { IngestConfigurationRuleFormType } from "../../scheduling/dataset-settings-scheduling-tab.component.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { FlowConfigRuleIngest } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-ingest-configuration-rule-form",
    templateUrl: "./ingest-configuration-rule-form.component.html",
    styleUrls: ["./ingest-configuration-rule-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngestConfigurationRuleFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public ingestionRule: FlowConfigRuleIngest;

    @Output() public changeConfigurationRuleEmit = new EventEmitter<FormGroup<IngestConfigurationRuleFormType>>();

    public ingestConfigurationRuleForm = new FormGroup<IngestConfigurationRuleFormType>({
        fetchUncacheable: new FormControl<boolean>(false, { nonNullable: true }),
    });

    public ngOnInit(): void {
        this.subscribeToFormValueChanges();

        this.ingestConfigurationRuleForm.patchValue({
            fetchUncacheable: this.ingestionRule.fetchUncacheable,
        });
    }

    private subscribeToFormValueChanges(): void {
        this.ingestConfigurationRuleForm.valueChanges.subscribe(() => {
            this.changeConfigurationRuleEmit.emit(this.ingestConfigurationRuleForm);
        });
    }
}
