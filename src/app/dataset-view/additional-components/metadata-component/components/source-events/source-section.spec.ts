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
    ControlType,
    EventTimeSourceKind,
    FetchKind,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    FetchControls,
    ReadControls,
    SourceField,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import {
    eventTimeControl,
    SourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { FETCH_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/fetch-form-data";
import { READ_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/read-form-data";

function fieldNamed(fields: readonly SourceField[], name: string): SourceField {
    return requireValue(
        fields.find((field) => field.name === name),
        `No field "${name}"`,
    );
}

describe("SourceSection", () => {
    let form: FormGroup<FetchControls>;
    let section: SourceSection<FetchControls>;

    beforeEach(() => {
        form = new FormGroup<FetchControls>({ kind: new FormControl(FetchKind.URL, { nonNullable: true }) });
        section = new SourceSection(form, form.controls.kind, FETCH_FORM_DATA, TestBed.inject(DestroyRef), [
            "eventTime",
        ]);
    });

    it("should add the controls of the initial kind", () => {
        expect(Object.keys(form.controls)).toEqual(["kind", "url", "eventTime", "headers", "cache"]);
    });

    it("should list the fields of the selected kind, each bound to the form's control", () => {
        form.controls.kind.setValue(FetchKind.FILES_GLOB);

        expect(section.fields.map(({ name }) => name)).toEqual(["path", "order", "eventTime", "cache"]);
        section.fields.forEach((field) => {
            expect(field.control).toBe(form.get(field.name));
        });
    });

    it("should build the fields only when the kind changes", () => {
        const urlFields = section.fields;

        expect(section.fields).toBe(urlFields);
        form.controls.kind.setValue(FetchKind.URL);
        expect(section.fields).toBe(urlFields);

        form.controls.kind.setValue(FetchKind.FILES_GLOB);
        expect(section.fields).not.toBe(urlFields);
    });

    it("should add the config's required flag and validators to the control", () => {
        const url = requireValue(form.controls.url);

        expect(url.hasError("required")).toBe(true);
        url.setValue("example.com");
        expect(url.hasError("url")).toBe(true);
        url.setValue("https://example.com");
        expect(url.valid).toBe(true);
    });

    it("should replace the controls when another kind is selected, keeping the kept ones with their value", () => {
        requireValue(form.controls.url).setValue("https://example.com");
        requireValue(form.controls.eventTime).controls.kind.setValue(EventTimeSourceKind.FROM_SYSTEM_TIME);

        form.controls.kind.setValue(FetchKind.FILES_GLOB);

        expect(form.getRawValue()).toEqual({
            kind: FetchKind.FILES_GLOB,
            eventTime: { kind: EventTimeSourceKind.FROM_SYSTEM_TIME, pattern: "", timestampFormat: "" },
            path: "",
            order: "NONE",
            cache: false,
        });
    });

    it("should bind the field of a kept control to the control already in the form", () => {
        const eventTime = requireValue(form.controls.eventTime);

        form.controls.kind.setValue(FetchKind.FILES_GLOB);

        expect(fieldNamed(section.fields, "eventTime").control).toBe(eventTime);
    });

    it("should disable a kept control the selected kind does not list, keeping its value", () => {
        const eventTime = requireValue(form.controls.eventTime);
        eventTime.controls.kind.setValue(EventTimeSourceKind.FROM_SYSTEM_TIME);

        form.controls.kind.setValue(FetchKind.CONTAINER);
        requireValue(form.controls.image).setValue("ghcr.io/kamu-data/fetch:latest");
        expect(eventTime.disabled).toBe(true);
        expect(form.valid).toBe(true);

        form.controls.kind.setValue(FetchKind.URL);
        expect(eventTime.enabled).toBe(true);
        expect(eventTime.controls.kind.value).toBe(EventTimeSourceKind.FROM_SYSTEM_TIME);
    });

    it("should keep the controls and their values when the same kind is selected again", () => {
        requireValue(form.controls.url).setValue("https://example.com");

        form.controls.kind.setValue(FetchKind.URL);

        expect(form.controls.url?.value).toEqual("https://example.com");
    });

    it("should stop revalidating a removed control once another kind is selected", () => {
        form.controls.kind.setValue(FetchKind.ETHEREUM_LOGS);
        const removedNodeUrl = requireValue(form.controls.nodeUrl);
        const removedChainId = requireValue(form.controls.chainId);
        const revalidate = vi.spyOn(removedChainId, "updateValueAndValidity");

        form.controls.kind.setValue(FetchKind.URL);
        removedNodeUrl.setValue("wss://old.example.com");
        expect(revalidate).not.toHaveBeenCalled();

        form.controls.kind.setValue(FetchKind.ETHEREUM_LOGS);
        requireValue(form.controls.nodeUrl).setValue("wss://node.example.com");
        expect(requireValue(form.controls.chainId).valid).toBe(true);
    });

    it("should hold only the kept controls for a kind the config has no entry for", () => {
        const urlOnlyForm = new FormGroup<FetchControls>({
            kind: new FormControl(FetchKind.URL, { nonNullable: true }),
        });
        const urlOnlySection = new SourceSection(
            urlOnlyForm,
            urlOnlyForm.controls.kind,
            { [FetchKind.URL]: FETCH_FORM_DATA[FetchKind.URL] },
            TestBed.inject(DestroyRef),
            ["eventTime"],
        );

        urlOnlyForm.controls.kind.setValue(FetchKind.FILES_GLOB);

        expect(Object.keys(urlOnlyForm.controls)).toEqual(["kind", "eventTime"]);
        expect(urlOnlySection.fields).toEqual([]);
    });

    describe("read step with JSON", () => {
        let readForm: FormGroup<ReadControls>;
        let readSection: SourceSection<ReadControls>;

        beforeEach(() => {
            readForm = new FormGroup<ReadControls>({
                kind: new FormControl(ReadKind.All_JSON, { nonNullable: true }),
            });
            readSection = new SourceSection(
                readForm,
                readForm.controls.kind,
                READ_FORM_DATA,
                TestBed.inject(DestroyRef),
            );
        });

        it("should add the path to the data file as a text field", () => {
            const subPath = fieldNamed(readSection.fields, "subPath");

            expect(subPath.type).toBe(ControlType.TEXT);
            expect(subPath.control).toBe(readForm.controls.subPath);
        });

        it("should show the path only while the format is JSON", () => {
            const subPath = fieldNamed(readSection.fields, "subPath");
            expect(readForm.controls.jsonKind?.value).toBe(ReadKind.JSON);
            expect(subPath.shown()).toBe(true);

            requireValue(readForm.controls.jsonKind).setValue(ReadKind.ND_JSON);
            expect(subPath.shown()).toBe(false);
            expect(readForm.controls.subPath).toBeDefined();

            requireValue(readForm.controls.jsonKind).setValue(ReadKind.JSON);
            expect(subPath.shown()).toBe(true);
        });

        it("should show a field with no condition always", () => {
            expect(fieldNamed(readSection.fields, "jsonKind").shown()).toBe(true);
        });
    });
});

describe("eventTimeControl", () => {
    it("should be valid from metadata with an empty pattern", () => {
        const group = eventTimeControl()([]);

        expect(group.controls.kind.value).toBe(EventTimeSourceKind.FROM_METADATA);
        expect(group.valid).toBe(true);
    });

    it("should require the pattern only from path", () => {
        const group = eventTimeControl()([]);

        group.controls.kind.setValue(EventTimeSourceKind.FROM_PATH);
        expect(group.controls.pattern.errors).toEqual({ required: true });
        expect(group.valid).toBe(false);

        group.controls.pattern.setValue("(\\d+).csv");
        expect(group.valid).toBe(true);

        group.controls.pattern.setValue("");
        group.controls.kind.setValue(EventTimeSourceKind.FROM_SYSTEM_TIME);
        expect(group.controls.pattern.errors).toBeNull();
        expect(group.valid).toBe(true);
    });

    it("should stay disabled from path with an empty pattern, and come back valid from metadata", () => {
        const group = eventTimeControl()([]);
        group.controls.kind.setValue(EventTimeSourceKind.FROM_PATH);

        group.disable();
        expect(group.disabled).toBe(true);

        group.controls.kind.setValue(EventTimeSourceKind.FROM_METADATA);
        group.enable();
        expect(group.valid).toBe(true);
    });

    it("should drop the check of an invalid pattern once the kind no longer shows it", () => {
        const group = eventTimeControl()([]);
        group.controls.kind.setValue(EventTimeSourceKind.FROM_PATH);
        group.controls.pattern.setValue("data-(.*");
        expect(group.valid).toBe(false);

        group.controls.kind.setValue(EventTimeSourceKind.FROM_METADATA);
        expect(group.valid).toBe(true);
    });

    it("should give each call its own group", () => {
        const factory = eventTimeControl();

        expect(factory([])).not.toBe(factory([]));
    });
});
