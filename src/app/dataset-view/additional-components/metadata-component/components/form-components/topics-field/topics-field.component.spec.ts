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

import { TopicsFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/topics-field/topics-field.component";
import { TopicsFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/topics-field/topics-field.harness";
import {
    topicGroup,
    topicListControl,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [TopicsFieldComponent],
    template: `
        <app-topics-field
            [control]="control"
            label="Topics"
            tooltip="Topics to subscribe to"
            buttonText="+ Add new topic"
            [requiredField]="true"
            dataTestId="fetch-topics"
        />
    `,
})
class TestTopicsFieldHostComponent {
    public control = topicListControl()([Validators.required]);
}

describe("TopicsFieldComponent", () => {
    let fixture: ComponentFixture<TestTopicsFieldHostComponent>;
    let host: TestTopicsFieldHostComponent;
    let harness: TopicsFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestTopicsFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestTopicsFieldHostComponent);
        host = fixture.componentInstance;
    });

    /** The field is OnPush and does not watch its control, so a test fills the list before rendering it. */
    async function render(): Promise<void> {
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(TopicsFieldHarness);
    }

    it("should render the label with the required marker and no topics", async () => {
        await render();

        expect(await harness.getLabel()).toBe("Topics");
        expect(await harness.isRequiredMarked()).toBe(true);
        expect(await harness.getItems()).toEqual([]);
    });

    it("should add a topic and write its path and quality of service into the control", async () => {
        await render();

        await harness.addItem();
        expect(host.control.valid).toBe(false);

        await harness.setItem(0, { path: "sensors/temperature", qos: "AtLeastOnce" });

        expect(await harness.getItems()).toEqual([{ path: "sensors/temperature", qos: "AtLeastOnce" }]);
        expect(host.control.getRawValue()).toEqual([{ path: "sensors/temperature", qos: "AtLeastOnce" }]);
        expect(host.control.valid).toBe(true);
    });

    it("should remove the chosen topic", async () => {
        host.control.push(topicGroup("first", ""));
        host.control.push(topicGroup("second", "ExactlyOnce"));
        await render();

        await harness.removeItem(0);

        expect(await harness.getItems()).toEqual([{ path: "second", qos: "ExactlyOnce" }]);
        expect(host.control.getRawValue()).toEqual([{ path: "second", qos: "ExactlyOnce" }]);
    });
});
