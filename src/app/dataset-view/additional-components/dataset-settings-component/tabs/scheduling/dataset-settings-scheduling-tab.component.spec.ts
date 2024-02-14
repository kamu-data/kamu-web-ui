import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsSchedulingTabComponent } from "./dataset-settings-scheduling-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatRadioModule } from "@angular/material/radio";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockNotScheduleDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { ReactiveFormsModule } from "@angular/forms";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import {
    checkButtonDisabled,
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    setFieldValue,
} from "src/app/common/base-test.helpers.spec";
import { PollingGroupEnum } from "../../dataset-settings.model";
import _ from "lodash";
import { TimeDelta, TimeUnit } from "src/app/api/kamu.graphql.interface";

describe("DatasetSettingsSchedulingTabComponent", () => {
    let component: DatasetSettingsSchedulingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSchedulingTabComponent>;
    let datasetSchedulingService: DatasetSchedulingService;

    const MOCK_PARAM_EVERY = 10;
    const MOCK_PARAM_UNIT = TimeUnit.Days;
    const MOCK_PARAM_MIN_DATA_BATCH = 1000;
    const MOCK_CRON_EXPRESSION = "* * * * ?";
    const MOCK_INVALID_CRON_EXPRESSION = "* *";
    const MOCK_INPUT_TIME_DELTA: TimeDelta = {
        every: MOCK_PARAM_EVERY,
        unit: MOCK_PARAM_UNIT,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetSettingsSchedulingTabComponent],
            providers: [Apollo],
            imports: [
                ApolloTestingModule,
                ToastrModule.forRoot(),
                BrowserAnimationsModule,
                SharedTestModule,
                MatDividerModule,
                MatSlideToggleModule,
                MatRadioModule,
                ReactiveFormsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsSchedulingTabComponent);
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
    });

    it("should create", () => {
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check have permission to canSchedule", () => {
        component.datasetPermissions = _.cloneDeep(mockNotScheduleDatasetPermissionsFragment);
        fixture.detectChanges();
        expect(component.pollingForm.disabled).toEqual(true);
    });

    it("should check the initial state of the 'Save' button", () => {
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        checkButtonDisabled(fixture, "save-config-options", true);
    });

    it("should check switch polling options", () => {
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "button-cron-expression");
        expect(component.pollingType.value).toEqual(PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION);
        emitClickOnElementByDataTestId(fixture, "button-time-delta");
        expect(component.pollingType.value).toEqual(PollingGroupEnum.TIME_DELTA);
    });

    it("should check 'Save' button works for ROOT dataset", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetFlowSchedule").and.callThrough();
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        setFieldValue(fixture, "polling-group-every", MOCK_PARAM_EVERY.toString());
        setFieldValue(fixture, "polling-group-unit", MOCK_PARAM_UNIT);
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-config-options");

        expect(setDatasetFlowScheduleSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                schedule: {
                    timeDelta: MOCK_INPUT_TIME_DELTA,
                },
            }),
        );
    });

    it("should check 'Save' button works for ROOT dataset with time delta", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetFlowSchedule").and.callThrough();
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        setFieldValue(fixture, "polling-group-every", MOCK_PARAM_EVERY.toString());
        setFieldValue(fixture, "polling-group-unit", MOCK_PARAM_UNIT);
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-config-options");

        expect(setDatasetFlowScheduleSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                schedule: {
                    timeDelta: MOCK_INPUT_TIME_DELTA,
                },
            }),
        );
    });

    it("should check 'Save' button works for ROOT dataset with cron expression", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetFlowSchedule").and.callThrough();
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "button-cron-expression");
        setFieldValue(fixture, "polling-group-cron-expression", MOCK_CRON_EXPRESSION);
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-config-options");

        expect(setDatasetFlowScheduleSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                schedule: {
                    cron5ComponentExpression: `${MOCK_CRON_EXPRESSION}`,
                },
            }),
        );
    });

    it("should check 'Save' button works for DERIVATIVE dataset", () => {
        const setDatasetFlowBatchingSpy = spyOn(datasetSchedulingService, "setDatasetFlowBatching").and.callThrough();
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        fixture.detectChanges();
        setFieldValue(fixture, "throttling-group-every", MOCK_PARAM_EVERY.toString());
        setFieldValue(fixture, "throttling-group-unit", MOCK_PARAM_UNIT);
        setFieldValue(fixture, "throttling-group-min-data-batch", MOCK_PARAM_MIN_DATA_BATCH.toString());
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-config-options");

        expect(setDatasetFlowBatchingSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                throttlingPeriod: MOCK_INPUT_TIME_DELTA,
                minimalDataBatch: MOCK_PARAM_MIN_DATA_BATCH,
            }),
        );
    });

    it("should check cron expression error", () => {
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "button-cron-expression");
        setFieldValue(fixture, "polling-group-cron-expression", MOCK_INVALID_CRON_EXPRESSION);
        fixture.detectChanges();
        const errorMessageElem = findElementByDataTestId(fixture, "cronExpression-error");
        expect(errorMessageElem?.textContent?.trim()).toEqual("Invalid expression");
    });
});
