/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { IngestConfigurationFormType } from "../scheduling/dataset-settings-scheduling-tab.component.types";
import { FormGroup } from "@angular/forms";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetBasicsFragment, DatasetFlowType } from "src/app/api/kamu.graphql.interface";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-dataset-settings-ingest-configuration-tab",
    templateUrl: "./dataset-settings-ingest-configuration-tab.component.html",
    styleUrls: ["./dataset-settings-ingest-configuration-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsIngestConfigurationTabComponent extends BaseComponent {
    @Input(RoutingResolvers.DATASET_SETTINGS_INGEST_CONFIGURATION_KEY)
    public ingestConfigurationTabData: DatasetViewData;
    public ingestConfigurationForm: FormGroup<IngestConfigurationFormType>;

    private datasetSchedulingService = inject(DatasetSchedulingService);

    public get datasetBasics(): DatasetBasicsFragment {
        return this.ingestConfigurationTabData.datasetBasics;
    }

    public changeIngestConfiguration(ingestConfigurationForm: FormGroup<IngestConfigurationFormType>): void {
        this.ingestConfigurationForm = ingestConfigurationForm;
    }

    public saveConfiguration(): void {
        this.datasetSchedulingService
            .setDatasetFlowConfigs({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.Ingest,
                configInput: {
                    ingest: {
                        fetchUncacheable: this.ingestConfigurationForm.controls.fetchUncacheable.value,
                    },
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
