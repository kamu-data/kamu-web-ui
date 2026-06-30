/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { AddPushSourceEditFormType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";
import { EditAddPushSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/edit-add-push-source.service";
import { mockDatasetInfo, mockParseAddPushSourceEventFromYamlToObject } from "src/app/search/mock.data";

describe("EditAddPushSourceService", () => {
    let service: EditAddPushSourceService;
    let blockService: BlockService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(EditAddPushSourceService);
        blockService = TestBed.inject(BlockService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check parse event from yaml to json", () => {
        const mockEventYaml =
            "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-12-28T09:41:56.469218218Z\n  prevBlockHash: zW1jaUXuf1HLoKvdQhYNq1e3x6KCFrY7UCqXsgVMfJBJF77\n  sequenceNumber: 1\n  event:\n    kind: AddPushSource\n    sourceName: mockSource\n    read:\n      kind: Csv\n      separator: ','\n      encoding: utf8\n      quote: '\"'\n      escape: \\\n      dateFormat: rfc3339\n      timestampFormat: rfc3339\n    merge:\n      kind: Append\n";
        const result: AddPushSourceEditFormType = mockParseAddPushSourceEventFromYamlToObject;
        expect(service.parseEventFromYaml(mockEventYaml)).toEqual(result);
    });

    it("should populate schema control via patchSchemaField from BlockService", () => {
        const expectedFields: DataSchemaField[] = [
            { name: "id", type: { kind: OdfTypes.Int64 } },
            { name: "amount", type: { kind: OdfTypes.Float64 } },
        ];
        const spy = spyOn(blockService, "getAddPushSourceSchemaFields").and.returnValue(of(expectedFields));

        const readForm = new FormGroup({ schema: new FormControl<DataSchemaField[]>([]) });
        service.patchSchemaField(readForm, mockDatasetInfo, "my-source");

        expect(spy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                accountName: mockDatasetInfo.accountName,
                datasetName: mockDatasetInfo.datasetName,
                sourceName: "my-source",
            }),
        );
        expect(readForm.get("schema")?.value).toEqual(expectedFields);
    });

    it("should not subscribe when schema control is absent in patchSchemaField", () => {
        const spy = spyOn(blockService, "getAddPushSourceSchemaFields");
        const readForm = new FormGroup({ otherControl: new FormControl("") });
        service.patchSchemaField(readForm, mockDatasetInfo, "my-source");
        expect(spy).not.toHaveBeenCalled();
    });
});
