/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Validators } from "@angular/forms";

import { integerInRangeValidators } from "@common/validation/number.validators";

import { NumberFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/number-field/number-field.component";
import { NumberFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/number-field/number-field.harness";
import { numberInputControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [NumberFieldComponent],
    template: `
        <app-number-field
            [control]="control"
            label="Port"
            tooltip="Broker port"
            placeholder="Enter port"
            [requiredField]="true"
            dataTestId="fetch-port"
        />
    `,
})
class TestNumberFieldHostComponent {
    public control = numberInputControl()([Validators.required, ...integerInRangeValidators(1, 65535)]);
}

describe("NumberFieldComponent", () => {
    let fixture: ComponentFixture<TestNumberFieldHostComponent>;
    let host: TestNumberFieldHostComponent;
    let harness: NumberFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestNumberFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestNumberFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(NumberFieldHarness);
    });

    it("should render the label with the required marker", async () => {
        expect(await harness.getLabel()).toBe("Port");
        expect(await harness.isRequiredMarked()).toBe(true);
    });

    it("should write the typed number into the control", async () => {
        await harness.setValue("1883");

        expect(host.control.value).toBe(1883);
        expect(host.control.valid).toBe(true);
        expect(await harness.getErrorMessage()).toBeNull();
    });

    it("should show the required error once the field is touched", async () => {
        await harness.touch();

        expect(await harness.getErrorMessage()).toBe("Port is required");
    });

    it("should show the range error for a number out of range", async () => {
        await harness.setValue("0");

        expect(host.control.hasError("min")).toBe(true);
        expect(await harness.getErrorMessage()).toBe("Port must be at least 1");
    });
});
