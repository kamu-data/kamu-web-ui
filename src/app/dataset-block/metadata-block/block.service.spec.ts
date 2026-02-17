/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { MetadataBlockInfo } from "src/app/dataset-block/metadata-block/metadata-block.types";
import { mockDatasetInfo } from "src/app/search/mock.data";

import { DatasetApi } from "@api/dataset.api";
import { mockGetMetadataBlockQuery, TEST_BLOCK_HASH } from "@api/mock/dataset.mock";
import { MaybeUndefined } from "@interface/app.types";

describe("BlockService", () => {
    let service: BlockService;
    let datasetApi: DatasetApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(BlockService);
        datasetApi = TestBed.inject(DatasetApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get block from api", () => {
        spyOn(datasetApi, "getBlockByHash").and.returnValue(of(mockGetMetadataBlockQuery));

        const metadataBlock$ = service
            .requestMetadataBlock(mockDatasetInfo, TEST_BLOCK_HASH)
            .subscribe((result: MaybeUndefined<MetadataBlockInfo>) => {
                if (result) {
                    expect(result.blockAsYaml).toEqual(
                        mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHashEncoded as string,
                    );
                }
            });

        expect(metadataBlock$.closed).toBeTrue();
    });
});
