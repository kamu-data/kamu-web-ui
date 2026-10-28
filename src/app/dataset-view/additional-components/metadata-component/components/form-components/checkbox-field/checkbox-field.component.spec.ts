/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CheckboxFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/checkbox-field/checkbox-field.component";
import { CheckboxFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/checkbox-field/checkbox-field.harness";
import { valueControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [CheckboxFieldComponent],
    template: `
        <app-checkbox-field
            [control]="control"
            label="Header"
            tooltip="The first line holds column names"
            dataTestId="read-header"
        />
    `,
})
class TestCheckboxFieldHostComponent {
    public control = valueControl(false)([]);
}

describe("CheckboxFieldComponent", () => {
    let fixture: ComponentFixture<TestCheckboxFieldHostComponent>;
    let host: TestCheckboxFieldHostComponent;
    let harness: CheckboxFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestCheckboxFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestCheckboxFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(CheckboxFieldHarness);
    });

    it("should render the label", async () => {
        expect(await harness.getLabel()).toBe("Header");
    });

    it("should toggle the control", async () => {
        expect(await harness.isChecked()).toBe(false);

        await harness.toggle();
        expect(await harness.isChecked()).toBe(true);
        expect(host.control.value).toBe(true);

        await harness.toggle();
        expect(await harness.isChecked()).toBe(false);
        expect(host.control.value).toBe(false);
    });

    it("should show the value the control holds", async () => {
        host.control.setValue(true);

        expect(await harness.isChecked()).toBe(true);
    });
});
