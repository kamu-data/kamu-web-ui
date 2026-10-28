/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

import { Apollo } from "apollo-angular";

import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import { mockSetPollingSourceEventYaml } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import {
    AddPollingSourceEditFormType,
    DecompressFormat,
    EventTimeSourceKind,
    FetchKind,
    MergeKind,
    PrepareKind,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
import {
    FetchControls,
    MergeControls,
    PrepareStepForm,
    ReadControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { SourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { FETCH_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/fetch-form-data";
import { MERGE_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/merge-form-data";
import { READ_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/read-form-data";
import { mockParseSetPollingSourceEventFromYamlToObject } from "src/app/search/mock.data";

describe("EditPollingSourceService", () => {
    let service: EditPollingSourceService;
    let destroyRef: DestroyRef;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(EditPollingSourceService);
        destroyRef = TestBed.inject(DestroyRef);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check parse event from yaml to json", () => {
        const mockEventYaml =
            "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-06-02T08:44:54.984731027Z\n  prevBlockHash: zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u\n  sequenceNumber: 1\n  event:\n    kind: SetPollingSource\n    fetch:\n      kind: FilesGlob\n      path: path\n      eventTime:\n        kind: FromMetadata\n    read:\n      kind: Csv\n      separator: ','\n      encoding: UTF-8\n      quote: '\"'\n      escape: \\\n      dateFormat: yyyy-MM-dd\n      timestampFormat: yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]\n    merge:\n      kind: Append\n";
        const result: AddPollingSourceEditFormType = mockParseSetPollingSourceEventFromYamlToObject;
        expect(service.parseEventFromYaml(mockEventYaml)).toEqual(result);
    });

    it("should normalize schema object from yaml to form fields", () => {
        const mockEventYaml = `
content:
  event:
    kind: SetPollingSource
    fetch:
      kind: FilesGlob
    read:
      kind: Csv
      schema:
        fields:
          - name: id
            type:
              kind: Int64
    merge:
      kind: Append
`;

        expect(service.parseEventFromYaml(mockEventYaml).read.schema).toEqual([
            { name: "id", type: { kind: OdfTypes.Int64 } },
        ]);
    });

    function fetchForm(): FormGroup<FetchControls> {
        const form = new FormGroup<FetchControls>({ kind: new FormControl(FetchKind.URL, { nonNullable: true }) });
        new SourceSection(form, form.controls.kind, FETCH_FORM_DATA, destroyRef, ["eventTime"]);
        return form;
    }

    function readForm(): FormGroup<ReadControls> {
        const form = new FormGroup<ReadControls>({ kind: new FormControl(ReadKind.CSV, { nonNullable: true }) });
        new SourceSection(form, form.controls.kind, READ_FORM_DATA, destroyRef, ["schema"]);
        return form;
    }

    function mergeForm(): FormGroup<MergeControls> {
        const form = new FormGroup<MergeControls>({ kind: new FormControl(MergeKind.APPEND, { nonNullable: true }) });
        new SourceSection(form, form.controls.kind, MERGE_FORM_DATA, destroyRef);
        return form;
    }

    it("should patch a url fetch step without headers", () => {
        const form = fetchForm();
        service.patchFetchStep(form, { kind: FetchKind.URL, url: "http://test.com" });

        expect(form.getRawValue()).toEqual({
            kind: FetchKind.URL,
            url: "http://test.com",
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA, pattern: "", timestampFormat: "" },
            headers: [],
            cache: false,
        });
        expect(form.valid).toBe(true);
    });

    it("should patch a url fetch step with its headers, cache and an event time from the path", () => {
        const form = fetchForm();
        service.patchFetchStep(form, {
            kind: FetchKind.URL,
            url: "http://test.com",
            headers: [{ name: "test_name", value: "test_value" }],
            cache: { kind: "Forever" },
            eventTime: { kind: EventTimeSourceKind.FROM_PATH, pattern: "(\\d+)" },
        });

        expect(form.getRawValue()).toEqual({
            kind: FetchKind.URL,
            url: "http://test.com",
            eventTime: { kind: EventTimeSourceKind.FROM_PATH, pattern: "(\\d+)", timestampFormat: "" },
            headers: [{ name: "test_name", value: "test_value" }],
            cache: true,
        });
        expect(form.controls.eventTime?.controls.pattern.enabled).toBe(true);
        expect(form.valid).toBe(true);
    });

    it("should switch the fetch step to a container and fill its lists", () => {
        const form = fetchForm();
        service.patchFetchStep(form, {
            kind: FetchKind.CONTAINER,
            image: "test_image",
            env: [{ name: "KEY", value: "value" }],
            command: ["-a"],
            args: ["arg1"],
        });

        expect(form.getRawValue()).toEqual({
            kind: FetchKind.CONTAINER,
            image: "test_image",
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA, pattern: "", timestampFormat: "" },
            command: ["-a"],
            args: ["arg1"],
            env: [{ name: "KEY", value: "value" }],
        });
    });

    it("should patch a csv read step and keep the schema from the event without a dataset", () => {
        const form = readForm();
        const schema: DataSchemaField[] = [{ name: "id", type: { kind: OdfTypes.Int64 } }];
        service.patchReadStep(form, { kind: ReadKind.CSV, separator: ";", schema }, null, destroyRef);

        expect(form.controls.kind.value).toEqual(ReadKind.CSV);
        expect(form.controls.separator?.value).toEqual(";");
        expect(form.controls.schema?.value).toEqual(schema);
    });

    it("should patch a json read step as the json kind with its format and path", () => {
        const form = readForm();
        service.patchReadStep(form, { kind: ReadKind.JSON, subPath: "items" }, null, destroyRef);

        expect(form.controls.kind.value).toEqual(ReadKind.All_JSON);
        expect(form.controls.jsonKind?.value).toEqual(ReadKind.JSON);
        expect(form.controls.subPath?.value).toEqual("items");
    });

    it("should patch a snapshot merge step with its keys", () => {
        const form = mergeForm();
        service.patchMergeStep(form, {
            kind: MergeKind.SNAPSHOT,
            primaryKey: ["id", "test"],
            compareColumns: ["id"],
        });

        expect(form.getRawValue()).toEqual({
            kind: MergeKind.SNAPSHOT,
            primaryKey: ["id", "test"],
            compareColumns: ["id"],
        });
    });

    it("should fill the prepare step from the event", () => {
        const form = new FormArray<PrepareStepForm>([]);
        service.patchPrepareStep(form, [
            { kind: PrepareKind.PIPE, command: ["sed", "-e", "s/a/b/"] },
            { kind: PrepareKind.DECOMPRESS, format: DecompressFormat.GZIP },
        ]);

        expect(form.getRawValue()).toEqual([
            { kind: PrepareKind.PIPE, command: "sed -e s/a/b/" },
            { kind: PrepareKind.DECOMPRESS, format: DecompressFormat.GZIP, subPath: "" },
        ]);
    });

    it("should skip the steps of a kind the editor has no form for", () => {
        const yaml = mockSetPollingSourceEventYaml.replace(
            "    - kind: Pipe\n",
            "    - kind: Unknown\n      value: 1\n    - kind: Pipe\n",
        );
        const form = new FormArray<PrepareStepForm>([]);
        service.patchPrepareStep(form, service.parseEventFromYaml(yaml).prepare);

        expect(form.getRawValue()).toEqual([
            { kind: PrepareKind.PIPE, command: "jq -c .result[]" },
            { kind: PrepareKind.DECOMPRESS, format: "zip", subPath: "" },
        ]);
    });
});
