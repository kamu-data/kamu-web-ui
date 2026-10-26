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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { MaybeNull } from "@interface/app.types";

import { FlowTriggerStopPolicyType } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { FlowStopPolicyFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/shared/flow-stop-policy-form/flow-stop-policy-form.component";
import { FlowStopPolicyFormHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/shared/flow-stop-policy-form/flow-stop-policy-form.harness";

@Component({
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        FlowStopPolicyFormComponent,
    ],
    template: `<app-flow-stop-policy-form
        [form]="hostForm.controls.stopPolicy"
        [updatesEnabledControl]="hostForm.controls.updatesEnabled"
    />`,
})
class TestFlowStopPolicyFormComponent {
    public readonly hostForm = new FormGroup({
        updatesEnabled: new FormControl(false, { nonNullable: true }),
        stopPolicy: FlowStopPolicyFormComponent.buildForm(),
    });

    @ViewChild(FlowStopPolicyFormComponent)
    public formComponent: FlowStopPolicyFormComponent;
}

describe("FlowStopPolicyFormComponent", () => {
    let hostComponent: TestFlowStopPolicyFormComponent;
    let component: FlowStopPolicyFormComponent;

    let fixture: ComponentFixture<TestFlowStopPolicyFormComponent>;
    let loader: HarnessLoader;
    let stopPolicyFormHarness: FlowStopPolicyFormHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [
                //-----//
                SharedTestModule,
                TestFlowStopPolicyFormComponent,
            ],
        });
        fixture = TestBed.createComponent(TestFlowStopPolicyFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        stopPolicyFormHarness = await loader.getHarness(FlowStopPolicyFormHarness);
    });

    // Helper function to validate form state
    function expectFormValueToEqual(expectedValue: {
        stopPolicyType: MaybeNull<FlowTriggerStopPolicyType>;
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
            maxFailures: FlowStopPolicyFormComponent.DEFAULT_MAX_FAILURES,
        };

        expectFormValueToEqual(expectedDefaults);
    });

    it("should have controls disabled when updates are disabled", () => {
        expect(hostComponent.hostForm.controls.updatesEnabled.value).toBe(false);
        expect(component.stopPolicyTypeControl.disabled).toBe(true);
        expect(component.maxFailuresControl.disabled).toBe(true);

        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();

        expect(component.stopPolicyTypeControl.disabled).toBe(false);
        // Max failures should still be disabled until "after consecutive failures" is selected
        expect(component.maxFailuresControl.disabled).toBe(true);
    });

    it("should set 'never' stop policy type via harness and reflect in form", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();

        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.NEVER);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.stopPolicyTypeControl.value).toBe(FlowTriggerStopPolicyType.NEVER);
        expect(component.maxFailuresControl.disabled).toBe(true);
    });

    it("should set 'after consecutive failures' stop policy type via harness and reflect in form", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();

        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.stopPolicyTypeControl.value).toBe(FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        expect(component.maxFailuresControl.disabled).toBe(false);
    });

    it("should set max failures via harness and reflect in form", async () => {
        // Enable updates and set policy type first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES);

        const TEST_MAX_FAILURES = 5;
        await stopPolicyFormHarness.setMaxFailures(TEST_MAX_FAILURES);

        expect(component.maxFailuresControl.value).toBe(TEST_MAX_FAILURES);
    });

    it("should get complete form value when stop policy is set to 'never'", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.NEVER);

        expectFormValueToEqual({
            stopPolicyType: FlowTriggerStopPolicyType.NEVER,
            maxFailures: FlowStopPolicyFormComponent.DEFAULT_MAX_FAILURES,
        });
    });

    it("should get complete form value when stop policy is set to 'after consecutive failures'", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        await stopPolicyFormHarness.setMaxFailures(3);

        expectFormValueToEqual({
            stopPolicyType: FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES,
            maxFailures: 3,
        });
    });

    it("should validate form with default values", () => {
        expect(component.form.valid).toBe(false); // Should be invalid due to required stopPolicyType
        expect(component.form.errors).toBeUndefined();
    });

    it("should validate form with 'never' policy", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.NEVER);

        expect(component.form.valid).toBe(true);
        expect(component.form.errors).toBeNull();
    });

    it("should validate form with 'after consecutive failures' policy and valid max failures", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        await stopPolicyFormHarness.setMaxFailures(2);

        expect(component.form.valid).toBe(true);
        expect(component.form.errors).toBeNull();
        expect(component.maxFailuresControl.hasError("min")).toBe(false);
        expect(component.maxFailuresControl.hasError("required")).toBe(false);
    });

    it("should show validation error for max failures less than 1", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES);

        // Set invalid value (less than 1)
        await stopPolicyFormHarness.setMaxFailures(0);

        expect(component.form.valid).toBe(false);
        expect(component.maxFailuresControl.hasError("min")).toBe(true);
    });

    it("should build stop policy input for 'never' policy", () => {
        const mockFormValue = {
            stopPolicyType: FlowTriggerStopPolicyType.NEVER,
            maxFailures: FlowStopPolicyFormComponent.DEFAULT_MAX_FAILURES,
        };

        const stopPolicyInput = FlowStopPolicyFormComponent.buildStopPolicyInput(mockFormValue);
        expect(stopPolicyInput).toEqual({
            never: { dummy: false },
        });
    });

    it("should build stop policy input for 'after consecutive failures' policy", () => {
        const mockFormValue = {
            stopPolicyType: FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES,
            maxFailures: 3,
        };

        const stopPolicyInput = FlowStopPolicyFormComponent.buildStopPolicyInput(mockFormValue);
        expect(stopPolicyInput).toEqual({
            afterConsecutiveFailures: { maxFailures: 3 },
        });
    });

    it("should disable max failures control when switching from 'after consecutive failures' to 'never'", async () => {
        // Enable updates first
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();

        // First select "after consecutive failures"
        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        fixture.detectChanges();
        expect(component.maxFailuresControl.disabled).toBe(false);

        // Then switch to "never"
        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.NEVER);
        fixture.detectChanges();
        expect(component.maxFailuresControl.disabled).toBe(true);
    });

    it("should disable stop policy type control when updates are disabled", () => {
        // First enable updates
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        fixture.detectChanges();
        expect(component.stopPolicyTypeControl.disabled).toBe(false);

        // Then disable updates
        hostComponent.hostForm.controls.updatesEnabled.setValue(false);
        fixture.detectChanges();
        expect(component.stopPolicyTypeControl.disabled).toBe(true);
    });
});
