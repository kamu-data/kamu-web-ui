/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { EditAddPushSourceService } from "./edit-add-push-source.service";
import { FormBuilder } from "@angular/forms";
import { Apollo, ApolloModule } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";
import { ApolloTestingModule } from "apollo-angular/testing";
import {
    mockDatasetInfo,
    mockHistoryEditAddPushSourceService,
    mockParseAddPushSourceEventFromYamlToObject,
} from "src/app/search/mock.data";
import { of } from "rxjs";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { AddPushSourceEditFormType } from "./add-push-source-form.types";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

describe("EditAddPushSourceService", () => {
    let service: EditAddPushSourceService;
    let datasetService: DatasetService;
    let blockService: BlockService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, DatasetApi, FormBuilder],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(EditAddPushSourceService);
        datasetService = TestBed.inject(DatasetService);
        blockService = TestBed.inject(BlockService);
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

    it("should check subscribe of getEventAsYaml", () => {
        const mockHistory = mockHistoryEditAddPushSourceService;
        spyOn(datasetService, "getDatasetHistory").and.returnValue(of(mockHistory));
        spyOn(blockService, "requestMetadataBlock").and.returnValue(of());
        service.getEventAsYaml(mockDatasetInfo, SupportedEvents.AddPushSource, "mockSourceName").subscribe(
            () => null,
            () => {
                expect(service.history).toBeDefined();
            },
        );
    });
});
