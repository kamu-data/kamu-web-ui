/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsIngestConfigurationTabComponent } from "./dataset-settings-ingest-configuration-tab.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { ToastrModule } from "ngx-toastr";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { emitClickOnElementByDataTestId, findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { MatDividerModule } from "@angular/material/divider";
import { IngestConfigurationRuleModule } from "./ingest-configuration-rule-form/ingest-configuration.module";
import { of } from "rxjs";
import { DatasetFlowConfigService } from "../../services/dataset-flow-config.service";
import { FlowRetryPolicyFormModule } from "./flow-retry-policy-form/flow-retry-policy-form.module";

describe("DatasetSettingsIngestConfigurationTabComponent", () => {
    let component: DatasetSettingsIngestConfigurationTabComponent;
    let fixture: ComponentFixture<DatasetSettingsIngestConfigurationTabComponent>;
    let datasetFlowConfigService: DatasetFlowConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DatasetSettingsIngestConfigurationTabComponent],
            imports: [
                SharedTestModule,
                ToastrModule.forRoot(),
                MatDividerModule,
                IngestConfigurationRuleModule,
                FlowRetryPolicyFormModule,
            ],
            providers: [Apollo, HttpClientTestingModule],
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

    it("should check initial state", () => {
        fixture.detectChanges();
        const fetchUncacheableCheckBox = findElementByDataTestId(fixture, "fetchUncacheable") as HTMLInputElement;
        expect(fetchUncacheableCheckBox.checked).toBeFalsy();
    });

    it("should check save configuration", () => {
        const setDatasetIngestFlowConfigsSpy = spyOn(
            datasetFlowConfigService,
            "setDatasetIngestFlowConfigs",
        ).and.returnValue(of());
        emitClickOnElementByDataTestId(fixture, "save-ingest-configuration");
        expect(setDatasetIngestFlowConfigsSpy).toHaveBeenCalledTimes(1);
    });
});
