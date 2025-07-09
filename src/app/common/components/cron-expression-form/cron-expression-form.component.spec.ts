/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { CronExpressionFormComponent } from "./cron-expression-form.component";
import { Component, ViewChild } from "@angular/core";
import { CronExpressionFormHarness } from "./cron-expression-form.harness";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";

@Component({
    standalone: true,
    imports: [CronExpressionFormComponent],
    template: `<app-cron-expression-form [label]="'Cron expression :'" [placeholder]="'Example: * * * * ?'" />`,
})
class TestCronExpressionFormComponent {
    @ViewChild(CronExpressionFormComponent)
    public formComponent: CronExpressionFormComponent;
}

describe("CronExpressionFormComponent", () => {
    let hostComponent: TestCronExpressionFormComponent;
    let component: CronExpressionFormComponent;

    let fixture: ComponentFixture<TestCronExpressionFormComponent>;
    let loader: HarnessLoader;
    let cronHarness: CronExpressionFormHarness;

    const VALID_CRON_EXPRESSION = "0 9 ? * MON"; // Every Monday at 9 AM
    const INVALID_CRON_EXPRESSION = "0 9 * * MON"; // Invalid because it has both day of month and day of week specified

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestCronExpressionFormComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: {} },
                        params: { subscribe: () => {} },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestCronExpressionFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        cronHarness = await loader.getHarness(CronExpressionFormHarness);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize with default values", () => {
        expect(component.cronExpressionControl.value).toBe("");
    });

    it("should update form value when writeValue is called", () => {
        const testValue = { cronExpression: VALID_CRON_EXPRESSION };
        component.writeValue(testValue);

        expect(component.cronExpressionControl.value).toBe(VALID_CRON_EXPRESSION);
    });

    it("should disable form when setDisabledState is called with true", () => {
        component.setDisabledState(true);
        expect(component.form.disabled).toBe(true);
    });

    it("should enable form when setDisabledState is called with false", () => {
        component.setDisabledState(false);
        expect(component.form.disabled).toBe(false);
    });

    it("should emit formChange when form values change", () => {
        const emitSpy = spyOn(component.formChange, "emit");

        component.form.patchValue({ cronExpression: VALID_CRON_EXPRESSION });

        expect(emitSpy).toHaveBeenCalledWith(component.form);
    });

    it("should validate cron expression", async () => {
        // Invalid cron expression
        await cronHarness.setCronExpression(INVALID_CRON_EXPRESSION);
        expect(component.cronExpressionControl.hasError("invalidCronExpression")).toBe(true);

        // Valid cron expression
        await cronHarness.setCronExpression(VALID_CRON_EXPRESSION);
        expect(component.cronExpressionControl.hasError("invalidCronExpression")).toBe(false);
    });

    it("should show error message and no next execution time for invalid cron expression", async () => {
        await cronHarness.setCronExpression(INVALID_CRON_EXPRESSION);

        const isInvalid = await cronHarness.isInvalid();
        expect(isInvalid).toBeTrue();

        const errorMessage = await cronHarness.getErrorMessage();
        expect(errorMessage).toEqual(component.INVALID_EXPRESSION_MESSAGE);

        const nextTime = await cronHarness.getNextTime();
        expect(nextTime).toBeNull();
    });

    it("should show next execution time and no error for valid cron expression", async () => {
        await cronHarness.setCronExpression(VALID_CRON_EXPRESSION);

        const isInvalid = await cronHarness.isInvalid();
        expect(isInvalid).toBeFalse();

        const errorMessage = await cronHarness.getErrorMessage();
        expect(errorMessage).toBeNull();

        const nextTime = await cronHarness.getNextTime();
        expect(nextTime).toContain(component.NEXT_TIME_LABEL);
    });
});
