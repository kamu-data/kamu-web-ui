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

import { OdfTypes } from "@interface/dataset-schema.interface";

import {
    AddPollingSourceEditFormType,
    FetchKind,
    MergeKind,
    ReadKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
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

    it("should be check patch form with fetch url step and without headers", () => {
        const sectionFetchForm = new FormGroup({
            kind: new FormControl(FetchKind.URL),
            url: new FormControl("http://test.com"),
            eventTime: new FormGroup({}),
            headers: new FormArray([]),
        });
        const editFormValue = {
            fetch: {
                kind: FetchKind.URL,
                url: "http://test.com",
            },
            read: {
                kind: ReadKind.CSV,
                separator: ",",
                encoding: "UTF-8",
                quote: '"',
                escape: "\\",
                dateFormat: "yyyy-MM-dd",
                timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
                schema: [],
            },
            merge: {
                kind: MergeKind.APPEND,
            },
        };
        const result = {
            kind: FetchKind.URL,
            url: "http://test.com",
            eventTime: { pattern: null, timestampFormat: null },
            headers: [],
        };
        const groupName = SetPollingSourceSection.FETCH;
        service.patchFormValues(sectionFetchForm, editFormValue, groupName, null, destroyRef);
        expect(sectionFetchForm.value.headers?.length).toEqual(0);
        expect(sectionFetchForm.value.url).toEqual(result.url);
        expect(sectionFetchForm.value.eventTime).toEqual(result.eventTime);
    });

    it("should be check patch form with fetch url and with headers", () => {
        const sectionFetchForm = new FormGroup({
            kind: new FormControl(FetchKind.URL),
            url: new FormControl(""),
            eventTime: new FormGroup({}),
            headers: new FormArray([]),
        });
        const editFormValue = {
            fetch: {
                kind: FetchKind.URL,
                url: "http://test.com",
                headers: [{ name: "test_name", value: "test_value" }],
            },
            read: {
                kind: ReadKind.CSV,
                separator: ",",
                encoding: "UTF-8",
                quote: '"',
                escape: "\\",
                dateFormat: "yyyy-MM-dd",
                timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
                schema: [],
            },
            merge: {
                kind: MergeKind.APPEND,
            },
        };
        const groupName = SetPollingSourceSection.FETCH;
        const result = {
            kind: FetchKind.URL,
            url: "http://test.com",
            eventTime: { pattern: null, timestampFormat: null },
            headers: [{ name: "test_name", value: "test_value" }],
        };
        service.patchFormValues(sectionFetchForm, editFormValue, groupName, null, destroyRef);
        expect(sectionFetchForm.value.headers?.length).toEqual(1);
        expect(sectionFetchForm.value.url).toEqual(result.url);
        expect(sectionFetchForm.value.eventTime).toEqual(result.eventTime);
    });

    it("should be check patch form with fetch CONTAINER step", () => {
        const sectionFetchForm = new FormGroup({
            kind: new FormControl(FetchKind.CONTAINER),
            image: new FormControl(""),
            eventTime: new FormGroup({}),
            env: new FormArray([]),
            command: new FormArray([]),
            args: new FormArray([]),
        });
        const editFormValue = {
            fetch: {
                kind: FetchKind.CONTAINER,
                image: "test_image",
                env: [],
                command: ["-a"],
                args: ["arg1"],
            },
            read: {
                kind: ReadKind.CSV,
                separator: ",",
                encoding: "UTF-8",
                quote: '"',
                escape: "\\",
                dateFormat: "yyyy-MM-dd",
                timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
                schema: [],
            },
            merge: {
                kind: MergeKind.APPEND,
            },
        };
        const result = {
            kind: FetchKind.CONTAINER,
            image: "test_image",
            eventTime: { pattern: null, timestampFormat: null },
            env: [],
            command: ["-a"],
            args: ["arg1"],
        };
        const groupName = SetPollingSourceSection.FETCH;
        service.patchFormValues(sectionFetchForm, editFormValue, groupName, null, destroyRef);
        expect(sectionFetchForm.value.image).toEqual(result.image);
        expect(sectionFetchForm.value.command as string[]).toEqual(result.command);
        expect(sectionFetchForm.value.args as string[]).toEqual(result.args);
    });

    it("should patch read form CSV kind without schema when datasetInfo is null", () => {
        const sectionReadForm = new FormGroup({
            kind: new FormControl(ReadKind.CSV),
            schema: new FormControl([]),
        });
        const editFormValue: AddPollingSourceEditFormType = {
            fetch: { kind: FetchKind.CONTAINER, image: "test_image", env: [], command: ["-a"], args: ["arg1"] },
            read: { kind: ReadKind.CSV, schema: [] },
            merge: { kind: MergeKind.APPEND },
        };
        service.patchFormValues(sectionReadForm, editFormValue, SetPollingSourceSection.READ, null, destroyRef);
        expect(sectionReadForm.value.kind).toEqual(ReadKind.CSV);
        expect(sectionReadForm.value.schema).toEqual([]);
    });

    it("should be check patch form with merge CSV step with schema", () => {
        const sectionMergeForm = new FormGroup({
            kind: new FormControl(MergeKind.SNAPSHOT),
            primaryKey: new FormArray([]),
            compareColumns: new FormArray([]),
        });
        const editFormValue: AddPollingSourceEditFormType = {
            fetch: { kind: FetchKind.CONTAINER, image: "test_image", env: [], command: ["-a"], args: ["arg1"] },
            read: { kind: ReadKind.CSV, schema: [{ name: "id", type: { kind: OdfTypes.Int64 } }] },
            merge: { kind: MergeKind.SNAPSHOT, primaryKey: ["id", "test"], compareColumns: ["id"] },
        };
        const groupName = SetPollingSourceSection.MERGE;
        const result = {
            kind: MergeKind.SNAPSHOT,
            primaryKey: ["id", "test"],
            compareColumns: ["id"],
        };
        service.patchFormValues(sectionMergeForm, editFormValue, groupName, null, destroyRef);
        expect(sectionMergeForm.value.kind).toEqual(result.kind);
        expect(sectionMergeForm.value.primaryKey?.length).toEqual(result.primaryKey.length);
        expect(sectionMergeForm.value.compareColumns?.length).toEqual(result.compareColumns.length);
    });
});
