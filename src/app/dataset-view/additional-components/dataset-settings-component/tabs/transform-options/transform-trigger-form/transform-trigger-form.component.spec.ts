/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TransformTriggerFormComponent } from "./transform-trigger-form.component";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { Component, ViewChild } from "@angular/core";
import { HarnessLoader } from "@angular/cdk/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { TransformTriggerFormHarness } from "./transform-trigger-form.harness";
import { BatchingRuleType } from "../../../dataset-settings.model";
import { FlowTriggerBreakingChangeRule, TimeDelta, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { TransformTriggerFormValue } from "./transform-trigger-form.types";
import { TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";

@Component({
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        TransformTriggerFormComponent,
    ],
    template: `<app-transform-trigger-form
        [form]="hostForm.controls.transformTrigger"
        [updateStateToggleLabel]="label"
    />`,
})
class TestTransformTriggerFormComponent {
    public readonly label = "Enable automatic updates";

    public readonly hostForm = new FormGroup({
        transformTrigger: TransformTriggerFormComponent.buildForm(),
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

    it("should enable updates toggle via harness and reflect in form", async () => {
        expect(component.updatesEnabledControl.value).toBeFalse();

        await transformTriggerFormHarness.enableUpdates();
        expect(component.updatesEnabledControl.value).toBeTrue();
        expect(component.batchingRuleTypeControl.disabled).toBeFalse();
        expect(component.forNewDataControl.disabled).toBeFalse();
        expect(component.bufferingBatchingForm.disabled).toBeTrue(); // Immediate by default
        expect(component.forBreakingChangeControl.disabled).toBeFalse();

        await transformTriggerFormHarness.disableUpdates();
        expect(component.updatesEnabledControl.value).toBeFalse();
        expect(component.batchingRuleTypeControl.disabled).toBeTrue();
        expect(component.forNewDataControl.disabled).toBeTrue();
        expect(component.bufferingBatchingForm.disabled).toBeTrue();
        expect(component.forBreakingChangeControl.disabled).toBeTrue();
    });

    it("should set batching rule type to immediate", async () => {
        await transformTriggerFormHarness.enableUpdates();
        expect(component.batchingRuleTypeControl.value).toBeNull();

        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.IMMEDIATE);

        expect(component.batchingRuleTypeControl.value).toBe(BatchingRuleType.IMMEDIATE);
        expect(component.bufferingBatchingForm.disabled).toBeTrue();
    });

    it("should set batching rule type to buffering", async () => {
        await transformTriggerFormHarness.enableUpdates();
        expect(component.batchingRuleTypeControl.value).toBeNull();

        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.BUFFERING);

        expect(component.batchingRuleTypeControl.value).toBe(BatchingRuleType.BUFFERING);
        expect(component.bufferingBatchingForm.disabled).toBeFalse();
    });

    it("should set buffering values", async () => {
        await transformTriggerFormHarness.enableUpdates();
        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.BUFFERING);

        const MIN_RECORDS = 100;
        const MAX_BATCHING_INTERVAL: TimeDelta = { every: 5, unit: TimeUnit.Minutes };
        await transformTriggerFormHarness.enterBufferingBatchingRule(MIN_RECORDS, MAX_BATCHING_INTERVAL);

        const bufferingFormValue = await transformTriggerFormHarness.getBufferingFormValue();
        expect(bufferingFormValue?.minRecordsToAwait).toBe(MIN_RECORDS);
        expect(bufferingFormValue?.maxBatchingInterval).toEqual(MAX_BATCHING_INTERVAL);
    });

    it("should set breaking change rule to no action", async () => {
        await transformTriggerFormHarness.enableUpdates();
        expect(component.forBreakingChangeControl.value).toBeNull();

        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.NoAction);

        expect(component.forBreakingChangeControl.value).toBe(FlowTriggerBreakingChangeRule.NoAction);
    });

    it("should set breaking change rule to recover", async () => {
        await transformTriggerFormHarness.enableUpdates();
        expect(component.forBreakingChangeControl.value).toBeNull();

        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.Recover);

        expect(component.forBreakingChangeControl.value).toBe(FlowTriggerBreakingChangeRule.Recover);
    });

    it("should set complete form value with buffering batching rule", async () => {
        await transformTriggerFormHarness.enableUpdates();
        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.BUFFERING);

        const MIN_RECORDS = 50;
        const MAX_BATCHING_INTERVAL: TimeDelta = { every: 1, unit: TimeUnit.Hours };
        await transformTriggerFormHarness.enterBufferingBatchingRule(MIN_RECORDS, MAX_BATCHING_INTERVAL);

        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.NoAction);

        const domFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domFormValue).toEqual({
            updatesEnabled: true,
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
        await transformTriggerFormHarness.enableUpdates();
        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.IMMEDIATE);
        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.Recover);

        const domFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domFormValue).toEqual({
            updatesEnabled: true,
            forNewData: {
                batchingRuleType: BatchingRuleType.IMMEDIATE,
                buffering: undefined,
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
        });

        expect(component.form.getRawValue() as TransformTriggerFormValue).toEqual({
            updatesEnabled: true,
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
