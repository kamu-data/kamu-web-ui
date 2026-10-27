/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { AddDataEventFragment } from "@api/kamu.graphql.interface";

import { AddDataEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/add-data-event/add-data-event.component";
import { BaseDynamicEventHarness } from "src/app/dataset-block/metadata-block/components/event-details/components/base-dynamic-event/base-dynamic-event.harness";
import { mockAddData } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

describe("AddDataEventComponent", () => {
    let component: AddDataEventComponent;
    let fixture: ComponentFixture<AddDataEventComponent>;
    let harness: BaseDynamicEventHarness;

    const OFFSET_START_TEST_ID = "add-data-data-slice-offset-interval-start";
    const OFFSET_END_TEST_ID = "add-data-data-slice-offset-interval-end";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, AddDataEventComponent],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AddDataEventComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "event", mockAddData);
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, BaseDynamicEventHarness);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should render a section per event field and its property values", async () => {
        expect(await harness.getSectionTitles()).toEqual(["New watermark", "New data", "New checkpoint"]);
        expect(await harness.getPropertyText(OFFSET_START_TEST_ID)).toEqual("0");
        expect(await harness.getPropertyText(OFFSET_END_TEST_ID)).toEqual("596125");
    });

    it("should rebuild the property rows when the event changes", async () => {
        const nextEvent = {
            ...mockAddData,
            newWatermark: null,
            newData: {
                __typename: "DataSlice",
                logicalHash: "zLogicalHashOfTheNextSlice",
                physicalHash: "zPhysicalHashOfTheNextSlice",
                size: "1024",
                offsetInterval: { __typename: "OffsetInterval", start: "596126", end: "600000" },
            },
        } satisfies AddDataEventFragment;

        setComponentInput(fixture, "event", nextEvent);

        expect(await harness.getSectionTitles()).toEqual(["New data", "New checkpoint"]);
        expect(await harness.getPropertyText(OFFSET_START_TEST_ID)).toEqual("596126");
        expect(await harness.getPropertyText(OFFSET_END_TEST_ID)).toEqual("600000");
    });
});
