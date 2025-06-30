/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { IngestConfigurationRuleFormType } from "../scheduling/dataset-settings-scheduling-tab.component.types";
import { FormGroup } from "@angular/forms";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetBasicsFragment, FlowConfigRuleIngest } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowConfigService } from "../../services/dataset-flow-config.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetSettingsIngestConfigurationTabData } from "./dataset-settings-ingest-configuration-tab.data";

@Component({
    selector: "app-dataset-settings-ingest-configuration-tab",
    templateUrl: "./dataset-settings-ingest-configuration-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsIngestConfigurationTabComponent extends BaseComponent {
    @Input(RoutingResolvers.DATASET_SETTINGS_INGEST_CONFIGURATION_KEY)
    public ingestConfigurationTabData: DatasetSettingsIngestConfigurationTabData;

    public ingestConfigurationRuleForm: FormGroup<IngestConfigurationRuleFormType>;

    private readonly datasetFlowConfigService = inject(DatasetFlowConfigService);

    public get datasetBasics(): DatasetBasicsFragment {
        return this.ingestConfigurationTabData.datasetBasics;
    }

    public get ingestionRule(): FlowConfigRuleIngest {
        return this.ingestConfigurationTabData.ingestionRule;
    }

    protected changeIngestConfigurationRule(ingestConfigurationForm: FormGroup<IngestConfigurationRuleFormType>): void {
        this.ingestConfigurationRuleForm = ingestConfigurationForm;
    }

    protected saveConfiguration(): void {
        this.datasetFlowConfigService
            .setDatasetIngestFlowConfigs({
                datasetId: this.datasetBasics.id,
                ingestConfigInput: {
                    fetchUncacheable: this.ingestConfigurationRuleForm.controls.fetchUncacheable.value,
                },
                retryPolicyInput: null, // TODO:
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
