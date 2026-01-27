/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component, ViewChild } from "@angular/core";
import { BufferingBatchingRuleFormComponent } from "./buffering-batching-rule-form.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BufferingBatchingRuleFormHarness } from "./buffering-batching-rule-form.harness";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";

@Component({
    imports: [BufferingBatchingRuleFormComponent, ReactiveFormsModule],
    template: `<app-buffering-batching-rule-form [form]="bufferingBatchingForm" />`
})
class TestBufferingBatchingRuleFormComponent {
    public bufferingBatchingForm = BufferingBatchingRuleFormComponent.buildForm();

    @ViewChild(BufferingBatchingRuleFormComponent)
    public formComponent: BufferingBatchingRuleFormComponent;
}

describe("BufferingBatchingRuleFormComponent", () => {
    let hostComponent: TestBufferingBatchingRuleFormComponent;
    let component: BufferingBatchingRuleFormComponent;
    let fixture: ComponentFixture<TestBufferingBatchingRuleFormComponent>;
    let loader: HarnessLoader;
    let bufferingBatchingRuleHarness: BufferingBatchingRuleFormHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                //-----//
                SharedTestModule,
                TestBufferingBatchingRuleFormComponent,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestBufferingBatchingRuleFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        bufferingBatchingRuleHarness = await loader.getHarness(BufferingBatchingRuleFormHarness);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
        expect(hostComponent).toBeTruthy();
        expect(bufferingBatchingRuleHarness).toBeTruthy();
    });

    it("should check init form with valid values", async () => {
        await bufferingBatchingRuleHarness.setMinRecordsToAwait(5);
        await bufferingBatchingRuleHarness.setMaxBatchingInterval({ every: 10, unit: TimeUnit.Minutes });

        const domFormValue = await bufferingBatchingRuleHarness.currentFormValue();
        expect(domFormValue).toEqual({
            minRecordsToAwait: 5,
            maxBatchingInterval: { every: 10, unit: TimeUnit.Minutes },
        });
        expect(component.form.getRawValue()).toEqual(domFormValue);
        expect(component.form.valid).toBeTrue();
    });

    it("should check min records required error", async () => {
        // Touch, but do not set min records
        await bufferingBatchingRuleHarness.setMinRecordsToAwait("");

        // Ensure errors and status are set correctly
        expect(component.form.invalid).toBeTrue();
        expect(component.form.errors).toBeNull();

        expect(component.form.controls.minRecordsToAwait.invalid).toBeTrue();
        expect(component.form.controls.minRecordsToAwait.errors).toEqual({
            required: true,
        });

        const errorMessage = await bufferingBatchingRuleHarness.getMinRecordsErrorMessage();
        expect(errorMessage).toBe("Minimum records is required");
    });

    it("should check min records range error", async () => {
        // Set invalid min records
        await bufferingBatchingRuleHarness.setMinRecordsToAwait(0);

        // Ensure errors and status are set correctly
        expect(component.form.invalid).toBeTrue();
        expect(component.form.errors).toBeNull();

        expect(component.form.controls.minRecordsToAwait.invalid).toBeTrue();
        expect(component.form.controls.minRecordsToAwait.errors).toEqual({
            min: { min: 1, actual: 0 },
        });

        const errorMessage = await bufferingBatchingRuleHarness.getMinRecordsErrorMessage();
        expect(errorMessage).toBe("The minimum value must be 1");
    });

    it("should check batching interval error", async () => {
        // Set invalid batching interval
        await bufferingBatchingRuleHarness.setMinRecordsToAwait(5);
        await bufferingBatchingRuleHarness.setMaxBatchingInterval({ every: 100, unit: TimeUnit.Minutes }); // Invalid value

        // Ensure errors and status are set correctly
        expect(component.form.invalid).toBeTrue();
        expect(component.form.errors).toBeNull();

        expect(component.form.controls.minRecordsToAwait.invalid).toBeFalse();
        expect(component.form.controls.minRecordsToAwait.errors).toBeNull();

        expect(component.form.controls.maxBatchingInterval.invalid).toBeTrue();
        expect(component.form.controls.maxBatchingInterval.get("every")?.errors).toEqual({
            range: {
                message: "Value should be between 1 to 60",
                refValues: [100, 1, 60],
            },
        });
    });
});
