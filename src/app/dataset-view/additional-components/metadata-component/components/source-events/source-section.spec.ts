/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { requireValue } from "@common/helpers/app.helpers";

import {
    EventTimeSourceKind,
    FetchKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { FetchControls } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import {
    SourceSection,
    textControl,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { FETCH_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/fetch-form-data";

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

    it("should lay out the controls the config lists for a kind", () => {
        expect(section.layout(FetchKind.FILES_GLOB).map(({ name }) => name)).toEqual([
            "path",
            "order",
            "eventTime",
            "cache",
        ]);
    });

    it("should replace the controls when another kind is selected, keeping the kept ones with their value", () => {
        requireValue(form.controls.url).setValue("https://example.com");
        requireValue(form.controls.eventTime).controls.kind.setValue(EventTimeSourceKind.FROM_SYSTEM_TIME);

        form.controls.kind.setValue(FetchKind.FILES_GLOB);

        expect(form.getRawValue()).toEqual({
            kind: FetchKind.FILES_GLOB,
            eventTime: { kind: EventTimeSourceKind.FROM_SYSTEM_TIME },
            path: "",
            order: "NONE",
            cache: false,
        });
    });

    it("should not let a kept control the selected kind does not list block the form", () => {
        const eventTime = requireValue(form.controls.eventTime);
        eventTime.controls.kind.setValue(EventTimeSourceKind.FROM_PATH);
        eventTime.addControl("pattern", textControl("", [Validators.required]));

        form.controls.kind.setValue(FetchKind.CONTAINER);
        requireValue(form.controls.image).setValue("ghcr.io/kamu-data/fetch:latest");
        expect(eventTime.disabled).toBe(true);
        expect(form.valid).toBe(true);

        form.controls.kind.setValue(FetchKind.URL);
        expect(eventTime.enabled).toBe(true);
        expect(form.valid).toBe(false);
    });

    it("should keep the controls and their values when the same kind is selected again", () => {
        requireValue(form.controls.url).setValue("https://example.com");

        form.controls.kind.setValue(FetchKind.URL);

        expect(form.controls.url?.value).toEqual("https://example.com");
    });

    it("should hold only the kept controls for a kind the config has no entry for", () => {
        const urlOnlyForm = new FormGroup<FetchControls>({
            kind: new FormControl(FetchKind.URL, { nonNullable: true }),
        });
        new SourceSection(
            urlOnlyForm,
            urlOnlyForm.controls.kind,
            { [FetchKind.URL]: FETCH_FORM_DATA[FetchKind.URL] },
            TestBed.inject(DestroyRef),
            ["eventTime"],
        );

        urlOnlyForm.controls.kind.setValue(FetchKind.FILES_GLOB);

        expect(Object.keys(urlOnlyForm.controls)).toEqual(["kind", "eventTime"]);
    });
});
