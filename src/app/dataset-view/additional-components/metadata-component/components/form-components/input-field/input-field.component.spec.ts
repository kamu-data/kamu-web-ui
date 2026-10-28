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

import { urlValidator } from "@common/validation/url.validators";

import { InputFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.component";
import { InputFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.harness";
import { textControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [InputFieldComponent],
    template: `
        <app-input-field
            [control]="control"
            label="Url"
            tooltip="Where the data is"
            placeholder="Enter url"
            [requiredField]="requiredField"
            [inputType]="inputType"
            [trimmed]="trimmed"
            dataTestId="fetch-url"
        />
    `,
})
class TestInputFieldHostComponent {
    public control = textControl("", [Validators.required, urlValidator(["http", "https"])]);
    public requiredField = true;
    public inputType: "text" | "password" = "text";
    public trimmed = true;
}

describe("InputFieldComponent", () => {
    let fixture: ComponentFixture<TestInputFieldHostComponent>;
    let host: TestInputFieldHostComponent;
    let harness: InputFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestInputFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestInputFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(InputFieldHarness);
    });

    it("should render the label with the required marker", async () => {
        expect(await harness.getLabel()).toBe("Url");
        expect(await harness.isRequiredMarked()).toBe(true);
        expect(await harness.getTestId()).toBe("fetch-url");
    });

    it("should not mark an optional field as required", async () => {
        host.requiredField = false;

        expect(await harness.isRequiredMarked()).toBe(false);
    });

    it("should render a password input", async () => {
        expect(await harness.getInputType()).toBe("text");

        host.inputType = "password";

        expect(await harness.getInputType()).toBe("password");
    });

    it("should write what the user types into the control", async () => {
        await harness.setValue("https://example.com/data.csv");

        expect(await harness.getValue()).toBe("https://example.com/data.csv");
        expect(host.control.value).toBe("https://example.com/data.csv");
        expect(host.control.valid).toBe(true);
        expect(await harness.getErrorMessage()).toBeNull();
    });

    it("should trim the value when the field is left", async () => {
        await harness.setValue("  https://example.com  ");

        expect(host.control.value).toBe("https://example.com");
    });

    it("should keep the spaces around a value the backend uses as typed", async () => {
        host.trimmed = false;
        fixture.detectChanges();
        host.control.setValue(" saved ");
        expect(await harness.getValue()).toBe(" saved ");

        await harness.setValue("  typed  ");

        expect(host.control.value).toBe("  typed  ");
    });

    it("should show the value the control holds", async () => {
        host.control.setValue("https://example.com");

        expect(await harness.getValue()).toBe("https://example.com");
    });

    it("should show no error before the field is touched", async () => {
        expect(host.control.valid).toBe(false);
        expect(await harness.getErrorMessage()).toBeNull();
    });

    it("should show the required error once the field is touched", async () => {
        await harness.touch();

        expect(host.control.touched).toBe(true);
        expect(await harness.getErrorMessage()).toBe("Url is required");
    });

    it("should show the control's validator error for a wrong value", async () => {
        await harness.setValue("example.com");

        expect(host.control.hasError("url")).toBe(true);
        expect(await harness.getErrorMessage()).toBe("Url must be a URL starting with http://, https://");
    });
});
