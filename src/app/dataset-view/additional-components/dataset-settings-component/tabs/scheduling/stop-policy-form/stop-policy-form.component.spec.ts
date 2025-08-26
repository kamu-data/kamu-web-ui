/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";
import { Component, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StopPolicyFormComponent } from "./stop-policy-form.component";
import { StopPolicyFormHarness } from "./stop-policy-form.harness";
import { StopPolicyType } from "../../../dataset-settings.model";

@Component({
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        StopPolicyFormComponent,
    ],
    template: `<app-stop-policy-form
        [form]="hostForm.controls.stopPolicy"
        [updatesEnabledControl]="hostForm.controls.updatesEnabled"
    />`,
})
class TestStopPolicyFormComponent {
    public readonly hostForm = new FormGroup({
        updatesEnabled: new FormControl(false),
        stopPolicy: StopPolicyFormComponent.buildForm(),
    });

    @ViewChild(StopPolicyFormComponent)
    public formComponent: StopPolicyFormComponent;
}

describe("StopPolicyFormComponent", () => {
    let hostComponent: TestStopPolicyFormComponent;
    let component: StopPolicyFormComponent;

    let fixture: ComponentFixture<TestStopPolicyFormComponent>;
    let loader: HarnessLoader;
    let stopPolicyFormHarness: StopPolicyFormHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [
                //-----//
                SharedTestModule,
                TestStopPolicyFormComponent,
            ],
        });
        fixture = TestBed.createComponent(TestStopPolicyFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        stopPolicyFormHarness = await loader.getHarness(StopPolicyFormHarness);
    });

    // Helper function to validate form state
    function expectFormValueToEqual(expectedValue: {
        stopPolicyType: StopPolicyType | null;
        maxFailures: number;
    }): void {
        expect(component.form.getRawValue()).toEqual(expectedValue);
    }

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
        expect(component).toBeTruthy();
        expect(stopPolicyFormHarness).toBeTruthy();
    });

    it("should have default form values", () => {
        const expectedDefaults = {
            stopPolicyType: null,
            maxFailures: StopPolicyFormComponent.DEFAULT_MAX_FAILURES,
        };

        expectFormValueToEqual(expectedDefaults);
    });

    it("should have controls disabled when updates are disabled", () => {
        expect(hostComponent.hostForm.controls.updatesEnabled.value).toBeFalse();
        expect(component.stopPolicyTypeControl.disabled).toBeTrue();
        expect(component.maxFailuresControl.disabled).toBeTrue();

        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();

        expect(component.stopPolicyTypeControl.disabled).toBeFalse();
        // Max failures should still be disabled until "after consecutive failures" is selected
        expect(component.maxFailuresControl.disabled).toBeTrue();
    });

    it("should set 'never' stop policy type via harness and reflect in form", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();

        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.NEVER);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.stopPolicyTypeControl.value).toBe(StopPolicyType.NEVER);
        expect(component.maxFailuresControl.disabled).toBeTrue();
    });

    it("should set 'after consecutive failures' stop policy type via harness and reflect in form", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();

        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.stopPolicyTypeControl.value).toBe(StopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        expect(component.maxFailuresControl.disabled).toBeFalse();
    });

    it("should set max failures via harness and reflect in form", async () => {
        // Enable updates and set policy type first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.AFTER_CONSECUTIVE_FAILURES);

        const TEST_MAX_FAILURES = 5;
        await stopPolicyFormHarness.setMaxFailures(TEST_MAX_FAILURES);

        expect(component.maxFailuresControl.value).toBe(TEST_MAX_FAILURES);
    });

    it("should get complete form value when stop policy is set to 'never'", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.NEVER);

        expectFormValueToEqual({
            stopPolicyType: StopPolicyType.NEVER,
            maxFailures: StopPolicyFormComponent.DEFAULT_MAX_FAILURES,
        });
    });

    it("should get complete form value when stop policy is set to 'after consecutive failures'", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        await stopPolicyFormHarness.setMaxFailures(3);

        expectFormValueToEqual({
            stopPolicyType: StopPolicyType.AFTER_CONSECUTIVE_FAILURES,
            maxFailures: 3,
        });
    });

    it("should validate form with default values", () => {
        expect(component.form.valid).toBeFalse(); // Should be invalid due to required stopPolicyType
        expect(component.form.errors).toBeUndefined();
    });

    it("should validate form with 'never' policy", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.NEVER);

        expect(component.form.valid).toBeTrue();
        expect(component.form.errors).toBeNull();
    });

    it("should validate form with 'after consecutive failures' policy and valid max failures", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        await stopPolicyFormHarness.setMaxFailures(2);

        expect(component.form.valid).toBeTrue();
        expect(component.form.errors).toBeNull();
        expect(component.maxFailuresControl.hasError("min")).toBeFalse();
        expect(component.maxFailuresControl.hasError("required")).toBeFalse();
    });

    it("should show validation error for max failures less than 1", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.AFTER_CONSECUTIVE_FAILURES);

        // Set invalid value (less than 1)
        await stopPolicyFormHarness.setMaxFailures(0);

        expect(component.form.valid).toBeFalse();
        expect(component.maxFailuresControl.hasError("min")).toBeTrue();
    });

    it("should build stop policy input for 'never' policy", () => {
        const mockFormValue = {
            stopPolicyType: StopPolicyType.NEVER,
            maxFailures: StopPolicyFormComponent.DEFAULT_MAX_FAILURES,
        };

        const stopPolicyInput = StopPolicyFormComponent.buildStopPolicyInput(mockFormValue);
        expect(stopPolicyInput).toEqual({
            never: { dummy: false },
        });
    });

    it("should build stop policy input for 'after consecutive failures' policy", () => {
        const mockFormValue = {
            stopPolicyType: StopPolicyType.AFTER_CONSECUTIVE_FAILURES,
            maxFailures: 3,
        };

        const stopPolicyInput = StopPolicyFormComponent.buildStopPolicyInput(mockFormValue);
        expect(stopPolicyInput).toEqual({
            afterConsecutiveFailures: { maxFailures: 3 },
        });
    });

    it("should disable max failures control when switching from 'after consecutive failures' to 'never'", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();

        // First select "after consecutive failures"
        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        fixture.detectChanges();
        expect(component.maxFailuresControl.disabled).toBeFalse();

        // Then switch to "never"
        await stopPolicyFormHarness.setSelectedStopPolicyType(StopPolicyType.NEVER);
        fixture.detectChanges();
        expect(component.maxFailuresControl.disabled).toBeTrue();
    });

    it("should disable stop policy type control when updates are disabled", () => {
        // First enable updates
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        expect(component.stopPolicyTypeControl.disabled).toBeFalse();

        // Then disable updates
        hostComponent.hostForm.controls.updatesEnabled.setValue(false);
        fixture.detectChanges();
        expect(component.stopPolicyTypeControl.disabled).toBeTrue();
    });
});
