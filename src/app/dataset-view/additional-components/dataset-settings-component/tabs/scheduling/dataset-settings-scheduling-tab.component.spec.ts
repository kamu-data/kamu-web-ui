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
import { IngestTriggerFormValue } from "./ingest-trigger-form/ingest-trigger-form.types";
import { getElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";

describe("DatasetSettingsSchedulingTabComponent", () => {
    let component: DatasetSettingsSchedulingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSchedulingTabComponent>;
    let datasetFlowTriggerService: DatasetFlowTriggerService;

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
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check 'Save' button is disabled with no schedule defined", () => {
        const saveButton: HTMLButtonElement = getElementByDataTestId(
            fixture,
            "save-scheduling-btn",
        ) as HTMLButtonElement;
        expect(saveButton.disabled).toBeTrue();
    });

    it("should check 'Save' button works for ROOT dataset with time delta", () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.callThrough();

        component.form.setValue({
            ingestTrigger: {
                updatesEnabled: true,
                __typename: ScheduleType.TIME_DELTA,
                timeDelta: MOCK_INPUT_TIME_DELTA,
                cron: { cronExpression: "* * * * *" }, // Should be ignored
            } as IngestTriggerFormValue,
        });

        component.saveScheduledUpdates();

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

    it("should check 'Save' button works for ROOT dataset with cron expression", () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.callThrough();

        component.form.setValue({
            ingestTrigger: {
                updatesEnabled: true,
                __typename: ScheduleType.CRON_5_COMPONENT_EXPRESSION,
                timeDelta: { every: 1, unit: TimeUnit.Minutes }, // Should be ignored
                cron: { cronExpression: MOCK_CRON_EXPRESSION },
            } as IngestTriggerFormValue,
        });
        fixture.detectChanges();

        component.saveScheduledUpdates();

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

    it("should check 'Save' button is ignored in invalid state for time delta", () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.stub();

        component.form.patchValue({
            ingestTrigger: {
                updatesEnabled: true,
                __typename: ScheduleType.TIME_DELTA,
                timeDelta: {
                    every: 100, // Invalid value
                    unit: TimeUnit.Minutes,
                },
                cron: null,
            } as IngestTriggerFormValue,
        });
        fixture.detectChanges();

        component.saveScheduledUpdates();

        expect(setDatasetFlowTriggersSpy).not.toHaveBeenCalled();
    });

    it("should check 'Save' button is ignored in invalid state for cron expression", () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.stub();

        component.form.patchValue({
            ingestTrigger: {
                updatesEnabled: true,
                __typename: ScheduleType.CRON_5_COMPONENT_EXPRESSION,
                timeDelta: null,
                cron: { cronExpression: "invalid-cron-expression" }, // Invalid value
            } as IngestTriggerFormValue,
        });
        fixture.detectChanges();

        component.saveScheduledUpdates();

        expect(setDatasetFlowTriggersSpy).not.toHaveBeenCalled();
    });
});
