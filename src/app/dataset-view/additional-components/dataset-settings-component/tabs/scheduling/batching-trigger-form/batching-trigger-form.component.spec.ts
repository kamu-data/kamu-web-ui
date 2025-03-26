/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BatchingTriggerFormComponent } from "./batching-trigger-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { Apollo } from "apollo-angular";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";
import {
    mockGetDatasetFlowTriggersBatchingQuery,
    mockGetDatasetFlowTriggersDefaultBatchingQuery,
} from "src/app/api/mock/dataset-flow.mock";
import { of } from "rxjs";
import { ToastrModule } from "ngx-toastr";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { emitClickOnElementByDataTestId, findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TooltipIconModule } from "src/app/common/components/tooltip-icon/tooltip-icon.module";

describe("BatchingTriggerFormComponent", () => {
    let component: BatchingTriggerFormComponent;
    let fixture: ComponentFixture<BatchingTriggerFormComponent>;
    let datasetSchedulingService: DatasetSchedulingService;
    let fetchDatasetFlowTriggersSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BatchingTriggerFormComponent],
            providers: [Apollo],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatProgressBarModule,
                TooltipIconModule,
                ToastrModule.forRoot(),
                MatSlideToggleModule,
                SharedTestModule,
            ],
        });
        fixture = TestBed.createComponent(BatchingTriggerFormComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);
        fetchDatasetFlowTriggersSpy = spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersBatchingQuery),
        );
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check save batching triggers", () => {
        const saveTriggerEmitSpy = spyOn(component.saveTriggerEmit, "emit");
        component.batchingForm.patchValue({ updatesState: true });
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-batching-triggers");

        expect(saveTriggerEmitSpy).toHaveBeenCalledTimes(1);
    });

    it("should check initial state for derivative dataset", () => {
        fixture.detectChanges();

        const batchingInterval = findElementByDataTestId(fixture, "batching-interval-unit") as HTMLInputElement;
        expect(batchingInterval.value).toEqual(TimeUnit.Hours);
    });

    it("should check initial state for derivative dataset with default options", () => {
        fetchDatasetFlowTriggersSpy = fetchDatasetFlowTriggersSpy.and.returnValue(
            of(mockGetDatasetFlowTriggersDefaultBatchingQuery),
        );
        const resetFormSpy = spyOn(component.batchingForm, "reset");
        fixture.detectChanges();

        expect(resetFormSpy).toHaveBeenCalledTimes(1);
    });

    it("should check save default batching triggers", () => {
        const saveTriggerEmitSpy = spyOn(component.saveTriggerEmit, "emit");
        emitClickOnElementByDataTestId(fixture, "save-default-batching-triggers");
        expect(saveTriggerEmitSpy).toHaveBeenCalledTimes(1);
    });
});
