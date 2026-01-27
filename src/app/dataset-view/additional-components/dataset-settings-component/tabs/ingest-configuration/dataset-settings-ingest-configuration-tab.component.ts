/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetBasicsFragment, DatasetKind } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowConfigService } from "../../services/dataset-flow-config.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetSettingsIngestConfigurationTabData } from "./dataset-settings-ingest-configuration-tab.data";
import { MatDividerModule } from "@angular/material/divider";
import { IngestConfigurationRuleFormComponent } from "./ingest-configuration-rule-form/ingest-configuration-rule-form.component";
import { FlowRetryPolicyFormComponent } from "./flow-retry-policy-form/flow-retry-policy-form.component";
import {
    IngestConfigurationFormType,
    IngestConfigurationFormValue,
} from "./dataset-settings-ingest-configuration-tab.types";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-dataset-settings-ingest-configuration-tab",
    templateUrl: "./dataset-settings-ingest-configuration-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        //-----//
        FlowRetryPolicyFormComponent,
        IngestConfigurationRuleFormComponent,
    ]
})
export class DatasetSettingsIngestConfigurationTabComponent extends BaseComponent implements AfterViewInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_INGEST_CONFIGURATION_KEY)
    public ingestConfigurationTabData: DatasetSettingsIngestConfigurationTabData;

    private readonly cdr = inject(ChangeDetectorRef);
    private readonly datasetFlowConfigService = inject(DatasetFlowConfigService);

    public readonly form: FormGroup<IngestConfigurationFormType> = new FormGroup<IngestConfigurationFormType>({
        ingestConfig: IngestConfigurationRuleFormComponent.buildForm(),
        flowRetryPolicy: FlowRetryPolicyFormComponent.buildForm(),
    });

    public get datasetBasics(): DatasetBasicsFragment {
        return this.ingestConfigurationTabData.datasetBasics;
    }

    public get isRootDataset(): boolean {
        return this.datasetBasics.kind === DatasetKind.Root;
    }

    public ngAfterViewInit() {
        this.form.patchValue(
            {
                ingestConfig: IngestConfigurationRuleFormComponent.buildFormValue(
                    this.ingestConfigurationTabData.ingestionRule,
                ),
                flowRetryPolicy: FlowRetryPolicyFormComponent.buildFormValue(
                    this.ingestConfigurationTabData.retryPolicy,
                ),
            } as IngestConfigurationFormValue,
            { emitEvent: true },
        );
        this.cdr.detectChanges();
    }

    protected saveConfiguration(): void {
        const formValue = this.form.getRawValue() as IngestConfigurationFormValue;

        this.datasetFlowConfigService
            .setDatasetIngestFlowConfigs({
                datasetId: this.datasetBasics.id,
                ingestConfigInput: IngestConfigurationRuleFormComponent.buildFlowConfigIngestInput(
                    formValue.ingestConfig,
                ),
                retryPolicyInput: FlowRetryPolicyFormComponent.buildFlowConfigRetryPolicyInput(
                    formValue.flowRetryPolicy,
                ),
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
