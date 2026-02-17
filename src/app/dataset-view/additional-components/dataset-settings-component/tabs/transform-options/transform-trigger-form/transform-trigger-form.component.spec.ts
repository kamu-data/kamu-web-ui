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

import { FlowTriggerBreakingChangeRule, TimeDelta, TimeUnit } from "@api/kamu.graphql.interface";
import { TimeDeltaFormValue } from "@common/components/time-delta-form/time-delta-form.value";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { BatchingRuleType } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { TransformTriggerFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/transform-trigger-form/transform-trigger-form.component";
import { TransformTriggerFormHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/transform-trigger-form/transform-trigger-form.harness";
import { TransformTriggerFormValue } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/transform-trigger-form/transform-trigger-form.types";

@Component({
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        TransformTriggerFormComponent,
    ],
    template: `<app-transform-trigger-form
        [form]="hostForm.controls.transformTrigger"
        [updatesEnabledControl]="hostForm.controls.updatesEnabled"
    />`,
})
class TestTransformTriggerFormComponent {
    public readonly label = "Enable automatic updates";

    public readonly hostForm = new FormGroup({
        transformTrigger: TransformTriggerFormComponent.buildForm(),
        updatesEnabled: new FormControl(false),
    });

    @ViewChild(TransformTriggerFormComponent)
    public formComponent: TransformTriggerFormComponent;
}

describe("TransformTriggerFormComponent", () => {
    let hostComponent: TestTransformTriggerFormComponent;
    let component: TransformTriggerFormComponent;

    let fixture: ComponentFixture<TestTransformTriggerFormComponent>;

    let loader: HarnessLoader;
    let transformTriggerFormHarness: TransformTriggerFormHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [
                //-----//
                SharedTestModule,
                TestTransformTriggerFormComponent,
            ],
        });
        fixture = TestBed.createComponent(TestTransformTriggerFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        transformTriggerFormHarness = await loader.getHarness(TransformTriggerFormHarness);
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
        expect(component).toBeTruthy();
        expect(transformTriggerFormHarness).toBeTruthy();
    });

    it("should enable updates toggle and reflect in form", () => {
        expect(component.updatesEnabledControl.value).toBeFalse();

        hostComponent.hostForm.controls.updatesEnabled.setValue(true);

        expect(component.updatesEnabledControl.value).toBeTrue();
        expect(component.batchingRuleTypeControl.disabled).toBeFalse();
        expect(component.forNewDataControl.disabled).toBeFalse();
        expect(component.bufferingBatchingForm.disabled).toBeTrue(); // Immediate by default
        expect(component.forBreakingChangeControl.disabled).toBeFalse();

        hostComponent.hostForm.controls.updatesEnabled.setValue(false);

        expect(component.updatesEnabledControl.value).toBeFalse();
        expect(component.batchingRuleTypeControl.disabled).toBeTrue();
        expect(component.forNewDataControl.disabled).toBeTrue();
        expect(component.bufferingBatchingForm.disabled).toBeTrue();
        expect(component.forBreakingChangeControl.disabled).toBeTrue();
    });

    it("should set batching rule type to immediate", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        expect(component.batchingRuleTypeControl.value).toBeNull();

        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.IMMEDIATE);

        expect(component.batchingRuleTypeControl.value).toBe(BatchingRuleType.IMMEDIATE);
        expect(component.bufferingBatchingForm.disabled).toBeTrue();
    });

    it("should set batching rule type to buffering", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        expect(component.batchingRuleTypeControl.value).toBeNull();

        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.BUFFERING);

        expect(component.batchingRuleTypeControl.value).toBe(BatchingRuleType.BUFFERING);
        expect(component.bufferingBatchingForm.disabled).toBeFalse();
    });

    it("should set buffering values", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.BUFFERING);

        const MIN_RECORDS = 100;
        const MAX_BATCHING_INTERVAL: TimeDelta = { every: 5, unit: TimeUnit.Minutes };
        await transformTriggerFormHarness.enterBufferingBatchingRule(MIN_RECORDS, MAX_BATCHING_INTERVAL);

        const bufferingFormValue = await transformTriggerFormHarness.getBufferingFormValue();
        expect(bufferingFormValue?.minRecordsToAwait).toBe(MIN_RECORDS);
        expect(bufferingFormValue?.maxBatchingInterval).toEqual(MAX_BATCHING_INTERVAL);
    });

    it("should set breaking change rule to no action", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        expect(component.forBreakingChangeControl.value).toBeNull();

        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.NoAction);

        expect(component.forBreakingChangeControl.value).toBe(FlowTriggerBreakingChangeRule.NoAction);
    });

    it("should set breaking change rule to recover", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        expect(component.forBreakingChangeControl.value).toBeNull();

        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.Recover);

        expect(component.forBreakingChangeControl.value).toBe(FlowTriggerBreakingChangeRule.Recover);
    });

    it("should set complete form value with buffering batching rule", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.BUFFERING);

        const MIN_RECORDS = 50;
        const MAX_BATCHING_INTERVAL: TimeDelta = { every: 1, unit: TimeUnit.Hours };
        await transformTriggerFormHarness.enterBufferingBatchingRule(MIN_RECORDS, MAX_BATCHING_INTERVAL);

        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.NoAction);

        const domFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domFormValue).toEqual({
            forNewData: {
                batchingRuleType: BatchingRuleType.BUFFERING,
                buffering: {
                    minRecordsToAwait: MIN_RECORDS,
                    maxBatchingInterval: MAX_BATCHING_INTERVAL,
                },
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.NoAction,
        });
        expect(component.form.getRawValue() as TransformTriggerFormValue).toEqual(domFormValue);
        expect(component.form.valid).toBeTrue();
    });

    it("should set complete form value with immediate batching rule", async () => {
        hostComponent.hostForm.controls.updatesEnabled.setValue(true);
        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.IMMEDIATE);
        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.Recover);

        const domFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domFormValue).toEqual({
            forNewData: {
                batchingRuleType: BatchingRuleType.IMMEDIATE,
                buffering: undefined,
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
        });

        expect(component.form.getRawValue() as TransformTriggerFormValue).toEqual({
            forNewData: {
                batchingRuleType: BatchingRuleType.IMMEDIATE,
                // Note: in raw value we will see the disabled form
                buffering: {
                    minRecordsToAwait: null,
                    maxBatchingInterval: {
                        every: null,
                        unit: null,
                    } as TimeDeltaFormValue,
                },
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
        });
        expect(component.form.valid).toBeTrue();
    });
});
