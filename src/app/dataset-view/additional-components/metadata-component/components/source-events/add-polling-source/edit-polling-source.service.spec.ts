/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

import { Apollo } from "apollo-angular";
import { mockParseSetPollingSourceEventFromYamlToObject } from "src/app/search/mock.data";

import {
    AddPollingSourceEditFormType,
    FetchKind,
    MergeKind,
    ReadKind,
    SetPollingSourceSection,
} from "./add-polling-source-form.types";
import { EditPollingSourceService } from "./edit-polling-source.service";

describe("EditPollingSourceService", () => {
    let service: EditPollingSourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(EditPollingSourceService);
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
        service.patchFormValues(sectionFetchForm, editFormValue, groupName);
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
        service.patchFormValues(sectionFetchForm, editFormValue, groupName);
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
        service.patchFormValues(sectionFetchForm, editFormValue, groupName);
        expect(sectionFetchForm.value.image).toEqual(result.image);
        expect(sectionFetchForm.value.command as string[]).toEqual(result.command);
        expect(sectionFetchForm.value.args as string[]).toEqual(result.args);
    });

    it("should be check patch form with read CSV step with schema", () => {
        const sectionReadForm = new FormGroup({
            kind: new FormControl(ReadKind.CSV),
            schema: new FormArray([]),
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
                schema: ["id BIGINT"],
            },
            merge: {
                kind: MergeKind.APPEND,
            },
        };
        const groupName = SetPollingSourceSection.READ;
        service.patchFormValues(sectionReadForm, editFormValue, groupName);
        expect(sectionReadForm.value.schema?.length).toEqual(1);
    });

    it("should be check patch form with merge CSV step with schema", () => {
        const sectionMergeForm = new FormGroup({
            kind: new FormControl(MergeKind.SNAPSHOT),
            primaryKey: new FormArray([]),
            compareColumns: new FormArray([]),
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
                schema: ["id BIGINT"],
            },
            merge: {
                kind: MergeKind.SNAPSHOT,
                primaryKey: ["id", "test"],
                compareColumns: ["id"],
            },
        };
        const groupName = SetPollingSourceSection.MERGE;
        const result = {
            kind: MergeKind.SNAPSHOT,
            primaryKey: ["id", "test"],
            compareColumns: ["id"],
        };
        service.patchFormValues(sectionMergeForm, editFormValue, groupName);
        expect(sectionMergeForm.value.kind).toEqual(result.kind);
        expect(sectionMergeForm.value.primaryKey?.length).toEqual(result.primaryKey.length);
        expect(sectionMergeForm.value.compareColumns?.length).toEqual(result.compareColumns.length);
    });
});
