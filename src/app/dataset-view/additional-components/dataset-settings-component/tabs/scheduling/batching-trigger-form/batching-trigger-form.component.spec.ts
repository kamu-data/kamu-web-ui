import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BatchingTriggerFormComponent } from "./batching-trigger-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { Apollo } from "apollo-angular";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";
import { mockGetDatasetFlowTriggersBatchingQuery } from "src/app/api/mock/dataset-flow.mock";
import { of } from "rxjs";
import { ToastrModule } from "ngx-toastr";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";

describe("BatchingTriggerFormComponent", () => {
    let component: BatchingTriggerFormComponent;
    let fixture: ComponentFixture<BatchingTriggerFormComponent>;
    let datasetSchedulingService: DatasetSchedulingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BatchingTriggerFormComponent],
            providers: [Apollo],
            imports: [FormsModule, ReactiveFormsModule, ToastrModule.forRoot(), MatSlideToggleModule, SharedTestModule],
        });
        fixture = TestBed.createComponent(BatchingTriggerFormComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);
        spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersBatchingQuery),
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check save batching triggers", () => {
        const saveTriggerEmitSpy = spyOn(component.saveTriggerEmit, "emit");

        emitClickOnElementByDataTestId(fixture, "save-batching-triggers");

        expect(saveTriggerEmitSpy).toHaveBeenCalledTimes(1);
    });
});
