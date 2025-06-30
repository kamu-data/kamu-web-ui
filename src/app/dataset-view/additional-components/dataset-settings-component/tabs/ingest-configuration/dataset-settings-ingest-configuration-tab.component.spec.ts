/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsIngestConfigurationTabComponent } from "./dataset-settings-ingest-configuration-tab.component";
import { FormGroup, FormControl } from "@angular/forms";
import { IngestConfigurationFormType } from "../scheduling/dataset-settings-scheduling-tab.component.types";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { ToastrModule } from "ngx-toastr";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { emitClickOnElementByDataTestId, findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { MatDividerModule } from "@angular/material/divider";
import { of } from "rxjs";
import { mockIngestGetDatasetFlowConfigsSuccess } from "src/app/api/mock/dataset-flow.mock";

describe("DatasetSettingsIngestConfigurationTabComponent", () => {
    let component: DatasetSettingsIngestConfigurationTabComponent;
    let fixture: ComponentFixture<DatasetSettingsIngestConfigurationTabComponent>;
    let datasetSchedulingService: DatasetSchedulingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedTestModule,
                ToastrModule.forRoot(),
                MatDividerModule,
                DatasetSettingsIngestConfigurationTabComponent,
            ],
            providers: [Apollo, HttpClientTestingModule],
        });
        fixture = TestBed.createComponent(DatasetSettingsIngestConfigurationTabComponent);
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);
        component = fixture.componentInstance;
        component.ingestConfigurationTabData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        };
        component.ingestConfigurationForm = new FormGroup<IngestConfigurationFormType>({
            fetchUncacheable: new FormControl<boolean>(false, { nonNullable: true }),
        });
        spyOn(datasetSchedulingService, "fetchDatasetFlowConfigs").and.returnValue(
            of(mockIngestGetDatasetFlowConfigsSuccess),
        );
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
        const setDatasetFlowConfigsSpy = spyOn(datasetSchedulingService, "setDatasetFlowConfigs").and.returnValue(
            of().pipe(),
        );
        emitClickOnElementByDataTestId(fixture, "save-ingest-configuration");
        expect(setDatasetFlowConfigsSpy).toHaveBeenCalledTimes(1);
    });
});
