import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IngestTriggerFormComponent } from "./ingest-trigger-form.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";
import { of } from "rxjs";
import {
    mockGetDatasetFlowTriggersQuery,
    mockGetDatasetFlowTriggersTimeDeltaQuery,
} from "src/app/api/mock/dataset-flow.mock";
import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    setFieldValue,
} from "src/app/common/base-test.helpers.spec";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { PollingGroupEnum } from "../../../dataset-settings.model";

describe("IngestTriggerFormComponent", () => {
    let component: IngestTriggerFormComponent;
    let fixture: ComponentFixture<IngestTriggerFormComponent>;
    let datasetSchedulingService: DatasetSchedulingService;

    const MOCK_INVALID_CRON_EXPRESSION = "* *";

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IngestTriggerFormComponent],
            providers: [Apollo],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                ToastrModule.forRoot(),
                MatRadioModule,
                SharedTestModule,
                MatSlideToggleModule,
            ],
        });
        fixture = TestBed.createComponent(IngestTriggerFormComponent);
        component = fixture.componentInstance;
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);
        component.datasetBasics = mockDatasetBasicsRootFragment;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check init form with cron expression", () => {
        spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersQuery),
        );
        fixture.detectChanges();

        const cronExpessionControl = findElementByDataTestId(
            fixture,
            "polling-group-cron-expression",
        ) as HTMLInputElement;
        expect(cronExpessionControl.value.trim()).toEqual("* * * * ?");
    });

    it("should check init form with time delta", () => {
        spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersTimeDeltaQuery),
        );
        fixture.detectChanges();

        const everyControl = findElementByDataTestId(fixture, "polling-group-every") as HTMLInputElement;
        expect(everyControl.value.trim()).toEqual("10");
        const unitControl = findElementByDataTestId(fixture, "polling-group-unit") as HTMLInputElement;
        expect(unitControl.value.trim()).toEqual(TimeUnit.Minutes);
    });

    it("should check switch polling options", () => {
        spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersTimeDeltaQuery),
        );
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "button-cron-expression");
        expect(component.pollingType.value).toEqual(PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION);
        emitClickOnElementByDataTestId(fixture, "button-time-delta");
        expect(component.pollingType.value).toEqual(PollingGroupEnum.TIME_DELTA);
    });

    it("should check cron expression error", () => {
        spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersTimeDeltaQuery),
        );
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "button-cron-expression");
        setFieldValue(fixture, "polling-group-cron-expression", MOCK_INVALID_CRON_EXPRESSION);
        fixture.detectChanges();
        const errorMessageElem = findElementByDataTestId(fixture, "cronExpression-error");
        expect(errorMessageElem?.textContent?.trim()).toEqual("Invalid expression");
    });

    it("should check save pollingTriggers", () => {
        spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersTimeDeltaQuery),
        );
        fixture.detectChanges();
        const saveTriggerEmitSpy = spyOn(component.saveTriggerEmit, "emit");
        emitClickOnElementByDataTestId(fixture, "save-config-options");

        expect(saveTriggerEmitSpy).toHaveBeenCalledTimes(1);
    });
});