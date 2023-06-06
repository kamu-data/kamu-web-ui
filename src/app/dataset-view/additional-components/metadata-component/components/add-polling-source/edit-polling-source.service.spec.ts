import { TestBed } from "@angular/core/testing";
import { EditPollingSourceService } from "./edit-polling-source.service";
import { Apollo } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";
import { FormBuilder } from "@angular/forms";
import { EditFormType } from "./add-polling-source-form.types";
import { mockParseEventFromYamlToObject } from "src/app/search/mock.data";

describe("EditPollingSourceService", () => {
    let service: EditPollingSourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, DatasetApi, FormBuilder],
        });
        service = TestBed.inject(EditPollingSourceService);
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
});
