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
import { DatasetFlowTriggerService } from "../../../services/dataset-flow-trigger.service";
import {
    mockGetDatasetFlowTriggersBatchingQuery,
    mockGetDatasetFlowTriggersDefaultBatchingQuery,
} from "src/app/api/mock/dataset-flow.mock";
import { of } from "rxjs";
import { provideToastr } from "ngx-toastr";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { emitClickOnElementByDataTestId, findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("BatchingTriggerFormComponent", () => {
    let component: BatchingTriggerFormComponent;
    let fixture: ComponentFixture<BatchingTriggerFormComponent>;
    let datasetFlowTriggerService: DatasetFlowTriggerService;
    let fetchDatasetFlowTriggersSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatProgressBarModule,
                MatSlideToggleModule,
                SharedTestModule,
                BatchingTriggerFormComponent,
            ],
        });
        fixture = TestBed.createComponent(BatchingTriggerFormComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.isLoaded = true;
        datasetFlowTriggerService = TestBed.inject(DatasetFlowTriggerService);
        fetchDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersBatchingQuery),
        );
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check save batching triggers", () => {
        const saveTriggerEmitSpy = spyOn(component.saveTriggerEmit, "emit");
        component.batchingForm.patchValue({
            updatesState: true,
            every: 10,
            unit: TimeUnit.Minutes,
            minRecordsToAwait: 1000,
        });
        fixture.detectChanges();

        component.saveBatchingTriggers();

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
        fixture.detectChanges();
        const saveTriggerEmitSpy = spyOn(component.saveTriggerEmit, "emit");
        emitClickOnElementByDataTestId(fixture, "save-default-batching-triggers");
        expect(saveTriggerEmitSpy).toHaveBeenCalledTimes(1);
    });
});
