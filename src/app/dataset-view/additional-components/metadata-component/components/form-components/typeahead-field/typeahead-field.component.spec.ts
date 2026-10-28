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

import { TypeaheadFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/typeahead-field/typeahead-field.component";
import { TypeaheadFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/typeahead-field/typeahead-field.harness";
import { textControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [TypeaheadFieldComponent],
    template: `
        <app-typeahead-field
            [control]="control"
            label="Date format"
            tooltip="Format of dates"
            placeholder="Select format"
            [data]="formats"
            [requiredField]="true"
            dataTestId="read-dateFormat"
        />
    `,
})
class TestTypeaheadFieldHostComponent {
    public control = textControl("", [Validators.required]);
    public formats = ["rfc3339", "iso8601"];
}

describe("TypeaheadFieldComponent", () => {
    let fixture: ComponentFixture<TestTypeaheadFieldHostComponent>;
    let host: TestTypeaheadFieldHostComponent;
    let harness: TypeaheadFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestTypeaheadFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestTypeaheadFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(TypeaheadFieldHarness);
    });

    it("should render the label with the required marker", async () => {
        expect(await harness.getLabel()).toBe("Date format");
        expect(await harness.isRequiredMarked()).toBe(true);
    });

    it("should suggest the formats that contain the typed text", async () => {
        await harness.typeText("iso");

        expect(await harness.getSuggestions()).toEqual(["iso8601"]);
    });

    it("should write the picked suggestion into the control", async () => {
        await harness.typeText("rfc");
        await harness.selectSuggestion("rfc3339");

        expect(host.control.value).toBe("rfc3339");
        expect(await harness.getValue()).toBe("rfc3339");
    });

    it("should accept a value that is not suggested", async () => {
        await harness.setValue("yyyy-MM-dd");

        expect(host.control.value).toBe("yyyy-MM-dd");
        expect(host.control.valid).toBe(true);
    });

    it("should show the required error once the field is touched", async () => {
        await harness.touch();

        expect(await harness.getErrorMessage()).toBe("Date format is required");
    });
});
