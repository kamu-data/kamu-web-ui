/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { ReadKind } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { AddPushSourceEditFormType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";
import { EditAddPushSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/edit-add-push-source.service";
import { ReadControls } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { mockDatasetInfo, mockParseAddPushSourceEventFromYamlToObject } from "src/app/search/mock.data";

describe("EditAddPushSourceService", () => {
    let service: EditAddPushSourceService;
    let blockService: BlockService;
    let destroyRef: DestroyRef;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(EditAddPushSourceService);
        blockService = TestBed.inject(BlockService);
        destroyRef = TestBed.inject(DestroyRef);
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
        const spy = vi.spyOn(blockService, "getAddPushSourceSchemaFields").mockReturnValue(of(expectedFields));

        const readForm = new FormGroup<ReadControls>({
            kind: new FormControl(ReadKind.CSV, { nonNullable: true }),
            schema: new FormControl<DataSchemaField[]>([], { nonNullable: true }),
        });
        service.patchSchemaField(readForm, mockDatasetInfo, "my-source", destroyRef);

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                accountName: mockDatasetInfo.accountName,
                datasetName: mockDatasetInfo.datasetName,
                sourceName: "my-source",
            }),
        );
        expect(readForm.controls.schema?.value).toEqual(expectedFields);
    });

    it("should not subscribe when schema control is absent in patchSchemaField", () => {
        const spy = stubMethod(blockService, "getAddPushSourceSchemaFields");
        const readForm = new FormGroup<ReadControls>({ kind: new FormControl(ReadKind.CSV, { nonNullable: true }) });
        service.patchSchemaField(readForm, mockDatasetInfo, "my-source", destroyRef);
        expect(spy).not.toHaveBeenCalled();
    });
});
