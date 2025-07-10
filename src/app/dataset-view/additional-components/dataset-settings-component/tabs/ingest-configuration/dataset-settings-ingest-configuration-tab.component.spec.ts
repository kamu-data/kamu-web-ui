/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsIngestConfigurationTabComponent } from "./dataset-settings-ingest-configuration-tab.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { provideToastr } from "ngx-toastr";
import { Apollo } from "apollo-angular";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { DatasetFlowConfigService } from "../../services/dataset-flow-config.service";

describe("DatasetSettingsIngestConfigurationTabComponent", () => {
    let component: DatasetSettingsIngestConfigurationTabComponent;
    let fixture: ComponentFixture<DatasetSettingsIngestConfigurationTabComponent>;
    let datasetFlowConfigService: DatasetFlowConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestModule, DatasetSettingsIngestConfigurationTabComponent],
            providers: [Apollo, provideToastr()],
        });
        fixture = TestBed.createComponent(DatasetSettingsIngestConfigurationTabComponent);
        datasetFlowConfigService = TestBed.inject(DatasetFlowConfigService);

        component = fixture.componentInstance;
        component.ingestConfigurationTabData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            ingestionRule: {
                __typename: "FlowConfigRuleIngest",
                fetchUncacheable: false,
            },
            retryPolicy: null,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
