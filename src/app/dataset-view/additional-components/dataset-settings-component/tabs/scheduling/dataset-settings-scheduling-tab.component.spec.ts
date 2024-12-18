import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsSchedulingTabComponent } from "./dataset-settings-scheduling-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastrService } from "ngx-toastr";
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
import { of } from "rxjs";
import {
    mockGetDatasetFlowTriggersBatchingQuery,
    mockGetDatasetFlowTriggersQuery,
    mockIngestGetDatasetFlowConfigsSuccess,
} from "src/app/api/mock/dataset-flow.mock";

describe("DatasetSettingsSchedulingTabComponent", () => {
    let component: DatasetSettingsSchedulingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSchedulingTabComponent>;
    let datasetSchedulingService: DatasetSchedulingService;
    let toastrService: ToastrService;

    const MOCK_PARAM_EVERY = 10;
    const MOCK_PARAM_UNIT = TimeUnit.Minutes;
    const MOCK_MIN_RECORDS_TO_AWAIT = 40;
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
        toastrService = TestBed.inject(ToastrService);

        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
    });

    it("should create", () => {
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check initial state", () => {
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        spyOn(datasetSchedulingService, "fetchDatasetFlowConfigs").and.returnValue(
            of(mockIngestGetDatasetFlowConfigsSuccess),
        );
        spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersQuery),
        );
        fixture.detectChanges();
        const fetchUncacheableCheckBox = findElementByDataTestId(fixture, "fetchUncacheable") as HTMLInputElement;
        expect(fetchUncacheableCheckBox.checked).toBeFalsy();
    });

    it("should check initial state for derivative dataset", () => {
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        component.datasetBasics = mockDatasetBasicsDerivedFragment;

        spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersBatchingQuery),
        );
        fixture.detectChanges();
        const fetchUncacheableCheckBox = findElementByDataTestId(fixture, "batching-interval-unit") as HTMLInputElement;
        expect(fetchUncacheableCheckBox.value).toEqual(TimeUnit.Hours);
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

    it("should check 'Save trigger' button works for ROOT dataset", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        setFieldValue(fixture, "polling-group-every", MOCK_PARAM_EVERY.toString());
        setFieldValue(fixture, "polling-group-unit", MOCK_PARAM_UNIT);
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-config-options");
        expect(setDatasetFlowScheduleSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerInput: {
                    schedule: {
                        timeDelta: MOCK_INPUT_TIME_DELTA,
                    },
                },
            }),
        );
    });

    it("should check 'Save trigger' button works for ROOT dataset with time delta", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        setFieldValue(fixture, "polling-group-every", MOCK_PARAM_EVERY.toString());
        setFieldValue(fixture, "polling-group-unit", MOCK_PARAM_UNIT);
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-config-options");

        expect(setDatasetFlowScheduleSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerInput: {
                    schedule: {
                        timeDelta: MOCK_INPUT_TIME_DELTA,
                    },
                },
            }),
        );
    });

    it("should check 'Save trigger' button works for ROOT dataset with cron expression", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "button-cron-expression");
        setFieldValue(fixture, "polling-group-cron-expression", MOCK_CRON_EXPRESSION);
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-config-options");

        expect(setDatasetFlowScheduleSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerInput: {
                    schedule: {
                        cron5ComponentExpression: `${MOCK_CRON_EXPRESSION}`,
                    },
                },
            }),
        );
    });

    it("should check 'Save triger' button works for DERIVATIVE dataset", () => {
        const setDatasetFlowBatchingSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        fixture.detectChanges();
        setFieldValue(fixture, "batching-interval-every", MOCK_PARAM_EVERY.toString());
        setFieldValue(fixture, "batching-interval-unit", MOCK_PARAM_UNIT);
        setFieldValue(fixture, "batching-min-records", MOCK_MIN_RECORDS_TO_AWAIT.toString());
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-batching-triggers");

        expect(setDatasetFlowBatchingSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerInput: {
                    batching: {
                        minRecordsToAwait: MOCK_MIN_RECORDS_TO_AWAIT,
                        maxBatchingInterval: {
                            every: MOCK_PARAM_EVERY,
                            unit: MOCK_PARAM_UNIT,
                        },
                    },
                },
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

    it("should check init form  with schedule", () => {
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "button-cron-expression");
        setFieldValue(fixture, "polling-group-cron-expression", MOCK_INVALID_CRON_EXPRESSION);
        fixture.detectChanges();
        const errorMessageElem = findElementByDataTestId(fixture, "cronExpression-error");
        expect(errorMessageElem?.textContent?.trim()).toEqual("Invalid expression");
    });

    it("should check save ingest configuration", () => {
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);
        const toastrServiceSpy = spyOn(toastrService, "success");
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetFlowConfigs").and.returnValue(
            of(true),
        );
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "fetchUncacheable");
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "save-polling-configuration");

        expect(setDatasetFlowScheduleSpy).toHaveBeenCalledTimes(1);
        expect(toastrServiceSpy).toHaveBeenCalledTimes(1);
    });
});
