/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ApolloTestingModule } from "apollo-angular/testing";

import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { BaseDynamicEventHarness } from "src/app/dataset-block/metadata-block/components/event-details/components/base-dynamic-event/base-dynamic-event.harness";
import { SetTransformEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-transform-event/set-transform-event.component";
import { mockSetTransform } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

describe("SetTransformEventComponent", () => {
    let component: SetTransformEventComponent;
    let fixture: ComponentFixture<SetTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [HIGHLIGHT_OPTIONS_PROVIDER],
            imports: [ApolloTestingModule, SharedTestModule, SetTransformEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SetTransformEventComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "event", mockSetTransform);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should render a section per input and one for the transform", async () => {
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, BaseDynamicEventHarness);

        expect(await harness.getSectionTitles()).toEqual(["inputs", "transform"]);
        expect(await harness.getPropertyText("set-transform-dataset-alias")).toEqual(
            "kamu/covid19.quebec.case-details",
        );
    });
});
