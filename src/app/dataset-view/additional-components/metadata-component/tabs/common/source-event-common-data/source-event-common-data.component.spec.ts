/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { SetPollingSourceEventFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { mockSetPollingSourceEvent } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";
import { SourceEventCommonDataComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/common/source-event-common-data/source-event-common-data.component";
import { SourceEventCommonDataHarness } from "src/app/dataset-view/additional-components/metadata-component/tabs/common/source-event-common-data/source-event-common-data.harness";

function withCsvFlags(header: MaybeNull<boolean>, inferSchema: MaybeNull<boolean>): SetPollingSourceEventFragment {
    const read = mockSetPollingSourceEvent.read;
    if (read.__typename !== "ReadStepCsv") {
        throw new Error("Expecting a CSV read step in the mock");
    }
    return { ...mockSetPollingSourceEvent, read: { ...read, header, inferSchema } };
}

describe("SourceEventCommonDataComponent", () => {
    let component: SourceEventCommonDataComponent;
    let fixture: ComponentFixture<SourceEventCommonDataComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SourceEventCommonDataComponent, SharedTestModule],
            providers: [HIGHLIGHT_OPTIONS_PROVIDER, provideToastr()],
        });
        fixture = TestBed.createComponent(SourceEventCommonDataComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "sourceEvent", mockSetPollingSourceEvent);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show the default 'false' for CSV flags that are not set", async () => {
        setComponentInput(fixture, "sourceEvent", withCsvFlags(null, null));
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SourceEventCommonDataHarness);

        expect(await harness.getCsvHeader()).toEqual("false");
        expect(await harness.getCsvInferSchema()).toEqual("false");
    });

    it("should show CSV flags that are set, false included", async () => {
        setComponentInput(fixture, "sourceEvent", withCsvFlags(true, false));
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SourceEventCommonDataHarness);

        expect(await harness.getCsvHeader()).toEqual("true");
        expect(await harness.getCsvInferSchema()).toEqual("false");
    });

    it("should show the settings of a newline-delimited JSON read step", async () => {
        setComponentInput(fixture, "sourceEvent", {
            ...mockSetPollingSourceEvent,
            read: {
                __typename: "ReadStepNdJson",
                encoding: "utf8",
                dateFormat: null,
                timestampFormat: null,
                schema: null,
            },
        });
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SourceEventCommonDataHarness);

        expect(await harness.getNdJsonEncoding()).toEqual("utf8");
    });
});
