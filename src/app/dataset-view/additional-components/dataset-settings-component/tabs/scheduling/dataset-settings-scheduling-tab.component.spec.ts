/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsSchedulingTabComponent } from "./dataset-settings-scheduling-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { DatasetFlowTriggerService } from "../../services/dataset-flow-trigger.service";
import { TimeDelta, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { ScheduleType } from "../../dataset-settings.model";
import { getElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { HarnessLoader } from "@angular/cdk/testing";
import { IngestTriggerFormHarness } from "./ingest-trigger-form/ingest-trigger-form.harness";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";

describe("DatasetSettingsSchedulingTabComponent", () => {
    let component: DatasetSettingsSchedulingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSchedulingTabComponent>;
    let datasetFlowTriggerService: DatasetFlowTriggerService;

    let loader: HarnessLoader;
    let ingestTriggerFormHarness: IngestTriggerFormHarness;

    const MOCK_PARAM_EVERY = 10;
    const MOCK_PARAM_UNIT = TimeUnit.Minutes;
    const MOCK_CRON_EXPRESSION = "0 0 * * ?";
    const MOCK_INPUT_TIME_DELTA: TimeDelta = {
        every: MOCK_PARAM_EVERY,
        unit: MOCK_PARAM_UNIT,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [ApolloTestingModule, SharedTestModule, DatasetSettingsSchedulingTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsSchedulingTabComponent);
        datasetFlowTriggerService = TestBed.inject(DatasetFlowTriggerService);

        component = fixture.componentInstance;
        component.schedulingTabData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            schedule: null,
            paused: true,
        };

        fixture.detectChanges();
        await fixture.whenStable();

        loader = TestbedHarnessEnvironment.loader(fixture);
        ingestTriggerFormHarness = await loader.getHarness(IngestTriggerFormHarness);
    });

    function getSaveButton(): HTMLButtonElement {
        return getElementByDataTestId(fixture, "save-scheduling-btn") as HTMLButtonElement;
    }

    it("should create", () => {
        expect(component).toBeTruthy();
        expect(ingestTriggerFormHarness).toBeTruthy();
    });

    it("should check 'Save' button is disabled with no schedule defined", () => {
        expect(component.form.status).toBe("INVALID");

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeTrue();
    });

    it("should check form is valid when loaded with time delta schedule", async () => {
        component.schedulingTabData.paused = false;
        component.schedulingTabData.schedule = {
            __typename: "TimeDelta",
            every: MOCK_PARAM_EVERY,
            unit: MOCK_PARAM_UNIT,
        };
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        const domIngestTriggerFormValue = await ingestTriggerFormHarness.currentFormValue();
        expect(domIngestTriggerFormValue).toEqual({
            updatesEnabled: true,
            __typename: ScheduleType.TIME_DELTA,
            timeDelta: {
                every: MOCK_PARAM_EVERY,
                unit: MOCK_PARAM_UNIT,
            },
            cron: { cronExpression: "" },
        });
        expect(component.form.getRawValue()).toEqual({
            ingestTrigger: domIngestTriggerFormValue,
        });
    });

    it("should check form is valid when loaded with cron schedule", async () => {
        component.schedulingTabData.paused = false;
        component.schedulingTabData.schedule = {
            __typename: "Cron5ComponentExpression",
            cron5ComponentExpression: MOCK_CRON_EXPRESSION,
        };
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        const domIngestTriggerFormValue = await ingestTriggerFormHarness.currentFormValue();
        expect(domIngestTriggerFormValue).toEqual({
            updatesEnabled: true,
            __typename: ScheduleType.CRON_5_COMPONENT_EXPRESSION,
            timeDelta: {
                every: null,
                unit: null,
            },
            cron: { cronExpression: MOCK_CRON_EXPRESSION },
        });
        expect(component.form.getRawValue()).toEqual({
            ingestTrigger: domIngestTriggerFormValue,
        });
    });

    it("should check 'Save' button works for ROOT dataset with time delta", async () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.callThrough();

        await ingestTriggerFormHarness.enableUpdates();
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.TIME_DELTA);
        await ingestTriggerFormHarness.setTimeDeltaSchedule({
            every: MOCK_PARAM_EVERY,
            unit: MOCK_PARAM_UNIT,
        });

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetFlowTriggersSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerInput: {
                    schedule: {
                        timeDelta: MOCK_INPUT_TIME_DELTA,
                    },
                },
            }),
        );
    });

    it("should check 'Save' button works for ROOT dataset with cron expression", async () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.callThrough();

        await ingestTriggerFormHarness.enableUpdates();
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.CRON_5_COMPONENT_EXPRESSION);
        await ingestTriggerFormHarness.setCronExpression(MOCK_CRON_EXPRESSION);

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetFlowTriggersSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerInput: {
                    schedule: {
                        cron5ComponentExpression: `${MOCK_CRON_EXPRESSION}`,
                    },
                },
            }),
        );
    });

    it("should check 'Save' button is ignored in invalid state for time delta", async () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.stub();

        await ingestTriggerFormHarness.enableUpdates();
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.TIME_DELTA);
        await ingestTriggerFormHarness.setTimeDeltaSchedule({
            every: 100, // Invalid value
            unit: TimeUnit.Minutes,
        });

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeTrue();

        saveButton.click(); // will be ignored
        expect(setDatasetFlowTriggersSpy).not.toHaveBeenCalled();
    });

    it("should check 'Save' button is ignored in invalid state for cron expression", async () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.stub();

        await ingestTriggerFormHarness.enableUpdates();
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.CRON_5_COMPONENT_EXPRESSION);
        await ingestTriggerFormHarness.setCronExpression("invalid-cron-expression"); // Invalid value

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeTrue();

        saveButton.click(); // will be ignored
        expect(setDatasetFlowTriggersSpy).not.toHaveBeenCalled();
    });
});
