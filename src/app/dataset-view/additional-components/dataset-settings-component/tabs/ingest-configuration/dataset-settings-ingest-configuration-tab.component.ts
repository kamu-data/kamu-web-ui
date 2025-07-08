/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetBasicsFragment, FlowConfigRuleIngest, FlowRetryPolicy } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowConfigService } from "../../services/dataset-flow-config.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    DatasetSettingsIngestConfigurationTabData,
    IngestConfigurationRuleFormType,
} from "./dataset-settings-ingest-configuration-tab.data";
import {
    FlowRetryPolicyFormType,
    FlowRetryPolicyFormValue,
} from "./flow-retry-policy-form/flow-retry-policy-form.types";
import { MaybeNull } from "src/app/interface/app.types";
import { MatDividerModule } from "@angular/material/divider";
import { IngestConfigurationRuleFormComponent } from "./ingest-configuration-rule-form/ingest-configuration-rule-form.component";
import { FlowRetryPolicyFormComponent } from "./flow-retry-policy-form/flow-retry-policy-form.component";

@Component({
    selector: "app-dataset-settings-ingest-configuration-tab",
    templateUrl: "./dataset-settings-ingest-configuration-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        MatDividerModule,

        //-----//
        FlowRetryPolicyFormComponent,
        IngestConfigurationRuleFormComponent,
    ],
})
export class DatasetSettingsIngestConfigurationTabComponent extends BaseComponent {
    @Input(RoutingResolvers.DATASET_SETTINGS_INGEST_CONFIGURATION_KEY)
    public ingestConfigurationTabData: DatasetSettingsIngestConfigurationTabData;

    private ingestConfigurationRuleForm: MaybeNull<FormGroup<IngestConfigurationRuleFormType>> = null;
    private flowRetryPolicyForm: MaybeNull<FormGroup<FlowRetryPolicyFormType>> = null;

    private readonly datasetFlowConfigService = inject(DatasetFlowConfigService);

    public get datasetBasics(): DatasetBasicsFragment {
        return this.ingestConfigurationTabData.datasetBasics;
    }

    public get ingestionRule(): FlowConfigRuleIngest {
        return this.ingestConfigurationTabData.ingestionRule;
    }

    public get retryPolicy(): FlowRetryPolicy | null {
        return this.ingestConfigurationTabData.retryPolicy;
    }

    protected changeIngestConfigurationRule(ingestConfigurationForm: FormGroup<IngestConfigurationRuleFormType>): void {
        this.ingestConfigurationRuleForm = ingestConfigurationForm;
    }

    protected changeRetryPolicy(retryPolicyForm: FormGroup<FlowRetryPolicyFormType>): void {
        this.flowRetryPolicyForm = retryPolicyForm;
    }

    public get disabledSaveButton(): boolean {
        return (
            !this.ingestConfigurationRuleForm ||
            this.ingestConfigurationRuleForm.invalid ||
            !this.flowRetryPolicyForm ||
            this.flowRetryPolicyForm.invalid
        );
    }

    protected saveConfiguration(): void {
        if (!this.ingestConfigurationRuleForm || !this.flowRetryPolicyForm) {
            return;
        }

        const ingestionRuleValue = this.ingestConfigurationRuleForm.value;
        const retryPolicyValue = this.flowRetryPolicyForm.value as FlowRetryPolicyFormValue;
        if (!ingestionRuleValue || !retryPolicyValue) {
            throw new Error("Ingest configuration form or retry policy form is not initialized.");
        }

        this.datasetFlowConfigService
            .setDatasetIngestFlowConfigs({
                datasetId: this.datasetBasics.id,
                ingestConfigInput: {
                    fetchUncacheable: ingestionRuleValue.fetchUncacheable || false,
                },
                retryPolicyInput: retryPolicyValue.retriesEnabled
                    ? {
                          backoffType: retryPolicyValue.backoffType,
                          maxAttempts: retryPolicyValue.maxAttempts,
                          minDelay: {
                              every: retryPolicyValue.minDelay.every,
                              unit: retryPolicyValue.minDelay.unit,
                          },
                      }
                    : null,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
