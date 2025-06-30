/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IngestConfigurationFormComponent } from "./ingest-configuration-form.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { of } from "rxjs";
import { mockIngestGetDatasetFlowConfigsSuccess } from "src/app/api/mock/dataset-flow.mock";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { DatasetFlowConfigService } from "../../../services/dataset-flow-config.service";

describe("IngestConfigurationFormComponent", () => {
    let component: IngestConfigurationFormComponent;
    let fixture: ComponentFixture<IngestConfigurationFormComponent>;
    let datasetFlowConfigService: DatasetFlowConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IngestConfigurationFormComponent],
            providers: [Apollo],
            imports: [SharedTestModule, FormsModule, MatCheckboxModule, ReactiveFormsModule, ToastrModule.forRoot()],
        });
        fixture = TestBed.createComponent(IngestConfigurationFormComponent);
        component = fixture.componentInstance;
        datasetFlowConfigService = TestBed.inject(DatasetFlowConfigService);

        component.datasetBasics = mockDatasetBasicsRootFragment;
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(
            of(mockIngestGetDatasetFlowConfigsSuccess),
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check emit form", () => {
        const changeConfigurationEmitSpy = spyOn(component.changeConfigurationEmit, "emit");
        emitClickOnElementByDataTestId(fixture, "fetchUncacheable");
        component.ingestConfigurationForm.patchValue({ fetchUncacheable: true });
        expect(changeConfigurationEmitSpy).toHaveBeenCalledTimes(1);
    });
});
