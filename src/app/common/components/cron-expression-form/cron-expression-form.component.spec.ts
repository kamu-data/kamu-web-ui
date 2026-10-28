/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { CronExpressionFormComponent } from "@common/components/cron-expression-form/cron-expression-form.component";
import { CronExpressionFormHarness } from "@common/components/cron-expression-form/cron-expression-form.harness";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";

@Component({
    imports: [CronExpressionFormComponent, ReactiveFormsModule],
    template: `<app-cron-expression-form
        [form]="cronForm"
        [label]="'Cron expression :'"
        [placeholder]="'Example: * * * * ?'"
    />`,
})
class TestCronExpressionFormComponent {
    public cronForm = CronExpressionFormComponent.buildForm();

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
    const INVALID_CRON_EXPRESSION = "0 9 * # MON"; // Invalid because has special character '#'
    const INVALID_EXPRESSION_MESSAGE = `Month has invalid format: "#".`;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestCronExpressionFormComponent, FormValidationErrorsDirective],

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
        expect(hostComponent).toBeTruthy();
        expect(cronHarness).toBeTruthy();
    });

    it("should initialize with default value", () => {
        expect(component.cronExpressionControl.value).toBe("");
    });

    it("should retrieve cron expression from the harness", async () => {
        await cronHarness.setCronExpression(VALID_CRON_EXPRESSION);
        const cronExpression = await cronHarness.getCronExpression();
        expect(cronExpression).toBe(VALID_CRON_EXPRESSION);
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
        expect(isInvalid).toBe(true);

        const isUntouched = await cronHarness.isUntouched();
        expect(isUntouched).toBe(false);

        fixture.detectChanges();

        const errorMessage = await cronHarness.getErrorMessage();
        expect(errorMessage).toEqual(INVALID_EXPRESSION_MESSAGE);

        const nextTime = await cronHarness.getNextTime();
        expect(nextTime).toBeNull();
    });

    it("should show next execution time and no error for valid cron expression", async () => {
        await cronHarness.setCronExpression(VALID_CRON_EXPRESSION);

        const isInvalid = await cronHarness.isInvalid();
        expect(isInvalid).toBe(false);

        const isUntouched = await cronHarness.isUntouched();
        expect(isUntouched).toBe(false);

        const errorMessage = await cronHarness.getErrorMessage();
        expect(errorMessage).toBeNull();

        const nextTime = await cronHarness.getNextTime();
        expect(nextTime).toContain(component.NEXT_TIME_LABEL);
    });

    it("should not show error neither next time for untouched cron expression", async () => {
        const isInvalid = await cronHarness.isInvalid();
        expect(isInvalid).toBe(true);

        const isUntouched = await cronHarness.isUntouched();
        expect(isUntouched).toBe(true);

        const errorMessage = await cronHarness.getErrorMessage();
        expect(errorMessage).toBeNull();

        const nextTime = await cronHarness.getNextTime();
        expect(nextTime).toBeNull();
    });
});
