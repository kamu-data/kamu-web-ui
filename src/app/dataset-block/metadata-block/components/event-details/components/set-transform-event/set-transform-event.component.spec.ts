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
import {
    MOCK_PRIVATE_INPUT_DATASET_REF,
    mockSetTransform,
    mockSetTransformWithPrivateInput,
} from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

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
    });

    it("should show the query alias the event gives the input, not the dataset's alias", async () => {
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, BaseDynamicEventHarness);

        expect(await harness.getPropertyText("set-transform-dataset-alias")).toEqual(mockSetTransform.inputs[0].alias);
    });

    it("should show the query alias of an input whose dataset is not accessible", async () => {
        setComponentInput(fixture, "event", mockSetTransformWithPrivateInput);
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, BaseDynamicEventHarness);

        expect(await harness.getPropertyText("set-transform-datasetNotAccessible-datasetRef")).toEqual(
            MOCK_PRIVATE_INPUT_DATASET_REF,
        );
        expect(await harness.getPropertyText("set-transform-dataset-alias")).toEqual(
            mockSetTransformWithPrivateInput.inputs[0].alias,
        );
    });
});
