/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArrayKeysFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/array-keys-field/array-keys-field.component";
import { ArrayKeysFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/array-keys-field/array-keys-field.harness";
import {
    listItemControl,
    textListControl,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [ArrayKeysFieldComponent],
    template: `
        <app-array-keys-field
            [control]="control"
            label="Primary key"
            tooltip="Columns that identify a row"
            buttonText="+ Add primary key"
            placeholder="Enter column name"
            dataTestId="merge-primaryKey"
        />
    `,
})
class TestArrayKeysFieldHostComponent {
    public control = textListControl()([]);
}

describe("ArrayKeysFieldComponent", () => {
    let fixture: ComponentFixture<TestArrayKeysFieldHostComponent>;
    let host: TestArrayKeysFieldHostComponent;
    let harness: ArrayKeysFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestArrayKeysFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestArrayKeysFieldHostComponent);
        host = fixture.componentInstance;
    });

    /** The field is OnPush and does not watch its control, so a test fills the list before rendering it. */
    async function render(): Promise<void> {
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(ArrayKeysFieldHarness);
    }

    it("should render the label, the add button and no keys", async () => {
        await render();

        expect(await harness.getLabel()).toBe("Primary key");
        expect(await harness.getButtonText()).toBe("+ Add primary key");
        expect(await harness.getItems()).toEqual([]);
    });

    it("should add a key, which is required, and write it into the control", async () => {
        await render();

        await harness.addItem();
        expect(host.control.getRawValue()).toEqual([""]);
        expect(host.control.valid).toBe(false);

        await harness.setItem(0, "id");

        expect(await harness.getItems()).toEqual(["id"]);
        expect(host.control.getRawValue()).toEqual(["id"]);
        expect(host.control.valid).toBe(true);
    });

    it("should remove the chosen key", async () => {
        host.control.push(listItemControl("id"));
        host.control.push(listItemControl("event_time"));
        await render();

        await harness.removeItem(0);

        expect(await harness.getItems()).toEqual(["event_time"]);
        expect(host.control.getRawValue()).toEqual(["event_time"]);
    });
});
