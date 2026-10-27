/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import {
    DecompressFormat,
    EventTimeSourceKind,
    FetchKind,
    MergeKind,
    PrepareKind,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import {
    PollingSourceFormValue,
    ProcessFormService,
} from "src/app/dataset-view/additional-components/metadata-component/services/process-form.service";

describe("ProcessFormService", () => {
    let service: ProcessFormService;

    const read: PollingSourceFormValue["read"] = {
        kind: ReadKind.CSV,
        header: false,
        separator: ",",
        nullValue: "",
    };
    const merge: PollingSourceFormValue["merge"] = { kind: MergeKind.LEDGER, primaryKey: ["id"], compareColumns: [] };

    function pollingSourceValue(fetch: PollingSourceFormValue["fetch"]): PollingSourceFormValue {
        return { fetch, prepare: [], read, merge };
    }

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProcessFormService);
    });

    it("should leave out empty fields, an unset order and an unchecked cache", () => {
        const event = service.pollingSourceEvent(
            pollingSourceValue({
                kind: FetchKind.URL,
                url: "https://example.com/data.csv",
                headers: [],
                eventTime: { kind: EventTimeSourceKind.FROM_METADATA, pattern: "", timestampFormat: "" },
                cache: false,
                order: SourceOrder.NONE,
            }),
        );

        expect(event).toEqual({
            fetch: {
                kind: FetchKind.URL,
                url: "https://example.com/data.csv",
                eventTime: { kind: EventTimeSourceKind.FROM_METADATA },
            },
            read: { kind: ReadKind.CSV, separator: "," },
            merge: { kind: MergeKind.LEDGER, primaryKey: ["id"] },
        });
    });

    it("should cache forever when caching is checked, and keep the path pattern of an event time from the path", () => {
        const event = service.pollingSourceEvent(
            pollingSourceValue({
                kind: FetchKind.FILES_GLOB,
                path: "/data/*.csv",
                eventTime: { kind: EventTimeSourceKind.FROM_PATH, pattern: "(\\d+).csv", timestampFormat: "" },
                cache: true,
                order: SourceOrder.BY_NAME,
            }),
        );

        expect(event.fetch).toEqual({
            kind: FetchKind.FILES_GLOB,
            path: "/data/*.csv",
            eventTime: { kind: EventTimeSourceKind.FROM_PATH, pattern: "(\\d+).csv" },
            cache: { kind: "Forever" },
            order: SourceOrder.BY_NAME,
        });
    });

    it("should leave out the event time of a fetch kind that takes none", () => {
        const event = service.pollingSourceEvent(
            pollingSourceValue({
                kind: FetchKind.CONTAINER,
                image: "ghcr.io/kamu-data/fetch:latest",
                eventTime: { kind: EventTimeSourceKind.FROM_METADATA },
                args: ["--all"],
            }),
        );

        expect(event.fetch).toEqual({
            kind: FetchKind.CONTAINER,
            image: "ghcr.io/kamu-data/fetch:latest",
            args: ["--all"],
        });
    });

    it("should keep numbers typed into number fields and leave out an empty topic quality of service", () => {
        const event = service.pollingSourceEvent(
            pollingSourceValue({
                kind: FetchKind.MQTT,
                host: "broker.example.com",
                port: 1883,
                topics: [
                    { path: "sensors/a", qos: "" },
                    { path: "sensors/b", qos: "AtLeastOnce" },
                ],
            }),
        );

        expect(event.fetch).toEqual({
            kind: FetchKind.MQTT,
            host: "broker.example.com",
            port: 1883,
            topics: [{ path: "sensors/a" }, { path: "sensors/b", qos: "AtLeastOnce" }],
        });
    });

    it("should leave out a number field the user never filled", () => {
        const event = service.pollingSourceEvent(
            pollingSourceValue({ kind: FetchKind.ETHEREUM_LOGS, chainId: "", nodeUrl: "https://node.example.com" }),
        );

        expect(event.fetch).toEqual({ kind: FetchKind.ETHEREUM_LOGS, nodeUrl: "https://node.example.com" });
    });

    it("should split a pipe command into arguments and leave out an empty decompress path", () => {
        const event = service.pollingSourceEvent({
            ...pollingSourceValue({ kind: FetchKind.URL, url: "https://example.com/data.zip" }),
            prepare: [
                { kind: PrepareKind.PIPE, command: "sed -e '1,/OBSERVATION/d'" },
                { kind: PrepareKind.DECOMPRESS, format: DecompressFormat.ZIP, subPath: "" },
            ],
        });

        expect(event.prepare).toEqual([
            { kind: PrepareKind.PIPE, command: ["sed", "-e", "'1,/OBSERVATION/d'"] },
            { kind: PrepareKind.DECOMPRESS, format: DecompressFormat.ZIP },
        ]);
    });

    it("should leave out the prepare step when it has no steps", () => {
        const event = service.pollingSourceEvent(pollingSourceValue({ kind: FetchKind.URL, url: "https://a.b" }));

        expect("prepare" in event).toBe(false);
    });

    it("should build a push source event from its name, read and merge steps", () => {
        const event = service.pushSourceEvent({ sourceName: "device", read, merge });

        expect(event).toEqual({
            sourceName: "device",
            read: { kind: ReadKind.CSV, separator: "," },
            merge: { kind: MergeKind.LEDGER, primaryKey: ["id"] },
        });
    });
});
