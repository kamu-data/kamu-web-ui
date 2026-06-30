/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { parse } from "yaml";

import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import {
    FetchKind,
    MergeKind,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { mockPreprocessStepValue, mockSetPollingSourceEditFormWithReadNdJsonFormat } from "src/app/search/mock.data";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";

describe("TemplatesYamlEventsService", () => {
    let service: TemplatesYamlEventsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TemplatesYamlEventsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check call buildYamlSetInfoEvent()", () => {
        const result = service.buildYamlSetInfoEvent("mock description", ["mock-keyword"]);
        expect(result).toBe(
            "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: SetInfo\n" +
                `  description: mock description\n` +
                `  keywords:\n` +
                `    - mock-keyword\n`,
        );
    });

    it("should check yaml SetPollingSource event normalize", () => {
        const result = service.buildYamlSetPollingSourceEvent(
            mockSetPollingSourceEditFormWithReadNdJsonFormat,
            mockPreprocessStepValue,
        );
        expect(result).not.toContain("subPath");
        expect(result).not.toContain("jsonKind");
    });

    it("should emit read.schema as { fields } object form for polling source", () => {
        const params = {
            fetch: { kind: FetchKind.URL, url: "http://example.com" },
            read: {
                kind: ReadKind.CSV,
                schema: [
                    { name: "id", type: { kind: OdfTypes.Int64 } },
                    {
                        name: "address",
                        type: {
                            kind: OdfTypes.Struct,
                            fields: [{ name: "city", type: { kind: OdfTypes.String } }],
                        },
                    },
                ] as DataSchemaField[],
            },
            merge: { kind: MergeKind.APPEND },
        };
        const yaml = service.buildYamlSetPollingSourceEvent(params, null);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = parse(yaml);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(parsed.content.read.schema.fields).toEqual(params.read.schema);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(Array.isArray(parsed.content.read.schema)).toBeFalse();
    });

    it("should emit read.schema as { fields } object form for push source", () => {
        const params = {
            sourceName: "test",
            read: {
                kind: ReadKind.CSV,
                schema: [{ name: "id", type: { kind: OdfTypes.Int64 } }] as DataSchemaField[],
            },
            merge: { kind: MergeKind.APPEND },
        };
        const yaml = service.buildYamlAddPushSourceEvent(params, null);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = parse(yaml);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(parsed.content.read.schema.fields).toEqual(params.read.schema);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(Array.isArray(parsed.content.read.schema)).toBeFalse();
    });

    it("should pass through read.schema unchanged when schema is empty for polling source", () => {
        const params = {
            fetch: { kind: FetchKind.URL, url: "http://example.com" },
            read: { kind: ReadKind.CSV, schema: [] as DataSchemaField[] },
            merge: { kind: MergeKind.APPEND },
        };
        const yaml = service.buildYamlSetPollingSourceEvent(params, null);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = parse(yaml);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(parsed.content.read.schema).toEqual([]);
    });
});
