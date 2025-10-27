/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IngestConfigurationRuleFormComponent } from "./ingest-configuration-rule-form.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";
import { Component, ViewChild } from "@angular/core";
import { IngestConfigurationRuleFormHarness } from "./ingest-configuration-rule-form.harness";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        IngestConfigurationRuleFormComponent,
    ],
    template: `<app-ingest-configuration-rule-form [form]="hostForm.controls.ingestConfigurationRule" />`,
})
class TestIngestConfigurationRuleFormComponent {
    public readonly hostForm = new FormGroup({
        ingestConfigurationRule: IngestConfigurationRuleFormComponent.buildForm(),
    });

    @ViewChild(IngestConfigurationRuleFormComponent)
    public formComponent: IngestConfigurationRuleFormComponent;
}

describe("IngestConfigurationRuleFormComponent", () => {
    let hostComponent: TestIngestConfigurationRuleFormComponent;
    let component: IngestConfigurationRuleFormComponent;
    let fixture: ComponentFixture<TestIngestConfigurationRuleFormComponent>;
    let loader: HarnessLoader;
    let ingestConfigurationRuleFormHarness: IngestConfigurationRuleFormHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                //-----//
                SharedTestModule,
                TestIngestConfigurationRuleFormComponent,
            ],
        });
        fixture = TestBed.createComponent(TestIngestConfigurationRuleFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        ingestConfigurationRuleFormHarness = await loader.getHarness(IngestConfigurationRuleFormHarness);
    });

    // Helper function to validate form state consistency
    async function expectFormValueToEqual(expectedValue: {
        fetchUncacheable: boolean;
        fetchNextIteration: boolean;
    }): Promise<void> {
        const domFormValue = await ingestConfigurationRuleFormHarness.currentFormValue();
        expect(domFormValue).toEqual(expectedValue);
        expect(component.form.getRawValue()).toEqual(domFormValue);
    }

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
        expect(component).toBeTruthy();
        expect(ingestConfigurationRuleFormHarness).toBeTruthy();
    });

    it("should have default form values", async () => {
        await expectFormValueToEqual({
            fetchUncacheable: false,
            fetchNextIteration: false,
        });
    });

    it("should enable fetchUncacheable via harness and reflect in form", async () => {
        expect(component.fetchUncacheableControl.value).toBeFalse();
        expect(await ingestConfigurationRuleFormHarness.isFetchUncacheableEnabled()).toBeFalse();

        await ingestConfigurationRuleFormHarness.enableFetchUncacheable();

        expect(component.fetchUncacheableControl.value).toBeTrue();
        expect(await ingestConfigurationRuleFormHarness.isFetchUncacheableEnabled()).toBeTrue();

        await expectFormValueToEqual({
            fetchUncacheable: true,
            fetchNextIteration: false,
        });
    });

    it("should enable fetchNextIteration via harness and reflect in form", async () => {
        expect(component.fetchNextIterationControl.value).toBeFalse();
        expect(await ingestConfigurationRuleFormHarness.isFetchNextIterationEnabled()).toBeFalse();

        await ingestConfigurationRuleFormHarness.enableFetchNextIteration();

        expect(component.fetchNextIterationControl.value).toBeTrue();
        expect(await ingestConfigurationRuleFormHarness.isFetchNextIterationEnabled()).toBeTrue();

        await expectFormValueToEqual({
            fetchUncacheable: false,
            fetchNextIteration: true,
        });
    });

    it("should disable fetchUncacheable via harness and reflect in form", async () => {
        // First enable it
        await ingestConfigurationRuleFormHarness.enableFetchUncacheable();
        expect(component.fetchUncacheableControl.value).toBeTrue();
        expect(await ingestConfigurationRuleFormHarness.isFetchUncacheableEnabled()).toBeTrue();

        // Then disable it
        await ingestConfigurationRuleFormHarness.disableFetchUncacheable();

        expect(component.fetchUncacheableControl.value).toBeFalse();
        expect(await ingestConfigurationRuleFormHarness.isFetchUncacheableEnabled()).toBeFalse();

        await expectFormValueToEqual({
            fetchUncacheable: false,
            fetchNextIteration: false,
        });
    });

    it("should disable fetchNextIteration via harness and reflect in form", async () => {
        // First enable it
        await ingestConfigurationRuleFormHarness.enableFetchNextIteration();
        expect(component.fetchNextIterationControl.value).toBeTrue();
        expect(await ingestConfigurationRuleFormHarness.isFetchNextIterationEnabled()).toBeTrue();

        // Then disable it
        await ingestConfigurationRuleFormHarness.disableFetchNextIteration();

        expect(component.fetchNextIterationControl.value).toBeFalse();
        expect(await ingestConfigurationRuleFormHarness.isFetchNextIterationEnabled()).toBeFalse();

        await expectFormValueToEqual({
            fetchUncacheable: false,
            fetchNextIteration: false,
        });
    });

    it("should build form value from FlowConfigRuleIngest", () => {
        const formValue1 = IngestConfigurationRuleFormComponent.buildFormValue({
            fetchUncacheable: true,
            fetchNextIteration: false,
        });
        expect(formValue1).toEqual({
            fetchUncacheable: true,
            fetchNextIteration: false,
        });

        const formValue2 = IngestConfigurationRuleFormComponent.buildFormValue({
            fetchUncacheable: false,
            fetchNextIteration: true,
        });
        expect(formValue2).toEqual({
            fetchUncacheable: false,
            fetchNextIteration: true,
        });
    });

    it("should build form value from null FlowConfigRuleIngest", () => {
        const formValue = IngestConfigurationRuleFormComponent.buildFormValue(null);
        expect(formValue).toEqual({
            fetchUncacheable: false,
            fetchNextIteration: false,
        });
    });

    it("should build FlowConfigRuleIngest from form value", () => {
        const mockFormValue1 = {
            fetchUncacheable: true,
            fetchNextIteration: false,
        };

        const mockFormValue2 = {
            fetchUncacheable: false,
            fetchNextIteration: true,
        };

        const ingestRule1 = IngestConfigurationRuleFormComponent.buildFlowConfigIngestInput(mockFormValue1);
        expect(ingestRule1).toEqual({
            fetchUncacheable: true,
            fetchNextIteration: false,
        });

        const ingestRule2 = IngestConfigurationRuleFormComponent.buildFlowConfigIngestInput(mockFormValue2);
        expect(ingestRule2).toEqual({
            fetchUncacheable: false,
            fetchNextIteration: true,
        });
    });

    it("should validate form is always valid", () => {
        // Form should be valid by default
        expect(component.form.valid).toBeTrue();
        expect(component.form.errors).toBeNull();

        // Form should still be valid after enabling fetchUncacheable
        component.form.patchValue({ fetchUncacheable: true });
        expect(component.form.valid).toBeTrue();
        expect(component.form.errors).toBeNull();
    });
});
