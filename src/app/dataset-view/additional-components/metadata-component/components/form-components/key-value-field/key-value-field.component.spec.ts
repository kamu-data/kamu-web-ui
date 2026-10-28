/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { uniqueItemsValidator } from "@common/validation/collection.validators";

import { KeyValueFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/key-value-field/key-value-field.component";
import { KeyValueFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/key-value-field/key-value-field.harness";
import {
    nameValueGroup,
    nameValueListControl,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [KeyValueFieldComponent],
    template: `
        <app-key-value-field
            [control]="control"
            label="Headers"
            tooltip="Request headers"
            buttonText="+ Add headers"
            dataTestId="fetch-headers"
        />
    `,
})
class TestKeyValueFieldHostComponent {
    public control = nameValueListControl()([]);
}

describe("KeyValueFieldComponent", () => {
    let fixture: ComponentFixture<TestKeyValueFieldHostComponent>;
    let host: TestKeyValueFieldHostComponent;
    let harness: KeyValueFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestKeyValueFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestKeyValueFieldHostComponent);
        host = fixture.componentInstance;
    });
    async function render(): Promise<void> {
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(KeyValueFieldHarness);
    }

    it("should render the label, the add button and no items", async () => {
        await render();

        expect(await harness.getLabel()).toBe("Headers");
        expect(await harness.getButtonText()).toBe("+ Add headers");
        expect(await harness.getItems()).toEqual([]);
    });

    it("should add an item and write its name and value into the control", async () => {
        await render();

        await harness.addItem();
        await harness.setItem(0, { name: "Accept", value: "application/json" });

        expect(await harness.getItems()).toEqual([{ name: "Accept", value: "application/json" }]);
        expect(host.control.getRawValue()).toEqual([{ name: "Accept", value: "application/json" }]);
    });

    it("should trim the name and keep the value as typed", async () => {
        await render();

        await harness.addItem();
        await harness.setItem(0, { name: " API_KEY ", value: " a b " });

        expect(host.control.getRawValue()).toEqual([{ name: "API_KEY", value: " a b " }]);
    });

    it("should show the items the control holds", async () => {
        host.control.push(nameValueGroup("Accept", "text/csv"));
        await render();

        expect(await harness.getItems()).toEqual([{ name: "Accept", value: "text/csv" }]);
    });

    it("should remove the chosen item", async () => {
        host.control.push(nameValueGroup("first", "1"));
        host.control.push(nameValueGroup("second", "2"));
        await render();

        await harness.removeItem(0);

        expect(await harness.getItems()).toEqual([{ name: "second", value: "2" }]);
        expect(host.control.getRawValue()).toEqual([{ name: "second", value: "2" }]);
    });

    it("should require a name for each entry and reject a repeated name", async () => {
        host.control.addValidators(uniqueItemsValidator((pair) => pair.get("name")?.value));
        await render();
        await harness.addItem();
        await harness.setItem(0, { name: "", value: "x" });
        expect(await harness.getItemErrorMessage(0)).toBe("Name is required");

        await harness.setItem(0, { name: "Accept", value: "x" });
        await harness.addItem();
        await harness.setItem(1, { name: "Accept", value: "y" });

        expect(await harness.getErrorMessage()).toContain('"Accept" more than once');
        expect(host.control.valid).toBe(false);
    });
});
