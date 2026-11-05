/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { readSchemaOf, requireDatasetSchema } from "@common/components/edit-schema-table/schema-editor.mock";
import { parseYamlAs } from "@common/helpers/untyped-boundary.helpers";
import { SetLicense } from "@api/kamu.graphql.interface";
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

    /** Text YAML would read as syntax if it were written unquoted. */
    const TRICKY_TEXTS = [
        "Prices: daily close",
        "#hashtag",
        "- starts like a list item",
        "yes",
        "123",
        "null",
        'it\'s "quoted"',
        "first line\nsecond line",
        "  leading and trailing spaces  ",
        "{ looks: like a map }",
        "[looks, like, a list]",
        "& * ! | > % @ `",
    ];

    TRICKY_TEXTS.forEach((text) => {
        it(`should keep ${JSON.stringify(text)} as typed in a SetInfo event`, () => {
            const yaml = service.buildYamlSetInfoEvent(text, [text, "plain"]);

            const event = parseYamlAs<{ content: { description: string; keywords: string[] } }>(yaml);
            expect(event.content.description).toBe(text);
            expect(event.content.keywords).toEqual([text, "plain"]);
        });

        it(`should keep ${JSON.stringify(text)} as typed in a SetLicense event`, () => {
            const license: Omit<SetLicense, "__typename"> = {
                name: text,
                shortName: text,
                websiteUrl: "https://example.com/license?a=1#b",
                spdxId: text,
            };

            const yaml = service.buildYamlSetLicenseEvent(license);

            expect(parseYamlAs<{ content: Omit<SetLicense, "__typename"> }>(yaml).content).toEqual({
                kind: "SetLicense",
                ...license,
            });
        });
    });

    it("should leave out an empty description and keyword list from a SetInfo event", () => {
        expect(service.buildYamlSetInfoEvent("", [])).toBe(
            "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: SetInfo\n",
        );
    });

    it("should leave out a missing license identifier from a SetLicense event", () => {
        expect(
            service.buildYamlSetLicenseEvent({
                name: "MIT",
                shortName: "MIT",
                websiteUrl: "https://mit.edu",
                spdxId: null,
            }),
        ).toBe(
            "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: SetLicense\n  name: MIT\n  shortName: MIT\n" +
                "  websiteUrl: https://mit.edu\n",
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
        const fields: DataSchemaField[] = [
            { name: "id", type: { kind: OdfTypes.Int64 } },
            {
                name: "address",
                type: {
                    kind: OdfTypes.Struct,
                    fields: [{ name: "city", type: { kind: OdfTypes.String } }],
                },
            },
        ];
        const params = {
            fetch: { kind: FetchKind.URL, url: "http://example.com" },
            read: { kind: ReadKind.CSV, schema: fields },
            merge: { kind: MergeKind.APPEND },
        };
        const yaml = service.buildYamlSetPollingSourceEvent(params, null);
        const schema = readSchemaOf(yaml);
        expect(requireDatasetSchema(schema).fields).toEqual(fields);
        expect(Array.isArray(schema)).toBe(false);
    });

    it("should emit read.schema as { fields } object form for push source", () => {
        const fields: DataSchemaField[] = [{ name: "id", type: { kind: OdfTypes.Int64 } }];
        const params = {
            sourceName: "test",
            read: { kind: ReadKind.CSV, schema: fields },
            merge: { kind: MergeKind.APPEND },
        };
        const yaml = service.buildYamlAddPushSourceEvent(params, null);
        const schema = readSchemaOf(yaml);
        expect(requireDatasetSchema(schema).fields).toEqual(fields);
        expect(Array.isArray(schema)).toBe(false);
    });

    it("should pass through read.schema unchanged when schema is empty for polling source", () => {
        const emptyFields: DataSchemaField[] = [];
        const params = {
            fetch: { kind: FetchKind.URL, url: "http://example.com" },
            read: { kind: ReadKind.CSV, schema: emptyFields },
            merge: { kind: MergeKind.APPEND },
        };
        const yaml = service.buildYamlSetPollingSourceEvent(params, null);
        expect(readSchemaOf(yaml)).toEqual([]);
    });

    it("should round-trip a field name with spaces through buildYamlSetPollingSourceEvent", () => {
        const schemaWithSpace: DataSchemaField[] = [
            { name: "id", type: { kind: OdfTypes.Int64 } },
            { name: "full name", type: { kind: OdfTypes.String } },
        ];
        const params = {
            fetch: { kind: FetchKind.URL, url: "http://example.com" },
            read: { kind: ReadKind.CSV, schema: schemaWithSpace },
            merge: { kind: MergeKind.APPEND },
        };
        const yaml = service.buildYamlSetPollingSourceEvent(params, null);
        const schema = readSchemaOf(yaml);
        expect(requireDatasetSchema(schema).fields).toEqual(schemaWithSpace);
        expect(Array.isArray(schema)).toBe(false);
    });

    it("should round-trip a field name with spaces through buildYamlAddPushSourceEvent", () => {
        const schemaWithSpace: DataSchemaField[] = [
            { name: "id", type: { kind: OdfTypes.Int64 } },
            { name: "full name", type: { kind: OdfTypes.String } },
        ];
        const params = {
            sourceName: "test",
            read: { kind: ReadKind.CSV, schema: schemaWithSpace },
            merge: { kind: MergeKind.APPEND },
        };
        const yaml = service.buildYamlAddPushSourceEvent(params, null);
        const schema = readSchemaOf(yaml);
        expect(requireDatasetSchema(schema).fields).toEqual(schemaWithSpace);
        expect(Array.isArray(schema)).toBe(false);
    });
});
