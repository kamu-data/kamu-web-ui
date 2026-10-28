/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SetPollingSourceTooltipsTexts } from "@common/tooltips/set-polling-source-tooltips.text";

import { SelectDateFormatFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-date-format-field/select-date-format-field.component";
import { SelectDateFormatFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-date-format-field/select-date-format-field.harness";
import { EventTimeSourceKind } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { eventTimeControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [SelectDateFormatFieldComponent],
    template: `
        <app-select-date-format-field
            [control]="control"
            label="Event time"
            tooltip="Where the event time comes from"
            [innerTooltips]="innerTooltips"
            dataTestId="fetch-eventTime"
        />
    `,
})
class TestSelectDateFormatFieldHostComponent {
    public control = eventTimeControl()([]);
    public innerTooltips = {
        fromMetadata: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_METADATA,
        fromPath: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_PATH,
        fromSystemTime: SetPollingSourceTooltipsTexts.EVENT_TIME_SYSTEM_TIME,
    };
}

describe("SelectDateFormatFieldComponent", () => {
    let fixture: ComponentFixture<TestSelectDateFormatFieldHostComponent>;
    let host: TestSelectDateFormatFieldHostComponent;
    let harness: SelectDateFormatFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestSelectDateFormatFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestSelectDateFormatFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(SelectDateFormatFieldHarness);
    });

    it("should start from metadata, with no pattern inputs and a valid group", async () => {
        expect(await harness.getLabel()).toBe("Event time");
        expect(await harness.isKindSelected(EventTimeSourceKind.FROM_METADATA)).toBe(true);
        expect(await harness.hasPatternFields()).toBe(false);
        expect(host.control.valid).toBe(true);
    });

    it("should show the pattern inputs from path, where the pattern is required", async () => {
        await harness.selectKind(EventTimeSourceKind.FROM_PATH);

        expect(host.control.controls.kind.value).toBe(EventTimeSourceKind.FROM_PATH);
        expect(await harness.hasPatternFields()).toBe(true);
        expect(host.control.valid).toBe(false);

        await harness.touchPattern();
        expect(await harness.getPatternErrorMessage()).toBe("Pattern is required");
    });

    it("should reject a pattern that is not a regular expression", async () => {
        await harness.selectKind(EventTimeSourceKind.FROM_PATH);
        await harness.setPattern("data-(.*");

        expect(await harness.getPatternErrorMessage()).toBe("Pattern must be a valid regular expression");
        expect(host.control.valid).toBe(false);
    });

    it("should write the pattern and timestamp format into the group", async () => {
        await harness.selectKind(EventTimeSourceKind.FROM_PATH);
        await harness.setPattern("(\\d+).csv");
        await harness.setTimestampFormat("YYYY-MM-DD");

        expect(host.control.getRawValue()).toEqual({
            kind: EventTimeSourceKind.FROM_PATH,
            pattern: "(\\d+).csv",
            timestampFormat: "YYYY-MM-DD",
        });
        expect(host.control.valid).toBe(true);
        expect(await harness.getPatternErrorMessage()).toBeNull();
    });

    it("should hide the pattern inputs and drop their errors for system time", async () => {
        await harness.selectKind(EventTimeSourceKind.FROM_PATH);
        await harness.selectKind(EventTimeSourceKind.FROM_SYSTEM_TIME);

        expect(await harness.isKindSelected(EventTimeSourceKind.FROM_SYSTEM_TIME)).toBe(true);
        expect(await harness.hasPatternFields()).toBe(false);
        expect(host.control.controls.pattern.errors).toBeNull();
        expect(host.control.valid).toBe(true);
    });
});
