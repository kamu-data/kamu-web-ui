/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IngestTriggerFormComponent } from "./ingest-trigger-form.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { DatasetBasicsFragment, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { ScheduleType } from "../../../dataset-settings.model";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";
import { Component, ViewChild } from "@angular/core";
import { IngestTriggerFormHarness } from "./ingest-trigger-form.harness";

@Component({
    standalone: true,
    imports: [IngestTriggerFormComponent],
    template: `<app-ingest-trigger-form [datasetBasics]="datasetBasics" [updateStateToggleLabel]="label" />`,
})
class TestIngestTriggerFormComponent {
    public readonly datasetBasics: DatasetBasicsFragment = mockDatasetBasicsRootFragment;
    public readonly label = "Enable automatic updates";

    @ViewChild(IngestTriggerFormComponent)
    public formComponent: IngestTriggerFormComponent;
}

describe("IngestTriggerFormComponent", () => {
    let hostComponent: TestIngestTriggerFormComponent;
    let component: IngestTriggerFormComponent;

    let fixture: ComponentFixture<TestIngestTriggerFormComponent>;
    let loader: HarnessLoader;
    let ingestTriggerFormHarness: IngestTriggerFormHarness;

    const MOCK_INVALID_CRON_EXPRESSION = "* *";

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [
                //-----//
                SharedTestModule,
                TestIngestTriggerFormComponent,
            ],
        });
        fixture = TestBed.createComponent(TestIngestTriggerFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        ingestTriggerFormHarness = await loader.getHarness(IngestTriggerFormHarness);
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
        expect(component).toBeTruthy();
        expect(ingestTriggerFormHarness).toBeTruthy();
    });

    it("should enable updates toggle via harness and reflect in form", async () => {
        expect(component.updatesEnabled.value).toBeFalse();

        await ingestTriggerFormHarness.enableUpdates();
        expect(component.updatesEnabled.value).toBeTrue();

        await ingestTriggerFormHarness.disableUpdates();
        expect(component.updatesEnabled.value).toBeFalse();
    });

    it("should check switch polling options", async () => {
        await ingestTriggerFormHarness.enableUpdates();

        // First verify initial state
        expect(component.scheduleType.value).toBeNull();

        // Click on CRON radio button
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.CRON_5_COMPONENT_EXPRESSION);
        expect(component.scheduleType.value).toEqual(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        // Click on time delta radio button
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.TIME_DELTA);
        expect(component.scheduleType.value).toEqual(ScheduleType.TIME_DELTA);
    });

    it("should fill form with cron expression and reflect in form state", async () => {
        await ingestTriggerFormHarness.enableUpdates();
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        expect(component.scheduleType.value).toEqual(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        await ingestTriggerFormHarness.setCronExpression("* * * * ?");

        const value = component.form.getRawValue();
        expect(value).toEqual({
            updatesEnabled: true,
            __typename: ScheduleType.CRON_5_COMPONENT_EXPRESSION,
            timeDelta: { every: null, unit: null },
            cron: {
                cronExpression: "* * * * ?",
            },
        });
    });

    it("should check cron expression error", async () => {
        await ingestTriggerFormHarness.enableUpdates();
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        expect(component.scheduleType.value).toEqual(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        // Set invalid cron expression
        await ingestTriggerFormHarness.setCronExpression(MOCK_INVALID_CRON_EXPRESSION);

        const errorMessageElem = findElementByDataTestId(fixture, "cron-expression-error");
        expect(errorMessageElem?.textContent?.trim()).toEqual("Invalid expression");
    });

    it("should check init form with time delta", async () => {
        await ingestTriggerFormHarness.enableUpdates();
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.TIME_DELTA);

        expect(component.scheduleType.value).toEqual(ScheduleType.TIME_DELTA);

        await ingestTriggerFormHarness.setTimeDeltaSchedule({ every: 10, unit: TimeUnit.Minutes });

        const value = component.form.getRawValue();
        expect(value).toEqual({
            updatesEnabled: true,
            __typename: ScheduleType.TIME_DELTA,
            timeDelta: { every: 10, unit: TimeUnit.Minutes },
            cron: { cronExpression: null },
        });
    });

    it("should check time delta error", async () => {
        await ingestTriggerFormHarness.enableUpdates();
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.TIME_DELTA);

        expect(component.scheduleType.value).toEqual(ScheduleType.TIME_DELTA);

        // Set invalid time delta
        await ingestTriggerFormHarness.setTimeDeltaSchedule({ every: 100, unit: TimeUnit.Minutes }); // Invalid value

        const errorMessageElem = findElementByDataTestId(fixture, "time-delta-range-error");
        expect(errorMessageElem?.textContent?.trim()).toEqual("Value should be between 0 to 60");
    });
});
