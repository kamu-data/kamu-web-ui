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

import { BaseDynamicEventHarness } from "src/app/dataset-block/metadata-block/components/event-details/components/base-dynamic-event/base-dynamic-event.harness";
import { ExecuteTransformEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/execute-transform-event/execute-transform-event.component";
import { mockExecuteTransform } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

describe("ExecuteTransformEventComponent", () => {
    let component: ExecuteTransformEventComponent;
    let fixture: ComponentFixture<ExecuteTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, ExecuteTransformEventComponent],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(ExecuteTransformEventComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "event", mockExecuteTransform);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should render the event sections and their property values", async () => {
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, BaseDynamicEventHarness);

        expect(await harness.getSectionTitles()).toEqual([
            "New data",
            "New watermark",
            "Query inputs",
            "New checkpoint",
        ]);
        expect(await harness.getPropertyText("execute-transform-data-slice-offset-interval-end")).toEqual("596125");
    });
});
