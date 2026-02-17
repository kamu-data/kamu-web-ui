/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FetchStepMqtt, FetchStepUrl, PrepStepDecompress } from "@api/kamu.graphql.interface";
import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import { getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { provideToastr } from "ngx-toastr";
import { SetPollingSourceEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-polling-source-event/set-polling-source-event.component";
import {
    mockSetPollingSourceEvent,
    mockSetPollingSourceEventWithFetchStepMqtt,
} from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

describe("SetPollingSourceEventComponent", () => {
    let component: SetPollingSourceEventComponent;
    let fixture: ComponentFixture<SetPollingSourceEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SetPollingSourceEventComponent],
            providers: [HIGHLIGHT_OPTIONS_PROVIDER, provideToastr()],
        }).compileComponents();

        fixture = TestBed.createComponent(SetPollingSourceEventComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check render event data", () => {
        component.event = Object.assign({}, mockSetPollingSourceEvent, {
            unsupportedKey: { name: "" },
        });
        fixture.detectChanges();
        const url = getElementByDataTestId(fixture, "setPollingSource-fetchStepUrl-url");
        expect(url.innerText).toEqual((mockSetPollingSourceEvent.fetch as FetchStepUrl).url);

        const schema = getElementByDataTestId(fixture, "setPollingSource-readStepCsv-schema");
        expect(schema).toBeDefined();

        const header = getElementByDataTestId(fixture, "setPollingSource-readStepCsv-header");
        expect(Boolean(header.innerText)).toEqual(true);

        const mergeStrategyType = getElementByDataTestId(fixture, "setPollingSource-mergeStrategyLedger-__typename");
        expect(mergeStrategyType.textContent).toEqual("(Ledger strategy)");

        const primaryKey = getElementByDataTestId(fixture, "setPollingSource-mergeStrategyLedger-primaryKey-0");
        expect(primaryKey.textContent).toEqual("id ");

        const engine = getElementByDataTestId(fixture, "setPollingSource-transformSql-engine");
        expect(engine.textContent).toEqual("Apache Spark (spark)");

        const queries = getElementByDataTestId(fixture, "setPollingSource-transformSql-queries");
        expect(queries).toBeDefined();

        const prepareFormat = getElementByDataTestId(fixture, "setPollingSource-prepStepDecompress-format");
        expect(prepareFormat.textContent).toEqual(
            (mockSetPollingSourceEvent.prepare as PrepStepDecompress[])[0].format,
        );

        const prepareSubPath = getElementByDataTestId(fixture, "setPollingSource-prepStepDecompress-subPath");
        expect(prepareSubPath.textContent).toEqual(
            (mockSetPollingSourceEvent.prepare as PrepStepDecompress[])[0].subPath ?? "",
        );

        const unsupportedSection = getElementByDataTestId(fixture, "unsupported-section");
        expect(unsupportedSection).toBeDefined();
    });

    it("should check render unsupported section", () => {
        component.event = Object.assign({}, mockSetPollingSourceEvent, {
            unsupportedKey: { name: "" },
        });
        fixture.detectChanges();
        const unsupportedSection = getElementByDataTestId(fixture, "unsupported-section");
        expect(unsupportedSection).toBeDefined();
    });

    it("should check render event data with FetchStepMqtt", () => {
        const fetchStep = mockSetPollingSourceEventWithFetchStepMqtt.fetch as FetchStepMqtt;
        component.event = mockSetPollingSourceEventWithFetchStepMqtt;
        fixture.detectChanges();
        const host = getElementByDataTestId(fixture, "setPollingSource-FetchStepMqtt-host");
        expect(host.innerText).toEqual(fetchStep.host);

        const port = getElementByDataTestId(fixture, "setPollingSource-FetchStepMqtt-port");
        expect(port.innerText).toEqual(fetchStep.port.toString());

        const username = getElementByDataTestId(fixture, "setPollingSource-FetchStepMqtt-username");
        expect(username.innerText).toEqual(fetchStep.username as string);

        const password = getElementByDataTestId(fixture, "setPollingSource-FetchStepMqtt-password");
        expect(password.innerText).toEqual(fetchStep.password as string);
    });
});
