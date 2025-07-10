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
    async function expectFormValueToEqual(expectedValue: { fetchUncacheable: boolean }): Promise<void> {
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
        });
    });

    it("should build form value from FlowConfigRuleIngest", () => {
        const mockIngestRule = {
            fetchUncacheable: true,
        };

        const formValue = IngestConfigurationRuleFormComponent.buildFormValue(mockIngestRule);
        expect(formValue).toEqual({
            fetchUncacheable: true,
        });
    });

    it("should build form value from null FlowConfigRuleIngest", () => {
        const formValue = IngestConfigurationRuleFormComponent.buildFormValue(null);
        expect(formValue).toEqual({
            fetchUncacheable: false,
        });
    });

    it("should build FlowConfigRuleIngest from form value", () => {
        const mockFormValue = {
            fetchUncacheable: true,
        };

        const ingestRule = IngestConfigurationRuleFormComponent.buildFlowConfigIngestInput(mockFormValue);
        expect(ingestRule).toEqual({
            fetchUncacheable: true,
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
