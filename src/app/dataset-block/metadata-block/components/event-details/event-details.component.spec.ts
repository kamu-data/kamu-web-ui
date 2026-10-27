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

import {
    findComponentInstance,
    findComponentInstances,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { AddDataEventFragment } from "@api/kamu.graphql.interface";
import { mockMetadataBlockByHash } from "@api/mock/dataset.mock";

import { AddDataEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/add-data-event/add-data-event.component";
import { BaseDynamicEventHarness } from "src/app/dataset-block/metadata-block/components/event-details/components/base-dynamic-event/base-dynamic-event.harness";
import { ExecuteTransformEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/execute-transform-event/execute-transform-event.component";
import { UnsupportedEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/unsupported-event/unsupported-event.component";
import { EventDetailsComponent } from "src/app/dataset-block/metadata-block/components/event-details/event-details.component";
import { mockAddData } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

describe("EventDetailsComponent", () => {
    let component: EventDetailsComponent;
    let fixture: ComponentFixture<EventDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EventDetailsComponent],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(EventDetailsComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "block", mockMetadataBlockByHash);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should render the component for the block's event type", () => {
        expect(findComponentInstance(fixture, ExecuteTransformEventComponent)).toBeTruthy();

        setComponentInput(fixture, "block", { ...mockMetadataBlockByHash, event: mockAddData });
        fixture.detectChanges();

        expect(findComponentInstance(fixture, AddDataEventComponent)).toBeTruthy();
        expect(findComponentInstances(fixture, ExecuteTransformEventComponent)).toEqual([]);
    });

    it("should show the new values when switching between blocks of the same event type", async () => {
        const offsetEndTestId = "add-data-data-slice-offset-interval-end";
        setComponentInput(fixture, "block", { ...mockMetadataBlockByHash, event: mockAddData });
        const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(BaseDynamicEventHarness);
        expect(await harness.getPropertyText(offsetEndTestId)).toEqual("596125");

        const nextEvent = {
            ...mockAddData,
            newData: {
                __typename: "DataSlice",
                logicalHash: "zLogicalHashOfTheNextSlice",
                physicalHash: "zPhysicalHashOfTheNextSlice",
                size: "1024",
                offsetInterval: { __typename: "OffsetInterval", start: "596126", end: "600000" },
            },
        } satisfies AddDataEventFragment;
        setComponentInput(fixture, "block", { ...mockMetadataBlockByHash, event: nextEvent });

        expect(await harness.getPropertyText(offsetEndTestId)).toEqual("600000");
    });

    it("should render the unsupported event view for an event type without its own view", () => {
        setComponentInput(fixture, "block", {
            ...mockMetadataBlockByHash,
            event: { __typename: "DisablePollingSource" },
        });
        fixture.detectChanges();

        expect(findComponentInstance(fixture, UnsupportedEventComponent)).toBeTruthy();
    });
});
