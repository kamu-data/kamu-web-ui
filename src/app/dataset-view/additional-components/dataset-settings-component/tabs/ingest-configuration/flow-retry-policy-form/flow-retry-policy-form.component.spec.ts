/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowRetryPolicyFormComponent } from "./flow-retry-policy-form.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";
import { Component, ViewChild } from "@angular/core";
import { FlowRetryPolicyFormHarness } from "./flow-retry-policy-form.harness";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlowRetryBackoffType, TimeUnit } from "src/app/api/kamu.graphql.interface";

@Component({
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        FlowRetryPolicyFormComponent,
    ],
    template: `<app-flow-retry-policy-form [form]="hostForm.controls.flowRetryPolicy" />`,
})
class TestFlowRetryPolicyFormComponent {
    public readonly hostForm = new FormGroup({
        flowRetryPolicy: FlowRetryPolicyFormComponent.buildForm(),
    });

    @ViewChild(FlowRetryPolicyFormComponent)
    public formComponent: FlowRetryPolicyFormComponent;
}

describe("FlowRetryPolicyFormComponent", () => {
    let hostComponent: TestFlowRetryPolicyFormComponent;
    let component: FlowRetryPolicyFormComponent;
    let fixture: ComponentFixture<TestFlowRetryPolicyFormComponent>;
    let loader: HarnessLoader;
    let flowRetryPolicyFormHarness: FlowRetryPolicyFormHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                //-----//
                SharedTestModule,
                TestFlowRetryPolicyFormComponent,
            ],
        });
        fixture = TestBed.createComponent(TestFlowRetryPolicyFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        // Manually trigger the initial setup to ensure proper state
        component.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        loader = TestbedHarnessEnvironment.loader(fixture);
        flowRetryPolicyFormHarness = await loader.getHarness(FlowRetryPolicyFormHarness);
    });

    // Helper function to validate form state consistency
    async function expectFormValueToEqual(expectedValue: {
        retriesEnabled: boolean;
        maxAttempts: number;
        minDelay: { every: number; unit: TimeUnit };
        backoffType: FlowRetryBackoffType;
    }): Promise<void> {
        const domFormValue = await flowRetryPolicyFormHarness.currentFormValue();
        expect(domFormValue).toEqual(expectedValue);
        expect(component.form.getRawValue()).toEqual(domFormValue);
    }

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
        expect(component).toBeTruthy();
        expect(flowRetryPolicyFormHarness).toBeTruthy();
    });

    it("should have default form values", async () => {
        const expectedDefaults = {
            retriesEnabled: false,
            maxAttempts: FlowRetryPolicyFormComponent.DEFAULT_MAX_ATTEMPTS,
            minDelay: FlowRetryPolicyFormComponent.DEFAULT_MIN_DELAY,
            backoffType: FlowRetryPolicyFormComponent.DEFAULT_BACKOFF_TYPE,
        };

        await expectFormValueToEqual(expectedDefaults);
    });

    it("should enable retries via harness and reflect in form", async () => {
        expect(component.retriesEnabled.value).toBeFalse();
        expect(component.maxAttempts.disabled).toBeTrue();
        expect(component.minDelay.disabled).toBeTrue();
        expect(component.backoffType.disabled).toBeTrue();

        await flowRetryPolicyFormHarness.enableRetries();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.retriesEnabled.value).toBeTrue();
        expect(component.maxAttempts.disabled).toBeFalse();
        expect(component.minDelay.disabled).toBeFalse();
        expect(component.backoffType.disabled).toBeFalse();
    });

    it("should disable retries via harness and reflect in form", async () => {
        // First enable retries
        await flowRetryPolicyFormHarness.enableRetries();
        expect(component.retriesEnabled.value).toBeTrue();
        expect(component.maxAttempts.disabled).toBeFalse();

        // Then disable retries
        await flowRetryPolicyFormHarness.disableRetries();

        expect(component.retriesEnabled.value).toBeFalse();
        expect(component.maxAttempts.disabled).toBeTrue();
        expect(component.minDelay.disabled).toBeTrue();
        expect(component.backoffType.disabled).toBeTrue();
    });

    it("should set max attempts via harness and reflect in form", async () => {
        await flowRetryPolicyFormHarness.enableRetries();

        const testValue = 5;
        await flowRetryPolicyFormHarness.setMaxAttempts(testValue);

        expect(component.maxAttempts.value).toBe(testValue);
        expect(await flowRetryPolicyFormHarness.getMaxAttempts()).toBe(testValue);
    });

    it("should set min delay via harness and reflect in form", async () => {
        await flowRetryPolicyFormHarness.enableRetries();

        const testDelay = { every: 30, unit: TimeUnit.Minutes };
        await flowRetryPolicyFormHarness.setMinDelay(testDelay);

        expect(component.minDelay.value).toEqual(testDelay);

        const retrievedDelay = await flowRetryPolicyFormHarness.getMinDelay();
        expect(retrievedDelay).toEqual(testDelay);

        // Verify no validation errors in the nested TimeDelta component
        const validationError = await flowRetryPolicyFormHarness.getMinDelayValidationError();
        expect(validationError).toBeNull();
    });

    it("should set backoff type via harness and reflect in form", async () => {
        await flowRetryPolicyFormHarness.enableRetries();

        const testBackoffType = FlowRetryBackoffType.Exponential;
        await flowRetryPolicyFormHarness.setBackoffType(testBackoffType);

        expect(component.backoffType.value).toBe(testBackoffType);
        expect(await flowRetryPolicyFormHarness.getBackoffType()).toBe(testBackoffType);
    });

    it("should get complete form value when retries are enabled", async () => {
        await flowRetryPolicyFormHarness.enableRetries();
        await flowRetryPolicyFormHarness.setMaxAttempts(7);
        await flowRetryPolicyFormHarness.setMinDelay({ every: 45, unit: TimeUnit.Minutes });
        await flowRetryPolicyFormHarness.setBackoffType(FlowRetryBackoffType.Linear);

        await expectFormValueToEqual({
            retriesEnabled: true,
            maxAttempts: 7,
            minDelay: { every: 45, unit: TimeUnit.Minutes },
            backoffType: FlowRetryBackoffType.Linear,
        });

        // Verify no validation errors in the nested TimeDelta component
        const validationError = await flowRetryPolicyFormHarness.getMinDelayValidationError();
        expect(validationError).toBeNull();
    });

    it("should get default form value when retries are disabled", async () => {
        expect(await flowRetryPolicyFormHarness.isRetriesEnabled()).toBeFalse();

        await expectFormValueToEqual({
            retriesEnabled: false,
            maxAttempts: 3,
            minDelay: { every: 15, unit: TimeUnit.Minutes },
            backoffType: FlowRetryBackoffType.Fixed,
        });
    });

    it("should build form value from FlowRetryPolicy", () => {
        const mockRetryPolicy = {
            maxAttempts: 10,
            minDelay: { every: 30, unit: TimeUnit.Minutes },
            backoffType: FlowRetryBackoffType.ExponentialWithJitter,
        };

        const formValue = FlowRetryPolicyFormComponent.buildFormValue(mockRetryPolicy);
        expect(formValue).toEqual({
            retriesEnabled: true,
            maxAttempts: 10,
            minDelay: { every: 30, unit: TimeUnit.Minutes },
            backoffType: FlowRetryBackoffType.ExponentialWithJitter,
        });
    });

    it("should build form value from null FlowRetryPolicy", () => {
        const formValue = FlowRetryPolicyFormComponent.buildFormValue(null);
        expect(formValue).toEqual({
            retriesEnabled: false,
            maxAttempts: FlowRetryPolicyFormComponent.DEFAULT_MAX_ATTEMPTS,
            minDelay: FlowRetryPolicyFormComponent.DEFAULT_MIN_DELAY,
            backoffType: FlowRetryPolicyFormComponent.DEFAULT_BACKOFF_TYPE,
        });
    });

    it("should build FlowRetryPolicyInput from form value when enabled", () => {
        const mockFormValue = {
            retriesEnabled: true,
            maxAttempts: 8,
            minDelay: { every: 15, unit: TimeUnit.Hours },
            backoffType: FlowRetryBackoffType.Linear,
        };

        const retryPolicyInput = FlowRetryPolicyFormComponent.buildFlowConfigRetryPolicyInput(mockFormValue);
        expect(retryPolicyInput).toEqual({
            maxAttempts: 8,
            minDelay: { every: 15, unit: TimeUnit.Hours },
            backoffType: FlowRetryBackoffType.Linear,
        });
    });

    it("should build null FlowRetryPolicyInput from form value when disabled", () => {
        const mockFormValue = {
            retriesEnabled: false,
            maxAttempts: 8,
            minDelay: { every: 3, unit: TimeUnit.Days },
            backoffType: FlowRetryBackoffType.Linear,
        };

        const retryPolicyInput = FlowRetryPolicyFormComponent.buildFlowConfigRetryPolicyInput(mockFormValue);
        expect(retryPolicyInput).toBeNull();
    });

    it("should validate form with default values", () => {
        expect(component.form.valid).toBeTrue();
        expect(component.form.errors).toBeNull();
    });

    it("should validate form with valid values", async () => {
        await flowRetryPolicyFormHarness.enableRetries();
        await flowRetryPolicyFormHarness.setMaxAttempts(5);
        await flowRetryPolicyFormHarness.setMinDelay({ every: 30, unit: TimeUnit.Minutes });
        await flowRetryPolicyFormHarness.setBackoffType(FlowRetryBackoffType.Exponential);

        expect(component.form.valid).toBeTrue();
        expect(component.form.errors).toBeNull();
    });

    it("should show validation error for invalid min delay", async () => {
        await flowRetryPolicyFormHarness.enableRetries();

        // Test with invalid value (exceeds maximum for minutes: 60)
        const invalidDelay = { every: 65, unit: TimeUnit.Minutes };
        await flowRetryPolicyFormHarness.setMinDelay(invalidDelay);

        // Verify validation error appears in the nested TimeDelta component
        const validationError = await flowRetryPolicyFormHarness.getMinDelayValidationError();
        expect(validationError).toEqual("Value should be between 0 to 60");
    });
});
