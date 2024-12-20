import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IngestConfigurationFormComponent } from "./ingest-configuration-form.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";
import { of } from "rxjs";
import { mockIngestGetDatasetFlowConfigsSuccess } from "src/app/api/mock/dataset-flow.mock";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe("IngestConfigurationFormComponent", () => {
    let component: IngestConfigurationFormComponent;
    let fixture: ComponentFixture<IngestConfigurationFormComponent>;
    let datasetSchedulingService: DatasetSchedulingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IngestConfigurationFormComponent],
            providers: [Apollo],
            imports: [SharedTestModule, FormsModule, ReactiveFormsModule, ToastrModule.forRoot()],
        });
        fixture = TestBed.createComponent(IngestConfigurationFormComponent);
        component = fixture.componentInstance;
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);
        component.datasetBasics = mockDatasetBasicsRootFragment;
        spyOn(datasetSchedulingService, "fetchDatasetFlowConfigs").and.returnValue(
            of(mockIngestGetDatasetFlowConfigsSuccess),
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check save ingest configuration", () => {
        const saveConfigurationEmitSpy = spyOn(component.saveConfigurationEmit, "emit");
        emitClickOnElementByDataTestId(fixture, "fetchUncacheable");

        emitClickOnElementByDataTestId(fixture, "save-polling-configuration");

        expect(saveConfigurationEmitSpy).toHaveBeenCalledTimes(1);
    });
});
