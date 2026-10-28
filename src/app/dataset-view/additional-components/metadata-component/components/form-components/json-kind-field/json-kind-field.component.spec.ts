/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { JsonKindFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/json-kind-field/json-kind-field.component";
import { JsonKindFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/json-kind-field/json-kind-field.harness";
import {
    ReadFormatControlType,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { valueControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [JsonKindFieldComponent],
    template: `
        <app-json-kind-field
            [control]="control"
            label="Select reader format"
            tooltip="JSON format"
            [controlDescriptors]="descriptors"
            dataTestId="read-jsonKind"
        />
    `,
})
class TestJsonKindFieldHostComponent {
    public control = valueControl(ReadKind.JSON)([]);
    public descriptors: ReadFormatControlType[] = [
        { label: "JSON", value: ReadKind.JSON },
        { label: "Newline-delimited JSON", value: ReadKind.ND_JSON },
    ];
}

describe("JsonKindFieldComponent", () => {
    let fixture: ComponentFixture<TestJsonKindFieldHostComponent>;
    let host: TestJsonKindFieldHostComponent;
    let harness: JsonKindFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestJsonKindFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestJsonKindFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(JsonKindFieldHarness);
    });

    it("should offer the formats it is given, with the control's one selected", async () => {
        expect(await harness.getLabel()).toBe("Select reader format");
        expect(await harness.hasKind(ReadKind.JSON)).toBe(true);
        expect(await harness.hasKind(ReadKind.ND_JSON)).toBe(true);
        expect(await harness.hasKind(ReadKind.GEO_JSON)).toBe(false);
        expect(await harness.isKindSelected(ReadKind.JSON)).toBe(true);
    });

    it("should write the selected format into the control", async () => {
        await harness.selectKind(ReadKind.ND_JSON);

        expect(host.control.value).toBe(ReadKind.ND_JSON);
        expect(await harness.isKindSelected(ReadKind.JSON)).toBe(false);
    });
});
