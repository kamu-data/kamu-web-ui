/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { mockParseAddPushSourceEventFromYamlToObject } from "src/app/search/mock.data";

import { AddPushSourceEditFormType } from "./add-push-source-form.types";
import { EditAddPushSourceService } from "./edit-add-push-source.service";

describe("EditAddPushSourceService", () => {
    let service: EditAddPushSourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(EditAddPushSourceService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check parse event from yaml to json", () => {
        const mockEventYaml =
            "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-12-28T09:41:56.469218218Z\n  prevBlockHash: zW1jaUXuf1HLoKvdQhYNq1e3x6KCFrY7UCqXsgVMfJBJF77\n  sequenceNumber: 1\n  event:\n    kind: AddPushSource\n    sourceName: mockSource\n    read:\n      kind: Csv\n      schema:\n      - id INT\n      separator: ','\n      encoding: utf8\n      quote: '\"'\n      escape: \\\n      dateFormat: rfc3339\n      timestampFormat: rfc3339\n    merge:\n      kind: Append\n";
        const result: AddPushSourceEditFormType = mockParseAddPushSourceEventFromYamlToObject;
        expect(service.parseEventFromYaml(mockEventYaml)).toEqual(result);
    });
});
