/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { requireValue } from "@common/helpers/app.helpers";

import {
    EventTimeSourceKind,
    FetchKind,
    MergeKind,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    FetchControls,
    MergeControls,
    ReadControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import {
    listItemControl,
    nameValueGroup,
    SourceSection,
    topicGroup,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { FETCH_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/fetch-form-data";
import { MERGE_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/merge-form-data";
import { READ_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/read-form-data";

// The rules each source step's config gives its fields, checked on the controls a real section builds.
describe("Source event step rules", () => {
    function fetchForm(kind: FetchKind): FormGroup<FetchControls> {
        const form = new FormGroup<FetchControls>({ kind: new FormControl(kind, { nonNullable: true }) });
        new SourceSection(form, form.controls.kind, FETCH_FORM_DATA, TestBed.inject(DestroyRef), ["eventTime"]);
        return form;
    }

    function readForm(kind: ReadKind): FormGroup<ReadControls> {
        const form = new FormGroup<ReadControls>({ kind: new FormControl(kind, { nonNullable: true }) });
        new SourceSection(form, form.controls.kind, READ_FORM_DATA, TestBed.inject(DestroyRef));
        return form;
    }

    function mergeForm(kind: MergeKind): FormGroup<MergeControls> {
        const form = new FormGroup<MergeControls>({ kind: new FormControl(kind, { nonNullable: true }) });
        new SourceSection(form, form.controls.kind, MERGE_FORM_DATA, TestBed.inject(DestroyRef));
        return form;
    }

    describe("MQTT", () => {
        [-5, 0, 1.5, 70000].forEach((port) => {
            it(`should reject port ${port}`, () => {
                const port$ = requireValue(fetchForm(FetchKind.MQTT).controls.port);
                port$.setValue(port);
                expect(port$.valid).toBe(false);
            });
        });

        [1, 1883, 65535].forEach((port) => {
            it(`should accept port ${port}`, () => {
                const port$ = requireValue(fetchForm(FetchKind.MQTT).controls.port);
                port$.setValue(port);
                expect(port$.valid).toBe(true);
            });
        });

        it("should require at least one topic and reject a repeated path", () => {
            const topics = requireValue(fetchForm(FetchKind.MQTT).controls.topics);
            expect(topics.errors).toEqual({ required: true });

            topics.push(topicGroup("sensors/a"));
            topics.push(topicGroup("sensors/a"));
            expect(topics.errors).toEqual({ duplicateItems: { value: "sensors/a" } });
        });
    });

    describe("Url", () => {
        ["https://example.com/data.csv", "ftp://example.com/data.csv"].forEach((url) => {
            it(`should accept ${url}`, () => {
                const url$ = requireValue(fetchForm(FetchKind.URL).controls.url);
                url$.setValue(url);
                expect(url$.valid).toBe(true);
            });
        });

        ["example.com/data.csv", "file:///etc/passwd", "http://"].forEach((url) => {
            it(`should reject ${url}`, () => {
                const url$ = requireValue(fetchForm(FetchKind.URL).controls.url);
                url$.setValue(url);
                expect(url$.errors).toEqual({ url: { schemes: ["http", "https", "ftp", "ftps"] } });
            });
        });

        it("should reject a repeated header name and a header without a name", () => {
            const headers = requireValue(fetchForm(FetchKind.URL).controls.headers);
            headers.push(nameValueGroup("", "x"));
            expect(headers.valid).toBe(false);

            headers.at(0).controls.name.setValue("Accept");
            headers.push(nameValueGroup("Accept", "y"));
            expect(headers.errors).toEqual({ duplicateItems: { value: "Accept" } });
        });
    });

    describe("Ethereum logs", () => {
        it("should require a chain id or a node URL", () => {
            const form = fetchForm(FetchKind.ETHEREUM_LOGS);
            const chainId = requireValue(form.controls.chainId);
            const nodeUrl = requireValue(form.controls.nodeUrl);
            expect(form.valid).toBe(false);

            nodeUrl.setValue("wss://node.example.com");
            expect(chainId.valid).toBe(true);
            expect(form.valid).toBe(true);

            nodeUrl.setValue("");
            chainId.setValue(1);
            expect(form.valid).toBe(true);
        });

        it("should reject a chain id that is not a positive whole number", () => {
            const chainId = requireValue(fetchForm(FetchKind.ETHEREUM_LOGS).controls.chainId);
            chainId.setValue(0);
            expect(chainId.errors).toEqual({ min: { min: 1, actual: 0 } });
            chainId.setValue(1.5);
            expect(chainId.errors).toEqual({ integer: true });
        });
    });

    describe("Event time", () => {
        it("should reject a pattern that is not a regular expression", () => {
            const eventTime = requireValue(fetchForm(FetchKind.URL).controls.eventTime);
            eventTime.controls.kind.setValue(EventTimeSourceKind.FROM_PATH);
            eventTime.controls.pattern.setValue("data-(.*");
            expect(eventTime.controls.pattern.errors).toEqual({
                format: { message: "must be a valid regular expression" },
            });
        });
    });

    describe("CSV", () => {
        it("should require a separator and a quote of exactly one character", () => {
            const form = readForm(ReadKind.CSV);
            const separator = requireValue(form.controls.separator);
            const quote = requireValue(form.controls.quote);

            separator.setValue("");
            expect(separator.errors).toEqual({ required: true });
            separator.setValue(",;");
            expect(separator.errors).toEqual({ singleChar: true });
            quote.setValue("");
            expect(quote.errors).toEqual({ required: true });
        });

        it("should allow an empty escape character", () => {
            const escape = requireValue(readForm(ReadKind.CSV).controls.escape);
            escape.setValue("");
            expect(escape.valid).toBe(true);
        });
    });

    describe("Merge strategies", () => {
        [MergeKind.LEDGER, MergeKind.SNAPSHOT, MergeKind.CHANGELOG_STREAM, MergeKind.UPSERT_STREAM].forEach((kind) => {
            it(`should require a primary key without repeated columns for ${kind}`, () => {
                const primaryKey = requireValue(mergeForm(kind).controls.primaryKey);
                expect(primaryKey.errors).toEqual({ required: true });

                primaryKey.push(listItemControl("id"));
                primaryKey.push(listItemControl("id"));
                expect(primaryKey.errors).toEqual({ duplicateItems: { value: "id" } });
            });
        });
    });
});
