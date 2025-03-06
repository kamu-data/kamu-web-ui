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
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";
import { of } from "rxjs";
import { mockIngestGetDatasetFlowConfigsSuccess } from "src/app/api/mock/dataset-flow.mock";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";

describe("IngestConfigurationFormComponent", () => {
    let component: IngestConfigurationFormComponent;
    let fixture: ComponentFixture<IngestConfigurationFormComponent>;
    let datasetSchedulingService: DatasetSchedulingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IngestConfigurationFormComponent],
            providers: [Apollo],
            imports: [SharedTestModule, FormsModule, MatCheckboxModule, ReactiveFormsModule, ToastrModule.forRoot()],
        });
        fixture = TestBed.createComponent(IngestConfigurationFormComponent);
        component = fixture.componentInstance;
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.disabled = false;
        spyOn(datasetSchedulingService, "fetchDatasetFlowConfigs").and.returnValue(
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

    it("should check ngOnChanges with enable method", () => {
        const enableIngestConfigurationFormSpy = spyOn(component.ingestConfigurationForm, "enable");
        component.ngOnChanges({
            disabled: {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: () => true,
            },
        });
        expect(enableIngestConfigurationFormSpy).toHaveBeenCalledTimes(1);
    });

    it("should check ngOnChanges with disable method", () => {
        const disableIngestConfigurationFormSpy = spyOn(component.ingestConfigurationForm, "disable");
        component.ngOnChanges({
            disabled: {
                previousValue: undefined,
                currentValue: false,
                firstChange: true,
                isFirstChange: () => true,
            },
        });
        expect(disableIngestConfigurationFormSpy).toHaveBeenCalledTimes(1);
    });
});
