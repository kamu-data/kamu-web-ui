import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsSchedulingTabComponent } from "./dataset-settings-scheduling-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatRadioModule } from "@angular/material/radio";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { TimeDelta, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { of } from "rxjs";
import {
    mockGetDatasetFlowTriggersBatchingQuery,
    mockGetDatasetFlowTriggersQuery,
    mockIngestGetDatasetFlowConfigsSuccess,
} from "src/app/api/mock/dataset-flow.mock";
import { BatchingTriggerModule } from "./batching-trigger-form/batching-trigger.module";
import { IngestConfigurationModule } from "./ingest-configuration-form/ingest-configuration.module";
import { IngestTriggerModule } from "./ingest-trigger-form/ingest-trigger.module";
import {
    BatchingFormType,
    IngestConfigurationFormType,
    PollingGroupType,
} from "./dataset-settings-scheduling-tab.component.types";
import { MaybeNull } from "src/app/interface/app.types";
import { PollingGroupEnum } from "../../dataset-settings.model";
import { cronExpressionValidator } from "src/app/common/helpers/data.helpers";

describe("DatasetSettingsSchedulingTabComponent", () => {
    let component: DatasetSettingsSchedulingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSchedulingTabComponent>;
    let datasetSchedulingService: DatasetSchedulingService;

    const MOCK_PARAM_EVERY = 10;
    const MOCK_PARAM_UNIT = TimeUnit.Minutes;
    const MOCK_MIN_RECORDS_TO_AWAIT = 40;
    const MOCK_CRON_EXPRESSION = "* * * * ?";
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
                IngestConfigurationModule,
                IngestTriggerModule,
                BatchingTriggerModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsSchedulingTabComponent);
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);

        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
    });

    it("should create", () => {
        component.datasetPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check initial state", () => {
        component.datasetPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
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
        component.datasetPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        component.datasetBasics = mockDatasetBasicsDerivedFragment;

        spyOn(datasetSchedulingService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersBatchingQuery),
        );
        fixture.detectChanges();
        const fetchUncacheableCheckBox = findElementByDataTestId(fixture, "batching-interval-unit") as HTMLInputElement;
        expect(fetchUncacheableCheckBox.value).toEqual(TimeUnit.Hours);
    });

    it("should check 'Save triger' button works for DERIVATIVE dataset", () => {
        const setDatasetFlowBatchingSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();
        component.datasetPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        const mockBatchingTriggerForm = new FormGroup<BatchingFormType>({
            updatesState: new FormControl<boolean>(false, { nonNullable: true }),
            every: new FormControl<MaybeNull<number>>({ value: MOCK_PARAM_EVERY, disabled: false }, [
                Validators.required,
                Validators.min(1),
            ]),
            unit: new FormControl<MaybeNull<TimeUnit>>({ value: MOCK_PARAM_UNIT, disabled: false }, [
                Validators.required,
            ]),
            minRecordsToAwait: new FormControl<MaybeNull<number>>(
                { value: MOCK_MIN_RECORDS_TO_AWAIT, disabled: false },
                [Validators.required, Validators.min(1)],
            ),
        });

        component.saveBatchingTriggers(mockBatchingTriggerForm);

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

    it("should check 'Save' button works for ROOT dataset with time delta", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();
        const setDatasetFlowConfigsSpy = spyOn(datasetSchedulingService, "setDatasetFlowConfigs").and.returnValue(
            of(true),
        );
        component.datasetPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);

        const mockPollingTriggerForm = new FormGroup<PollingGroupType>({
            updatesState: new FormControl<boolean>(true, { nonNullable: true }),
            __typename: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
            every: new FormControl<MaybeNull<number>>({ value: MOCK_PARAM_EVERY, disabled: false }, [
                Validators.required,
                Validators.min(1),
            ]),
            unit: new FormControl<MaybeNull<TimeUnit>>({ value: MOCK_PARAM_UNIT, disabled: false }, [
                Validators.required,
            ]),
            cronExpression: new FormControl<MaybeNull<string>>({ value: "", disabled: true }, [
                Validators.required,
                cronExpressionValidator(),
            ]),
        });
        component.pollingForm = mockPollingTriggerForm;
        component.ingestConfigurationForm = new FormGroup<IngestConfigurationFormType>({
            fetchUncacheable: new FormControl<boolean>(false, { nonNullable: true }),
        });

        component.saveScheduledUpdates();

        expect(setDatasetFlowConfigsSpy).toHaveBeenCalledTimes(1);
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

    it("should check 'Save' button works for ROOT dataset with cron expression", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();
        const setDatasetFlowConfigsSpy = spyOn(datasetSchedulingService, "setDatasetFlowConfigs").and.returnValue(
            of(true),
        );
        component.datasetPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);

        const mockPollingTriggerForm = new FormGroup<PollingGroupType>({
            updatesState: new FormControl<boolean>(true, { nonNullable: true }),
            __typename: new FormControl(PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION, [Validators.required]),
            every: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
                Validators.required,
                Validators.min(1),
            ]),
            unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: false }, [Validators.required]),
            cronExpression: new FormControl<MaybeNull<string>>({ value: MOCK_CRON_EXPRESSION, disabled: true }, [
                Validators.required,
                cronExpressionValidator(),
            ]),
        });
        component.pollingForm = mockPollingTriggerForm;
        component.ingestConfigurationForm = new FormGroup<IngestConfigurationFormType>({
            fetchUncacheable: new FormControl<boolean>(false, { nonNullable: true }),
        });

        component.saveScheduledUpdates();

        expect(setDatasetFlowConfigsSpy).toHaveBeenCalledTimes(1);
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
});
