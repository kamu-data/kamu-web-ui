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

import { InputFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.harness";
import { textControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { SourceNameStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/source-name-step/source-name-step.component";

@Component({
    imports: [SourceNameStepComponent],
    template: `<app-source-name-step [control]="control" />`,
})
class TestSourceNameStepHostComponent {
    public control = textControl("", [Validators.required]);
}

describe("SourceNameStepComponent", () => {
    let fixture: ComponentFixture<TestSourceNameStepHostComponent>;
    let host: TestSourceNameStepHostComponent;
    let nameField: InputFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestSourceNameStepHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestSourceNameStepHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        nameField = await TestbedHarnessEnvironment.loader(fixture).getHarness(
            InputFieldHarness.with({ dataTestId: "source-name" }),
        );
    });

    it("should render the required source name field", async () => {
        expect(await nameField.getLabel()).toBe("Source name");
        expect(await nameField.isRequiredMarked()).toBe(true);
    });

    it("should write the typed name into the control", async () => {
        await nameField.setValue("my-source");

        expect(host.control.value).toBe("my-source");
    });

    it("should show the required error once the field is touched", async () => {
        await nameField.touch();

        expect(await nameField.getErrorMessage()).toBe("Source name is required");
    });
});
