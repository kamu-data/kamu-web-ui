import { TestBed } from "@angular/core/testing";
import { EditPollingSourceService } from "./edit-polling-source.service";
import { Apollo } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { EditFormType, FetchKind, MergeKind, ReadKind } from "./add-polling-source-form.types";
import {
    mockDatasetInfo,
    mockHistoryEditPollingSourceService,
    mockParseEventFromYamlToObject,
} from "src/app/search/mock.data";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { of } from "rxjs";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

describe("EditPollingSourceService", () => {
    let service: EditPollingSourceService;
    let datasetService: DatasetService;
    let blockService: BlockService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, DatasetApi, FormBuilder],
        });
        service = TestBed.inject(EditPollingSourceService);
        datasetService = TestBed.inject(DatasetService);
        blockService = TestBed.inject(BlockService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check parse event from yaml to json", () => {
        const mockEventYaml =
            "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-06-02T08:44:54.984731027Z\n  prevBlockHash: zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u\n  sequenceNumber: 1\n  event:\n    kind: setPollingSource\n    fetch:\n      kind: filesGlob\n      path: path\n      eventTime:\n        kind: fromMetadata\n    read:\n      kind: csv\n      separator: ','\n      encoding: UTF-8\n      quote: '\"'\n      escape: \\\n      enforceSchema: true\n      nanValue: NaN\n      positiveInf: Inf\n      negativeInf: -Inf\n      dateFormat: yyyy-MM-dd\n      timestampFormat: yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]\n    merge:\n      kind: append\n";
        const result: EditFormType = mockParseEventFromYamlToObject;
        expect(service.parseEventFromYaml(mockEventYaml)).toEqual(result);
    });

    it("should check subscribe of getSetPollingSourceAsYaml", () => {
        const mockHistory = mockHistoryEditPollingSourceService;
        spyOn(datasetService, "getDatasetHistory").and.returnValue(of(mockHistory));
        spyOn(blockService, "requestMetadataBlock").and.returnValue(of());
        blockService.emitMetadataBlockAsYamlChanged("test yaml");
        service.getEventAsYaml(mockDatasetInfo, SupportedEvents.SetPollingSource).subscribe(
            () => null,
            () => {
                expect(service.history).toBeDefined();
            },
        );
    });

    it("should be check patch form with fetch url step and without headers", () => {
        const sectionFetchForm = new FormGroup({
            kind: new FormControl("url"),
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
                enforceSchema: true,
                nanValue: "NaN",
                positiveInf: "Inf",
                negativeInf: "-Inf",
                dateFormat: "yyyy-MM-dd",
                timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
            },
            merge: {
                kind: MergeKind.APPEND,
            },
        };
        const result = {
            kind: "url",
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
            kind: new FormControl("url"),
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
                enforceSchema: true,
                nanValue: "NaN",
                positiveInf: "Inf",
                negativeInf: "-Inf",
                dateFormat: "yyyy-MM-dd",
                timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
            },
            merge: {
                kind: MergeKind.APPEND,
            },
        };
        const groupName = SetPollingSourceSection.FETCH;
        const result = {
            kind: "url",
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
            kind: new FormControl("container"),
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
                enforceSchema: true,
                nanValue: "NaN",
                positiveInf: "Inf",
                negativeInf: "-Inf",
                dateFormat: "yyyy-MM-dd",
                timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
            },
            merge: {
                kind: MergeKind.APPEND,
            },
        };
        const result = {
            kind: "container",
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
            kind: new FormControl("csv"),
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
            kind: new FormControl("snapshot"),
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
            kind: "snapshot",
            primaryKey: ["id", "test"],
            compareColumns: ["id"],
        };
        service.patchFormValues(sectionMergeForm, editFormValue, groupName);
        expect(sectionMergeForm.value.kind).toEqual(result.kind);
        expect(sectionMergeForm.value.primaryKey?.length).toEqual(result.primaryKey.length);
        expect(sectionMergeForm.value.compareColumns?.length).toEqual(result.compareColumns.length);
    });
});
