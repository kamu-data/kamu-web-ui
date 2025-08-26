/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IngestTriggerFormComponent } from "./ingest-trigger-form.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { ScheduleType } from "../../../dataset-settings.model";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";
import { Component, ViewChild } from "@angular/core";
import { IngestTriggerFormHarness } from "./ingest-trigger-form.harness";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";

@Component({
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        IngestTriggerFormComponent,
    ],
    template: `<app-ingest-trigger-form
        [form]="hostForm.controls.ingestTrigger"
        [updatesEnabledControl]="hostForm.controls.updatesEnabled"
    />`,
})
class TestIngestTriggerFormComponent {
    public readonly label = "Enable automatic updates";

    public readonly hostForm = new FormGroup({
        updatesEnabled: new FormControl(false),
        ingestTrigger: IngestTriggerFormComponent.buildForm(),
    });

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

    it("should enable updates toggle via harness and reflect in form", () => {
        expect(component.updatesEnabledControl.value).toBeFalse();

        hostComponent.hostForm.controls.updatesEnabled.setValue(true);

        expect(component.updatesEnabledControl.value).toBeTrue();
        expect(component.scheduleTypeControl.disabled).toBeFalse();
        // initially disabled, because we did not select any schedule type
        expect(component.timeDeltaControl.disabled).toBeTrue();
        expect(component.cronExpressionControl.disabled).toBeTrue();

        hostComponent.hostForm.controls.updatesEnabled.setValue(false);

        expect(component.updatesEnabledControl.value).toBeFalse();
        expect(component.scheduleTypeControl.disabled).toBeTrue();
        // still disabled, because we did not select any schedule type
        expect(component.timeDeltaControl.disabled).toBeTrue();
        expect(component.cronExpressionControl.disabled).toBeTrue();
    });

    it("should check switch polling options", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);

        // First verify initial state
        expect(component.scheduleTypeControl.value).toBeNull();

        // Click on CRON radio button
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.CRON_5_COMPONENT_EXPRESSION);
        expect(component.scheduleTypeControl.value).toEqual(ScheduleType.CRON_5_COMPONENT_EXPRESSION);
        expect(component.cronExpressionControl.disabled).toBeFalse();
        expect(component.timeDeltaControl.disabled).toBeTrue();

        // Click on time delta radio button
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.TIME_DELTA);
        expect(component.scheduleTypeControl.value).toEqual(ScheduleType.TIME_DELTA);
        expect(component.cronExpressionControl.disabled).toBeTrue();
        expect(component.timeDeltaControl.disabled).toBeFalse();
    });

    it("should fill form with cron expression and reflect in form state", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        expect(component.scheduleTypeControl.value).toEqual(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        await ingestTriggerFormHarness.setCronExpression("* * * * ?");

        const domFormValue = await ingestTriggerFormHarness.currentFormValue();
        expect(domFormValue).toEqual({
            __typename: ScheduleType.CRON_5_COMPONENT_EXPRESSION,
            timeDelta: { every: null, unit: null },
            cron: {
                cronExpression: "* * * * ?",
            },
        });
        expect(component.form.getRawValue()).toEqual(domFormValue);
    });

    it("should check init form with time delta", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.TIME_DELTA);

        expect(component.scheduleTypeControl.value).toEqual(ScheduleType.TIME_DELTA);

        await ingestTriggerFormHarness.setTimeDeltaSchedule({ every: 10, unit: TimeUnit.Minutes });

        const domFormValue = await ingestTriggerFormHarness.currentFormValue();
        expect(domFormValue).toEqual({
            __typename: ScheduleType.TIME_DELTA,
            timeDelta: { every: 10, unit: TimeUnit.Minutes },
            cron: { cronExpression: "" },
        });
        expect(component.form.getRawValue()).toEqual(domFormValue);
    });

    it("should check cron expression error", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        expect(component.scheduleTypeControl.value).toEqual(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        // Set invalid cron expression
        await ingestTriggerFormHarness.setCronExpression(MOCK_INVALID_CRON_EXPRESSION);

        // Ensure errors and status are set correctly
        expect(component.form.invalid).toBeTrue();
        expect(component.form.errors).toBeNull();

        expect(component.cronExpressionControl.invalid).toBeTrue();
        expect(component.cronExpressionControl.get("cronExpression")?.errors).toEqual({
            invalidCronExpression:
                "Cron expression must consist of 5 fields (minute, hour, day of month, month, day of week), but got 2.",
        });

        expect(component.timeDeltaControl.invalid).toBeFalse();
        expect(component.timeDeltaControl.errors).toBeNull();
    });

    it("should check time delta error", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        await ingestTriggerFormHarness.setSelectedScheduleType(ScheduleType.TIME_DELTA);

        expect(component.scheduleTypeControl.value).toEqual(ScheduleType.TIME_DELTA);

        // Set invalid time delta
        await ingestTriggerFormHarness.setTimeDeltaSchedule({ every: 100, unit: TimeUnit.Minutes }); // Invalid value

        // Ensure errors and status are set correctly
        expect(component.form.invalid).toBeTrue();
        expect(component.form.errors).toBeNull();

        expect(component.cronExpressionControl.invalid).toBeFalse();
        expect(component.cronExpressionControl.errors).toBeNull();

        expect(component.timeDeltaControl.invalid).toBeTrue();
        expect(component.timeDeltaControl.get("every")?.errors).toEqual({
            range: {
                message: "Value should be between 1 to 60",
                refValues: [100, 1, 60],
            },
        });
    });
});
